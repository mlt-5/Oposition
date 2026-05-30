const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'opposition.db');

for (const suffix of ['', '-shm', '-wal']) {
  const f = DB_PATH + suffix;
  if (fs.existsSync(f)) { fs.unlinkSync(f); }
}
console.log('Removed existing opposition.db (+ WAL/SHM if present)');

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);
console.log('Schema applied.');

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const insertMinistry   = db.prepare(`INSERT INTO ministry_budget (fiscal_year,estimate_type,name,alloc,spent,pct) VALUES (@fiscal_year,@estimate_type,@name,@alloc,@spent,@pct)`);
const insertRevenue    = db.prepare(`INSERT INTO revenue_sources (fiscal_year,estimate_type,name,amt,pct,type,yoy,color,note) VALUES (@fiscal_year,@estimate_type,@name,@amt,@pct,@type,@yoy,@color,@note)`);
const insertExpend     = db.prepare(`INSERT INTO expenditure_sectors (fiscal_year,estimate_type,sector,amt,pct,type,color,note) VALUES (@fiscal_year,@estimate_type,@sector,@amt,@pct,@type,@color,@note)`);
const insertCapex      = db.prepare(`INSERT INTO capex_breakdown (fiscal_year,estimate_type,name,amt,yoy,pct_gdp,note) VALUES (@fiscal_year,@estimate_type,@name,@amt,@yoy,@pct_gdp,@note)`);
const insertGdpComp    = db.prepare(`INSERT INTO sector_gdp_comparison (fiscal_year,estimate_type,sector,india,world_avg,developed,recommended) VALUES (@fiscal_year,@estimate_type,@sector,@india,@world_avg,@developed,@recommended)`);
const insertFiscal     = db.prepare(`INSERT INTO fiscal_trend (yr,estimate_type,deficit,deficit_abs,debt,revenue,exp,note) VALUES (@yr,@estimate_type,@deficit,@deficit_abs,@debt,@revenue,@exp,@note)`);

// ─── FISCAL TREND (FY20–FY27) ────────────────────────────────────────────────

// deficit_abs = official Fiscal Deficit in ₹ crore (Row 17 of Budget at a Glance 2026-27 summary table)
// Formula: Total Expenditure − (Revenue Receipts + Recovery of Loans + Other Receipts)
// FY20–FY24: approximated as exp−revenue (exact figures require earlier budget PDFs; not shown in Overview chart)
const fiscalRows = [
  { yr:'FY20', estimate_type:'BE',      deficit:3.8, deficit_abs:625292,   debt:68.9, revenue:2004853, exp:2630145, note:'Pre-COVID; deficit overshot 3.3% target to 3.8% actual' },
  { yr:'FY21', estimate_type:'BE',      deficit:9.2, deficit_abs:1875000,  debt:89.4, revenue:1627000,  exp:3502000, note:'COVID-19 pandemic; massive stimulus; highest deficit since liberalisation' },
  { yr:'FY22', estimate_type:'BE',      deficit:6.7, deficit_abs:1560963,  debt:83.4, revenue:2232741,  exp:3793704, note:'Economic recovery; RE better than BE. Actual 6.7% vs 6.8% BE' },
  { yr:'FY23', estimate_type:'BE',      deficit:6.4, deficit_abs:1610559,  debt:81.0, revenue:2567745,  exp:4178304, note:'Tax buoyancy strong. Actual 6.4% vs 6.4% target — first time target met since FY17' },
  { yr:'FY24', estimate_type:'BE',      deficit:5.6, deficit_abs:1444781,  debt:80.1, revenue:3002949,  exp:4447730, note:'Actual 5.6% (RE: 5.8%). Capex record ₹9.5L Cr actual' },
  { yr:'FY25', estimate_type:'Actuals', deficit:4.8, deficit_abs:1574431,  debt:55.3, revenue:3036619,  exp:4652867, note:'FY25 Actuals. Revenue ₹30.37L Cr, Exp ₹46.53L Cr, Deficit ₹15,74,431 Cr. Source: Budget at a Glance 2026-27' },
  { yr:'FY26', estimate_type:'BE',      deficit:4.4, deficit_abs:1568936,  debt:56.1, revenue:3420409,  exp:5065345, note:'BE FY26: 4.4% target. Fiscal deficit ₹15,68,936 Cr. Net market borrowings ₹11,54,000 Cr' },
  // FY26 RE from Budget at a Glance 2026-27 (p.1,4,8): Row 17 Fiscal Deficit = ₹15,58,492 Cr (4.4% of GDP)
  { yr:'FY26', estimate_type:'RE',      deficit:4.4, deficit_abs:1558492,  debt:56.1, revenue:3342323,  exp:4964842, note:'RE FY26: 4.4% fiscal deficit ₹15,58,492 Cr. Revenue ₹33,42,323 Cr, Exp ₹49,64,842 Cr. Source: Budget at a Glance 2026-27' },
  { yr:'FY27', estimate_type:'BE',      deficit:4.3, deficit_abs:1695768,  debt:54.7, revenue:3533150,  exp:5347315, note:'BE FY27: 4.3% target. Fiscal deficit ₹16,95,768 Cr. GDP est ₹3,93,00,393 Cr (+10% YoY). Source: Budget at a Glance 2026-27' },
];
db.transaction(() => { for (const r of fiscalRows) insertFiscal.run(r); })();
console.log(`Seeded ${fiscalRows.length} fiscal_trend rows (FY20–FY27).`);

// ─── MINISTRY BUDGET ─────────────────────────────────────────────────────────
// FY25 Actuals from "Expenditure of Major Items", Budget at a Glance 2026-27 (page 11)
// FY26 BE from India Opposition Tracking App.jsx (original data)
// FY27 BE from "Expenditure of Major Items", Budget at a Glance 2026-27 (page 11)

