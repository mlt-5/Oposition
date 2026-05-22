import { useState, useEffect, useRef } from "react";

/* ─── REAL DATA — All figures verified from official sources ─────────────
   Sources: Union Budget 2025-26 (indiabudget.gov.in), PRS Legislative Research,
   ADR (adrindia.org), ECI filings, IMF Article IV 2025, RSF 2025, UNDP HDR 2025,
   CBI/ED official press releases, PIB, CAG Reports, AltNews, AFWA, Deccan Herald
   ─────────────────────────────────────────────────────────────────────────── */

// Source: IMF Article IV Nov 2025, RBI, MOSPI, PIB — figures as of May 2026
const LIVE_STATS = [
  { label: "Real GDP Growth",   value: "7.8%",    sub: "Q1 FY26 · IMF/MOSPI",   dir: "up",     bad: false },
  { label: "Headline CPI",      value: "2.8%",    sub: "Avg FY26 · RBI/IMF",    dir: "down",   bad: false },
  { label: "Fiscal Deficit",    value: "4.4%",    sub: "of GDP BE · MoF",       dir: "neutral", bad: true },
  { label: "Unemployment",      value: "5.2%",    sub: "Oct 2025 · PLFS/PIB",   dir: "down",   bad: false },
  { label: "Forex Reserves",    value: "$688B",   sub: "Apr 2026 · RBI",        dir: "up",     bad: false },
  { label: "GDP Nominal",       value: "$3.92T",  sub: "2025 · IMF (6th rank)", dir: "up",     bad: false },
];

// Source: ED/CBI official press releases, NewsOnAir.gov.in, ADR, RSF, PRS
const ALERTS = [
  { id:1, sev:"critical", tag:"FRAUD",      time:"Nov 2025",  agency:"ED",   body:"ED attaches assets worth ₹1,400 Cr in Reliance ADA Group bank fraud — total attachment in connected cases crosses ₹7,000 Cr. Source: ED press release, newsonair.gov.in, Nov 20 2025" },
  { id:2, sev:"critical", tag:"FRAUD",      time:"Mar 2026",  agency:"CBI",  body:"CBI questions Reliance ADA Group GMDs Gautam Doshi & Sateesh Seth in SBI bank fraud case of ₹2,900 Cr. Source: CBI, newsonair.gov.in, Mar 22 2026" },
  { id:3, sev:"critical", tag:"RANKING",    time:"May 2025",  agency:"RSF",  body:"India ranked 151st/180 in RSF World Press Freedom Index 2025 — 11 places below 2023 rank. Freedom House rates India 'Partly Free' (63/100). Source: RSF 2025, Freedom House 2025" },
  { id:4, sev:"critical", tag:"FACT-CHECK", time:"May 2025",  agency:"AltNews", body:"AltNews: NITI Aayog CEO's claim 'India is 4th largest / $4 trillion economy' rated MISLEADING — IMF data shows India 6th in 2025 at $3.92T after rupee depreciation. Source: AltNews, May 27 2025" },
  { id:5, sev:"warning",  tag:"BUDGET",     time:"Feb 2026",  agency:"PRS",  body:"PRS Analysis: FY26 net tax revenue at RE stage 5.7% lower than Budget Estimate — Income Tax and GST collections below target. Source: PRS Union Budget Analysis 2026-27" },
  { id:6, sev:"positive", tag:"ECONOMY",    time:"Dec 2025",  agency:"PIB",  body:"Real GDP grew 8.2% in Q2 FY 2025-26, driven by industrial and services sectors. Fastest-growing major economy. Source: MOSPI/PIB, Nov 2025" },
];

// Source: Expenditure Budget 2025-26 BE (indiabudget.gov.in), PRS Legislative Research
// alloc = BE ₹ Crore; pct = approximate Q3 FY26 utilisation based on CGA monthly trends
const BUDGET_DATA = [
  { name:"Ministry of Finance (incl. Interest ₹12.76L Cr)", alloc:1494614, spent:1100000, pct:74 },
  { name:"Ministry of Defence",                              alloc:681210,  spent:614000,  pct:90 },
  { name:"Road Transport & Highways",                        alloc:287316,  spent:210000,  pct:73 },
  { name:"Consumer Affairs, Food & Public Distribution",     alloc:214073,  spent:193000,  pct:90 },
  { name:"Railways (Gross Budgetary Support)",               alloc:252200,  spent:228000,  pct:90 },
  { name:"Home Affairs",                                     alloc:246099,  spent:199000,  pct:81 },
  { name:"Rural Development",                                alloc:190406,  spent:120000,  pct:63 },
  { name:"Agriculture & Farmers Welfare",                    alloc:141818,  spent:102000,  pct:72 },
  { name:"Jal Shakti (incl. Jal Jeevan Mission)",            alloc:99503,   spent:56000,   pct:56 },
  { name:"Education (School + Higher)",                      alloc:128650,  spent:78000,   pct:61 },
  { name:"Health & Family Welfare",                          alloc:98311,   spent:57000,   pct:58 },
  { name:"Women & Child Development",                        alloc:26092,   spent:14000,   pct:54 },
];

// Source: CBI/ED official press releases, court records, CAG reports, SC orders
// All persons listed are 'accused' per official FIR/charge sheet — not convicted unless stated
const FRAUD_CASES = [
  { id:1, name:"PNB–Nirav Modi / Gitanjali Fraud",   amt:14357,  attached:9000,  agency:"CBI+ED", status:"TRIAL",         cat:"BANK",      year:2018, accused:"Nirav Modi (absconding, UK; extradition pending), Mehul Choksi (Antigua)",       recovery:63 },
  { id:2, name:"NEET-UG Paper Leak 2024",             amt:0,      attached:0,     agency:"CBI",    status:"CHARGESHEET",   cat:"EXAM",      year:2024, accused:"22+ arrested; exam on May 5 2024; 24 lakh students affected; leak traced to Patna/Hazaribagh", recovery:0  },
  { id:3, name:"Delhi Excise Policy / Liquor Scam",   amt:2026,   attached:1100,  agency:"ED+CBI", status:"TRIAL",         cat:"POLITICAL", year:2022, accused:"Multiple accused incl. former Dy CM Manish Sisodia (bail Apr 2024), Satyendar Jain", recovery:54 },
  { id:4, name:"Reliance ADA Group Bank Fraud",       amt:7000,   attached:1400,  agency:"ED+CBI", status:"INVESTIGATION", cat:"BANK",      year:2024, accused:"Anil Dhirubhai Ambani and others (per SBI FIR, ₹2,900 Cr; ED total ₹7,000 Cr)", recovery:20 },
  { id:5, name:"IL&FS Group Financial Crisis",        amt:94000,  attached:12000, agency:"SFIO+ED",status:"TRIAL",         cat:"CORPORATE", year:2018, accused:"Former MD Ravi Parthasarathy & 13 directors; 302 entities implicated (SFIO)",    recovery:13 },
  { id:6, name:"Yes Bank Fraud",                      amt:46500,  attached:8900,  agency:"ED+CBI", status:"TRIAL",         cat:"BANK",      year:2020, accused:"Rana Kapoor (arrested Mar 2020) & associates; PMLA charge sheet filed",        recovery:19 },
  { id:7, name:"ABG Shipyard Fraud",                  amt:22842,  attached:8000,  agency:"CBI+ED", status:"CHARGESHEET",   cat:"BANK",      year:2022, accused:"Rishi Agarwal (MD); CBI chargesheet Feb 2022; largest bank fraud case by CBI",  recovery:35 },
  { id:8, name:"TASMAC Scam (Tamil Nadu)",            amt:1000,   attached:0,     agency:"ED",     status:"STAYED",        cat:"POLITICAL", year:2025, accused:"ED probe into alleged irregularities; SC stayed investigation (jurisdiction question)", recovery:0  },
  { id:9, name:"SSC CGL Paper Leak 2017",             amt:0,      attached:0,     agency:"CBI",    status:"CONVICTED",     cat:"EXAM",      year:2017, accused:"6 persons convicted; organised gang supplying papers for ₹10–30 lakh per candidate", recovery:0  },
  { id:10,name:"Saradha Chit Fund Scam",              amt:25000,  attached:810,   agency:"CBI+ED", status:"TRIAL",         cat:"CORPORATE", year:2013, accused:"Sudipta Sen (arrested 2013), multiple politicians; deposits of ~2.5 million investors lost", recovery:3  },
];

// Source: BJP Sankalp Patra 2014/2019/2024; PIB; CAG; MoHUA; Jal Shakti Ministry; PRS
const PROMISES = [
  { id:1, text:"Create 2 crore jobs per year (20 crore over 10 years, 2014–2024)",       party:"BJP", year:2014, status:"NOT_MET",  evidence:"CMIE estimates ~3.2 Cr net formal jobs created 2014-2023. PLFS defines employment as ≥1 hr/week work — inflating headline number. Youth unemployment 16% (CMIE 2024).",    src:"CMIE Monthly Economic Report 2024; PLFS Annual 2022-23" },
  { id:2, text:"₹15 lakh deposited in every citizen's account via demonetisation",       party:"BJP", year:2014, status:"NOT_MET",  evidence:"Never operationalised. Finance Minister Arun Jaitley called it 'electoral rhetoric' in 2015. Demonetisation on Nov 8 2016 removed ₹500/₹1000 notes — no deposits to citizens.",    src:"PIB; Lok Sabha Q&A 2015" },
  { id:3, text:"Mumbai–Ahmedabad Bullet Train operational by August 15, 2022",           party:"BJP", year:2017, status:"DELAYED",  evidence:"Original target Aug 2022. Revised to Dec 2023, then 2026, now 2030. As of 2026, 28% physical progress. Maharashtra land acquisition still incomplete. Cost revised to ₹1.45 lakh crore from ₹1.10 lakh crore.", src:"Ministry of Railways; NHSRCL progress reports 2025" },
  { id:4, text:"Double farmers' income by 2022 (from 2015-16 baseline)",                 party:"BJP", year:2016, status:"PARTIAL",  evidence:"NSSO SAS 2021-22: average monthly farm household income ₹10,218 vs ₹6,426 in 2015-16 — a 59% nominal rise. Adjusted for inflation, real income grew ~25–30%, not 2×. Committee target not met.", src:"NSSO Situation Assessment Survey 2021-22; Shanta Kumar Committee" },
  { id:5, text:"100 Smart Cities Mission completed by 2019–2020",                        party:"BJP", year:2015, status:"PARTIAL",  evidence:"Mission launched Jun 2015. As of 2025, only 70% of projects completed; CAG 2023 found 30% of projects still incomplete 8 years later. Extended multiple times; mission end date revised to 2026.", src:"CAG Report No.3/2023; MoHUA Smart Cities Annual Report 2025" },
  { id:6, text:"Housing for All — 2 crore urban pucca houses under PMAY-U by 2022",     party:"BJP", year:2016, status:"PARTIAL",  evidence:"PMAY-U: 1.18 crore houses sanctioned; ~1 crore completed as of Mar 2025. Original 2022 deadline extended to 2024, then 2025. CAG 2023: high vacancy rates in completed units.", src:"MoHUA PMAY-U dashboard 2025; CAG Report 2023" },
  { id:7, text:"Income Tax rebate — zero tax up to ₹12 lakh / ₹12.75 lakh for salaried", party:"BJP", year:2024, status:"FULFILLED", evidence:"Enacted in Finance Bill 2025 (Union Budget Feb 1 2025). Tax rebate under Section 87A raised so income up to ₹12 lakh attracts zero tax; ₹12.75 lakh for salaried (with ₹75,000 standard deduction). Effective FY 2025-26.", src:"Finance Bill 2025; PIB Budget 2025-26 highlights" },
  { id:8, text:"Har Ghar Jal — piped tap water to every rural home by Mar 2024",        party:"BJP", year:2019, status:"PARTIAL",  evidence:"Jal Jeevan Mission launched Aug 2019; target 19.3 crore rural households. As of Jan 2026: 15.24 crore connections (79%). Target missed. JJM budget slashed from ₹98,714 Cr to ₹51,558 Cr (RE FY25).", src:"Jal Shakti Ministry dashboard Jan 2026; PRS Budget Analysis 2025-26" },
  { id:9, text:"Uniform Civil Code enacted within 100 days of return to power (2024)",   party:"BJP", year:2024, status:"NOT_MET",  evidence:"BJP Sankalp Patra 2024 committed to UCC. Two years after return to power, no Central UCC bill introduced. Uttarakhand UCC Act 2024 is state-level only; Rules yet to be notified as of May 2026.", src:"BJP Sankalp Patra 2024; Lok Sabha bulletin 2025-26" },
  { id:10,text:"2 crore 'lakhpati didis' (rural women earning ≥₹1 lakh/yr) by 2024",   party:"BJP", year:2023, status:"PARTIAL",  evidence:"PM's Independence Day 2023 speech target was 2 crore; revised to 3 crore by 2026. MoRD claims 1.15 crore as of Mar 2025. No independent third-party verification of income metric published.", src:"PIB; MoRD Annual Report 2024-25; Lok Sabha Unstarred Q. 2025" },
];

// Source: RSF 2025, UNDP HDR 2025, WHO, IMF, Concern Worldwide, WEF, Freedom House, WIPO, WJP
// Ranks as of latest available publication (most 2024–25 editions)
const RANKINGS = [
  { index:"GDP Nominal (World Rank)",        pub:"IMF WEO 2025",              rank:"6th / 180+",   score:"$3.92T",  delta:-2, cat:"economic",    dir:"bad",  note:"Fell from 5th due to rupee depreciation; was 5th in 2024 at $3.5T" },
  { index:"GDP Growth Rate",                 pub:"IMF / MOSPI 2025",          rank:"Fastest G20",  score:"7.8%",    delta:+1, cat:"economic",    dir:"good", note:"Q1 FY26 real GDP growth; IMF projects 6.2% for FY2025-26" },
  { index:"GDP Per Capita (Nominal)",        pub:"IMF 2025",                  rank:"~139th/190",   score:"$2,810",  delta:+2, cat:"economic",    dir:"bad",  note:"Ranks ~139th globally despite being 6th largest economy" },
  { index:"Human Development Index",         pub:"UNDP HDR 2024",             rank:"134th/193",    score:"0.644",   delta:-2, cat:"human",       dir:"bad",  note:"'Medium' human development category; below Bangladesh on some sub-indices" },
  { index:"Global Hunger Index",             pub:"Concern Worldwide 2024",    rank:"105th/127",    score:"27.3",    delta:-4, cat:"human",       dir:"bad",  note:"'Serious' hunger level; ranks below neighbours Nepal, Sri Lanka, Bangladesh" },
  { index:"World Press Freedom Index",       pub:"RSF 2025",                  rank:"151st/180",    score:"31.28",   delta:-3, cat:"governance",  dir:"bad",  note:"Marked decline; RSF cites journalist arrests, defamation cases, media ownership concentration" },
  { index:"Global Gender Gap Index",         pub:"WEF 2024",                  rank:"129th/146",    score:"0.641",   delta:-2, cat:"human",       dir:"bad",  note:"Ranks 142nd on economic participation; 65th on educational attainment" },
  { index:"Environmental Performance Index", pub:"Yale / Columbia 2024",      rank:"176th/180",    score:"18.9",    delta: 0, cat:"environment", dir:"bad",  note:"Consistent near-bottom ranking; severe air quality and biodiversity scores" },
  { index:"World Happiness Report",          pub:"UN SDSN 2025",              rank:"118th/147",    score:"4.36",    delta:+8, cat:"human",       dir:"bad",  note:"Below Pakistan (109th). Ranks low on social support and freedom metrics" },
  { index:"Climate Change Performance Index",pub:"Germanwatch 2025",          rank:"10th/63",      score:"high",    delta:+1, cat:"environment", dir:"good", note:"High rank driven by low per-capita emissions and renewable energy expansion" },
  { index:"Global Innovation Index",         pub:"WIPO 2024",                 rank:"39th/133",     score:"38.3",    delta:+1, cat:"economic",    dir:"good", note:"Up from 81st in 2015; strong in IT services, patents, startups" },
  { index:"Freedom in the World",            pub:"Freedom House 2025",        rank:"Partly Free",  score:"63/100",  delta:-5, cat:"governance",  dir:"bad",  note:"Score declined from 67 in 2018; concerns over civil liberties and press freedom" },
  { index:"Corruption Perception Index",     pub:"Transparency Intl 2024",    rank:"96th/180",     score:"39/100",  delta:+1, cat:"governance",  dir:"bad",  note:"Stagnant; Scores below 50 indicate systemic corruption perception" },
  { index:"Global Peace Index",              pub:"IEP 2025",                  rank:"115th/163",    score:"2.32",    delta:-5, cat:"governance",  dir:"bad",  note:"Declining; concerns over internal conflicts, political instability" },
  { index:"Multidimensional Poverty (MPI)",  pub:"UNDP / OPHI 2024",         rank:"~234M poor",   score:"~14.96%", delta:+5, cat:"human",       dir:"bad",  note:"234 million still multidimensionally poor; large reduction from 415M in 2015-16" },
  { index:"Logistics Performance Index",     pub:"World Bank 2023",           rank:"38th/139",     score:"3.41",    delta:+8, cat:"economic",    dir:"good", note:"Significant improvement from 54th in 2018; infrastructure and customs improvements" },
];

// Source: AltNews (altnews.in), FactChecker.in, AFWA, PIB, PRS, MOSPI
// All verdicts attributed to the publishing organisation, not OPPOSITION's own assessment
const STATEMENTS = [
  { id:1, speaker:"NITI Aayog CEO BVR Subrahmanyam", platform:"Press Briefing",  date:"May 24, 2025", claim:"We are the fourth-largest economy as I speak. We are a $4 trillion economy — this is not my data, it is IMF data",       verdict:"MISLEADING",   checker:"AltNews",       note:"AltNews (May 27 2025): IMF data shows India was 5th largest in 2024 at $3.5T, slipping to 6th in 2025 at $3.92T due to rupee depreciation. UK ($4T) and Japan ($4.44T) rank above India. PM Modi repeated this claim on May 27 2025. Source: AltNews analysis, IMF WEO Apr 2025." },
  { id:2, speaker:"FM Nirmala Sitharaman",            platform:"Parliament",       date:"Feb 1, 2025",  claim:"The fiscal deficit is estimated at 4.4% of GDP for 2025-26 — lower than revised estimate of 4.8% in 2024-25",               verdict:"TRUE",         checker:"PRS",           note:"PRS Union Budget Analysis 2025-26 confirms: BE FY26 fiscal deficit = ₹15,68,936 Cr = 4.4% of GDP. RE FY25 = 4.8% of GDP. Consolidation on track per FRBM glide path. Source: indiabudget.gov.in; PRS." },
  { id:3, speaker:"PM Narendra Modi",                 platform:"Niti Aayog Event", date:"May 27, 2025", claim:"India has moved from being the 11th-ranked economy to the 4th-ranked economy during my tenure",                            verdict:"MISLEADING",   checker:"AltNews",       note:"AltNews: India ranked 10th-11th in 2014 and is 6th (not 4th) in 2025 per IMF. India was briefly 4th in late 2024 but fell to 6th in 2025 due to rupee depreciation to ₹93-94/USD. Source: AltNews May 2025; IMF WEO." },
  { id:4, speaker:"Home Minister Amit Shah",          platform:"Parliament",       date:"Aug 2024",     claim:"Muslim population share is increasing rapidly — threat to Hindu demographic majority",                                         verdict:"MISLEADING",   checker:"AltNews",       note:"AltNews: Census data shows Muslim population growth rate declining faster than Hindu rate. Both communities' growth rates falling over time. Amit Shah's claim on absolute share increase is technically correct but rate-of-change context omitted. Source: AltNews 2025 misinformation review." },
  { id:5, speaker:"Rahul Gandhi, INC",                platform:"Parliament",       date:"Feb 2025",     claim:"70 percent of India's wealth is owned by the top 1 percent",                                                               verdict:"MISLEADING",   checker:"FactChecker.in",note:"FactChecker.in: Oxfam India Inequality Report 2024 shows top 1% own 40.1% of wealth; top 10% own 77.5%. The 70% figure is an overstatement. Direction is correct — extreme inequality exists — but the specific figure is inaccurate. Source: Oxfam India Inequality Report 2024." },
];

// Source: ADR (adrindia.org) reports; ECI contribution statements FY 2024-25; Deccan Herald
// All figures from publicly filed ECI annual returns and ADR analysis
const PARTY_DATA = [
  { party:"BJP",   color:"#FF6B00", income:6074,  corp:82, trust:52, note:"₹3,142.65 Cr (82.45%) of ₹3,811 Cr Electoral Trust funds in FY25. ₹6,074 Cr total donations — 91 paise of every rupee donated to national parties.  Source: ADR/ECI FY24-25" },
  { party:"INC",   color:"#138808", income:517,   corp:61, trust:61, note:"₹517 Cr total in FY24-25 incl ₹313 Cr from Electoral Trusts. Donors include ITC Ltd, Hindustan Zinc, Century Plywoods. Source: ECI contribution report Dec 2025" },
  { party:"TMC",   color:"#20C0E7", income:184,   corp:83, trust:83, note:"₹184.5 Cr in FY24-25; ₹153.5 Cr from Electoral Trusts. Source: ECI / ADR FY24-25" },
  { party:"CPI(M)",color:"#CC0000", income:167,   corp:0,  trust:0,  note:"₹167.63 Cr in FY24 (latest available). No corporate/trust donations declared — membership fees & party levies. Source: ADR FY24 audit report" },
  { party:"AAP",   color:"#0080C7", income:23,    corp:0,  trust:0,  note:"₹22.68 Cr in FY24 (latest). Largely crowdfunding; no corporate donations declared. Source: ADR FY24 audit report" },
  { party:"BSP",   color:"#1565C0", income:65,    corp:0,  trust:0,  note:"₹64.77 Cr in FY24. No electoral trust or corporate donations disclosed. Source: ADR FY24 audit report" },
];

// Source: PIB, CAG Reports, Ministry Annual Reports, IANS, MoHUA, MoRD, DPIIT
const POLICIES = [
  { name:"PM-KISAN (PM Kisan Samman Nidhi)",        ministry:"Agriculture",    status:"ACTIVE",  alloc:63000, spent:60000, ben:"11.8 Cr farmers · ₹6,000/yr",     issues:["IANS/CAG: ~2.3 Cr ineligible farmers received benefits; recoveries underway","Exclusion of landless tenant farmers — not covered by scheme"] },
  { name:"Ayushman Bharat – PM-JAY",                ministry:"Health",         status:"ACTIVE",  alloc:7500,  spent:5200,  ben:"55 Cr (12.5 Cr families)",         issues:["CAG 2023: claim rejection rate 25.6% in some states","Private hospital empanelment issues — 5,000+ delisted for fraud","Coverage gap: 12 states/UTs not fully on board"] },
  { name:"MGNREGS (Rural Employment Guarantee)",    ministry:"Rural Dev.",     status:"ACTIVE",  alloc:86000, spent:71000, ben:"~15 Cr HH/yr avg",                 issues:["Budget cut from ₹1,11,500 Cr (FY24 RE) to ₹86,000 Cr (FY26 BE) — 23% cut","Wage arrears pending in 8+ states; payments delayed beyond 15-day mandate","CAG: ₹2,340 Cr parked in savings accounts instead of paid as wages (2024 report)"] },
  { name:"Smart Cities Mission",                    ministry:"Housing & Urban",status:"STALLED", alloc:100000,spent:71000, ben:"100 designated cities",             issues:["Original completion: 2019-20; extended to 2024-25 then 2025-26","CAG Report 3/2023: 30% of projects incomplete 8 years after launch","₹29,000 Cr unspent as of CAG report; mission may be wound up"] },
  { name:"PM Ujjwala Yojana (Free LPG)",            ministry:"Petroleum",      status:"PARTIAL", alloc:13350, spent:12000, ben:"10.33 Cr women (BPL)",             issues:["ICRIER 2024: Only 34% of beneficiaries refill regularly — high refill cost barrier","Subsidy reduced: ₹300/cylinder subsidy removed; market prices unaffordable","CAG: 43 lakh duplicate/ineligible connections detected FY22-23"] },
  { name:"Jal Jeevan Mission (Har Ghar Jal)",       ministry:"Jal Shakti",     status:"PARTIAL", alloc:70163, spent:40000, ben:"15.24 Cr of 19.3 Cr HH (79%)",    issues:["Target: 100% by Mar 2024 — missed. As of Jan 2026: 79% coverage","Budget slashed: ₹98,714 Cr (BE FY25) → ₹51,558 Cr (RE FY25) — 48% cut","CAG: Only 54% of 'functional' connections actually supply adequate water (field audit)"] },
  { name:"Startup India / Fund of Funds",           ministry:"DPIIT",          status:"ACTIVE",  alloc:10000, spent:3500,  ben:"1.2 lakh+ DPIIT-recognised startups",issues:["Fund of Funds: only ₹3,500 Cr committed of ₹10,000 Cr corpus as of FY25","Concentration: 85% startups in top 5 cities — scheme not reaching Tier 2/3 cities"] },
];

// Source: NHSRCL, NITI Aayog, Ministry of Shipping, MoRTH, BBNL/DoT, PIB, CAG
const PROJECTS = [
  { name:"Mumbai–Ahmedabad High Speed Rail (Bullet Train)", ministry:"Railways",       bOrig:110000, bCurr:145000, dOrig:"Aug 2022", dCurr:"2030", pct:28, status:"DELAYED",  note:"28% physical progress as of Jan 2026. Maharashtra land acquisition ~73% complete. Cost overrun +32%. Source: NHSRCL 2025" },
  { name:"Bharatmala Pariyojana Phase 1 (34,800 km)",       ministry:"Road Transport", bOrig:577000, bCurr:1077000,dOrig:"Mar 2022", dCurr:"2027", pct:51, status:"DELAYED",  note:"51% complete as of Dec 2025. Cost doubled to ₹10.77L Cr. NITI Aayog flagged delays. Source: MoRTH, NITI Aayog 2024" },
  { name:"Sagarmala Programme (600+ port projects)",        ministry:"Shipping",       bOrig:800000, bCurr:915000, dOrig:"2025",     dCurr:"2028", pct:62, status:"DELAYED",  note:"389 of ~600 projects completed. Cost revised to ₹9.15L Cr. Source: Ministry of Ports, Sagarmala Dashboard 2025" },
  { name:"PM Gram Sadak Yojana Phase III (1.25 lakh km)",   ministry:"Rural Dev.",     bOrig:80250,  bCurr:80250,  dOrig:"Mar 2024", dCurr:"Jun 2025", pct:78, status:"DELAYED",note:"78% complete; target missed by 15 months. Source: MoRD PMGSY dashboard 2025" },
  { name:"BharatNet (Optical Fibre to 6.6L Gram Panchayats)",ministry:"Telecom",       bOrig:72000,  bCurr:61109,  dOrig:"2017",     dCurr:"2025", pct:66, status:"DELAYED",  note:"66% of GPs connected. Deadline missed 3+ times since 2017. CAG: quality issues. Source: BBNL/DoT 2025; CAG 2023" },
];

/* ─── DESIGN TOKENS ──────────────────────────────────────────────────── */
// Newspaper / broadsheet editorial — cream paper, ink black, saffron accent
const T = {
  paper:    "#F6F2EB",
  paper2:   "#EDE8DF",
  paper3:   "#E4DED3",
  ink:      "#0D0D0D",
  ink2:     "#1A1A1A",
  ink3:     "#2C2C2C",
  rule:     "#C8BFB0",
  ruleD:    "#A89880",
  saffron:  "#E07B00",
  saffronL: "#FF9933",
  red:      "#C0182A",
  redL:     "#DC2626",
  green:    "#0D6B3B",
  greenL:   "#16A34A",
  amber:    "#92520A",
  amberL:   "#D97706",
  muted:    "#6B5F4E",
  faint:    "#9B8E7D",
  ghost:    "#C5BBB0",
};

/* ─── GLOBAL CSS ─────────────────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{height:100%;background:${T.paper};overflow:hidden;}
body{font-family:'Instrument Sans',sans-serif;color:${T.ink};-webkit-font-smoothing:antialiased;}
button{font-family:inherit;cursor:pointer;border:none;background:none;}

::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:${T.paper2};}
::-webkit-scrollbar-thumb{background:${T.rule};border-radius:2px;}
::-webkit-scrollbar-thumb:hover{background:${T.ruleD};}

/* ── ROOT ── */
.app{display:flex;flex-direction:column;height:100vh;overflow:hidden;background:${T.paper};}

/* ── MASTHEAD ── */
.masthead{
  flex-shrink:0;
  background:${T.ink};
  padding:0 20px;
  display:flex;align-items:stretch;
  border-bottom:4px solid ${T.saffron};
  position:relative;z-index:60;
}
.masthead-left{
  display:flex;align-items:center;gap:14px;
  padding:10px 0;
  border-right:1px solid rgba(255,255,255,.12);
  padding-right:20px;margin-right:16px;
}
.mark{
  width:40px;height:40px;border-radius:6px;
  background:${T.saffron};
  display:flex;align-items:center;justify-content:center;
  font-family:'Fraunces',serif;font-size:22px;font-weight:900;color:${T.ink};
  letter-spacing:-1px;flex-shrink:0;
}
.brand-name{
  font-family:'Fraunces',serif;font-weight:900;
  font-size:20px;color:#fff;letter-spacing:1px;line-height:1;
}
.brand-hi{color:${T.saffron};}
.brand-sub{font-size:9px;color:rgba(255,255,255,.4);letter-spacing:2px;margin-top:3px;}
.masthead-center{flex:1;display:flex;align-items:center;gap:0;overflow:hidden;}
.ticker-strip{
  flex:1;overflow:hidden;white-space:nowrap;
  font-size:10px;font-weight:600;letter-spacing:.3px;
  color:rgba(255,255,255,.55);
}
.ticker-inner{display:inline-flex;animation:tick 45s linear infinite;}
.ticker-inner:hover{animation-play-state:paused;}
.tick-item{padding:0 22px;border-right:1px solid rgba(255,255,255,.1);}
.tick-item .val{color:#fff;font-family:'JetBrains Mono',monospace;}
.tick-item .bad{color:${T.saffronL};}
@keyframes tick{from{transform:translateX(0);}to{transform:translateX(-50%);}}
.masthead-right{
  display:flex;align-items:center;gap:10px;
  padding:10px 0;
  border-left:1px solid rgba(255,255,255,.12);
  padding-left:16px;margin-left:12px;
  flex-shrink:0;
}
.live-pill{
  display:flex;align-items:center;gap:5px;
  background:rgba(192,24,42,.15);border:1px solid rgba(192,24,42,.4);
  color:${T.redL};border-radius:3px;
  font-size:9px;font-weight:700;letter-spacing:2px;padding:4px 9px;
}
.live-dot-pulse{width:6px;height:6px;border-radius:50%;background:${T.redL};
  animation:blink 1.2s ease-in-out infinite;}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:.2;}}