const ministriesAll = [
  // ── FY25 Actuals (Budget at a Glance 2026-27, p.11) ──
  { fiscal_year:'FY25', estimate_type:'Actuals', name:'Ministry of Finance (incl. Interest ₹11.16L Cr)', alloc:1173792, spent:1173792, pct:100 },
  { fiscal_year:'FY25', estimate_type:'Actuals', name:'Ministry of Defence',                              alloc:450733,  spent:450733,  pct:100 },
  { fiscal_year:'FY25', estimate_type:'Actuals', name:'Road Transport & Highways',                        alloc:560162,  spent:560162,  pct:100 },
  { fiscal_year:'FY25', estimate_type:'Actuals', name:'Consumer Affairs, Food & Public Distribution',     alloc:196000,  spent:196000,  pct:100 },
  { fiscal_year:'FY25', estimate_type:'Actuals', name:'Railways (Gross Budgetary Support)',               alloc:220000,  spent:220000,  pct:100 },
  { fiscal_year:'FY25', estimate_type:'Actuals', name:'Home Affairs',                                     alloc:224585,  spent:224585,  pct:100 },
  { fiscal_year:'FY25', estimate_type:'Actuals', name:'Rural Development',                                alloc:206010,  spent:206010,  pct:100 },
  { fiscal_year:'FY25', estimate_type:'Actuals', name:'Agriculture & Farmers Welfare',                    alloc:154610,  spent:154610,  pct:100 },
  { fiscal_year:'FY25', estimate_type:'Actuals', name:'Jal Shakti (incl. Jal Jeevan Mission)',            alloc:86000,   spent:86000,   pct:100 },
  { fiscal_year:'FY25', estimate_type:'Actuals', name:'Education (School + Higher)',                      alloc:110736,  spent:110736,  pct:100 },
  { fiscal_year:'FY25', estimate_type:'Actuals', name:'Health & Family Welfare',                          alloc:88353,   spent:88353,   pct:100 },
  { fiscal_year:'FY25', estimate_type:'Actuals', name:'Women & Child Development',                        alloc:24500,   spent:24500,   pct:100 },
  // ── FY26 BE (Q3 utilisation data — used for utilisation tracker table) ──
  { fiscal_year:'FY26', estimate_type:'BE', name:'Ministry of Finance (incl. Interest ₹12.76L Cr)', alloc:1494614, spent:1100000, pct:74 },
  { fiscal_year:'FY26', estimate_type:'BE', name:'Ministry of Defence',                              alloc:681210,  spent:614000,  pct:90 },
  { fiscal_year:'FY26', estimate_type:'BE', name:'Road Transport & Highways',                        alloc:287316,  spent:210000,  pct:73 },
  { fiscal_year:'FY26', estimate_type:'BE', name:'Consumer Affairs, Food & Public Distribution',     alloc:214073,  spent:193000,  pct:90 },
  { fiscal_year:'FY26', estimate_type:'BE', name:'Railways (Gross Budgetary Support)',               alloc:252200,  spent:228000,  pct:90 },
  { fiscal_year:'FY26', estimate_type:'BE', name:'Home Affairs',                                     alloc:246099,  spent:199000,  pct:81 },
  { fiscal_year:'FY26', estimate_type:'BE', name:'Rural Development',                                alloc:190406,  spent:120000,  pct:63 },
  { fiscal_year:'FY26', estimate_type:'BE', name:'Agriculture & Farmers Welfare',                    alloc:141818,  spent:102000,  pct:72 },
  { fiscal_year:'FY26', estimate_type:'BE', name:'Jal Shakti (incl. Jal Jeevan Mission)',            alloc:99503,   spent:56000,   pct:56 },
  { fiscal_year:'FY26', estimate_type:'BE', name:'Education (School + Higher)',                      alloc:128650,  spent:78000,   pct:61 },
  { fiscal_year:'FY26', estimate_type:'BE', name:'Health & Family Welfare',                          alloc:98311,   spent:57000,   pct:58 },
  { fiscal_year:'FY26', estimate_type:'BE', name:'Women & Child Development',                        alloc:26092,   spent:14000,   pct:54 },
  // ── FY26 RE (Revised Estimates 2025-26 from Budget at a Glance 2026-27, p.11) ──
  // Finance: Interest ₹12,74,338 Cr + FC Grants ₹1,52,953 Cr + Finance Dept ₹1,12,175 Cr = ₹15,39,466 Cr
  { fiscal_year:'FY26', estimate_type:'RE', name:'Ministry of Finance (incl. Interest ₹12.74L Cr)', alloc:1539466, spent:0, pct:0 },
  { fiscal_year:'FY26', estimate_type:'RE', name:'Ministry of Defence',                              alloc:567855,  spent:0, pct:0 },
  // Transport total RE = ₹5,47,563 Cr; split: Roads ~₹2,77,000 + Railways ~₹2,65,000 + NCRB/other ~₹5,563
  { fiscal_year:'FY26', estimate_type:'RE', name:'Road Transport & Highways',                        alloc:277000,  spent:0, pct:0 },
  // Food: Food Subsidy ₹2,28,154 + other distribution ~₹10,000 Cr
  { fiscal_year:'FY26', estimate_type:'RE', name:'Consumer Affairs, Food & Public Distribution',     alloc:238154,  spent:0, pct:0 },
  { fiscal_year:'FY26', estimate_type:'RE', name:'Railways (Gross Budgetary Support)',               alloc:265000,  spent:0, pct:0 },
  { fiscal_year:'FY26', estimate_type:'RE', name:'Home Affairs',                                     alloc:241485,  spent:0, pct:0 },
  { fiscal_year:'FY26', estimate_type:'RE', name:'Rural Development',                                alloc:212750,  spent:0, pct:0 },
  { fiscal_year:'FY26', estimate_type:'RE', name:'Agriculture & Farmers Welfare',                    alloc:151853,  spent:0, pct:0 },
  // Jal Shakti: JJM ₹17,000 + Krishi Sinchai ₹6,372 + NMCG/other ~₹26,000
  { fiscal_year:'FY26', estimate_type:'RE', name:'Jal Shakti (incl. Jal Jeevan Mission)',            alloc:50000,   spent:0, pct:0 },
  { fiscal_year:'FY26', estimate_type:'RE', name:'Education (School + Higher)',                      alloc:121949,  spent:0, pct:0 },
  { fiscal_year:'FY26', estimate_type:'RE', name:'Health & Family Welfare',                          alloc:94625,   spent:0, pct:0 },
  { fiscal_year:'FY26', estimate_type:'RE', name:'Women & Child Development',                        alloc:26500,   spent:0, pct:0 },
  // ── FY27 BE ──
  { fiscal_year:'FY27', estimate_type:'BE', name:'Ministry of Finance (incl. Interest ₹14.04L Cr)', alloc:1424621, spent:0, pct:0 },
  { fiscal_year:'FY27', estimate_type:'BE', name:'Ministry of Defence',                              alloc:594585,  spent:0, pct:0 },
  { fiscal_year:'FY27', estimate_type:'BE', name:'Road Transport & Highways',                        alloc:598520,  spent:0, pct:0 },
  { fiscal_year:'FY27', estimate_type:'BE', name:'Consumer Affairs, Food & Public Distribution',     alloc:227629,  spent:0, pct:0 },
  { fiscal_year:'FY27', estimate_type:'BE', name:'Railways (Gross Budgetary Support)',               alloc:265200,  spent:0, pct:0 },
  { fiscal_year:'FY27', estimate_type:'BE', name:'Home Affairs',                                     alloc:255234,  spent:0, pct:0 },
  { fiscal_year:'FY27', estimate_type:'BE', name:'Rural Development',                                alloc:273108,  spent:0, pct:0 },
  { fiscal_year:'FY27', estimate_type:'BE', name:'Agriculture & Farmers Welfare',                    alloc:162671,  spent:0, pct:0 },
  { fiscal_year:'FY27', estimate_type:'BE', name:'Jal Shakti (incl. Jal Jeevan Mission)',            alloc:70163,   spent:0, pct:0 },
  { fiscal_year:'FY27', estimate_type:'BE', name:'Education (School + Higher)',                      alloc:139289,  spent:0, pct:0 },
  { fiscal_year:'FY27', estimate_type:'BE', name:'Health & Family Welfare',                          alloc:104599,  spent:0, pct:0 },
  { fiscal_year:'FY27', estimate_type:'BE', name:'Women & Child Development',                        alloc:27000,   spent:0, pct:0 },
];
db.transaction(() => { for (const r of ministriesAll) insertMinistry.run(r); })();
console.log(`Seeded ${ministriesAll.length} ministry_budget rows (FY25+FY26+FY27).`);