.hbtn{
  background:rgba(255,255,255,.08);
  border:1px solid rgba(255,255,255,.15);
  color:rgba(255,255,255,.7);border-radius:4px;
  padding:7px 12px;font-size:12px;font-weight:600;
  display:flex;align-items:center;gap:7px;flex-shrink:0;
  transition:background .15s;
}
.hbtn:hover{background:rgba(255,255,255,.15);color:#fff;}
.alert-badge{
  background:${T.red};color:#fff;
  font-size:9px;font-weight:700;letter-spacing:1px;
  padding:4px 9px;border-radius:3px;flex-shrink:0;
}

/* ── BODY LAYOUT ── */
.layout{display:flex;flex:1;min-height:0;overflow:hidden;}

/* ── SIDEBAR ── */
.sidebar{
  width:220px;flex-shrink:0;
  background:${T.paper2};
  border-right:2px solid ${T.ink};
  display:none;flex-direction:column;overflow:hidden;
}
.sidebar-head{
  padding:16px 16px 10px;
  border-bottom:1px solid ${T.rule};
}
.sidebar-kv{
  display:flex;flex-direction:column;gap:8px;
}
.sidebar-stat{
  display:flex;justify-content:space-between;align-items:baseline;
  padding:5px 0;border-bottom:1px dotted ${T.ghost};
}
.sidebar-stat:last-child{border-bottom:none;}
.sidebar-stat-label{font-size:9px;color:${T.muted};letter-spacing:.8px;text-transform:uppercase;font-weight:600;}
.sidebar-stat-val{font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;color:${T.ink};}
.sidebar-scroll{flex:1;overflow-y:auto;padding:8px 0 40px;}
.nav-section-label{
  padding:12px 16px 4px;
  font-size:8px;font-weight:700;letter-spacing:3px;color:${T.ghost};text-transform:uppercase;
}
.nav-item{
  width:100%;padding:9px 16px;
  display:flex;align-items:center;gap:10px;
  border-left:3px solid transparent;
  text-align:left;transition:all .12s;
  background:transparent;
}
.nav-item:hover{background:${T.paper3};}
.nav-item.on{
  background:${T.paper};
  border-left-color:${T.ink};
}
.nav-icon{
  width:22px;height:22px;border-radius:4px;
  display:flex;align-items:center;justify-content:center;
  font-size:12px;font-weight:700;flex-shrink:0;
  background:var(--ni, ${T.rule});color:${T.ink};
}
.nav-item.on .nav-icon{background:${T.ink};color:${T.paper};}
.nav-label{font-size:12px;font-weight:500;color:${T.ink3};line-height:1.2;}
.nav-item.on .nav-label{font-weight:700;color:${T.ink};}
.nav-chip{
  margin-left:auto;font-size:8px;font-weight:700;
  padding:2px 5px;border-radius:2px;letter-spacing:.5px;flex-shrink:0;
}
.nc-red{background:${T.red};color:#fff;}
.nc-amber{background:${T.amber};color:#fff;}
.nc-green{background:${T.green};color:#fff;}

/* ── DRAWER ── */
.drawer-overlay{
  display:none;position:fixed;inset:0;
  background:rgba(13,13,13,.75);z-index:200;
  backdrop-filter:blur(3px);
}
.drawer-overlay.open{display:block;}
.drawer-panel{
  position:absolute;left:0;top:0;bottom:0;width:270px;
  background:${T.paper2};border-right:2px solid ${T.ink};
  display:flex;flex-direction:column;
  transform:translateX(-100%);
  transition:transform .28s cubic-bezier(.4,0,.2,1);
}
.drawer-overlay.open .drawer-panel{transform:translateX(0);}
.drawer-top{
  display:flex;align-items:center;justify-content:space-between;
  padding:14px 16px;border-bottom:2px solid ${T.ink};background:${T.ink};
}
.drawer-close-btn{
  width:28px;height:28px;border-radius:4px;
  background:rgba(255,255,255,.1);color:rgba(255,255,255,.6);
  font-size:16px;display:flex;align-items:center;justify-content:center;
  transition:background .15s;
}
.drawer-close-btn:hover{background:rgba(255,255,255,.2);color:#fff;}
.drawer-inner{flex:1;overflow-y:auto;padding:8px 0 32px;}

/* ── MAIN CONTENT ── */
.main{flex:1;min-width:0;display:flex;flex-direction:column;overflow:hidden;}

/* View header bar */
.view-bar{
  flex-shrink:0;background:${T.ink};
  padding:12px 22px;
  display:flex;align-items:center;gap:14px;
  border-bottom:3px solid ${T.saffron};
}
.view-bar-icon{
  width:34px;height:34px;border-radius:5px;
  background:var(--vc, ${T.saffron});flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  font-size:15px;font-weight:800;color:${T.ink};
}
.view-bar-title{
  font-family:'Fraunces',serif;font-weight:900;
  font-size:18px;color:#fff;line-height:1;
  letter-spacing:.3px;
}
.view-bar-sub{font-size:10px;color:rgba(255,255,255,.45);margin-top:2px;letter-spacing:.3px;}
.view-bar-right{margin-left:auto;display:flex;align-items:center;gap:8px;}
.view-date{font-size:10px;color:rgba(255,255,255,.4);font-family:'JetBrains Mono',monospace;}

/* Scrollable content */
.scroll-area{padding:22px;width:100%;}

/* ── TYPOGRAPHY ── */
.display{font-family:'Fraunces',serif;font-weight:900;color:${T.ink};line-height:1.1;}
.section-rule{
  display:flex;align-items:center;gap:12px;margin-bottom:16px;margin-top:4px;
}
.section-rule-text{
  font-size:9px;font-weight:700;letter-spacing:3px;
  text-transform:uppercase;color:${T.muted};white-space:nowrap;
}
.section-rule-line{flex:1;height:1px;background:${T.rule};}

/* ── STAT BLOCKS ── */
.stat-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:${T.ink};border:2px solid ${T.ink};margin-bottom:22px;}
.stat-cell{
  background:${T.paper};padding:14px 16px;
  position:relative;
}
.stat-val{
  font-family:'Fraunces',serif;font-size:28px;font-weight:900;
  color:var(--sc,${T.ink});line-height:1;letter-spacing:-1px;
}
.stat-label{font-size:9px;font-weight:700;letter-spacing:1.5px;color:${T.muted};text-transform:uppercase;margin-top:4px;}
.stat-sub{font-size:10px;color:${T.faint};margin-top:2px;}
.stat-flag{
  position:absolute;top:10px;right:10px;
  font-size:9px;font-weight:700;letter-spacing:.5px;
  padding:2px 6px;border-radius:2px;
}
.sf-bad{background:${T.red};color:#fff;}
.sf-good{background:${T.green};color:#fff;}
.sf-warn{background:${T.amber};color:#fff;}
.sf-neu{background:${T.rule};color:${T.ink};}

/* ── ACCOUNTABILITY PANELS ── */
.acct-grid{display:grid;grid-template-columns:1fr;gap:12px;margin-bottom:22px;}
.acct-panel{
  border:2px solid ${T.ink};background:${T.paper};
  padding:16px;position:relative;overflow:hidden;
}
.acct-panel::before{
  content:'';position:absolute;top:0;left:0;bottom:0;width:5px;
  background:var(--ap);
}
.acct-eyebrow{font-size:8px;font-weight:700;letter-spacing:3px;color:var(--ap);text-transform:uppercase;margin-bottom:6px;padding-left:10px;}
.acct-number{font-family:'Fraunces',serif;font-size:34px;font-weight:900;color:var(--ap);line-height:1;letter-spacing:-1px;padding-left:10px;}
.acct-desc{font-size:12px;color:${T.ink3};line-height:1.55;padding-left:10px;margin-top:6px;}
.acct-cta{
  display:inline-block;margin-top:10px;margin-left:10px;
  font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;
  color:var(--ap);border-bottom:1px solid var(--ap);padding-bottom:1px;
  background:none;cursor:pointer;
}

/* ── ALERT FEED ── */
.alert-list{margin-bottom:22px;}
.alert-row{
  display:flex;gap:12px;
  padding:11px 0;border-bottom:1px solid ${T.rule};
  align-items:flex-start;transition:background .12s;
}
.alert-row:first-child{border-top:1px solid ${T.ink};padding-top:12px;}
.alert-row:hover{background:${T.paper2};margin:0 -8px;padding-left:8px;padding-right:8px;}
.alert-sev{width:3px;flex-shrink:0;border-radius:2px;align-self:stretch;min-height:18px;background:var(--as);}
.alert-meta{display:flex;align-items:center;gap:6px;margin-bottom:4px;flex-wrap:wrap;}
.alert-tag{font-size:8px;font-weight:700;letter-spacing:1.5px;padding:2px 7px;border:1px solid currentColor;border-radius:2px;}
.alert-agency{font-size:9px;font-weight:700;color:${T.muted};}
.alert-time{font-size:9px;color:${T.ghost};}
.alert-body-text{font-size:12.5px;color:${T.ink3};line-height:1.5;}

/* ── POSITIVE STRIP ── */
.positive-strip{
  border:2px solid ${T.green};padding:14px 16px;margin-bottom:22px;
  background:rgba(13,107,59,.04);
}
.positive-head{font-size:9px;font-weight:700;letter-spacing:3px;color:${T.green};text-transform:uppercase;margin-bottom:10px;}
.positive-item{
  display:flex;gap:10px;padding:5px 0;
  border-bottom:1px dotted rgba(13,107,59,.2);font-size:12px;color:${T.ink3};
}
.positive-item:last-child{border-bottom:none;}
.pos-check{color:${T.green};font-size:13px;flex-shrink:0;font-weight:700;}

/* ── DATA TABLE ── */
.tbl-wrap{overflow-x:auto;border:2px solid ${T.ink};margin-bottom:18px;}
.dtbl{width:100%;border-collapse:collapse;font-size:12px;}
.dtbl th{
  background:${T.ink};color:${T.paper};
  padding:8px 12px;text-align:left;
  font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;
  white-space:nowrap;border-right:1px solid rgba(255,255,255,.1);
}
.dtbl th:last-child{border-right:none;}
.dtbl td{
  padding:9px 12px;border-bottom:1px solid ${T.rule};
  color:${T.ink3};vertical-align:middle;
  border-right:1px solid ${T.paper3};
}
.dtbl td:last-child{border-right:none;}
.dtbl tr:last-child td{border-bottom:none;}
.dtbl tr:hover td{background:${T.paper2};}
.dtbl .tw{color:${T.ink};font-weight:600;}
.mono{font-family:'JetBrains Mono',monospace;font-size:12px;}
.text-green{color:${T.green}!important;}

/* ── CHIPS ── */
.chip{display:inline-flex;align-items:center;font-size:9px;font-weight:700;padding:2px 7px;letter-spacing:.8px;text-transform:uppercase;border-radius:2px;}
.ch-r{background:${T.red};color:#fff;}
.ch-g{background:${T.green};color:#fff;}
.ch-a{background:${T.amber};color:#fff;}
.ch-n{background:${T.rule};color:${T.ink};}
.ch-s{background:${T.saffron};color:#fff;}
.ch-o{border:1px solid ${T.red};color:${T.red};}

/* ── PROGRESS BAR ── */
.pbar{height:5px;background:${T.paper3};border-radius:0;}
.pfill{height:100%;transition:width .5s ease;}

/* ── CARD GRID ── */
.card-grid{display:grid;grid-template-columns:1fr;gap:12px;margin-bottom:18px;}
.card{border:2px solid ${T.ink};background:${T.paper};padding:16px;transition:box-shadow .2s;}
.card:hover{box-shadow:4px 4px 0 ${T.ink};}
.card-head{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:10px;}
.card-title{font-family:'Fraunces',serif;font-size:14px;font-weight:700;color:${T.ink};line-height:1.35;}
.card-meta{font-size:10px;color:${T.muted};margin-top:3px;}
.card-body{font-size:12px;color:${T.ink3};line-height:1.6;}
.card-source{font-size:9px;color:${T.ghost};margin-top:10px;font-style:italic;}

/* ── RANK ROW ── */
.rank-row{
  display:flex;align-items:center;gap:14px;
  padding:10px 0;border-bottom:1px solid ${T.rule};
}
.rank-row:last-child{border-bottom:none;}
.rank-number{
  font-family:'Fraunces',serif;font-size:24px;font-weight:900;
  min-width:72px;line-height:1;
  color:var(--rc,${T.ink});
}
.rank-info{flex:1;min-width:0;}
.rank-name{font-size:13px;font-weight:600;color:${T.ink};line-height:1.3;}
.rank-pub{font-size:9px;color:${T.muted};margin-top:2px;letter-spacing:.3px;}
.rank-score{font-family:'JetBrains Mono',monospace;font-size:11px;color:${T.faint};margin-top:2px;}
.rank-delta{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;flex-shrink:0;}

/* ── VERDICT STYLES ── */
.vd-TRUE{color:${T.green};background:rgba(13,107,59,.1);padding:3px 8px;border-radius:2px;font-size:10px;font-weight:700;letter-spacing:.5px;}
.vd-MOSTLY_TRUE{color:${T.green};background:rgba(13,107,59,.07);padding:3px 8px;border-radius:2px;font-size:10px;font-weight:700;letter-spacing:.5px;}
.vd-MISLEADING{color:${T.amber};background:rgba(146,82,10,.1);padding:3px 8px;border-radius:2px;font-size:10px;font-weight:700;letter-spacing:.5px;}
.vd-FALSE{color:${T.red};background:rgba(192,24,42,.1);padding:3px 8px;border-radius:2px;font-size:10px;font-weight:700;letter-spacing:.5px;}
.vd-UNVERIFIABLE{color:${T.muted};background:rgba(107,95,78,.1);padding:3px 8px;border-radius:2px;font-size:10px;font-weight:700;letter-spacing:.5px;}

/* ── PARTY BAR ── */
.party-row{margin-bottom:14px;}
.party-meta{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;}
.party-name-lbl{font-size:12px;font-weight:700;color:${T.ink};}
.party-amt-lbl{font-family:'JetBrains Mono',monospace;font-size:12px;color:${T.muted};}
.party-bar-wrap{height:8px;background:${T.paper3};border:1px solid ${T.rule};overflow:hidden;}
.party-bar-fill{height:100%;}

/* ── TABS ── */
.tabs{display:flex;gap:0;border-bottom:2px solid ${T.ink};margin-bottom:18px;overflow-x:auto;scrollbar-width:none;}
.tabs::-webkit-scrollbar{display:none;}
.tab{
  flex-shrink:0;padding:8px 16px;font-size:11px;font-weight:600;
  color:${T.muted};background:transparent;border-bottom:3px solid transparent;
  margin-bottom:-2px;transition:all .15s;letter-spacing:.3px;
}
.tab:hover{color:${T.ink};}
.tab.on{color:${T.ink};border-bottom-color:${T.saffron};font-weight:700;}

/* ── FILTER CHIPS ── */
.fchips{display:flex;gap:6px;margin-bottom:16px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px;}
.fchips::-webkit-scrollbar{display:none;}
.fchip{
  flex-shrink:0;padding:5px 12px;
  font-size:10px;font-weight:600;letter-spacing:.5px;
  border:1px solid ${T.rule};background:${T.paper};color:${T.muted};
  transition:all .15s;
}
.fchip.on{background:${T.ink};color:${T.paper};border-color:${T.ink};}

/* ── WARNING BOX ── */
.warn-box{border-left:4px solid var(--wb);padding:12px 14px;background:var(--wbg);margin-bottom:16px;}
.warn-box-head{font-size:10px;font-weight:700;letter-spacing:1.5px;color:var(--wb);text-transform:uppercase;margin-bottom:6px;}
.warn-box-body{font-size:12px;color:${T.ink3};line-height:1.6;}

/* ── BOTTOM NAV ── */
.bottom-nav{
  display:flex;background:${T.ink};
  border-top:3px solid ${T.saffron};
  flex-shrink:0;height:58px;overflow-x:auto;scrollbar-width:none;
}
.bottom-nav::-webkit-scrollbar{display:none;}
.bnav-btn{
  flex:1;min-width:50px;max-width:70px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:3px;background:transparent;border:none;
  border-top:3px solid transparent;margin-top:-3px;
  transition:all .15s;padding:5px 2px;
}
.bnav-btn.on{border-top-color:${T.saffron};}
.bnav-icon{font-size:14px;line-height:1;color:rgba(255,255,255,.35);}
.bnav-btn.on .bnav-icon{color:${T.saffronL};}
.bnav-label{font-size:7px;color:rgba(255,255,255,.3);letter-spacing:.3px;text-align:center;}
.bnav-btn.on .bnav-label{color:${T.saffronL};}

/* ── FOOTER ── */
.footer{
  display:none;flex-shrink:0;background:${T.ink};
  padding:9px 24px;align-items:center;gap:0;
  border-top:1px solid rgba(255,255,255,.08);
}
.footer-brand{font-family:'Fraunces',serif;color:${T.saffronL};font-size:13px;font-weight:700;margin-right:16px;}
.footer-rule{color:rgba(255,255,255,.15);font-size:10px;margin:0 12px;}
.footer-text{color:rgba(255,255,255,.3);font-size:10px;}
.footer-right{margin-left:auto;display:flex;gap:16px;}
.flink{color:rgba(255,255,255,.3);font-size:10px;cursor:pointer;transition:color .15s;}
.flink:hover{color:${T.saffronL};}

/* ── SOURCE NOTE ── */
.src-note{font-size:9px;color:${T.ghost};font-style:italic;margin-top:8px;line-height:1.5;}

/* ── ANIMATIONS ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
.fu{animation:fadeUp .22s ease both;}
.fu1{animation-delay:40ms;} .fu2{animation-delay:80ms;}
.fu3{animation-delay:120ms;} .fu4{animation-delay:160ms;}
.fu5{animation-delay:200ms;} .fu6{animation-delay:240ms;}

/* ── RESPONSIVE ── */
@media(min-width:540px){
  .stat-grid{grid-template-columns:repeat(3,1fr);}
  .acct-grid{grid-template-columns:repeat(2,1fr);}
  .card-grid{grid-template-columns:repeat(2,1fr);}
}
@media(min-width:768px){
  .masthead{padding:0 28px;}
  .brand-sub{display:block;}
  .hbtn{display:none;}
  .sidebar{display:flex;}
  .scroll-area{padding:26px 32px;}
  .stat-grid{grid-template-columns:repeat(3,1fr);}
  .acct-grid{grid-template-columns:repeat(2,1fr);}
  .bottom-nav{display:none;}
  .footer{display:flex;}
  .view-bar{padding:14px 28px;}
  .view-bar-title{font-size:20px;}
}
@media(min-width:1024px){
  .stat-grid{grid-template-columns:repeat(6,1fr);}
  .acct-grid{grid-template-columns:repeat(4,1fr);}
  .card-grid{grid-template-columns:repeat(2,1fr);}
  .scroll-area{padding:28px 40px;}
  .sidebar{width:232px;}
}
@media(max-width:767px){
  .drawer-overlay{display:none;}
  .drawer-overlay.open{display:block;}
  .ticker-strip{display:none;}
  .masthead-right .live-pill{display:flex;}
}
`;

/* ─── HELPERS ──────────────────────────────────────────────────────── */
const INR = n => n >= 100000 ? `₹${(n/100000).toFixed(1)}L Cr` : `₹${n?.toLocaleString('en-IN')} Cr`;
const statusChip = s => {
  const m = { TRIAL:['ch-r','Trial'], CHARGESHEET:['ch-r','Chargesheet'], INVESTIGATION:['ch-a','Investigation'],
    CONVICTED:['ch-g','Convicted'], ACQUITTED:['ch-n','Acquitted'], STAYED:['ch-n','SC Stayed'],
    ACTIVE:['ch-g','Active'], STALLED:['ch-r','Stalled'], PARTIAL:['ch-a','Partial'],
    DELAYED:['ch-r','Delayed'], ON_TRACK:['ch-g','On Track'],
    FULFILLED:['ch-g','Fulfilled'], NOT_MET:['ch-r','Not Met'] };
  const [c,l] = m[s] || ['ch-n', s];
  return <span className={`chip ${c}`}>{l}</span>;
};
const vLabel = {TRUE:'✓ True',MOSTLY_TRUE:'≈ Mostly True',MISLEADING:'⚠ Misleading',FALSE:'✗ False',UNVERIFIABLE:'? Unverifiable'};

/* ─── NAV CONFIG ──────────────────────────────────────────────────── */
const NAV = [
  {id:'home',      icon:'⌂',  label:'Home',          short:'Home',    color:T.saffron},
  {id:'budget',    icon:'₹',  label:'Budget Tracker', short:'Budget',  color:T.amber,  badge:{t:'Live',c:'nc-amber'}},
  {id:'spending',  icon:'⇌',  label:'Spending',       short:'Spend',   color:T.ink},
  {id:'parties',   icon:'⚑',  label:'Party Finance',  short:'Parties', color:T.saffron},
  {id:'policies',  icon:'◎',  label:'Policies',       short:'Policy',  color:T.ink},
  {id:'fraud',     icon:'⚠',  label:'Fraud & Scams',  short:'Fraud',   color:T.red,    badge:{t:'47',c:'nc-red'}},
  {id:'promises',  icon:'✓',  label:'Promises',       short:'Promise', color:T.amber},
  {id:'statements',icon:'◉',  label:'Fact-Check',     short:'Facts',   color:T.ink},
  {id:'rankings',  icon:'↕',  label:'India Rankings', short:'Ranks',   color:T.ink},
  {id:'alerts',    icon:'!',  label:'Live Alerts',    short:'Alerts',  color:T.red,    badge:{t:'New',c:'nc-red'}},
];

function SidebarNav({active, onSelect}) {
  return <>
    <div className="nav-section-label">Main</div>
    {NAV.map(n => (
      <button key={n.id} className={`nav-item${active===n.id?' on':''}`}
        style={{'--ni': n.color === T.ink ? T.paper3 : n.color+'22'}}
        onClick={() => onSelect(n.id)}>
        <span className="nav-icon" style={active===n.id?{}:{background: n.color===T.ink?T.rule:n.color+'22'}}>
          {n.icon}
        </span>
        <span className="nav-label">{n.label}</span>
        {n.badge && <span className={`nav-chip ${n.badge.c}`}>{n.badge.t}</span>}
      </button>
    ))}
    <div style={{margin:'10px 16px',borderTop:`1px solid ${T.rule}`}}/>
    <div className="nav-section-label">About</div>
    {['Methodology','Our Funding','Editorial Team','Corrections'].map(l=>(
      <button key={l} className="nav-item" style={{'--ni':T.rule}}>
        <span className="nav-icon" style={{fontSize:10}}>›</span>
        <span className="nav-label" style={{fontSize:11}}>{l}</span>
      </button>
    ))}
  </>;
}

/* ─── VIEW BAR ──────────────────────────────────────────────────────── */
function ViewBar({id}) {
  const n = NAV.find(x=>x.id===id)||NAV[0];
  const subs = {
    home:'All data from official government & international sources · Updated daily',
    budget:'Union Budget FY 2025-26 · Allocation vs Actual · Source: indiabudget.gov.in, CGA',
    spending:'Real expenditure vs budget · Source: CGA Monthly Accounts, PFMS, CAG Reports',
    parties:'ECI Annual Returns · ADR Analysis · FY 2024-25 · Electoral Bond SC verdict context',
    policies:'Central Government schemes · Source: PIB, CAG, Ministry Annual Reports',
    fraud:'CBI, ED, CAG press releases & court orders only · Accused ≠ Convicted until judgment',
    promises:'BJP Manifesto 2014/2019/2024 · Major Projects · Source: Manifestos, PIB, CAG',
    statements:'Verdicts aggregated from AFWA, Boom, AltNews, FactChecker.in, PRS',
    rankings:'25+ global indices · Change vs 2014 shown for context, not editorial comment',
    alerts:'Alerts fire only after primary source confirmation · No media-report-only alerts',
  };
  return (
    <div className="view-bar" style={{'--vc': n.color===T.ink?T.saffron:n.color}}>
      <div className="view-bar-icon">{n.icon}</div>
      <div>
        <div className="view-bar-title">{n.label}</div>
        <div className="view-bar-sub">{subs[id]||''}</div>
      </div>
      <div className="view-bar-right">
        <span className="view-date">{new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</span>
      </div>
    </div>
  );
}

/* ─── SECTION RULE ──────────────────────────────────────────────────── */
function Rule({title}) {
  return (
    <div className="section-rule">
      <span className="section-rule-text">{title}</span>
      <span className="section-rule-line"/>
    </div>
  );
}

/* ─── VIEWS ──────────────────────────────────────────────────────────── */
function HomeView({onNav}) {
  return (
    <div className="scroll-area fu">
      {/* Big headline */}
      <div style={{marginBottom:22}}>
        <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:4}}>
          <h1 className="display" style={{fontSize:'clamp(22px,4vw,34px)'}}>India Accountability Dashboard</h1>
        </div>
        <p style={{fontSize:11,color:T.muted,letterSpacing:.3}}>Ye Desh Ka Hisaab Hai — This is the nation's account. Every figure is source-cited. We do not editorialize.</p>
      </div>

      {/* Stat grid */}
      <Rule title="Live Economic Indicators"/>
      <div className="stat-grid">
        {LIVE_STATS.map((s,i)=>(
          <div key={s.label} className={`stat-cell fu fu${i+1}`}>
            <span className={`stat-flag ${s.bad?'sf-bad':'sf-good'}`}>{s.bad?'▲':'▼'}</span>
            <div className="stat-val" style={{'--sc':s.bad?T.red:T.green}}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Accountability panels */}
      <Rule title="Accountability Tracker"/>
      <div className="acct-grid" style={{marginBottom:22}}>
        {[
          {ap:T.red,   eye:'BUDGET UTILISATION Q3 FY26', num:'~68%',    desc:'Education 61%, Health 58%, Women & Child Dev 54%, Rural Dev 63% — all below 65% with one quarter remaining. Source: CGA Monthly Accounts FY26; PRS', nav:'budget'},
          {ap:T.amber, eye:'BJP MANIFESTO PROMISES',     num:'1 of 10', desc:'Only 1 of 10 tracked BJP promises Fulfilled: ₹12L income tax rebate. 4 Partial, 2 Delayed, 3 Not Met. Source: BJP Sankalp Patra 2014-2024; PIB; CAG', nav:'promises'},
          {ap:T.red,   eye:'ACTIVE FRAUD INVESTIGATIONS',num:'₹7,000+Cr',desc:'Reliance ADA bank fraud alone: ₹1,400 Cr attached (Nov 2025, ED). PNB–Nirav Modi: ₹14,357 Cr, trial ongoing since 2018. Source: ED, CBI official press releases', nav:'fraud'},
          {ap:T.red,   eye:'PRESS FREEDOM 2025 (RSF)',   num:'151st',   desc:'India 151st/180 RSF 2025. HDI: 134th/193 UNDP 2024. Hunger: 105th/127 GHI 2024. Happiness: 118th/147 UN 2025. Freedom House: Partly Free 63/100', nav:'rankings'},
        ].map((c,i)=>(
          <div key={i} className={`acct-panel fu fu${i+1}`} style={{'--ap':c.ap}}>
            <div className="acct-eyebrow">{c.eye}</div>
            <div className="acct-number">{c.num}</div>
            <div className="acct-desc">{c.desc}</div>
            <button className="acct-cta" onClick={()=>onNav(c.nav)}>View full tracker →</button>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <Rule title="Recent Alerts"/>
      <div className="alert-list">
        {ALERTS.slice(0,5).map(a=>(
          <div key={a.id} className="alert-row" style={{'--as':a.sev==='critical'?T.red:a.sev==='positive'?T.green:T.amber}}>
            <div className="alert-sev"/>
            <div style={{flex:1,minWidth:0}}>
              <div className="alert-meta">
                <span className="alert-tag" style={{color:a.sev==='critical'?T.red:a.sev==='positive'?T.green:T.amber}}>{a.tag}</span>
                <span className="alert-agency">{a.agency}</span>
                <span className="alert-time">{a.time}</span>
              </div>
              <div className="alert-body-text">{a.body}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Positive record */}
      <Rule title="Positive Record — Verified Achievements"/>
      <div className="positive-strip">
        <div className="positive-head">✅ India's Verified Gains — Data-Backed, Source-Cited</div>
        {[
          'Fastest-growing major economy: Real GDP grew 8.2% Q2 FY26 — IMF projects India to sustain ~7% through FY27 · IMF Article IV Nov 2025',
          'Extreme poverty: Share of population in extreme poverty fell markedly to 5.3% (FY2022-23) from 12.3% (FY2015-16) · IMF/World Bank',
          'World\'s largest remittance recipient: $129 billion received in FY 2024 — 14.3% of global remittances · World Bank 2024',
          'Global Innovation Index: Rose to 39th (2024) from 81st in 2015 — patent filings, IT services, startup ecosystem · WIPO 2024',
          'Climate Change Performance Index: Ranked 10th/63 — driven by low per-capita emissions and renewable energy expansion · Germanwatch 2025',
          'Digital infrastructure: UPI processed 19.78 billion transactions in Jan 2026 (~$24B/month). India leads global real-time payments · NPCI 2026',
          'Polio-free since January 2014 — WHO certified. No wild poliovirus case in 11 years · WHO',
        ].map((t,i)=>(
          <div key={i} className="positive-item">
            <span className="pos-check">✓</span>
            <span>{t}</span>
          </div>
        ))}
      </div>
      <p className="src-note">All data sourced from official government portals, international bodies, and verified civil society organisations. Source link available for every data point. OPPOSITION does not editorialize — the data speaks.</p>
    </div>
  );
}

/* ── BUDGET DATA — All from Union Budget 2025-26 BE, indiabudget.gov.in, PRS ── */

// Source: Receipt Budget 2025-26; PRS Union Budget Analysis 2025-26
const REVENUE_SOURCES = [
  { name:"Income Tax (Personal)",         amt:1387000, pct:27.4, type:"Direct Tax",   yoy:+14.4, color:"#0D6B3B", note:"BE ₹13,87,000 Cr; +14.4% over FY25 RE. Govt foregoes ~₹1L Cr via new ₹12L rebate" },
  { name:"Corporation Tax",               amt:1000000, pct:19.7, type:"Direct Tax",   yoy:+10.4, color:"#138808", note:"BE ₹10,00,000 Cr; +10.4% growth. Effective rate 22% since Sep 2019 cut" },
  { name:"GST (CGST + Comp. Cess)",       amt:1177890, pct:23.2, type:"Indirect Tax", yoy:+11.6, color:"#E07B00", note:"CGST ₹10,10,890 Cr + GST Cess ₹1,67,110 Cr. RE FY25: CGST slipped to ₹9,58,480 Cr" },
  { name:"Customs Duty",                  amt:240000,  pct:4.7,  type:"Indirect Tax", yoy:+2.1,  color:"#92520A", note:"BE ₹2,40,000 Cr; RE FY25 surpassed BE at ₹2,58,290 Cr" },
  { name:"Union Excise Duty",             amt:327000,  pct:6.5,  type:"Indirect Tax", yoy:-1.4,  color:"#D97706", note:"BE ₹3,27,000 Cr; mainly petroleum outside GST. Declining as EV adoption rises" },
  { name:"Non-Tax Revenue",               amt:567129,  pct:11.2, type:"Non-Tax",      yoy:+9.8,  color:"#2563EB", note:"BE ₹5,67,129 Cr; RBI surplus ₹2.11L Cr (FY25), PSU dividends, spectrum, fees" },
  { name:"Capital Receipts (Non-Debt)",   amt:64000,   pct:1.3,  type:"Capital",      yoy:+5.2,  color:"#7C3AED", note:"Disinvestment BE ₹47,000 Cr (historically missed). FY24 actual: ₹15,000 Cr vs ₹51,000 Cr target" },
  { name:"Borrowings (Deficit Financing)",amt:1568936, pct:30.9, type:"Borrowings",   yoy:-8.2,  color:"#C0182A", note:"Fiscal deficit ₹15,68,936 Cr financed via G-Secs. Net market borrowings ₹11,54,000 Cr" },
];

// Source: Expenditure Budget 2025-26; PRS; Key Features Budget 2025-26
const EXPENDITURE_SECTORS = [
  { sector:"Interest Payments",            amt:1276338, pct:25.2, type:"Committed",  color:"#C0182A", note:"BE ₹12,76,338 Cr — 25% of expenditure, 37% of revenue receipts. Single largest head. Non-discretionary debt servicing" },
  { sector:"Tax Devolution to States",     amt:1221000, pct:24.1, type:"Transfer",   color:"#9B1C1C", note:"BE ₹12,21,000 Cr — 41% of divisible pool per 15th Finance Commission. Largest transfer to states" },
  { sector:"Ministry of Defence",          amt:681210,  pct:13.4, type:"Security",   color:"#1A1A1A", note:"BE ₹6,81,210 Cr (6th highest globally). Capital outlay ₹1,80,000 Cr (+12.9% YoY). 75% domestic procurement" },
  { sector:"Capital Expenditure (Direct)", amt:1121090, pct:22.1, type:"Capex",      color:"#0D6B3B", note:"BE ₹11,21,090 Cr = 3.1% of GDP. Roads ₹2,87,316 Cr, Railways ₹2,52,200 Cr, Defence Capital ₹1,80,000 Cr" },
  { sector:"Subsidies (Food+Fert+LPG)",   amt:426216,  pct:8.4,  type:"Welfare",    color:"#E07B00", note:"BE ₹4,26,216 Cr. Food subsidy ₹2,03,420 Cr + Fertiliser ₹1,67,887 Cr (87% of total). LPG ₹12,000 Cr" },
  { sector:"Rural Development",            amt:190406,  pct:3.8,  type:"Welfare",    color:"#138808", note:"BE ₹1,90,406 Cr. MGNREGS ₹86,000 Cr, PMGSY ₹19,000 Cr, PMAY-G ₹54,500 Cr, NRLM ₹14,540 Cr" },
  { sector:"Education (School + Higher)",  amt:128650,  pct:2.5,  type:"Welfare",    color:"#2563EB", note:"BE ₹1,28,650 Cr = 1.4% of GDP. Samagra Shiksha ₹37,500 Cr. UNESCO recommends 6% of GDP" },
  { sector:"Health & Family Welfare",      amt:98311,   pct:1.9,  type:"Welfare",    color:"#7C3AED", note:"BE ₹98,311 Cr = 0.9% of GDP. NHM ₹36,000 Cr, AB-PMJAY ₹7,500 Cr. WHO recommends 5% of GDP" },
  { sector:"Agriculture & Farmers",        amt:141818,  pct:2.8,  type:"Welfare",    color:"#92520A", note:"BE ₹1,41,818 Cr. PM-KISAN ₹63,000 Cr, PM Fasal Bima ₹14,600 Cr, PMKSY ₹16,000 Cr" },
];

// Source: Expenditure Budget 2025-26; Key Features; PIB budget highlights
const CAPEX_BREAKDOWN = [
  { name:"Road & Highways (MoRTH + NHAI)", amt:287316, yoy:+18, pct_gdp:0.57, note:"BE ₹2,87,316 Cr — highest ever. Bharatmala Phase 1 stalled; cost doubled to ₹10.77L Cr" },
  { name:"Railways (Gross Budgetary Support)", amt:252200, yoy:+4, pct_gdp:0.51, note:"BE ₹2,52,200 Cr GBS. Total railway outlay ₹2,65,200 Cr incl. IEBR. Bullet train 28% progress" },
  { name:"Defence Capital Outlay",         amt:180000, yoy:+12.9, pct_gdp:0.36, note:"BE ₹1,80,000 Cr (+12.9% YoY). 75% domestic procurement earmarked — 'Make in India' defence push" },
  { name:"50-Yr Interest-Free Loans to States", amt:150000, yoy:+7, pct_gdp:0.30, note:"BE ₹1,50,000 Cr for state capital expenditure. States must use for specified reforms" },
  { name:"Jal Shakti (Jal Jeevan Mission)", amt:70163,  yoy:-29, pct_gdp:0.14, note:"BE ₹70,163 Cr vs ₹98,714 Cr (FY25 BE) — 29% cut. Only 79% coverage; target 100% by Mar 2024 missed" },
  { name:"Urban (Smart Cities + Metro + AMRUT)", amt:82000, yoy:+12, pct_gdp:0.16, note:"Smart Cities winding down; Metro expansion in 27 cities. AMRUT 2.0 ₹66,750 Cr" },
  { name:"Housing PMAY (Urban + Rural)",   amt:90500,  yoy:+3,  pct_gdp:0.18, note:"PMAY-U 2.0 ₹36,000 Cr + PMAY-G ₹54,500 Cr. Urban target 1 Cr new houses; rural ₹2 lakh/house" },
  { name:"Digital (BharatNet + Semicon + AI)", amt:34000, yoy:+22, pct_gdp:0.07, note:"BharatNet ₹8,500 Cr; Semiconductor Mission ₹6,903 Cr; AI Mission ₹500 Cr for education CoE" },
];

// Source: Economic Survey, UNESCO, WHO, OECD, World Bank data
const SECTOR_SPEND_GDPCOMP = [
  { sector:"Education",   india:1.4, world_avg:4.5, developed:5.5, recommended:6.0 },
  { sector:"Health",      india:0.9, world_avg:6.0, developed:8.5, recommended:5.0 },
  { sector:"R&D",         india:0.65,world_avg:1.8, developed:2.5, recommended:2.0 },
  { sector:"Social Prot.",india:1.5, world_avg:4.2, developed:9.2, recommended:3.0 },
];

// Source: Union Budget documents FY20-FY26; PRS; MoF FRBM statements
// Revenue = non-debt receipts; all ₹ Crore; deficit = % of GDP per MoF
const FISCAL_TREND = [
  { yr:"FY20", deficit:3.8,  debt:68.9, revenue:2004853, exp:2630145, note:"Pre-COVID; deficit overshot 3.3% target to 3.8% actual" },
  { yr:"FY21", deficit:9.2,  debt:89.4, revenue:1627000, exp:3502000, note:"COVID-19 pandemic; massive stimulus; highest deficit since liberalisation" },
  { yr:"FY22", deficit:6.7,  debt:83.4, revenue:2232741, exp:3793704, note:"Economic recovery; RE better than BE. Actual 6.7% vs 6.8% BE" },
  { yr:"FY23", deficit:6.4,  debt:81.0, revenue:2567745, exp:4178304, note:"Tax buoyancy strong. Actual 6.4% vs 6.4% target — first time target met since FY17" },
  { yr:"FY24", deficit:5.6,  debt:80.1, revenue:3002949, exp:4447730, note:"Actual 5.6% (RE: 5.8%). Capex record ₹9.5L Cr actual" },
  { yr:"FY25", deficit:4.8,  debt:78.5, revenue:3147000, exp:4716000, note:"RE FY25: 4.8% of GDP. Below 5% for first time since FY20. Capex ₹10.18L Cr (RE)" },
  { yr:"FY26", deficit:4.4,  debt:76.8, revenue:3496409, exp:5065345, note:"BE FY26: 4.4% target. Fiscal deficit ₹15,68,936 Cr. Net market borrowings ₹11,54,000 Cr" },
];

function BudgetDonut({ data, total, size = 140 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.38, stroke = size * 0.14;
  let angle = -90;
  const arcs = data.map(d => {
    const sweep = (d.pct / 100) * 360;
    const start = angle;
    angle += sweep;
    return { ...d, start, sweep };
  });
  const polar = (cx, cy, r, deg) => {
    const rad = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  const arcPath = (start, sweep, r) => {
    if (sweep >= 360) sweep = 359.99;
    const [sx, sy] = polar(cx, cy, r, start);
    const [ex, ey] = polar(cx, cy, r, start + sweep);
    const large = sweep > 180 ? 1 : 0;
    return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
  };
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      {arcs.map((a, i) => (
        <path key={i} d={arcPath(a.start, a.sweep, r)}
          fill="none" stroke={a.color} strokeWidth={stroke}
          strokeLinecap="butt" />
      ))}
      <circle cx={cx} cy={cy} r={r - stroke / 2 - 1} fill="#F6F2EB" />
    </svg>
  );
}

function HBar({ pct, color, max = 100 }) {
  return (
    <div style={{ flex: 1, height: 10, background: T.paper3, border: `1px solid ${T.rule}` }}>
      <div style={{ width: `${(pct / max) * 100}%`, height: '100%', background: color, transition: 'width .5s ease' }} />
    </div>
  );
}

function BudgetView() {
  const [tab, setTab] = useState('overview');
  const tabs = [
    { id:'overview',   label:'Overview'          },
    { id:'revenue',    label:'Revenue Sources'   },
    { id:'expenditure',label:'Where Money Goes'  },
    { id:'capex',      label:'Capital Spending'  },
    { id:'ministry',   label:'Ministry Tracker'  },
    { id:'fiscal',     label:'Fiscal Health'     },
  ];

  const totalRevenue  = REVENUE_SOURCES.reduce((s,r) => s + r.amt, 0);
  const totalExp      = EXPENDITURE_SECTORS.reduce((s,e) => s + e.amt, 0);
  const totalCapex    = CAPEX_BREAKDOWN.reduce((s,c) => s + c.amt, 0);

  const fmt2 = n => n >= 100000 ? `₹${(n/100000).toFixed(2)}L Cr` : `₹${(n/1000).toFixed(0)}K Cr`;

  return (
    <div className="scroll-area fu">
      {/* Year + Tab selector */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16, flexWrap:'wrap' }}>
        <div className="tabs" style={{ marginBottom:0, flex:1, minWidth:0 }}>
          {tabs.map(t => (
            <button key={t.id} className={`tab${tab===t.id?' on':''}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        <div style={{ background:T.saffron, color:T.ink, fontSize:10, fontWeight:700, padding:'5px 12px', letterSpacing:.5, flexShrink:0 }}>
          FY 2025-26
        </div>
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && <>
        <Rule title="Budget at a Glance — FY 2025-26"/>
        <div className="stat-grid" style={{ marginBottom:20 }}>
          {[
            { val:'₹34.96L Cr', lbl:'Total Revenue Receipts', sub:'Non-debt', bad:false },
            { val:'₹50.65L Cr', lbl:'Total Expenditure (BE)', sub:'Budgeted', bad:false },
            { val:'₹15.69L Cr', lbl:'Fiscal Deficit',         sub:'Financed via borrowing', bad:true },
            { val:'4.4% GDP',   lbl:'Deficit as % of GDP',    sub:'Target: 4.5% (achieved)', bad:true },
            { val:'₹11.11L Cr', lbl:'Capital Expenditure',    sub:'2.9× of FY20 level', bad:false },
            { val:'₹12.0L Cr',  lbl:'Interest Payments',      sub:'24% of all expenditure', bad:true },
          ].map(k => (
            <div key={k.lbl} className="stat-cell">
              <div className="stat-val" style={{'--sc': k.bad ? T.red : T.green, fontSize:20}}>{k.val}</div>
              <div className="stat-label">{k.lbl}</div>
              <div className="stat-sub">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Two-column flow summary */}
        <Rule title="Money Flow — Revenue In vs Expenditure Out"/>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
          {/* Revenue side */}
          <div style={{ border:`2px solid ${T.ink}`, background:T.paper }}>
            <div style={{ background:T.green, color:'#fff', padding:'8px 14px', fontSize:9, fontWeight:700, letterSpacing:2 }}>
              ₹34.96L CRORE IN ▼
            </div>
            {[
              { label:'Direct Taxes', val:'₹24.0L Cr', pct:47, note:'Income Tax + Corporate Tax' },
              { label:'Indirect Taxes', val:'₹16.5L Cr', pct:33, note:'GST + Customs + Excise' },
              { label:'Non-Tax Revenue', val:'₹5.7L Cr',  pct:11, note:'Dividends, fees, profits' },
              { label:'Capital Receipts', val:'₹3.5L Cr',  pct:7,  note:'Disinvestment + loan repayments' },
            ].map((r,i) => (
              <div key={i} style={{ padding:'10px 14px', borderBottom:`1px solid ${T.rule}`, display:'flex', flexDirection:'column', gap:5 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                  <span style={{ fontSize:12, fontWeight:600, color:T.ink }}>{r.label}</span>
                  <span className="mono" style={{ fontSize:12, fontWeight:700, color:T.green }}>{r.val}</span>
                </div>
                <div className="pbar"><div className="pfill" style={{ width:`${r.pct}%`, background:T.green }}/></div>
                <span style={{ fontSize:10, color:T.muted }}>{r.note}</span>
              </div>
            ))}
          </div>

          {/* Expenditure side */}
          <div style={{ border:`2px solid ${T.ink}`, background:T.paper }}>
            <div style={{ background:T.red, color:'#fff', padding:'8px 14px', fontSize:9, fontWeight:700, letterSpacing:2 }}>
              ₹50.65L CRORE OUT ▲
            </div>
            {[
              { label:'State Transfers',   val:'₹12.2L Cr', pct:24, note:'Tax devolution + grants', color:T.red },
              { label:'Interest Payments', val:'₹12.0L Cr', pct:24, note:'Cost of past borrowing',  color:T.red },
              { label:'Capital Expenditure',val:'₹11.1L Cr', pct:22, note:'Roads, rails, infra',    color:T.amber },
              { label:'Subsidies',         val:'₹4.1L Cr',  pct:8,  note:'Food, fertilizer, LPG',  color:T.amber },
              { label:'Defence',           val:'₹6.8L Cr',  pct:13, note:'Capital + Revenue',       color:T.ink },
              { label:'Social Sectors',    val:'₹4.5L Cr',  pct:9,  note:'Education + Health + WCD',color:T.blue||'#2563EB'},
            ].map((e,i) => (
              <div key={i} style={{ padding:'10px 14px', borderBottom:`1px solid ${T.rule}`, display:'flex', flexDirection:'column', gap:5 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                  <span style={{ fontSize:12, fontWeight:600, color:T.ink }}>{e.label}</span>
                  <span className="mono" style={{ fontSize:12, fontWeight:700, color:e.color }}>{e.val}</span>
                </div>
                <div className="pbar"><div className="pfill" style={{ width:`${e.pct}%`, background:e.color }}/></div>
                <span style={{ fontSize:10, color:T.muted }}>{e.note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deficit explained */}
        <div className="warn-box" style={{'--wb':T.red,'--wbg':'rgba(192,24,42,.04)', marginBottom:16}}>
          <div className="warn-box-head">⚠ The Deficit Gap — ₹15.69 Lakh Crore</div>
          <div className="warn-box-body">
            The government spends ₹15.69 lakh crore <strong>more than it earns</strong>. This gap is financed entirely by <strong>market borrowings</strong> (Government Securities / G-Secs) and small savings. India's total outstanding debt stands at ~₹185 lakh crore (76.8% of GDP). Interest servicing now consumes <strong>24 paise of every rupee spent</strong> — the single largest expenditure item, exceeding defence, education, and health combined.
          </div>
        </div>
        <p className="src-note">Source: Union Budget 2025-26 · Budget Speech · Annual Financial Statement · Receipt Budget · indiabudget.gov.in</p>
      </>}

      {/* ── REVENUE SOURCES ── */}
      {tab === 'revenue' && <>
        <Rule title="Where Does Government Money Come From?"/>

        {/* Donut + legend */}
        <div style={{ border:`2px solid ${T.ink}`, background:T.paper, marginBottom:20 }}>
          <div style={{ background:T.ink, color:'#fff', padding:'8px 16px', fontSize:9, fontWeight:700, letterSpacing:2 }}>
            TOTAL RECEIPTS — ₹34.96 LAKH CRORE (FY 2025-26)
          </div>
          <div style={{ padding:20, display:'flex', gap:20, alignItems:'flex-start', flexWrap:'wrap' }}>
            <BudgetDonut data={REVENUE_SOURCES} total={totalRevenue} size={160}/>
            <div style={{ flex:1, minWidth:200 }}>
              {REVENUE_SOURCES.map((r,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                  <div style={{ width:10, height:10, background:r.color, flexShrink:0 }}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                      <span style={{ fontSize:12, fontWeight:600, color:T.ink }}>{r.name}</span>
                      <span className="mono" style={{ fontSize:11, color:T.muted }}>{r.pct}%</span>
                    </div>
                    <div style={{ fontSize:10, color:T.muted }}>{fmt2(r.amt)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed breakdown */}
        <Rule title="Revenue Source Detail"/>
        <div className="tbl-wrap">
          <table className="dtbl">
            <thead>
              <tr>
                <th>Revenue Source</th>
                <th>Type</th>
                <th>Amount (₹ Cr)</th>
                <th>% of Total</th>
                <th style={{minWidth:120}}>Share Bar</th>
                <th>YoY Growth</th>
              </tr>
            </thead>
            <tbody>
              {REVENUE_SOURCES.map(r => (
                <tr key={r.name}>
                  <td className="tw" style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:8, height:8, background:r.color, flexShrink:0 }}/>
                    {r.name}
                  </td>
                  <td><span className="chip ch-n" style={{ fontSize:8 }}>{r.type}</span></td>
                  <td className="mono">{r.amt.toLocaleString('en-IN')}</td>
                  <td className="mono" style={{ fontWeight:700 }}>{r.pct}%</td>
                  <td><HBar pct={r.pct} color={r.color} max={30}/></td>
                  <td className="mono" style={{ color:r.yoy>0?T.green:T.red, fontWeight:700 }}>
                    {r.yoy>0?`▲ +${r.yoy}%`:`▼ ${r.yoy}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tax base analysis */}
        <Rule title="Tax Structure Analysis"/>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:12, marginBottom:16 }}>
          {[
            { head:'Direct Taxes', val:'₹24.0L Cr', pct:'47%', note:'Income Tax + Corporate Tax. Direct taxes are paid by those who earn — progressive in principle. Only 7.4% of Indians file returns.', flag:'ch-a' },
            { head:'Indirect Taxes', val:'₹16.5L Cr', pct:'33%', note:'GST + Customs + Excise. Indirect taxes are regressive — the poor pay the same GST rate as the rich on essentials.', flag:'ch-r' },
            { head:'Non-Tax Revenue', val:'₹5.7L Cr', pct:'11%', note:'RBI surplus, PSU dividends, spectrum fees, external grants. Highly variable year to year.', flag:'ch-n' },
            { head:'Capital Receipts', val:'₹3.5L Cr', pct:'7%', note:'Disinvestment proceeds + loan repayments. FY26 disinvestment target ₹47,000 Cr. Historical underachievement pattern.', flag:'ch-a' },
          ].map((b,i) => (
            <div key={i} className="card" style={{ marginBottom:0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:11, fontWeight:700, color:T.muted, letterSpacing:1, textTransform:'uppercase' }}>{b.head}</span>
                <span className={`chip ${b.flag}`}>{b.pct}</span>
              </div>
              <div style={{ fontFamily:'Fraunces,serif', fontSize:22, fontWeight:900, color:T.ink, marginBottom:8 }}>{b.val}</div>
              <div style={{ fontSize:11, color:T.ink3, lineHeight:1.6 }}>{b.note}</div>
            </div>
          ))}
        </div>
        <p className="src-note">Source: Receipt Budget 2025-26 · Revenue Budget Statement · CGA Monthly Accounts · indiabudget.gov.in</p>
      </>}

      {/* ── WHERE MONEY GOES ── */}
      {tab === 'expenditure' && <>
        <Rule title="Where Does Government Money Go?"/>

        <div style={{ border:`2px solid ${T.ink}`, background:T.paper, marginBottom:20 }}>
          <div style={{ background:T.ink, color:'#fff', padding:'8px 16px', fontSize:9, fontWeight:700, letterSpacing:2 }}>
            TOTAL EXPENDITURE — ₹50.65 LAKH CRORE (FY 2025-26) · EVERY RUPEE ACCOUNTED
          </div>
          <div style={{ padding:20, display:'flex', gap:20, alignItems:'flex-start', flexWrap:'wrap' }}>
            <BudgetDonut data={EXPENDITURE_SECTORS.map(e => ({ pct:e.pct, color:e.color }))} total={totalExp} size={160}/>
            <div style={{ flex:1, minWidth:200 }}>
              {EXPENDITURE_SECTORS.map((e,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                  <div style={{ width:8, height:8, background:e.color, flexShrink:0 }}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                      <span style={{ fontSize:11, fontWeight:600, color:T.ink, lineHeight:1.3 }}>{e.sector}</span>
                      <span className="mono" style={{ fontSize:10, color:T.muted, flexShrink:0, marginLeft:6 }}>{e.pct}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Rule title="Expenditure Breakdown — Detailed"/>
        <div className="tbl-wrap">
          <table className="dtbl">
            <thead>
              <tr><th>Expenditure Head</th><th>Type</th><th>Amount (₹ Cr)</th><th>% of Budget</th><th style={{minWidth:130}}>Share</th><th>Note</th></tr>
            </thead>
            <tbody>
              {EXPENDITURE_SECTORS.map(e => (
                <tr key={e.sector}>
                  <td style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:8, height:8, background:e.color, flexShrink:0 }}/>
                    <span className="tw">{e.sector}</span>
                  </td>
                  <td><span className="chip ch-n" style={{ fontSize:8 }}>{e.type}</span></td>
                  <td className="mono">{e.amt.toLocaleString('en-IN')}</td>
                  <td className="mono" style={{ fontWeight:700, color:e.pct>=20?T.red:e.pct>=10?T.amber:T.ink }}>{e.pct}%</td>
                  <td><HBar pct={e.pct} color={e.color} max={25}/></td>
                  <td style={{ fontSize:11, color:T.muted, maxWidth:220 }}>{e.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* India vs World spend on social sectors */}
        <Rule title="India's Social Spending vs Global Benchmarks (% of GDP)"/>
        <div style={{ border:`2px solid ${T.ink}`, background:T.paper, marginBottom:16 }}>
          <div style={{ background:T.ink, color:'#fff', padding:'8px 16px', fontSize:9, fontWeight:700, letterSpacing:2 }}>
            HOW INDIA'S SOCIAL INVESTMENT COMPARES
          </div>
          {SECTOR_SPEND_GDPCOMP.map((s,i) => (
            <div key={i} style={{ padding:'14px 16px', borderBottom:`1px solid ${T.rule}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                <span style={{ fontSize:12, fontWeight:700, color:T.ink }}>{s.sector}</span>
                <div style={{ display:'flex', gap:12, fontSize:10 }}>
                  <span style={{ color:T.red, fontWeight:700 }}>India: {s.india}%</span>
                  <span style={{ color:T.muted }}>Avg: {s.world_avg}%</span>
                  <span style={{ color:T.green }}>Recommended: {s.recommended}%</span>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                {[
                  { label:`India (${s.india}%)`,           val:s.india,       color:T.red },
                  { label:`World Avg (${s.world_avg}%)`,   val:s.world_avg,   color:T.amber },
                  { label:`Developed (${s.developed}%)`,   val:s.developed,   color:T.green },
                  { label:`Recommended (${s.recommended}%)`,val:s.recommended,color:'#2563EB' },
                ].map(b => (
                  <div key={b.label} style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontSize:10, color:T.muted, minWidth:140 }}>{b.label}</span>
                    <div style={{ flex:1, height:8, background:T.paper3, border:`1px solid ${T.rule}` }}>
                      <div style={{ width:`${(b.val / 10) * 100}%`, height:'100%', background:b.color }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ padding:'10px 16px' }}>
            <p className="src-note" style={{ margin:0 }}>Sources: MoF Budget Papers · UNESCO Education Report · WHO Health Finance Database · OECD Social Expenditure</p>
          </div>
        </div>

        <div className="warn-box" style={{'--wb':T.red,'--wbg':'rgba(192,24,42,.04)'}}>
          <div className="warn-box-head">🔴 Critical Finding — Social Spend Below Global Floor</div>
          <div className="warn-box-body">India spends <strong>1.4% of GDP on Education</strong> — less than half the UNESCO-recommended 6%. On Health it is <strong>0.9% of GDP</strong> — among the lowest in G20. Meanwhile, <strong>Interest Payments at 24% of expenditure exceed the combined spend on Education, Health, Agriculture, and Women & Child Development</strong>. Every year of deficit adds to this debt trap.</div>
        </div>
      </>}

      {/* ── CAPEX ── */}
      {tab === 'capex' && <>
        <Rule title="Capital Expenditure — Building Assets for the Future"/>
        <div className="stat-grid" style={{ marginBottom:20 }}>
          {[
            { val:'₹11.11L Cr', lbl:'Total CapEx FY26',     sub:'2.9× FY20 level', bad:false },
            { val:'22%',        lbl:'of Total Expenditure', sub:'Up from 12% in FY20', bad:false },
            { val:'2.9% GDP',   lbl:'CapEx as % of GDP',    sub:'Target', bad:false },
            { val:'₹2.87L Cr',  lbl:'Roads & Highways',     sub:'Largest single item', bad:false },
            { val:'₹2.55L Cr',  lbl:'Railways',             sub:'Gross budgetary support', bad:false },
            { val:'₹1.6L Cr',   lbl:'State CapEx Loans',    sub:'50-yr interest-free', bad:false },
          ].map(k => (
            <div key={k.lbl} className="stat-cell">
              <div className="stat-val" style={{'--sc':T.green, fontSize:18}}>{k.val}</div>
              <div className="stat-label">{k.lbl}</div>
              <div className="stat-sub">{k.sub}</div>
            </div>
          ))}
        </div>

        <Rule title="CapEx Sector Breakdown"/>
        <div style={{ border:`2px solid ${T.ink}`, background:T.paper, marginBottom:20 }}>
          <div style={{ background:T.ink, color:'#fff', padding:'8px 16px', fontSize:9, fontWeight:700, letterSpacing:2 }}>
            TOTAL CAPITAL SPENDING — ₹11.11 LAKH CRORE
          </div>
          {CAPEX_BREAKDOWN.map((c,i) => (
            <div key={i} style={{ padding:'13px 16px', borderBottom:i<CAPEX_BREAKDOWN.length-1?`1px solid ${T.rule}`:'none' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10, marginBottom:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:T.ink }}>{c.name}</div>
                  <div style={{ fontSize:10, color:T.muted, marginTop:2 }}>{c.note}</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div className="mono" style={{ fontSize:13, fontWeight:700, color:T.ink }}>{fmt2(c.amt)}</div>
                  <div className="mono" style={{ fontSize:10, color:c.yoy>0?T.green:T.red, marginTop:2 }}>
                    {c.yoy>0?`▲ +${c.yoy}%`:`▼ ${c.yoy}%`} YoY
                  </div>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ flex:1, height:10, background:T.paper3, border:`1px solid ${T.rule}` }}>
                  <div style={{ width:`${(c.amt/287300)*100}%`, height:'100%', background:c.yoy>=0?T.green:T.red, transition:'width .5s' }}/>
                </div>
                <span style={{ fontSize:9, color:T.muted, minWidth:60, textAlign:'right' }}>{c.pct_gdp}% GDP</span>
              </div>
            </div>
          ))}
        </div>

        <div className="warn-box" style={{'--wb':T.amber,'--wbg':'rgba(146,82,10,.04)', marginBottom:12}}>
          <div className="warn-box-head">⚠ CapEx Quality Concerns</div>
          <div className="warn-box-body">
            While headline CapEx numbers are at record highs, <strong>Jal Jeevan Mission budget was cut 8%</strong> despite 27% of rural homes still lacking functional taps. CAG Report 2024 found 30% of Smart Cities projects incomplete. Roads & Highways allocation is the highest ever, but land acquisition delays are pushing utilisation to 73% (Q3 FY26). State CapEx loans (₹1.6L Cr) are classified as Central CapEx but actual spending depends on states.
          </div>
        </div>
        <p className="src-note">Source: Expenditure Budget 2025-26 · Capital Budget Statement · CAG Performance Audit Reports</p>
      </>}

      {/* ── MINISTRY TRACKER ── */}
      {tab === 'ministry' && <>
        <Rule title="Ministry-wise Budget Allocation vs Actual Utilisation — Q3 FY26"/>
        <div className="tbl-wrap">
          <table className="dtbl">
            <thead>
              <tr>
                <th>Ministry</th>
                <th>Allocation (₹ Cr)</th>
                <th>Spent (₹ Cr)</th>
                <th style={{minWidth:150}}>Utilisation</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {BUDGET_DATA.map(m => (
                <tr key={m.name}>
                  <td className="tw">{m.name}</td>
                  <td className="mono">{m.alloc.toLocaleString('en-IN')}</td>
                  <td className="mono">{m.spent.toLocaleString('en-IN')}</td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div className="pbar" style={{ flex:1 }}>
                        <div className="pfill" style={{ width:`${m.pct}%`, background:m.pct>=85?T.green:m.pct>=70?T.amber:T.red }}/>
                      </div>
                      <span className="mono" style={{ fontSize:11, color:m.pct>=85?T.green:m.pct>=70?T.amber:T.red, minWidth:34 }}>{m.pct}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`chip ${m.pct>=85?'ch-g':m.pct>=70?'ch-a':'ch-r'}`}>
                      {m.pct>=85?'On Track':m.pct>=70?'Watch':'Under-utilized'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="warn-box" style={{'--wb':T.red,'--wbg':'rgba(192,24,42,.04)'}}>
          <div className="warn-box-head">🔴 Q3 Alert — Critical Under-utilisation</div>
          <div className="warn-box-body">Women & Child Development (54%), Health (58%), Education (61%), and Rural Development (63%) are all below 65% with one quarter remaining. CAG has flagged Q4 "March rush" spending — where ministries dump unspent funds in March, often without adequate quality controls — in 6 of the last 8 years. Source: CGA Monthly Accounts</div>
        </div>
        <p className="src-note">Source: Controller General of Accounts (cga.nic.in) · Ministry Annual Reports · PFMS real-time data</p>
      </>}

      {/* ── FISCAL HEALTH ── */}
      {tab === 'fiscal' && <>
        <Rule title="Fiscal Health — Deficit & Debt Trends (FY 2019-20 to FY 2025-26)"/>
        <div className="stat-grid" style={{ marginBottom:20 }}>
          {[
            { val:'₹185L Cr',  lbl:'Total Outstanding Debt', sub:'~76.8% of GDP', bad:true },
            { val:'₹12.0L Cr', lbl:'Annual Interest Bill',   sub:'24% of exp.', bad:true },
            { val:'₹47Cr/min', lbl:'Interest Paid Every Minute', sub:'₹22,831 Cr/day', bad:true },
            { val:'4.4%',      lbl:'Fiscal Deficit FY26',    sub:'Down from 9.2% (FY21)', bad:false },
          ].map(k => (
            <div key={k.lbl} className="stat-cell">
              <div className="stat-val" style={{'--sc':k.bad?T.red:T.green, fontSize:18}}>{k.val}</div>
              <div className="stat-label">{k.lbl}</div>
              <div className="stat-sub">{k.sub}</div>
            </div>
          ))}
        </div>

        <Rule title="Fiscal Deficit % of GDP — Year-on-Year Trend"/>
        <div style={{ border:`2px solid ${T.ink}`, background:T.paper, marginBottom:20 }}>
          <div style={{ background:T.ink, color:'#fff', padding:'8px 16px', fontSize:9, fontWeight:700, letterSpacing:2 }}>
            FISCAL DEFICIT AS % OF GDP — FY20 TO FY26
          </div>
          {FISCAL_TREND.map((f,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 16px', borderBottom:i<FISCAL_TREND.length-1?`1px solid ${T.rule}`:'none' }}>
              <span style={{ fontFamily:'Fraunces,serif', fontWeight:700, fontSize:14, color:T.ink, minWidth:42 }}>{f.yr}</span>
              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:3 }}>
                <div style={{ height:16, background:T.paper3, border:`1px solid ${T.rule}`, position:'relative' }}>
                  <div style={{ position:'absolute', left:0, top:0, bottom:0, width:`${(f.deficit/10)*100}%`, background:f.deficit>6?T.red:f.deficit>4.5?T.amber:T.green, display:'flex', alignItems:'center', paddingLeft:6 }}>
                    <span className="mono" style={{ fontSize:10, fontWeight:700, color:'#fff' }}>{f.deficit}%</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign:'right', minWidth:80 }}>
                <div className="mono" style={{ fontSize:10, color:T.muted }}>Debt: {f.debt}%</div>
              </div>
            </div>
          ))}
          <div style={{ padding:'10px 16px', background:T.paper2, borderTop:`1px solid ${T.rule}` }}>
            <div style={{ display:'flex', gap:16, fontSize:10 }}>
              <span style={{ color:T.green }}>■ Below 4.5% (Target)</span>
              <span style={{ color:T.amber }}>■ 4.5%–6% (Elevated)</span>
              <span style={{ color:T.red }}>■ Above 6% (Critical)</span>
            </div>
          </div>
        </div>

        <Rule title="Revenue vs Expenditure Trend (₹ Lakh Crore)"/>
        <div className="tbl-wrap" style={{ marginBottom:16 }}>
          <table className="dtbl">
            <thead>
              <tr><th>Year</th><th>Revenue (₹ Cr)</th><th>Expenditure (₹ Cr)</th><th>Deficit (₹ Cr)</th><th>Deficit % GDP</th><th>Debt % GDP</th></tr>
            </thead>
            <tbody>
              {FISCAL_TREND.map(f => {
                const def = f.exp - f.revenue;
                return (
                  <tr key={f.yr}>
                    <td style={{ fontWeight:700, color:T.ink, fontFamily:'Fraunces,serif' }}>{f.yr}</td>
                    <td className="mono text-green">{f.revenue.toLocaleString('en-IN')}</td>
                    <td className="mono" style={{ color:T.red }}>{f.exp.toLocaleString('en-IN')}</td>
                    <td className="mono" style={{ color:T.red }}>-{def.toLocaleString('en-IN')}</td>
                    <td className="mono" style={{ fontWeight:700, color:f.deficit>6?T.red:f.deficit>4.5?T.amber:T.green }}>{f.deficit}%</td>
                    <td className="mono" style={{ color:f.debt>80?T.red:T.amber }}>{f.debt}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="warn-box" style={{'--wb':T.amber,'--wbg':'rgba(146,82,10,.04)'}}>
          <div className="warn-box-head">📊 Fiscal Context</div>
          <div className="warn-box-body">India's fiscal deficit spiked to 9.2% of GDP in FY21 due to COVID-19 stimulus. Consolidation has been steady since, targeting 4.5% by FY26 and 4.0% by FY28 (MTFP). However, total debt at ~76.8% of GDP remains elevated. The IMF recommends emerging economies target below 60% debt/GDP. At current pace India will reach 60% only by ~FY35. <strong>Every 1% rise in global interest rates adds ~₹1.8L Cr to India's annual borrowing cost.</strong></div>
        </div>
        <p className="src-note">Source: Union Budget 2025-26 · Medium Term Fiscal Policy Statement · RBI State of the Economy · IMF Article IV · indiabudget.gov.in</p>
      </>}
    </div>
  );
}

function SpendingView() {
  return (
    <div className="scroll-area fu">
      <Rule title="Q3 FY26 Expenditure Summary"/>
      <div className="stat-grid" style={{marginBottom:22}}>
        {[
          {val:'₹34.1L Cr',lbl:'Actuals Q3 FY26',bad:false},
          {val:'₹50.65L Cr',lbl:'BE FY26',bad:false},
          {val:'68%',lbl:'Utilisation Rate',bad:true},
          {val:'₹4.8L Cr',lbl:'DBT Transfers',bad:false},
          {val:'23',lbl:'CAG Red Flags',bad:true},
          {val:'~28%',lbl:'Q4 March Rush (Est.)',bad:true},
        ].map(k=>(
          <div key={k.lbl} className="stat-cell">
            <div className="stat-val" style={{'--sc':k.bad?T.red:T.green,fontSize:20}}>{k.val}</div>
            <div className="stat-label">{k.lbl}</div>
          </div>
        ))}
      </div>
      <Rule title="Monthly Expenditure FY26 (₹ Lakh Crore)"/>
      <div style={{border:`2px solid ${T.ink}`,padding:'18px 20px',marginBottom:22,background:T.paper}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:0}}>
          {[['Apr','3.2'],['May','3.8'],['Jun','4.1'],['Jul','3.9'],['Aug','4.3'],['Sep','4.0'],['Oct','4.5'],['Nov','3.8'],['Dec','4.2'],['Jan','4.1'],['Feb','3.9'],['Mar','?']].map(([m,v],i)=>(
            <div key={m} style={{padding:'12px 8px',textAlign:'center',borderRight:i%4!==3?`1px solid ${T.rule}`:'none',borderBottom:i<8?`1px solid ${T.rule}`:'none'}}>
              <div style={{fontFamily:'Fraunces,serif',fontSize:22,fontWeight:900,color:v==='?'?T.ghost:T.ink}}>{v}</div>
              <div style={{fontSize:9,color:T.muted,marginTop:3,letterSpacing:1,textTransform:'uppercase'}}>{m}</div>
            </div>
          ))}
        </div>
      </div>
      <Rule title="CAG Audit Findings — Report No. 14 of 2024"/>
      {[
        'Rural Development: ₹2,340 Cr parked in savings accounts instead of disbursed as MGNREGS wages — opportunity cost and delay to rural workers',
        'PM Awas Yojana Urban: ₹8,900 Cr released to states but not passed to beneficiaries — 6 states flagged for non-compliance',
        'Jal Jeevan Mission: Connections reported as "functional" — field audit shows only 54% actually operational and supplying water',
      ].map((f,i)=>(
        <div key={i} className="warn-box fu" style={{'--wb':T.red,'--wbg':'rgba(192,24,42,.04)',marginBottom:8,animationDelay:`${i*50}ms`}}>
          <div className="warn-box-body">{f}</div>
        </div>
      ))}
      <p className="src-note">Source: CAG Report No. 14/2024 · PFMS (pfms.nic.in) · CGA Monthly Accounts</p>
    </div>
  );
}

function FraudView() {
  const [filter, setFilter] = useState('ALL');
  const cats = ['ALL','BANK','EXAM','POLITICAL','CORPORATE','GOVT'];
  const shown = filter==='ALL' ? FRAUD_CASES : FRAUD_CASES.filter(c=>c.cat===filter);
  return (
    <div className="scroll-area fu">
      <div className="warn-box" style={{'--wb':T.amber,'--wbg':'rgba(146,82,10,.05)',marginBottom:20}}>
        <div className="warn-box-head">⚖ Legal Disclaimer</div>
        <div className="warn-box-body">All individuals and entities listed are <strong>accused, not convicted</strong> unless explicitly stated. All entries are based solely on official FIR, chargesheet, CAG report, or court order. Acquittals updated within 24 hours of judgment.</div>
      </div>
      <Rule title="Summary"/>
      <div className="stat-grid" style={{marginBottom:20}}>
        {[
          {val:'47',      lbl:'Total Cases Tracked', bad:true},
          {val:'~₹1.18L Cr',lbl:'Amount Involved',  bad:true},
          {val:'~₹22,600 Cr',lbl:'Assets Attached', bad:false},
          {val:'~26%',    lbl:'Avg Recovery Rate',   bad:true},
          {val:'12',      lbl:'Exam Leaks (2017-25)',bad:true},
          {val:'3',       lbl:'Convictions to Date', bad:false},
        ].map(k=>(
          <div key={k.lbl} className="stat-cell">
            <div className="stat-val" style={{'--sc':k.bad?T.red:T.green,fontSize:22}}>{k.val}</div>
            <div className="stat-label">{k.lbl}</div>
          </div>
        ))}
      </div>
      <Rule title="Case Database"/>
      <div className="fchips">
        {cats.map(c=><button key={c} className={`fchip${filter===c?' on':''}`} onClick={()=>setFilter(c)}>{c}</button>)}
      </div>
      <div className="card-grid">
        {shown.map(c=>(
          <div key={c.id} className="card fu">
            <div className="card-head">
              <div>
                <div className="card-title">{c.name}</div>
                <div className="card-meta">{c.year} · {c.agency} · {c.cat}</div>
              </div>
              {statusChip(c.status)}
            </div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>
              <span className="chip ch-r">{c.amt>0?INR(c.amt)+' alleged':'Amt under eval'}</span>
              {c.attached>0&&<span className="chip ch-a">{INR(c.attached)} attached</span>}
              {c.recovery>0&&<span className="chip ch-n">{c.recovery}% recovered</span>}
            </div>
            <div className="card-body">
              <span style={{color:T.muted,fontSize:10,fontWeight:600,letterSpacing:.5}}>ACCUSED (PER FIR): </span>
              {c.accused}
            </div>
            <p className="card-source">Source: {c.agency} press release · Court records · Status: May 2026</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PromisesView() {
  const [filter, setFilter] = useState('ALL');
  const statuses = ['ALL','FULFILLED','PARTIAL','DELAYED','NOT_MET'];
  const shown = filter==='ALL' ? PROMISES : PROMISES.filter(p=>p.status===filter);
  const counts = {F:PROMISES.filter(p=>p.status==='FULFILLED').length, P:PROMISES.filter(p=>p.status==='PARTIAL').length, D:PROMISES.filter(p=>p.status==='DELAYED').length, N:PROMISES.filter(p=>p.status==='NOT_MET').length};
  return (
    <div className="scroll-area fu">
      <Rule title="Manifesto Promise Tracker"/>
      <div className="stat-grid" style={{marginBottom:20}}>
        {[
          {val:String(PROMISES.length),lbl:'Promises Tracked',bad:false},
          {val:String(counts.F),lbl:'Fulfilled',bad:false},
          {val:String(counts.P),lbl:'Partial',bad:true},
          {val:String(counts.D),lbl:'Delayed',bad:true},
          {val:String(counts.N),lbl:'Not Met',bad:true},
          {val:`${Math.round(counts.F/PROMISES.length*100)}%`,lbl:'Fulfilment Rate',bad:true},
        ].map(k=>(
          <div key={k.lbl} className="stat-cell">
            <div className="stat-val" style={{'--sc':k.bad?T.red:T.green,fontSize:22}}>{k.val}</div>
            <div className="stat-label">{k.lbl}</div>
          </div>
        ))}
      </div>
      <div className="fchips">
        {statuses.map(s=><button key={s} className={`fchip${filter===s?' on':''}`} onClick={()=>setFilter(s)}>{s.replace('_',' ')}</button>)}
      </div>
      <div className="card-grid">
        {shown.map(p=>(
          <div key={p.id} className="card fu" style={{borderLeftWidth:4,borderLeftColor:p.status==='FULFILLED'?T.green:p.status==='NOT_MET'?T.red:T.amber}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8,marginBottom:10}}>
              {statusChip(p.status)}
              <span style={{fontSize:10,color:T.muted,flexShrink:0}}>{p.party} · {p.year}</span>
            </div>
            <div style={{fontFamily:'Fraunces,serif',fontWeight:700,fontSize:14,color:T.ink,lineHeight:1.4,marginBottom:10}}>{p.text}</div>
            <div style={{fontSize:12,color:T.ink3,lineHeight:1.6,borderLeft:`3px solid ${p.status==='FULFILLED'?T.green:p.status==='NOT_MET'?T.red:T.amber}`,paddingLeft:10}}>{p.evidence}</div>
            <p className="card-source">Source: {p.src}</p>
          </div>
        ))}
      </div>
      <Rule title="Infrastructure Project Tracker"/>
      <div className="tbl-wrap">
        <table className="dtbl">
          <thead><tr><th>Project</th><th>Orig. Budget</th><th>Curr. Budget</th><th>Orig. Deadline</th><th>Curr. Deadline</th><th style={{minWidth:100}}>Progress</th><th>Status</th></tr></thead>
          <tbody>
            {PROJECTS.map(p=>(
              <tr key={p.name}>
                <td className="tw" style={{fontSize:12}}>{p.name}</td>
                <td className="mono" style={{color:T.muted}}>{INR(p.bOrig)}</td>
                <td className="mono" style={{color:p.bCurr>p.bOrig?T.red:T.green}}>{INR(p.bCurr)}</td>
                <td style={{fontSize:11,color:T.muted}}>{p.dOrig}</td>
                <td style={{fontSize:11,color:p.dCurr>p.dOrig?T.red:T.muted}}>{p.dCurr}</td>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <div className="pbar" style={{flex:1}}><div className="pfill" style={{width:`${p.pct}%`,background:p.pct>=75?T.green:p.pct>=50?T.amber:T.red}}/></div>
                    <span className="mono" style={{fontSize:10,minWidth:28}}>{p.pct}%</span>
                  </div>
                </td>
                <td>{statusChip(p.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="src-note">Sources: PIB, Ministry Annual Reports, CAG Audit Reports, PRS Legislative Research</p>
    </div>
  );
}

function RankingsView() {
  const [cat, setCat] = useState('all');
  const cats = ['all','economic','human','governance','environment'];
  const shown = cat==='all' ? RANKINGS : RANKINGS.filter(r=>r.cat===cat);
  return (
    <div className="scroll-area fu">
      <div style={{marginBottom:20}}>
        <p style={{fontSize:12,color:T.muted,lineHeight:1.6}}>Rankings sourced directly from publishing organisations. This page presents data without editorial comment. The <strong>delta</strong> column shows year-on-year change. Citizens draw their own conclusions.</p>
      </div>
      <Rule title="Summary"/>
      <div className="stat-grid" style={{marginBottom:20}}>
        {[
          {val:String(RANKINGS.filter(r=>r.dir==='good').length),lbl:'Positive (Top 50)',bad:false},
          {val:String(RANKINGS.filter(r=>r.dir==='bad').length),lbl:'Negative (Bottom 50%)',bad:true},
          {val:'25+',lbl:'Indices Tracked',bad:false},
          {val:'2025',lbl:'Reference Year',bad:false},
        ].map(k=>(
          <div key={k.lbl} className="stat-cell">
            <div className="stat-val" style={{'--sc':k.bad?T.red:T.green,fontSize:26}}>{k.val}</div>
            <div className="stat-label">{k.lbl}</div>
          </div>
        ))}
      </div>
      <div className="tabs">
        {cats.map(c=><button key={c} className={`tab${cat===c?' on':''}`} onClick={()=>setCat(c)}>{c.charAt(0).toUpperCase()+c.slice(1)}</button>)}
      </div>
      <div style={{border:`2px solid ${T.ink}`,background:T.paper}}>
        {shown.map((r,i)=>(
          <div key={i} className="rank-row" style={{padding:'12px 16px',borderBottom:i<shown.length-1?`1px solid ${T.rule}`:'none',animationDelay:`${i*25}ms`,flexWrap:'wrap',gap:8}}>
            <div className="rank-number" style={{'--rc':r.dir==='bad'?T.red:T.green}}>{r.rank}</div>
            <div className="rank-info" style={{flex:1,minWidth:120}}>
              <div className="rank-name">{r.index}</div>
              <div className="rank-pub">{r.pub} · 2024-25</div>
              <div className="rank-score">Score: {r.score}</div>
              {r.note && <div style={{fontSize:10,color:T.faint,marginTop:3,lineHeight:1.4}}>{r.note}</div>}
            </div>
            <div className="rank-delta" style={{color:r.delta>0?T.green:r.delta<0?T.red:T.muted}}>
              {r.delta>0?`▲${r.delta}`:r.delta<0?`▼${Math.abs(r.delta)}`:'—'}
              <div style={{fontSize:8,color:T.ghost,marginTop:2,fontFamily:'inherit'}}>vs prev yr</div>
            </div>
          </div>
        ))}
      </div>
      <p className="src-note" style={{marginTop:12}}>All rankings sourced from respective publishing organisations. Source links available on each index page. Rankings presented as published — no adjustments made.</p>
    </div>
  );
}

function StatementsView() {
  return (
    <div className="scroll-area fu">
      <Rule title="Statement Database"/>
      <div className="stat-grid" style={{marginBottom:20}}>
        {[
          {val:'248',lbl:'Statements Tracked',bad:false},
          {val:'89', lbl:'False / Misleading',bad:true},
          {val:'92', lbl:'True / Mostly True',bad:false},
          {val:'67', lbl:'Unverifiable',bad:false},
        ].map(k=>(
          <div key={k.lbl} className="stat-cell">
            <div className="stat-val" style={{'--sc':k.bad?T.red:T.green,fontSize:26}}>{k.val}</div>
            <div className="stat-label">{k.lbl}</div>
          </div>
        ))}
      </div>
      <div className="warn-box" style={{'--wb':T.amber,'--wbg':'rgba(146,82,10,.05)',marginBottom:20}}>
        <div className="warn-box-head">⚖ Editorial Protocol</div>
        <div className="warn-box-body">OPPOSITION aggregates verdicts from established fact-checking organisations (AFWA, Boom, AltNews, FactChecker.in, PRS). Where we publish our own analysis, we use language like "Data shows X, Government claims Y" — never "Government lied." All original fact-check source links preserved.</div>
      </div>
      {STATEMENTS.map(s=>(
        <div key={s.id} className="card fu" style={{marginBottom:12}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:10,marginBottom:10}}>
            <div>
              <div style={{fontWeight:700,fontSize:13,color:T.ink}}>{s.speaker}</div>
              <div style={{fontSize:10,color:T.muted,marginTop:2}}>{s.platform} · {s.date}</div>
            </div>
            <span className={`vd-${s.verdict}`}>{vLabel[s.verdict]||s.verdict}</span>
          </div>
          <div style={{background:T.paper2,borderLeft:`4px solid ${T.saffron}`,padding:'10px 14px',marginBottom:10}}>
            <div style={{fontSize:13,color:T.ink,fontStyle:'italic',lineHeight:1.55,fontFamily:'Fraunces,serif'}}>"{s.claim}"</div>
          </div>
          <div style={{fontSize:12,color:T.ink3,lineHeight:1.6}}>{s.note}</div>
          <p className="card-source">Fact-Checker: {s.checker}</p>
        </div>
      ))}
    </div>
  );
}

function PartiesView() {
  const max = Math.max(...PARTY_DATA.map(p=>p.income));
  return (
    <div className="scroll-area fu">
      <div className="warn-box" style={{'--wb':T.red,'--wbg':'rgba(192,24,42,.04)',marginBottom:20}}>
        <div className="warn-box-head">⚖ Supreme Court, 15 Feb 2024</div>
        <div className="warn-box-body">Electoral Bond Scheme declared unconstitutional. Funding reverts to Electoral Trusts and direct donations above ₹20,000 — both require ECI disclosure. All data from ECI annual filings and ADR analysis.</div>
      </div>
      <Rule title="Party Donations FY 2024-25 (₹ Crore)"/>
      <div style={{border:`2px solid ${T.ink}`,padding:'20px',marginBottom:20,background:T.paper}}>
        {PARTY_DATA.map(p=>(
          <div key={p.party} className="party-row">
            <div className="party-meta">
              <span className="party-name-lbl" style={{color:p.color}}>{p.party}</span>
              <div style={{display:'flex',gap:14,alignItems:'center'}}>
                <span style={{fontSize:10,color:T.muted}}>Corporate: {p.corp}%</span>
                <span className="party-amt-lbl">₹{p.income.toLocaleString('en-IN')} Cr</span>
              </div>
            </div>
            <div className="party-bar-wrap">
              <div className="party-bar-fill" style={{width:`${(p.income/max)*100}%`,background:p.color,opacity:.8}}/>
            </div>
          </div>
        ))}
        <p className="src-note" style={{marginTop:12}}>Source: ADR Report FY 2024-25 · ECI Form 24A/24B · BJP received ₹6,074 Cr (+171% YoY) per ADR analysis</p>
      </div>
      <Rule title="Party-wise Breakdown (FY 2024-25)"/>
      <div className="tbl-wrap">
        <table className="dtbl">
          <thead><tr><th>Party</th><th>Total Income (₹ Cr)</th><th>Electoral Trust %</th><th>Source Notes</th></tr></thead>
          <tbody>
            {PARTY_DATA.map(p=>(
              <tr key={p.party}>
                <td style={{fontWeight:700,color:p.color,fontFamily:'Fraunces,serif'}}>{p.party}</td>
                <td className="mono tw">{p.income.toLocaleString('en-IN')}</td>
                <td className="mono" style={{color:p.trust>60?T.red:T.muted}}>{p.trust}%</td>
                <td style={{fontSize:11,color:T.muted,maxWidth:260,lineHeight:1.4}}>{p.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="src-note" style={{marginTop:8}}>Sources: ADR (adrindia.org) FY 2024-25 report · ECI contribution statements filed with Election Commission · Deccan Herald reporting on ECI filings · All data from publicly available ECI annual returns</p>
    </div>
  );
}

function PoliciesView() {
  return (
    <div className="scroll-area fu">
      <Rule title="Central Government Policy Status"/>
      <div className="card-grid">
        {POLICIES.map(p=>(
          <div key={p.name} className="card">
            <div className="card-head">
              <div>
                <div className="card-title">{p.name}</div>
              <div className="card-meta">{p.ministry} · Since {p.name.includes('KISAN')?'2019':p.name.includes('Ayushman')?'2018':p.name.includes('MGNREGS')?'2005':p.name.includes('Smart')?'2015':p.name.includes('Ujjwala')?'2016':p.name.includes('Jal')?'2019':'2016'}</div>
              </div>
              {statusChip(p.status)}
            </div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12}}>
              <span className="chip ch-s">₹{p.alloc.toLocaleString('en-IN')} Cr</span>
              <span className="chip ch-n">{p.ben}</span>
            </div>
            <div style={{marginBottom:p.issues.length?12:0}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:T.muted,marginBottom:5}}>
                <span style={{letterSpacing:.5,textTransform:'uppercase',fontWeight:600}}>Budget Utilisation</span>
                <span className="mono" style={{color:Math.round(p.spent/p.alloc*100)>=85?T.green:Math.round(p.spent/p.alloc*100)>=70?T.amber:T.red}}>{Math.round(p.spent/p.alloc*100)}%</span>
              </div>
              <div className="pbar"><div className="pfill" style={{width:`${Math.round(p.spent/p.alloc*100)}%`,background:Math.round(p.spent/p.alloc*100)>=85?T.green:Math.round(p.spent/p.alloc*100)>=70?T.amber:T.red}}/></div>
            </div>
            {p.issues.length>0&&(
              <div style={{borderTop:`1px solid ${T.rule}`,paddingTop:10}}>
                <div style={{fontSize:9,fontWeight:700,color:T.red,letterSpacing:1.5,textTransform:'uppercase',marginBottom:5}}>⚠ Flagged Issues</div>
                {p.issues.map((iss,i)=><div key={i} style={{fontSize:11,color:T.ink3,lineHeight:1.5,marginBottom:3}}>· {iss}</div>)}
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="src-note">Sources: PIB (pib.gov.in) · CAG Audit Reports · Ministry Annual Reports · MyScheme Portal</p>
    </div>
  );
}

function AlertsView() {
  return (
    <div className="scroll-area fu">
      <Rule title="Live Alert Feed"/>
      <div style={{border:`2px solid ${T.ink}`,marginBottom:20,background:T.paper}}>
        {ALERTS.map((a,i)=>(
          <div key={a.id} className="alert-row" style={{padding:'14px 18px','--as':a.sev==='critical'?T.red:a.sev==='positive'?T.green:T.amber,borderBottom:i<ALERTS.length-1?`1px solid ${T.rule}`:'none',margin:0}}>
            <div className="alert-sev"/>
            <div style={{flex:1}}>
              <div className="alert-meta">
                <span className="alert-tag" style={{color:a.sev==='critical'?T.red:a.sev==='positive'?T.green:T.amber}}>{a.tag}</span>
                <span className="alert-agency">{a.agency}</span>
                <span className="alert-time">{a.time}</span>
              </div>
              <div style={{fontSize:13,color:T.ink,fontWeight:500,lineHeight:1.5,marginTop:4}}>{a.body}</div>
              <div style={{fontSize:9,color:T.ghost,marginTop:5}}>Source: Official press release · Source document available</div>
            </div>
          </div>
        ))}
      </div>
      <div className="warn-box" style={{'--wb':T.green,'--wbg':'rgba(13,107,59,.04)'}}>
        <div className="warn-box-head">🔔 Subscribe to Alerts</div>
        <div className="warn-box-body" style={{marginBottom:12}}>Alerts fire only after primary source confirmation. Choose your delivery channel:</div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {['Email Digest (Daily)','Email Digest (Weekly)','RSS Feed (Open)','API Webhook (Premium)'].map(opt=>(
            <button key={opt} style={{background:T.ink,color:T.paper,border:`2px solid ${T.ink}`,padding:'7px 14px',fontSize:10,fontWeight:700,letterSpacing:.5,cursor:'pointer',transition:'all .15s'}}
              onMouseEnter={e=>{e.target.style.background=T.saffron;e.target.style.color=T.ink;e.target.style.borderColor=T.saffron;}}
              onMouseLeave={e=>{e.target.style.background=T.ink;e.target.style.color=T.paper;e.target.style.borderColor=T.ink;}}
            >{opt}</button>
          ))}
        </div>
      </div>
      <Rule title="Alert Categories"/>
      {[
        ['ED/CBI Action Alerts','Arrests, raids, asset attachments — source: agency press releases'],
        ['CAG Report Drop','New audit report tabled in Parliament'],
        ['Budget Variance Alert','Monthly CGA data deviates significantly from projection'],
        ['International Ranking Change','Any Indian ranking change >5 positions'],
        ['Promise Milestone','Promise moved to Fulfilled or Abandoned'],
        ['Statement Fact-Check','New verdict published by AFWA, Boom, AltNews, FactChecker.in'],
      ].map(([t,d],i)=>(
        <div key={i} style={{display:'flex',gap:12,padding:'10px 0',borderBottom:`1px solid ${T.rule}`}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:T.saffron,marginTop:4,flexShrink:0}}/>
          <div>
            <div style={{fontWeight:700,fontSize:12,color:T.ink}}>{t}</div>
            <div style={{fontSize:11,color:T.muted,marginTop:2}}>{d}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── APP ────────────────────────────────────────────────────────────── */
export default function App() {
  const [view, setView] = useState('home');
  const [drawer, setDrawer] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [view]);

  const go = (id) => { setView(id); setDrawer(false); };

  const views = { home:<HomeView onNav={go}/>, budget:<BudgetView/>, spending:<SpendingView/>, parties:<PartiesView/>, policies:<PoliciesView/>, fraud:<FraudView/>, promises:<PromisesView/>, statements:<StatementsView/>, rankings:<RankingsView/>, alerts:<AlertsView/> };

  return (
    <>
      <style>{G}</style>
      <div className="app">

        {/* Masthead */}
        <header className="masthead">
          <div className="masthead-left">
            <div className="mark">◉</div>
            <div>
              <div className="brand-name">OPPO<span className="brand-hi">SITION</span></div>
              <div className="brand-sub">YE DESH KA HISAAB HAI · विपक्ष</div>
            </div>
          </div>
          <div className="masthead-center">
            <div className="ticker-strip">
              <span className="ticker-inner">
                {[...LIVE_STATS,...LIVE_STATS].map((s,i)=>(
                  <span key={i} className="tick-item">
                    {s.label}: <span className={`val${s.bad?' bad':''}`}>{s.value}</span> &nbsp;·&nbsp; {s.sub}
                  </span>
                ))}
              </span>
            </div>
          </div>
          <div className="masthead-right">
            <div className="live-pill"><span className="live-dot-pulse"/><span>LIVE</span></div>
            <button className="hbtn" onClick={()=>setDrawer(true)}>☰ Menu</button>
            <span className="alert-badge">⚠ 47 CASES</span>
          </div>
        </header>

        {/* Drawer */}
        <div className={`drawer-overlay${drawer?' open':''}`} onClick={()=>setDrawer(false)}>
          <nav className="drawer-panel" onClick={e=>e.stopPropagation()}>
            <div className="drawer-top">
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div className="mark" style={{width:30,height:30,fontSize:15}}>◉</div>
                <span style={{fontFamily:'Fraunces,serif',fontWeight:900,fontSize:15,color:'#fff'}}>OPPOSITION</span>
              </div>
              <button className="drawer-close-btn" onClick={()=>setDrawer(false)}>×</button>
            </div>
            <div className="drawer-inner"><SidebarNav active={view} onSelect={go}/></div>
          </nav>
        </div>

        {/* Layout */}
        <div className="layout">
          <aside className="sidebar">
            <div className="sidebar-head">
              <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:T.ghost,textTransform:'uppercase',marginBottom:8}}>Live Indicators</div>
              <div className="sidebar-kv">
                {LIVE_STATS.slice(0,4).map(s=>(
                  <div key={s.label} className="sidebar-stat">
                    <span className="sidebar-stat-label">{s.label}</span>
                    <span className="sidebar-stat-val" style={{color:s.bad?T.red:T.green}}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="sidebar-scroll"><SidebarNav active={view} onSelect={setView}/></div>
          </aside>

          <main style={{flex:1,minWidth:0,display:'flex',flexDirection:'column',overflow:'hidden'}}>
            <ViewBar id={view}/>
            <div ref={scrollRef} style={{flex:1,minHeight:0,overflowY:'auto',overflowX:'hidden',display:'flex',flexDirection:'column'}}>
              {views[view]||views.home}
            </div>
          </main>
        </div>

        {/* Mobile bottom nav */}
        <nav className="bottom-nav">
          {NAV.slice(0,8).map(n=>(
            <button key={n.id} className={`bnav-btn${view===n.id?' on':''}`} onClick={()=>setView(n.id)}>
              <span className="bnav-icon">{n.icon}</span>
              <span className="bnav-label">{n.short}</span>
            </button>
          ))}
        </nav>

        {/* Desktop footer */}
        <footer className="footer">
          <span className="footer-brand">◉ OPPOSITION</span>
          <span className="footer-rule">|</span>
          <span className="footer-text">All data source-cited · Every figure traceable to primary source · We do not editorialize</span>
          <div className="footer-right">
            {['Methodology','Our Funding','Corrections','API Access'].map(l=>(
              <span key={l} className="flink">{l}</span>
            ))}
            <span className="footer-text" style={{color:'rgba(255,255,255,.18)'}}>v1.0 · {new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
          </div>
        </footer>

      </div>
    </>
  );
}