// ─── REVENUE SOURCES ──────────────────────────────────────────────────────────

const revenueAll = [
  // ── FY26 BE ──
  { fiscal_year:'FY26', estimate_type:'BE', name:'Income Tax (Personal)',         amt:1387000, pct:27.4, type:'Direct Tax',   yoy:14.4,  color:'#166534', note:'BE ₹13,87,000 Cr; +14.4% over FY25 RE. Govt foregoes ~₹1L Cr via new ₹12L rebate' },
  { fiscal_year:'FY26', estimate_type:'BE', name:'Corporation Tax',               amt:1000000, pct:19.7, type:'Direct Tax',   yoy:10.4,  color:'#138808', note:'BE ₹10,00,000 Cr; +10.4% growth. Effective rate 22% since Sep 2019 cut' },
  { fiscal_year:'FY26', estimate_type:'BE', name:'GST (CGST + Comp. Cess)',       amt:1177890, pct:23.2, type:'Indirect Tax', yoy:11.6,  color:'#C9830A', note:'CGST ₹10,10,890 Cr + GST Cess ₹1,67,110 Cr. RE FY25: CGST slipped to ₹9,58,480 Cr' },
  { fiscal_year:'FY26', estimate_type:'BE', name:'Customs Duty',                  amt:240000,  pct:4.7,  type:'Indirect Tax', yoy:2.1,   color:'#92520A', note:'BE ₹2,40,000 Cr; RE FY25 surpassed BE at ₹2,58,290 Cr' },
  { fiscal_year:'FY26', estimate_type:'BE', name:'Union Excise Duty',             amt:327000,  pct:6.5,  type:'Indirect Tax', yoy:-1.4,  color:'#D97706', note:'BE ₹3,27,000 Cr; mainly petroleum outside GST. Declining as EV adoption rises' },
  { fiscal_year:'FY26', estimate_type:'BE', name:'Non-Tax Revenue',               amt:567129,  pct:11.2, type:'Non-Tax',      yoy:9.8,   color:'#2563EB', note:'BE ₹5,67,129 Cr; RBI surplus ₹2.11L Cr (FY25), PSU dividends, spectrum, fees' },
  { fiscal_year:'FY26', estimate_type:'BE', name:'Capital Receipts (Non-Debt)',   amt:64000,   pct:1.3,  type:'Capital',      yoy:5.2,   color:'#7C3AED', note:'Disinvestment BE ₹47,000 Cr (historically missed). FY24 actual: ₹15,000 Cr vs ₹51,000 Cr target' },
  { fiscal_year:'FY26', estimate_type:'BE', name:'Borrowings (Deficit Financing)',amt:1568936, pct:30.9, type:'Borrowings',   yoy:-8.2,  color:'#B91C1C', note:'Fiscal deficit ₹15,68,936 Cr financed via G-Secs. Net market borrowings ₹11,54,000 Cr' },
  // ── FY26 RE — from Budget at a Glance 2026-27, p.6 (Receipt Budget RE 2025-26) ──
  { fiscal_year:'FY26', estimate_type:'RE', name:'Income Tax (Personal)',         amt:1312000, pct:26.4, type:'Direct Tax',   yoy:-5.4,  color:'#166534', note:'RE ₹13,12,000 Cr; -5.4% vs BE ₹13,87,000 Cr. New ₹12L rebate reduced collections below budget. Source: Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', name:'Corporation Tax',               amt:1109000, pct:22.3, type:'Direct Tax',   yoy:10.9,  color:'#138808', note:'RE ₹11,09,000 Cr; +10.9% vs BE ₹10,00,000 Cr. Corporate tax buoyancy exceeded target. Source: Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', name:'GST (CGST + Comp. Cess)',       amt:1046480, pct:21.1, type:'Indirect Tax', yoy:-11.2, color:'#C9830A', note:'RE CGST ₹9,58,480 Cr + Cess ₹88,000 Cr = ₹10,46,480 Cr; -11.2% vs BE. Cess revenue lower as phase-out begins. Source: Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', name:'Customs Duty',                  amt:258290,  pct:5.2,  type:'Indirect Tax', yoy:7.6,   color:'#92520A', note:'RE ₹2,58,290 Cr; +7.6% vs BE ₹2,40,000 Cr. Import growth and tariff revisions. Source: Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', name:'Union Excise Duty',             amt:336550,  pct:6.8,  type:'Indirect Tax', yoy:2.9,   color:'#D97706', note:'RE ₹3,36,550 Cr; +2.9% vs BE ₹3,27,000 Cr. Source: Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', name:'Non-Tax Revenue',               amt:667662,  pct:13.4, type:'Non-Tax',      yoy:17.7,  color:'#2563EB', note:'RE ₹6,67,662 Cr; +17.7% vs BE — RBI surplus ₹3,75,590 Cr (dividends/profits surge). Source: Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', name:'Capital Receipts (Non-Debt)',   amt:64027,   pct:1.3,  type:'Capital',      yoy:0.0,   color:'#7C3AED', note:'RE ₹64,027 Cr; near BE. Non-debt capital receipts (loan recoveries, disinvestment). Source: Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', name:'Borrowings (Deficit Financing)',amt:1558492, pct:31.4, type:'Borrowings',   yoy:-0.7,  color:'#B91C1C', note:'RE fiscal deficit ₹15,58,492 Cr (4.4% of GDP); -0.7% vs BE ₹15,68,936 Cr. G-Sec market borrowings ₹10,40,439 Cr. Source: Budget at a Glance 2026-27' },
  // ── FY27 BE — from Budget at a Glance 2026-27, page 6 ──
  { fiscal_year:'FY27', estimate_type:'BE', name:'Income Tax (Personal)',         amt:1466000, pct:21.0, type:'Direct Tax',   yoy:11.7,  color:'#166534', note:'BE ₹14,66,000 Cr; +11.7% vs FY26 RE ₹13,12,000 Cr. Includes Securities Transaction Tax. Source: Receipt Budget 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', name:'Corporation Tax',               amt:1231000, pct:18.0, type:'Direct Tax',   yoy:11.0,  color:'#138808', note:'BE ₹12,31,000 Cr; +11.0% vs FY26 RE ₹11,09,000 Cr. Effective rate 22% maintained. Source: Receipt Budget 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', name:'GST (CGST + Comp. Cess)',       amt:1019020, pct:15.0, type:'Indirect Tax', yoy:-2.6,  color:'#C9830A', note:'CGST ₹10,19,020 Cr; GST Compensation Cess phased out in FY27 BE. -2.6% vs FY26 RE. Source: Receipt Budget 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', name:'Customs Duty',                  amt:271200,  pct:4.0,  type:'Indirect Tax', yoy:5.0,   color:'#92520A', note:'BE ₹2,71,200 Cr; +5.0% vs FY26 RE ₹2,58,290 Cr. Source: Receipt Budget 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', name:'Union Excise Duty',             amt:388910,  pct:6.0,  type:'Indirect Tax', yoy:15.6,  color:'#D97706', note:'BE ₹3,88,910 Cr; +15.6% vs FY26 RE — shift from phased-out GST cess to excise on petroleum. Source: Receipt Budget 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', name:'Non-Tax Revenue',               amt:666228,  pct:10.0, type:'Non-Tax',      yoy:-0.2,  color:'#2563EB', note:'BE ₹6,66,228 Cr; -0.2% vs FY26 RE ₹6,67,662 Cr. Dividends/Profits ₹3,91,000 Cr. Source: Receipt Budget 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', name:'Capital Receipts (Non-Debt)',   amt:118397,  pct:2.0,  type:'Capital',      yoy:85.0,  color:'#7C3AED', note:'BE ₹1,18,397 Cr; +85% vs FY26 RE — includes disinvestment + loan recoveries. Source: Receipt Budget 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', name:'Borrowings (Deficit Financing)',amt:1695768, pct:24.0, type:'Borrowings',   yoy:8.8,   color:'#B91C1C', note:'Fiscal deficit ₹16,95,768 Cr (4.3% of GDP); +8.8% vs FY26 RE. Market borrowings ₹11,73,210 Cr. Source: Budget at a Glance 2026-27' },
];
db.transaction(() => { for (const r of revenueAll) insertRevenue.run(r); })();
console.log(`Seeded ${revenueAll.length} revenue_sources rows (FY26+FY27).`);

// ─── EXPENDITURE SECTORS ─────────────────────────────────────────────────────
// All rows sourced from "Expenditure of Major Items", Budget at a Glance 2026-27.
// Tax Devolution to States excluded — it has no row in this official table
// (constitutional transfer, not departmental expenditure).
// "Others" = official table "Others" row + unallocated Transport split residual.

const expendAll = [
  // ── FY26 BE (total ₹50,65,345 Cr) ──
  { fiscal_year:'FY26', estimate_type:'BE', sector:'Interest Payments',       amt:1276338, pct:25.2, type:'Committed',  color:'#B91C1C', note:'BE ₹12,76,338 Cr. Debt servicing — single largest head, non-discretionary. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'Pension',                 amt:276618,  pct:5.5,  type:'Committed',  color:'#7C2D12', note:'BE ₹2,76,618 Cr. Civil & defence pensions — statutory, non-discretionary. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'Ministry of Defence',     amt:491732,  pct:9.7,  type:'Security',   color:'#1A1A1A', note:'BE ₹4,91,732 Cr. Capital outlay ₹1,80,000 Cr (+12.9% YoY). 75% domestic procurement. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'Home Affairs (incl. UTs)',amt:233211,  pct:4.6,  type:'Security',   color:'#374151', note:'BE ₹2,33,211 Cr. CRPF, BSF, ITBP, NSG, police modernisation, UT administration. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'Food Subsidy',            amt:203420,  pct:4.0,  type:'Welfare',    color:'#C9830A', note:'BE ₹2,03,420 Cr. PDS via FCI under National Food Security Act. Source: Expenditure of Major Items (Subsidy – Food), Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'Fertiliser Subsidy',      amt:167887,  pct:3.3,  type:'Welfare',    color:'#D97706', note:'BE ₹1,67,887 Cr. Urea & P&K subsidy (Ministry of Chemicals). Source: Expenditure of Major Items (Subsidy – Fertiliser), Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'Rural Development',       amt:265817,  pct:5.2,  type:'Welfare',    color:'#138808', note:'BE ₹2,65,817 Cr. MGNREGS ₹86,000 Cr, PMGSY, PMAY-G, NRLM. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'Agriculture & Allied',    amt:158838,  pct:3.1,  type:'Welfare',    color:'#92520A', note:'BE ₹1,58,838 Cr. PM-KISAN, Fasal Bima, PMKSY. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'Education',               amt:128650,  pct:2.5,  type:'Welfare',    color:'#2563EB', note:'BE ₹1,28,650 Cr = 1.4% of GDP. Samagra Shiksha ₹37,500 Cr. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'Health',                  amt:98311,   pct:1.9,  type:'Welfare',    color:'#7C3AED', note:'BE ₹98,311 Cr = 0.9% of GDP. NHM, AB-PMJAY. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'Social Welfare',          amt:60052,   pct:1.2,  type:'Welfare',    color:'#8B5CF6', note:'BE ₹60,052 Cr. ICDS, Poshan, SC/ST welfare, disability schemes. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'Petroleum Subsidy',       amt:12100,   pct:0.2,  type:'Welfare',    color:'#B45309', note:'BE ₹12,100 Cr. LPG subsidy via DBTL. Source: Expenditure of Major Items (Subsidy – Petroleum), Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'Transport',               amt:548649,  pct:10.8, type:'Capex',      color:'#166534', note:'BE ₹5,48,649 Cr. Roads & Highways (MoRTH+NHAI) + Indian Railways GBS + other transport. Source: Expenditure of Major Items (Transport), Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'Energy',                  amt:80174,   pct:1.6,  type:'Capex',      color:'#EA580C', note:'BE ₹80,174 Cr. Power sector, renewable energy. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'Urban Development',       amt:96777,   pct:1.9,  type:'Capex',      color:'#0891B2', note:'BE ₹96,777 Cr. Smart Cities, Metro, AMRUT 2.0, SBM-Urban. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'IT & Telecom',            amt:86898,   pct:1.7,  type:'Capex',      color:'#0284C7', note:'BE ₹86,898 Cr. BharatNet, DoT, Semiconductor Mission, AI. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'Finance Dept',            amt:62924,   pct:1.2,  type:'Governance', color:'#4338CA', note:'BE ₹62,924 Cr. DEA, DFS, DIPAM (excl. Interest shown separately). Source: Expenditure of Major Items (Finance), Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'Tax Administration',      amt:186632,  pct:3.7,  type:'Governance', color:'#6366F1', note:'BE ₹1,86,632 Cr. CBDT, CBIC, income-tax & GST administration. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'Commerce & Industry',     amt:65553,   pct:1.3,  type:'Governance', color:'#6D28D9', note:'BE ₹65,553 Cr. PLI schemes, DPIIT, SEZs, export promotion. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'Scientific Departments',  amt:55679,   pct:1.1,  type:'Governance', color:'#0D9488', note:'BE ₹55,679 Cr. DST, DBT, CSIR, DRDO basic research. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'External Affairs',        amt:20517,   pct:0.4,  type:'Governance', color:'#1D4ED8', note:'BE ₹20,517 Cr. MEA, embassies, diplomatic missions. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'Dev. of North East',      amt:5915,    pct:0.1,  type:'Governance', color:'#15803D', note:'BE ₹5,915 Cr. DoNER, NEC, connectivity & development grants. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'Others',                  amt:482654,  pct:9.5,  type:'Other',      color:'#9CA3AF', note:'BE official "Others" residual ₹4,82,654 Cr. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  // ── FY26 RE (total ₹49,64,842 Cr) ──
  { fiscal_year:'FY26', estimate_type:'RE', sector:'Interest Payments',       amt:1274338, pct:25.7, type:'Committed',  color:'#B91C1C', note:'RE ₹12,74,338 Cr; -0.2% vs BE. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'Pension',                 amt:286641,  pct:5.8,  type:'Committed',  color:'#7C2D12', note:'RE ₹2,86,641 Cr; +3.6% vs BE. Civil & defence pensions — statutory. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'Ministry of Defence',     amt:567855,  pct:11.4, type:'Security',   color:'#1A1A1A', note:'RE ₹5,67,855 Cr; capital outlay ₹1,84,000 Cr. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'Home Affairs (incl. UTs)',amt:241485,  pct:4.9,  type:'Security',   color:'#374151', note:'RE ₹2,41,485 Cr. CRPF, BSF, police modernisation, UT admin. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'Food Subsidy',            amt:228154,  pct:4.6,  type:'Welfare',    color:'#C9830A', note:'RE ₹2,28,154 Cr. PDS via FCI under NFSA. Source: Expenditure of Major Items (Subsidy – Food), Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'Fertiliser Subsidy',      amt:186460,  pct:3.8,  type:'Welfare',    color:'#D97706', note:'RE ₹1,86,460 Cr. Urea & P&K subsidy. Source: Expenditure of Major Items (Subsidy – Fertiliser), Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'Rural Development',       amt:212750,  pct:4.3,  type:'Welfare',    color:'#138808', note:'RE ₹2,12,750 Cr. MGNREGA ₹88,000 Cr. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'Agriculture & Allied',    amt:151853,  pct:3.1,  type:'Welfare',    color:'#92520A', note:'RE ₹1,51,853 Cr. PM-KISAN full utilisation. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'Education',               amt:121949,  pct:2.5,  type:'Welfare',    color:'#2563EB', note:'RE ₹1,21,949 Cr; -5.2% vs BE. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'Health',                  amt:94625,   pct:1.9,  type:'Welfare',    color:'#7C3AED', note:'RE ₹94,625 Cr; -3.7% vs BE. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'Social Welfare',          amt:50053,   pct:1.0,  type:'Welfare',    color:'#8B5CF6', note:'RE ₹50,053 Cr. ICDS, Poshan, SC/ST welfare. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'Petroleum Subsidy',       amt:15121,   pct:0.3,  type:'Welfare',    color:'#B45309', note:'RE ₹15,121 Cr. LPG subsidy. Source: Expenditure of Major Items (Subsidy – Petroleum), Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'Transport',               amt:547563,  pct:11.0, type:'Capex',      color:'#166534', note:'RE ₹5,47,563 Cr. Roads & Highways (MoRTH+NHAI) + Indian Railways GBS + other transport. Source: Expenditure of Major Items (Transport), Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'Energy',                  amt:86471,   pct:1.7,  type:'Capex',      color:'#EA580C', note:'RE ₹86,471 Cr. Power sector, renewables. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'Urban Development',       amt:57204,   pct:1.2,  type:'Capex',      color:'#0891B2', note:'RE ₹57,204 Cr; -40.9% vs BE — urban capex severely under-executed. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'IT & Telecom',            amt:53946,   pct:1.1,  type:'Capex',      color:'#0284C7', note:'RE ₹53,946 Cr; -37.9% vs BE. BharatNet, Semiconductor Mission. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'Finance Dept',            amt:112175,  pct:2.3,  type:'Governance', color:'#4338CA', note:'RE ₹1,12,175 Cr. DEA, DFS (excl. Interest). Source: Expenditure of Major Items (Finance), Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'Tax Administration',      amt:74540,   pct:1.5,  type:'Governance', color:'#6366F1', note:'RE ₹74,540 Cr. CBDT, CBIC. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'Commerce & Industry',     amt:52324,   pct:1.1,  type:'Governance', color:'#6D28D9', note:'RE ₹52,324 Cr. PLI, DPIIT, SEZs. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'Scientific Departments',  amt:37014,   pct:0.7,  type:'Governance', color:'#0D9488', note:'RE ₹37,014 Cr. DST, DBT, CSIR, space/atomic. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'External Affairs',        amt:21743,   pct:0.4,  type:'Governance', color:'#1D4ED8', note:'RE ₹21,743 Cr. MEA, missions abroad. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'Dev. of North East',      amt:4479,    pct:0.1,  type:'Governance', color:'#15803D', note:'RE ₹4,479 Cr. DoNER ministry. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'Others',                  amt:486100,  pct:9.8,  type:'Other',      color:'#9CA3AF', note:'RE official "Others" residual ₹4,86,100 Cr. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  // ── FY27 BE (total ₹53,47,315 Cr) ──
  { fiscal_year:'FY27', estimate_type:'BE', sector:'Interest Payments',       amt:1403972, pct:26.3, type:'Committed',  color:'#B91C1C', note:'BE ₹14,03,972 Cr; +10.2% vs FY26 RE. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'Pension',                 amt:296214,  pct:5.5,  type:'Committed',  color:'#7C2D12', note:'BE ₹2,96,214 Cr; +3.3% vs FY26 RE. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'Ministry of Defence',     amt:594585,  pct:11.1, type:'Security',   color:'#1A1A1A', note:'BE ₹5,94,585 Cr; +4.7% vs FY26 RE. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'Home Affairs (incl. UTs)',amt:255234,  pct:4.8,  type:'Security',   color:'#374151', note:'BE ₹2,55,234 Cr; +5.7% vs FY26 RE. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'Food Subsidy',            amt:227629,  pct:4.3,  type:'Welfare',    color:'#C9830A', note:'BE ₹2,27,629 Cr; -0.2% vs FY26 RE. Source: Expenditure of Major Items (Subsidy – Food), Budget at a Glance 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'Fertiliser Subsidy',      amt:170781,  pct:3.2,  type:'Welfare',    color:'#D97706', note:'BE ₹1,70,781 Cr; -8.4% vs FY26 RE. Source: Expenditure of Major Items (Subsidy – Fertiliser), Budget at a Glance 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'Rural Development',       amt:273108,  pct:5.1,  type:'Welfare',    color:'#138808', note:'BE ₹2,73,108 Cr. MGNREGA cut to ₹30,000 Cr from FY26 RE ₹88,000 Cr. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'Agriculture & Allied',    amt:162671,  pct:3.0,  type:'Welfare',    color:'#92520A', note:'BE ₹1,62,671 Cr; +7.1% vs FY26 RE. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'Education',               amt:139289,  pct:2.6,  type:'Welfare',    color:'#2563EB', note:'BE ₹1,39,289 Cr; +14.2% vs FY26 RE. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'Health',                  amt:104599,  pct:2.0,  type:'Welfare',    color:'#7C3AED', note:'BE ₹1,04,599 Cr; +10.6% vs FY26 RE. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'Social Welfare',          amt:62362,   pct:1.2,  type:'Welfare',    color:'#8B5CF6', note:'BE ₹62,362 Cr; +24.6% vs FY26 RE. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'Petroleum Subsidy',       amt:12085,   pct:0.2,  type:'Welfare',    color:'#B45309', note:'BE ₹12,085 Cr. Source: Expenditure of Major Items (Subsidy – Petroleum), Budget at a Glance 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'Transport',               amt:598520,  pct:11.2, type:'Capex',      color:'#166534', note:'BE ₹5,98,520 Cr; +9.3% vs FY26 RE. Roads & Highways + Indian Railways GBS + other transport. Source: Expenditure of Major Items (Transport), Budget at a Glance 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'Energy',                  amt:109029,  pct:2.0,  type:'Capex',      color:'#EA580C', note:'BE ₹1,09,029 Cr; +26.1% vs FY26 RE. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'Urban Development',       amt:85522,   pct:1.6,  type:'Capex',      color:'#0891B2', note:'BE ₹85,522 Cr; +49.5% vs FY26 RE. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'IT & Telecom',            amt:74560,   pct:1.4,  type:'Capex',      color:'#0284C7', note:'BE ₹74,560 Cr; +38.2% vs FY26 RE. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'Finance Dept',            amt:20649,   pct:0.4,  type:'Governance', color:'#4338CA', note:'BE ₹20,649 Cr; -81.6% vs FY26 RE (FC grant reclassification). Source: Expenditure of Major Items (Finance), Budget at a Glance 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'Tax Administration',      amt:45500,   pct:0.9,  type:'Governance', color:'#6366F1', note:'BE ₹45,500 Cr. CBDT, CBIC. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'Commerce & Industry',     amt:70296,   pct:1.3,  type:'Governance', color:'#6D28D9', note:'BE ₹70,296 Cr; +34.3% vs FY26 RE. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'Scientific Departments',  amt:55756,   pct:1.0,  type:'Governance', color:'#0D9488', note:'BE ₹55,756 Cr; +50.6% vs FY26 RE. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'External Affairs',        amt:22119,   pct:0.4,  type:'Governance', color:'#1D4ED8', note:'BE ₹22,119 Cr; +1.7% vs FY26 RE. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'Dev. of North East',      amt:6812,    pct:0.1,  type:'Governance', color:'#15803D', note:'BE ₹6,812 Cr; +52.1% vs FY26 RE. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'Others',                  amt:556021,  pct:10.4, type:'Other',      color:'#9CA3AF', note:'BE official "Others" residual ₹5,56,021 Cr. Source: Expenditure of Major Items, Budget at a Glance 2026-27' },
];
db.transaction(() => { for (const r of expendAll) insertExpend.run(r); })();
console.log(`Seeded ${expendAll.length} expenditure_sectors rows.`);

// ─── CAPEX BREAKDOWN ─────────────────────────────────────────────────────────

const capexAll = [
  // ── FY26 BE ──
  { fiscal_year:'FY26', estimate_type:'BE', name:'Road & Highways (MoRTH + NHAI)',     amt:287316, yoy:18,   pct_gdp:0.57, note:'BE ₹2,87,316 Cr — highest ever. Bharatmala Phase 1 stalled; cost doubled to ₹10.77L Cr' },
  { fiscal_year:'FY26', estimate_type:'BE', name:'Railways (Gross Budgetary Support)',  amt:252200, yoy:4,    pct_gdp:0.51, note:'BE ₹2,52,200 Cr GBS. Total railway outlay ₹2,65,200 Cr incl. IEBR. Bullet train 28% progress' },
  { fiscal_year:'FY26', estimate_type:'BE', name:'Defence Capital Outlay',             amt:180000, yoy:12.9, pct_gdp:0.36, note:'BE ₹1,80,000 Cr (+12.9% YoY). 75% domestic procurement earmarked' },
  { fiscal_year:'FY26', estimate_type:'BE', name:'50-Yr Interest-Free Loans to States',amt:150000, yoy:7,    pct_gdp:0.30, note:'BE ₹1,50,000 Cr for state capital expenditure. States must use for specified reforms' },
  { fiscal_year:'FY26', estimate_type:'BE', name:'Jal Shakti (Jal Jeevan Mission)',    amt:70163,  yoy:-29,  pct_gdp:0.14, note:'BE ₹70,163 Cr vs ₹98,714 Cr (FY25 BE) — 29% cut. Only 79% coverage; target 100% by Mar 2024 missed' },
  { fiscal_year:'FY26', estimate_type:'BE', name:'Urban (Smart Cities + Metro + AMRUT)',amt:82000, yoy:12,   pct_gdp:0.16, note:'Smart Cities winding down; Metro expansion in 27 cities. AMRUT 2.0 ₹66,750 Cr' },
  { fiscal_year:'FY26', estimate_type:'BE', name:'Housing PMAY (Urban + Rural)',        amt:90500, yoy:3,    pct_gdp:0.18, note:'PMAY-U 2.0 ₹36,000 Cr + PMAY-G ₹54,500 Cr. Urban target 1 Cr new houses' },
  { fiscal_year:'FY26', estimate_type:'BE', name:'Digital (BharatNet + Semicon + AI)',  amt:34000, yoy:22,   pct_gdp:0.07, note:'BharatNet ₹8,500 Cr; Semiconductor Mission ₹6,903 Cr; AI Mission ₹500 Cr' },
  // ── FY26 RE — derived from Budget at a Glance 2026-27 (p.11, p.14-16, p.12) ──
  // Roads: Transport total RE ₹5,47,563 Cr split; Jal Jeevan: Scheme 27 RE = ₹17,000 Cr; 50yr Loans: p.12 RE = ₹1,44,000 Cr
  { fiscal_year:'FY26', estimate_type:'RE', name:'Road & Highways (MoRTH + NHAI)',     amt:277000, yoy:-3.6, pct_gdp:0.55, note:'RE ₹2,77,000 Cr (derived); -3.6% vs BE. Road project execution below budget due to land acquisition delays. Source: Transport Ministry RE 2025-26' },
  { fiscal_year:'FY26', estimate_type:'RE', name:'Railways (Gross Budgetary Support)',  amt:265000, yoy:5.1,  pct_gdp:0.53, note:'RE ₹2,65,000 Cr (derived); +5.1% vs BE ₹2,52,200 Cr. Railways executed above budget. Source: Transport RE 2025-26' },
  { fiscal_year:'FY26', estimate_type:'RE', name:'Defence Capital Outlay',             amt:184000, yoy:2.2,  pct_gdp:0.37, note:'RE ₹1,84,000 Cr (sum of capital scheme items: Aircraft ₹72,780 + R&D ₹15,344 + Equipments ₹50,760 + Naval ₹21,397 + other). Source: Major Schemes RE 2025-26' },
  { fiscal_year:'FY26', estimate_type:'RE', name:'50-Yr Interest-Free Loans to States',amt:144000, yoy:-4.0, pct_gdp:0.29, note:'RE ₹1,44,000 Cr; -4.0% vs BE ₹1,50,000 Cr. Reform-linked state capital loans. Source: Transfer to States RE 2025-26 p.12' },
  { fiscal_year:'FY26', estimate_type:'RE', name:'Jal Shakti (Jal Jeevan Mission)',    amt:17000,  yoy:-75.8,pct_gdp:0.03, note:'RE ₹17,000 Cr — ₹53,163 Cr slash from BE ₹70,163 Cr. JJM completion delayed; funds redirected. Source: Major Schemes RE 2025-26 p.15' },
  { fiscal_year:'FY26', estimate_type:'RE', name:'Urban (Smart Cities + Metro + AMRUT)',amt:44000, yoy:-46.3,pct_gdp:0.09, note:'RE ₹44,000 Cr (Metro ₹27,450 + AMRUT ₹7,500 + SBM-Urban ₹2,000 + other); -46.3% vs BE. Urban capex severely under-executed. Source: Major Schemes RE 2025-26' },
  { fiscal_year:'FY26', estimate_type:'RE', name:'Housing PMAY (Urban + Rural)',        amt:40300, yoy:-55.5,pct_gdp:0.08, note:'RE ₹40,300 Cr (PMAY-U ₹7,800 + PMAY-Rural ₹32,500); -55.5% vs BE ₹90,500 Cr. Urban housing targets missed. Source: Major Schemes RE 2025-26 p.14-15' },
  { fiscal_year:'FY26', estimate_type:'RE', name:'Digital (BharatNet + Semicon + AI)',  amt:24000, yoy:-29.4,pct_gdp:0.05, note:'RE ₹24,000 Cr (Semiconductor ₹4,300 + AI ₹800 + Telecom infra ₹9,650 + PLI MEITY ₹7,000 + other); -29.4% vs BE. Source: Major Schemes RE 2025-26' },
  // ── FY27 BE — from Budget at a Glance 2026-27 ──
  { fiscal_year:'FY27', estimate_type:'BE', name:'Road & Highways (MoRTH + NHAI)',     amt:320000, yoy:15.5, pct_gdp:0.56, note:'BE ₹3,20,000 Cr; +15.5% vs FY26 RE. Continued Bharatmala expansion. Source: Expenditure Budget 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', name:'Railways (Gross Budgetary Support)',  amt:265200, yoy:0.1,  pct_gdp:0.47, note:'BE ₹2,65,200 Cr; near-flat vs FY26 RE. Vande Bharat expansion, electrification. Source: Expenditure Budget 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', name:'Defence Capital Outlay',             amt:203000, yoy:10.3, pct_gdp:0.36, note:'BE ₹2,03,000 Cr; +10.3% vs FY26 RE. 75% domestic procurement. Source: Defence Budget 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', name:'50-Yr Interest-Free Loans to States',amt:185000, yoy:28.5, pct_gdp:0.33, note:'BE ₹1,85,000 Cr; +28.5% vs FY26 RE. Reform-linked capital assistance. Source: Budget at a Glance 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', name:'Jal Shakti (Jal Jeevan Mission)',    amt:67670,  yoy:298,  pct_gdp:0.12, note:'BE ₹67,670 Cr; +298% vs FY26 RE ₹17,000 Cr — restored after massive cut. 79% rural coverage; 21% remaining. Source: Major Schemes 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', name:'Urban (Smart Cities + Metro + AMRUT)',amt:90000, yoy:104,  pct_gdp:0.16, note:'BE ₹90,000 Cr; +104% vs FY26 RE. Urban Challenge Fund ₹10,000 Cr new. Source: Major Schemes 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', name:'Housing PMAY (Urban + Rural)',        amt:90000, yoy:123,  pct_gdp:0.16, note:'BE ₹90,000 Cr; +123% vs FY26 RE. PMAY-U 2.0 ₹18,625 Cr + PMAY-G ₹54,917 Cr. Source: Major Schemes 2026-27' },
  { fiscal_year:'FY27', estimate_type:'BE', name:'Digital (BharatNet + Semicon + AI)',  amt:40000, yoy:66.7, pct_gdp:0.07, note:'BE ₹40,000 Cr; +66.7% vs FY26 RE. Semiconductor Mission; AI; BharatNet Phase III. Source: Expenditure Budget 2026-27' },
];
db.transaction(() => { for (const r of capexAll) insertCapex.run(r); })();
console.log(`Seeded ${capexAll.length} capex_breakdown rows (FY26+FY27).`);

// ─── SECTOR GDP COMPARISON ───────────────────────────────────────────────────

const gdpCompAll = [
  // ── FY26 BE — India figures on FY26 GDP est ₹3,57,13,886 Cr ──
  { fiscal_year:'FY26', estimate_type:'BE', sector:'Education',   india:1.4,  world_avg:4.5, developed:5.5, recommended:6.0 },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'Health',      india:0.9,  world_avg:6.0, developed:8.5, recommended:5.0 },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'R&D',         india:0.65, world_avg:1.8, developed:2.5, recommended:2.0 },
  { fiscal_year:'FY26', estimate_type:'BE', sector:'Social Prot.',india:1.5,  world_avg:4.2, developed:9.2, recommended:3.0 },
  // ── FY26 RE — India figures adjusted for RE allocations vs BE (FY26 GDP ₹3,57,13,886 Cr) ──
  // Education RE ₹1,21,949 Cr vs BE ₹1,28,650 Cr (-5.2%); Health RE ₹94,625 vs BE ₹98,311 (-3.7%)
  { fiscal_year:'FY26', estimate_type:'RE', sector:'Education',   india:1.33, world_avg:4.5, developed:5.5, recommended:6.0 },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'Health',      india:0.87, world_avg:6.0, developed:8.5, recommended:5.0 },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'R&D',         india:0.65, world_avg:1.8, developed:2.5, recommended:2.0 },
  { fiscal_year:'FY26', estimate_type:'RE', sector:'Social Prot.',india:1.51, world_avg:4.2, developed:9.2, recommended:3.0 },
  // ── FY27 BE — India figures recalculated on FY27 GDP est ₹3,93,00,393 Cr ──
  { fiscal_year:'FY27', estimate_type:'BE', sector:'Education',   india:1.35, world_avg:4.5, developed:5.5, recommended:6.0 },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'Health',      india:0.89, world_avg:6.0, developed:8.5, recommended:5.0 },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'R&D',         india:0.65, world_avg:1.8, developed:2.5, recommended:2.0 },
  { fiscal_year:'FY27', estimate_type:'BE', sector:'Social Prot.',india:1.4,  world_avg:4.2, developed:9.2, recommended:3.0 },
];
db.transaction(() => { for (const r of gdpCompAll) insertGdpComp.run(r); })();
console.log(`Seeded ${gdpCompAll.length} sector_gdp_comparison rows (FY26+FY27).`);

db.close();
console.log('\nDone. opposition.db created and seeded with FY25+FY26+FY27 data.');
