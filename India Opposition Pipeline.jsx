import { useState } from "react";

/* ── TOKENS ─────────────────────────────────────────────────── */
const T = {
  bg:     "#050810",
  bg2:    "#0a0f1e",
  bg3:    "#0f1628",
  card:   "#111827",
  border: "#1e2d4a",
  b2:     "#253558",
  white:  "#e8edf8",
  dim:    "#94a3b8",
  muted:  "#64748b",
  faint:  "#334155",
  green:  "#22c55e",
  greenD: "#15803d",
  red:    "#ef4444",
  amber:  "#f59e0b",
  blue:   "#3b82f6",
  cyan:   "#06b6d4",
  violet: "#8b5cf6",
  orange: "#f97316",
  saffron:"#FF9933",
  mono:   "'JetBrains Mono', 'Fira Code', monospace",
  sans:   "'IBM Plex Sans', system-ui, sans-serif",
  serif:  "'Playfair Display', Georgia, serif",
};

/* ── CSS ─────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{height:100%;background:${T.bg};overflow:hidden;}
body{font-family:${T.sans};color:${T.white};-webkit-font-smoothing:antialiased;}
::-webkit-scrollbar{width:3px;height:3px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:${T.border};border-radius:2px;}

.root{display:flex;flex-direction:column;height:100vh;overflow:hidden;}

/* Header */
.hdr{
  flex-shrink:0;background:${T.bg2};
  border-bottom:2px solid ${T.saffron};
  display:flex;align-items:center;gap:14px;
  padding:0 20px;height:56px;z-index:50;
}
.hdr-logo{
  width:36px;height:36px;border-radius:7px;
  background:${T.saffron};color:${T.bg};
  font-family:${T.serif};font-size:17px;font-weight:900;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
}
.hdr-title{font-family:${T.serif};font-size:16px;font-weight:700;color:${T.saffron};letter-spacing:1px;}
.hdr-sub{font-size:10px;color:${T.muted};letter-spacing:1.5px;display:none;}
.hdr-badge{
  margin-left:auto;background:rgba(34,197,94,.15);
  border:1px solid rgba(34,197,94,.3);color:${T.green};
  font-size:9px;font-weight:700;letter-spacing:1.5px;padding:3px 10px;border-radius:3px;
  display:flex;align-items:center;gap:5px;flex-shrink:0;
}
.hdr-badge::before{content:'';width:6px;height:6px;border-radius:50%;background:${T.green};animation:pulse 1.5s ease-in-out infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.3;}}

/* Layout */
.body{display:flex;flex:1;min-height:0;overflow:hidden;}

/* Sidebar */
.sidebar{
  width:220px;flex-shrink:0;background:${T.bg2};
  border-right:1px solid ${T.border};
  display:none;flex-direction:column;overflow:hidden;
}
.sb-inner{flex:1;overflow-y:auto;padding:10px 0 60px;}
.sb-section{font-size:8px;font-weight:700;letter-spacing:3px;color:${T.muted};
  padding:12px 16px 5px;text-transform:uppercase;}
.sb-btn{
  width:100%;background:transparent;border:none;border-left:3px solid transparent;
  padding:9px 16px;display:flex;align-items:center;gap:10px;
  cursor:pointer;text-align:left;transition:all .12s;
}
.sb-btn:hover{background:rgba(255,255,255,.03);}
.sb-btn.on{background:rgba(255,153,51,.08);border-left-color:var(--c);}
.sb-icon{
  width:22px;height:22px;border-radius:4px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  font-size:11px;background:var(--c-faint);color:var(--c);
}
.sb-btn.on .sb-icon{background:var(--c);color:${T.bg};}
.sb-label{font-size:11.5px;color:${T.dim};font-weight:400;}
.sb-btn.on .sb-label{color:${T.white};font-weight:600;}

/* Drawer */
.drawer-mask{display:none;position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:200;backdrop-filter:blur(3px);}
.drawer-mask.open{display:block;}
.drawer-panel{
  position:absolute;left:0;top:0;bottom:0;width:260px;
  background:${T.bg2};border-right:1px solid ${T.border};
  display:flex;flex-direction:column;
  transform:translateX(-100%);transition:transform .25s cubic-bezier(.4,0,.2,1);
}
.drawer-mask.open .drawer-panel{transform:translateX(0);}
.drawer-top{
  display:flex;align-items:center;justify-content:space-between;
  padding:14px 16px;border-bottom:1px solid ${T.border};flex-shrink:0;
}
.drawer-x{
  background:rgba(255,255,255,.08);border:none;color:${T.dim};
  border-radius:50%;width:28px;height:28px;cursor:pointer;font-size:16px;
  display:flex;align-items:center;justify-content:center;
}
.drawer-inner{flex:1;overflow-y:auto;padding:8px 0;}

/* Main */
.main{flex:1;min-width:0;display:flex;flex-direction:column;overflow:hidden;}
.main-bar{
  flex-shrink:0;background:${T.bg3};
  border-bottom:1px solid ${T.border};
  padding:12px 20px;display:flex;align-items:center;gap:12px;
}
.main-bar-icon{
  width:32px;height:32px;border-radius:5px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  font-size:14px;background:var(--bc);color:${T.bg};
}
.main-bar-title{font-family:${T.serif};font-size:16px;font-weight:700;color:${T.white};line-height:1;}
.main-bar-sub{font-size:10px;color:${T.muted};margin-top:2px;}
.content{flex:1;overflow-y:auto;padding:18px;}

/* Bottom nav */
.bnav{
  display:flex;background:${T.bg2};border-top:1px solid ${T.border};
  flex-shrink:0;height:56px;overflow-x:auto;scrollbar-width:none;
}
.bnav::-webkit-scrollbar{display:none;}
.bnav-btn{
  flex:1;min-width:48px;max-width:68px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:3px;background:transparent;border:none;border-top:2px solid transparent;
  cursor:pointer;padding:4px;transition:all .12s;margin-top:-1px;
}
.bnav-btn.on{border-top-color:var(--c);}
.bnav-icon{font-size:13px;color:${T.muted};}
.bnav-btn.on .bnav-icon{color:var(--c);}
.bnav-label{font-size:7px;color:${T.muted};letter-spacing:.3px;text-align:center;}
.bnav-btn.on .bnav-label{color:var(--c);}

/* Footer */
.footer{display:none;flex-shrink:0;background:${T.bg2};border-top:1px solid ${T.border};padding:8px 20px;align-items:center;gap:12px;}
.footer-text{font-size:10px;color:${T.muted};}

/* Code blocks */
pre.code-block{
  background:#0d1117;border:1px solid #30363d;border-radius:8px;
  padding:16px;overflow-x:auto;font-family:${T.mono};
  font-size:11.5px;line-height:1.7;color:#e6edf3;margin:12px 0;
}
.kw{color:#ff7b72;} .fn{color:#d2a8ff;} .str{color:#a5d6ff;}
.cm{color:#8b949e;font-style:italic;} .num{color:#79c0ff;}
.dec{color:#ffa657;} .var{color:#e6edf3;} .op{color:#ff7b72;}

/* Cards & components */
.card{
  background:${T.card};border:1px solid ${T.border};border-radius:10px;
  padding:16px;margin-bottom:12px;transition:border-color .15s;
}
.card:hover{border-color:${T.b2};}
.card-title{font-weight:700;font-size:13.5px;color:${T.white};margin-bottom:6px;}
.card-body{font-size:12.5px;color:${T.dim};line-height:1.65;}

/* Section headings */
.sec-head{
  display:flex;align-items:center;gap:10px;margin-bottom:14px;margin-top:8px;
}
.sec-line{flex:1;height:1px;background:${T.border};}
.sec-title{font-size:9px;font-weight:700;letter-spacing:3px;color:${T.muted};white-space:nowrap;text-transform:uppercase;}

/* Chips */
.chip{display:inline-flex;align-items:center;font-size:9px;font-weight:700;
  padding:2px 8px;border-radius:3px;letter-spacing:.5px;text-transform:uppercase;}
.chip-g{background:rgba(34,197,94,.15);color:${T.green};}
.chip-r{background:rgba(239,68,68,.15);color:${T.red};}
.chip-a{background:rgba(245,158,11,.15);color:${T.amber};}
.chip-b{background:rgba(59,130,246,.15);color:${T.blue};}
.chip-v{background:rgba(139,92,246,.15);color:${T.violet};}
.chip-c{background:rgba(6,182,212,.15);color:${T.cyan};}
.chip-o{background:rgba(249,115,22,.15);color:${T.orange};}
.chip-s{background:rgba(255,153,51,.15);color:${T.saffron};}

/* Tables */
.tbl-wrap{overflow-x:auto;border-radius:8px;border:1px solid ${T.border};margin-bottom:14px;}
.tbl{width:100%;border-collapse:collapse;font-size:12px;min-width:360px;}
.tbl th{background:${T.bg3};color:${T.muted};padding:8px 12px;
  text-align:left;font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;
  border-bottom:1px solid ${T.border};white-space:nowrap;}
.tbl td{padding:8px 12px;border-bottom:1px solid ${T.border};color:${T.dim};vertical-align:top;}
.tbl tr:last-child td{border-bottom:none;}
.tbl tr:hover td{background:rgba(255,255,255,.02);}
.tw{color:${T.white};font-weight:500;}
.mono{font-family:${T.mono};font-size:11px;}

/* Flow diagram */
.flow{display:flex;flex-direction:column;gap:0;}
.flow-step{
  display:flex;gap:0;align-items:stretch;
}
.flow-left{
  display:flex;flex-direction:column;align-items:center;width:40px;flex-shrink:0;
}
.flow-dot{
  width:28px;height:28px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:700;color:${T.bg};flex-shrink:0;
}
.flow-line{width:2px;flex:1;background:${T.border};min-height:12px;}
.flow-content{flex:1;padding:0 0 20px 14px;}
.flow-title{font-weight:700;font-size:13px;color:${T.white};margin-bottom:4px;}
.flow-desc{font-size:12px;color:${T.dim};line-height:1.6;}
.flow-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px;}

/* Info boxes */
.info-box{
  border-left:3px solid var(--ib);background:rgba(255,255,255,.02);
  border-radius:0 6px 6px 0;padding:12px 14px;margin-bottom:12px;
}
.info-box-head{font-size:9px;font-weight:700;letter-spacing:2px;color:var(--ib);text-transform:uppercase;margin-bottom:6px;}
.info-box-body{font-size:12.5px;color:${T.dim};line-height:1.65;}

/* Pipeline diagram boxes */
.pipe-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;}
.pipe-box{
  flex:1;min-width:120px;max-width:200px;
  background:${T.bg3};border:1px solid var(--pb);
  border-radius:8px;padding:10px 12px;
}
.pipe-box-label{font-size:9px;font-weight:700;letter-spacing:1.5px;color:var(--pb);text-transform:uppercase;margin-bottom:4px;}
.pipe-box-title{font-size:12px;font-weight:600;color:${T.white};line-height:1.3;}
.pipe-box-sub{font-size:10px;color:${T.muted};margin-top:3px;}
.pipe-arrow{display:flex;align-items:center;justify-content:center;color:${T.muted};font-size:18px;padding:4px 0;}

/* Hamburguer */
.hbtn{
  background:rgba(255,153,51,.1);border:1px solid rgba(255,153,51,.25);
  color:${T.saffron};border-radius:6px;padding:6px 11px;font-size:12px;
  display:flex;align-items:center;gap:6px;cursor:pointer;
}

/* Responsive */
@media(min-width:768px){
  .hdr{padding:0 28px;height:62px;}
  .hdr-sub{display:block;}
  .hbtn{display:none!important;}
  .sidebar{display:flex;}
  .content{padding:22px 30px;}
  .main-bar{padding:14px 28px;}
  .main-bar-title{font-size:18px;}
  .bnav{display:none;}
  .footer{display:flex;}
}
@media(min-width:1024px){.content{padding:26px 36px;}.sidebar{width:240px;}}
@media(max-width:767px){.drawer-mask{display:none;}.drawer-mask.open{display:block;}}

/* Animations */
@keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
.fu{animation:fadeUp .22s ease both;}
.fu1{animation-delay:30ms;}.fu2{animation-delay:60ms;}.fu3{animation-delay:90ms;}
.fu4{animation-delay:120ms;}.fu5{animation-delay:150ms;}
`;

/* ── NAV ─────────────────────────────────────────────────────── */
const NAV = [
  { id:"overview",   icon:"⬡", label:"Architecture Overview",  short:"Overview",  color:T.saffron },
  { id:"sources",    icon:"⇣", label:"Data Source Registry",   short:"Sources",   color:T.cyan    },
  { id:"scrapers",   icon:"⟳", label:"Scraper Engineering",    short:"Scrapers",  color:T.green   },
  { id:"pipeline",   icon:"⟹", label:"Orchestration Pipeline", short:"Pipeline",  color:T.violet  },
  { id:"extraction", icon:"⊞", label:"PDF & File Extraction",  short:"Extract",   color:T.amber   },
  { id:"validation", icon:"✓", label:"Validation & QA Layer",  short:"Validate",  color:T.blue    },
  { id:"database",   icon:"⊡", label:"Database Schema & Load", short:"Database",  color:T.orange  },
  { id:"editorial",  icon:"⊙", label:"Editorial Workflow",     short:"Editorial", color:T.red     },
  { id:"alerting",   icon:"⚡", label:"Alert & Delivery",       short:"Alerts",    color:T.green   },
  { id:"monitoring", icon:"◈", label:"Monitoring & Recovery",  short:"Monitor",   color:T.cyan    },
];

/* ── HELPERS ─────────────────────────────────────────────────── */
function SH({ title }) {
  return (
    <div className="sec-head">
      <span className="sec-title">{title}</span>
      <span className="sec-line" />
    </div>
  );
}
function Chip({ t, c="chip-b" }) { return <span className={`chip ${c}`}>{t}</span>; }
function InfoBox({ color, head, children }) {
  return (
    <div className="info-box" style={{ "--ib": color }}>
      {head && <div className="info-box-head">{head}</div>}
      <div className="info-box-body">{children}</div>
    </div>
  );
}
function Code({ children }) {
  return <pre className="code-block" dangerouslySetInnerHTML={{ __html: children }} />;
}

/* ── VIEWS ───────────────────────────────────────────────────── */

function Overview() {
  const layers = [
    { n:"1", color:T.cyan,   bg:"rgba(6,182,212,.15)",   title:"Data Source Layer", desc:"30+ official government portals, international bodies, civil society APIs, and RSS feeds. Every source is classified by tier, update frequency, and legal access rights.", tags:["data.gov.in REST API","PIB RSS Feed","CBI/ED Press Releases","World Bank API","IMF JSON API","ECI Filings","CAG PDFs"] },
    { n:"2", color:T.green,  bg:"rgba(34,197,94,.15)",   title:"Ingestion & Scraping Layer", desc:"Three ingestion paths: (A) Direct API calls for structured sources, (B) Scrapy/Playwright scrapers for HTML sources, (C) PDF extraction pipeline for document sources. All ingestion is scheduled via Prefect.", tags:["Scrapy","Playwright","httpx async","Camelot/Tabula","PyMuPDF","BeautifulSoup4","feedparser"] },
    { n:"3", color:T.amber,  bg:"rgba(245,158,11,.15)",  title:"Raw Storage & Deduplication", desc:"Every ingested document lands in raw object storage (Cloudflare R2) before any processing. A fingerprint hash prevents duplicate ingestion. Raw layer is append-only — originals are never mutated.", tags:["Cloudflare R2","SHA-256 fingerprint","PostgreSQL raw_ingest log","Idempotent writes"] },
    { n:"4", color:T.violet, bg:"rgba(139,92,246,.15)",  title:"Transform & Parse Layer", desc:"Module-specific parsers convert raw HTML/PDF/JSON into typed, validated Python dataclasses. Each parser outputs a canonical intermediate JSON format before DB write. Validation is strict — missing required fields raise exceptions.", tags:["Pydantic v2 models","Module parsers (9×)","Intermediate JSON schema","Type coercion","Currency normalisation"] },
    { n:"5", color:T.blue,   bg:"rgba(59,130,246,.15)",  title:"Validation & Human Review Gate", desc:"Automated validators check data ranges, source freshness, and anomaly scores. High-sensitivity content (fraud cases, statements, named individuals) goes to a human editor queue before DB write. Safe automated data bypasses human review.", tags:["Pydantic validators","Statistical anomaly detection","Editor queue (FastAPI)","Sensitivity classifier","Four-eyes principle"] },
    { n:"6", color:T.orange, bg:"rgba(249,115,22,.15)",  title:"PostgreSQL + Elasticsearch Load", desc:"Validated data is written atomically to PostgreSQL via SQLAlchemy with Alembic migrations. A Celery task simultaneously indexes the record in Elasticsearch for full-text search. TimescaleDB hypertables store time-series metrics with automatic partitioning.", tags:["SQLAlchemy ORM","Alembic migrations","TimescaleDB hypertables","Elasticsearch 8 indexing","Redis cache invalidation"] },
    { n:"7", color:T.red,    bg:"rgba(239,68,68,.15)",   title:"API & Alert Delivery", desc:"FastAPI serves all read endpoints with Redis caching (TTL-based). A Celery beat task evaluates freshly written data against alert rules and fires webhooks/emails/push notifications. Public API rate-limiting enforced via Redis.", tags:["FastAPI","Redis (cache + rate limit)","Celery beat","SMTP / Pushover","Webhook delivery","RSS generation"] },
  ];

  return (
    <div className="content fu">
      <InfoBox color={T.saffron} head="Design Philosophy">
        The OPPOSITION pipeline is built on three non-negotiable principles: <strong>source immutability</strong> (raw data is never deleted), <strong>full lineage</strong> (every DB record traces back to a URL + date), and <strong>human-in-the-loop for sensitive content</strong> (no fraud case or named individual auto-publishes). The architecture is designed to survive government portal blocking, rate-limiting, and takedown pressure.
      </InfoBox>

      <SH title="End-to-End Architecture — 7 Layers" />
      <div className="flow">
        {layers.map((l, i) => (
          <div key={i} className="flow-step">
            <div className="flow-left">
              <div className="flow-dot" style={{ background: l.color }}>{l.n}</div>
              {i < layers.length - 1 && <div className="flow-line" />}
            </div>
            <div className="flow-content">
              <div className="flow-title" style={{ color: l.color }}>{l.title}</div>
              <div className="flow-desc">{l.desc}</div>
              <div className="flow-tags">
                {l.tags.map(t => (
                  <span key={t} className="mono" style={{ fontSize: 10, background: l.bg, color: l.color, padding: "2px 7px", borderRadius: 3 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <SH title="Technology Stack Decision Matrix" />
      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th>Component</th><th>Chosen Tool</th><th>Why</th><th>Alternative Rejected</th></tr></thead>
          <tbody>
            {[
              ["Orchestrator","Prefect 3","Python-native, simpler than Airflow, excellent failure recovery, dynamic DAGs — perfect for variable-frequency scrapers","Apache Airflow (heavy ops overhead for a small team)"],
              ["Web Scraping","Scrapy + Playwright","Scrapy for static HTML (fast, middleware ecosystem); Playwright for JS-rendered portals (sansad.in, pfms.nic.in)","Selenium (slower), Puppeteer (Node.js ecosystem mismatch)"],
              ["PDF Extraction","Camelot + PyMuPDF","Camelot for table extraction (Budget PDFs); PyMuPDF for text/image extraction; Tabula as fallback","pdfminer (no table support), pdfplumber (slower for large files)"],
              ["Primary Database","PostgreSQL 16 + TimescaleDB","ACID compliance, complex queries, TimescaleDB for time-series metrics without separate infrastructure","MongoDB (schema-less bad for financial data), MySQL (weaker time-series support)"],
              ["Search Index","Elasticsearch 8","Full-text search across statements, fraud cases, policy names — critical for search UX","Meilisearch (less mature for complex queries), Algolia (cost at scale)"],
              ["Task Queue","Celery + Redis","Mature, battle-tested for background tasks (indexing, alerts, email). Redis doubles as cache and rate-limit store","RQ (less feature-rich), Dramatiq (smaller community)"],
              ["API Framework","FastAPI (Python)","Async-native, auto-generates OpenAPI docs, Pydantic integration for request validation matches our data models","Django REST Framework (synchronous), Flask (too minimal)"],
              ["Object Storage","Cloudflare R2","S3-compatible, zero egress fees, EU region available, pairs with Cloudflare CDN — no AWS dependency","AWS S3 (egress costs, Indian govt blocking risk), MinIO (self-hosted ops burden)"],
            ].map(([comp, tool, why, alt]) => (
              <tr key={comp}>
                <td className="tw">{comp}</td>
                <td><span className="mono" style={{ color: T.green }}>{tool}</span></td>
                <td style={{ fontSize: 11, maxWidth: 220 }}>{why}</td>
                <td style={{ fontSize: 11, color: T.muted }}>{alt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Sources() {
  const sources = [
    { tier:"T1", name:"PIB (Press Information Bureau)", url:"pib.gov.in", method:"RSS + HTTP scrape", freq:"Every 2 hours", format:"HTML / RSS XML", module:"Statements, Policies, Alerts", auth:"None", rate:"Polite: 1 req/5s", notes:"RSS at pib.gov.in/AllRelease.aspx — most reliable govt source. Parse ministry tag for routing." },
    { tier:"T1", name:"data.gov.in (OGD Platform)", url:"data.gov.in/api/", method:"REST API", freq:"Weekly or on-demand", format:"JSON", module:"Budget, Spending, Agriculture", auth:"API key (free registration)", rate:"Official: no limit stated; use 5 req/s", notes:"100,000+ datasets. Python package: `datagovindia`. Resource IDs needed per dataset." },
    { tier:"T1", name:"indiabudget.gov.in", url:"indiabudget.gov.in", method:"PDF download + parse", freq:"Annual (Budget Day Feb 1)", format:"PDF", module:"Budget Tracker", auth:"None", rate:"Single download; no crawl needed", notes:"Download: Budget Speech, Annual Financial Statement, Expenditure Budget Vol 1+2, Receipt Budget, Key Features doc." },
    { tier:"T1", name:"CGA (cga.nic.in)", url:"cga.nic.in/MonthlyAccounts.aspx", method:"HTTP scrape", freq:"Monthly (released ~last week of month)", format:"PDF / HTML table", module:"Spending Tracker", auth:"None", rate:"1 req/10s", notes:"Monthly expenditure statements. Parse the HTML table; fallback to PDF. Store both raw PDF and extracted JSON." },
    { tier:"T1", name:"ECI (eci.gov.in) — Party Finance", url:"eci.gov.in/contributionreports/", method:"HTTP scrape + PDF parse", freq:"Annual (Sep 30 ECI deadline)", format:"PDF", module:"Party Finance", auth:"None", rate:"Slow crawl only", notes:"Contribution reports and audit reports filed by parties. ADR (adrindia.org) publishes analysis — cite both." },
    { tier:"T1", name:"Sansad.in (Parliament)", url:"sansad.in/api/", method:"REST API + Playwright scrape", freq:"Daily during sessions", format:"JSON / HTML", module:"Statements, Fact-Check", auth:"None (public)", rate:"1 req/3s", notes:"Question/Answer pairs, debate transcripts. Session calendar drives scrape schedule. JS-rendered — Playwright needed." },
    { tier:"T1", name:"CBI Press Releases", url:"cbi.gov.in/press-releases/", method:"RSS + HTTP scrape", freq:"Every 4 hours", format:"HTML", module:"Fraud Tracker, Alerts", auth:"None", rate:"1 req/10s", notes:"No official RSS — build synthetic RSS from /press-releases/ listing page. Parse case name, date, amount from body." },
    { tier:"T1", name:"ED Press Releases", url:"enforcementdirectorate.gov.in", method:"HTTP scrape", freq:"Every 4 hours", format:"HTML", module:"Fraud Tracker, Alerts", auth:"None", rate:"1 req/10s", notes:"Parse attachment orders, arrests. Extract ₹ amounts with regex. Source every fraud entry to specific press release URL." },
    { tier:"T1", name:"RBI DBIE", url:"dbie.rbi.org.in/DBIE/dbie.rbi?site=api", method:"REST API", freq:"Weekly / Monthly", format:"JSON", module:"Home Dashboard KPIs", auth:"None (public API)", rate:"No limit stated; use 2 req/s", notes:"Forex reserves, repo rate, CPI, WPI, money supply. Well-documented REST API with time-series endpoints." },
    { tier:"T1", name:"CAG Reports", url:"cag.gov.in/en/reports.html", method:"HTTP scrape + PDF parse", freq:"Monthly check; parse on new report", format:"PDF", module:"Spending, Policies", auth:"None", rate:"1 req/15s", notes:"New reports tabled in Parliament — monitor for new PDFs. Extract 'Key Findings' and 'Audit Paras' sections." },
    { tier:"T2", name:"World Bank Open Data", url:"api.worldbank.org/v2/", method:"REST API", freq:"Quarterly / Annual", format:"JSON / XML", module:"International Rankings", auth:"None", rate:"Official: 50 req/10s", notes:"Indicators: NY.GDP.MKTP.CD (GDP), SP.POP.TOTL, SL.UEM.TOTL.ZS. Free, well-documented, reliable." },
    { tier:"T2", name:"IMF Data API", url:"imf.org/external/datamapper/api/", method:"REST API", freq:"Quarterly", format:"JSON", module:"International Rankings, Home KPIs", auth:"None", rate:"Official: no documented limit; use 2 req/s", notes:"WEO database: NGDPD (GDP nominal), PCPIPCH (inflation), GGR_NGDP (fiscal balance). Use country=IND filter." },
    { tier:"T2", name:"UNDP Human Development Reports", url:"hdr.undp.org/en/data", method:"Dataset download (CSV)", freq:"Annual (usually Nov-Dec)", format:"CSV / Excel", module:"International Rankings", auth:"None", rate:"Single download", notes:"Download composite HDI dataset. Also available via HDR statistical API. Parse India row (IND)." },
    { tier:"T2", name:"RSF Press Freedom Index", url:"rsf.org/en/index", method:"Dataset download / HTTP scrape", freq:"Annual (May)", format:"CSV / HTML table", module:"International Rankings", auth:"None", rate:"Single download", notes:"RSF publishes Excel/CSV with all country data. Download on annual release. Monitor rsf.org/en/index for release date." },
    { tier:"T3", name:"ADR (adrindia.org)", url:"adrindia.org/reports/", method:"HTTP scrape + PDF parse", freq:"Event-driven (post-ECI filings)", format:"PDF / HTML", module:"Party Finance", auth:"None", rate:"1 req/10s", notes:"ADR publishes analysis reports after ECI filings. Parse party name, income, expenditure tables. Cite ADR as source." },
    { tier:"T3", name:"PRS Legislative Research", url:"prsindia.org", method:"HTTP scrape", freq:"Budget day + monthly", format:"HTML / PDF", module:"Budget, Policies", auth:"None", rate:"1 req/10s", notes:"Budget analysis, bill summaries. Cite PRS for contextual analysis. Do not reproduce copyrighted analysis verbatim — extract data points only." },
    { tier:"T3", name:"AltNews / AFWA / Boom / FactChecker.in", url:"Various", method:"RSS aggregation", freq:"Every 6 hours", format:"RSS XML", module:"Fact-Check Tracker", auth:"None", rate:"Standard RSS polling", notes:"Aggregate fact-check verdicts via RSS. Map verdict taxonomy: True/False/Misleading/Unverifiable. Store checker URL for attribution." },
  ];
  const tiers = ["T1","T2","T3"];
  const [tier, setTier] = useState("T1");
  const shown = sources.filter(s => s.tier === tier);
  const tcolors = { T1: T.green, T2: T.blue, T3: T.violet };

  return (
    <div className="content fu">
      <InfoBox color={T.cyan} head="Source Tier System">
        <strong>Tier 1 (T1):</strong> Official Indian government portals — legally authoritative, freely accessible, primary source for all claims.<br/>
        <strong>Tier 2 (T2):</strong> Official international bodies — IMF, World Bank, UN agencies. Used for all international rankings and macro data.<br/>
        <strong>Tier 3 (T3):</strong> Verified civil society — ADR, PRS, established fact-checkers. Used for analysis context and party finance cross-verification.
      </InfoBox>
      <div style={{ display:'flex', gap:6, marginBottom:16 }}>
        {tiers.map(t => (
          <button key={t} onClick={() => setTier(t)} style={{
            padding:'6px 16px', border:`1px solid ${tier===t?tcolors[t]:T.border}`,
            background:tier===t?`rgba(${t==='T1'?'34,197,94':t==='T2'?'59,130,246':'139,92,246'},.12)`:'transparent',
            color:tier===t?tcolors[t]:T.muted, borderRadius:4, cursor:'pointer',
            fontSize:12, fontWeight:700, transition:'all .12s'
          }}>
            {t} — {t==='T1'?'Official Govt':t==='T2'?'International':'Civil Society'} ({sources.filter(s=>s.tier===t).length} sources)
          </button>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {shown.map((s, i) => (
          <div key={i} className="card" style={{ borderLeft:`3px solid ${tcolors[tier]}` }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10, marginBottom:8, flexWrap:'wrap' }}>
              <div>
                <div className="card-title">{s.name}</div>
                <div className="mono" style={{ fontSize:10, color:T.muted, marginTop:2 }}>{s.url}</div>
              </div>
              <div style={{ display:'flex', gap:5, flexWrap:'wrap', flexShrink:0 }}>
                <Chip t={s.method.split(' ')[0]} c="chip-c" />
                <Chip t={s.freq} c="chip-b" />
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:8, marginBottom:8 }}>
              {[["Format", s.format], ["Module", s.module], ["Auth", s.auth], ["Rate Limit", s.rate]].map(([k,v]) => (
                <div key={k} style={{ background:T.bg3, borderRadius:5, padding:'6px 10px' }}>
                  <div style={{ fontSize:8, color:T.muted, letterSpacing:1, textTransform:'uppercase', marginBottom:3 }}>{k}</div>
                  <div className="mono" style={{ fontSize:11, color:T.white }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize:11.5, color:T.dim, lineHeight:1.6 }}>{s.notes}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Scrapers() {
  return (
    <div className="content fu">
      <InfoBox color={T.green} head="Three Scraper Types">
        Every source falls into one of three ingestion paths. Using the right tool per source is the difference between a reliable pipeline and a fragile one.
      </InfoBox>

      <SH title="Path A — REST API Integration (Structured Sources)" />
      <Code>{`<span class="cm"># opposition/scrapers/api/world_bank.py</span>
<span class="kw">import</span> httpx, asyncio
<span class="kw">from</span> pydantic <span class="kw">import</span> BaseModel
<span class="kw">from</span> opposition.db <span class="kw">import</span> upsert_metric

<span class="dec">INDICATORS</span> = {
    <span class="str">"NY.GDP.MKTP.CD"</span>: <span class="str">"gdp_nominal_usd"</span>,
    <span class="str">"SP.POP.TOTL"</span>:    <span class="str">"population"</span>,
    <span class="str">"SL.UEM.TOTL.ZS"</span>: <span class="str">"unemployment_pct"</span>,
}

<span class="kw">class</span> <span class="fn">WorldBankRecord</span>(BaseModel):
    indicator_code: str
    indicator_name: str
    value: <span class="dec">float</span> | <span class="dec">None</span>
    year: <span class="dec">int</span>
    source_url: str

<span class="kw">async def</span> <span class="fn">fetch_indicator</span>(client: httpx.AsyncClient, code: str, field: str):
    url = (
        <span class="str">f"https://api.worldbank.org/v2/country/IND/indicator/{code}"</span>
        <span class="str">"?format=json&mrv=10&per_page=10"</span>  <span class="cm"># last 10 years</span>
    )
    r = <span class="kw">await</span> client.get(url, timeout=<span class="num">30</span>)
    r.raise_for_status()
    data = r.json()[<span class="num">1</span>]  <span class="cm"># [0] is metadata</span>

    records = []
    <span class="kw">for</span> entry <span class="kw">in</span> data:
        <span class="kw">if</span> entry[<span class="str">"value"</span>] <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span>:
            records.append(WorldBankRecord(
                indicator_code=code,
                indicator_name=entry[<span class="str">"indicator"</span>][<span class="str">"value"</span>],
                value=entry[<span class="str">"value"</span>],
                year=<span class="dec">int</span>(entry[<span class="str">"date"</span>]),
                source_url=url,
            ))
    <span class="kw">return</span> records

<span class="kw">async def</span> <span class="fn">run_world_bank_pipeline</span>():
    limits = httpx.Limits(max_connections=<span class="num">5</span>)
    <span class="kw">async with</span> httpx.AsyncClient(limits=limits) <span class="kw">as</span> client:
        tasks = [fetch_indicator(client, code, field)
                 <span class="kw">for</span> code, field <span class="kw">in</span> <span class="dec">INDICATORS</span>.items()]
        results = <span class="kw">await</span> asyncio.gather(*tasks, return_exceptions=<span class="kw">True</span>)

    <span class="kw">for</span> res <span class="kw">in</span> results:
        <span class="kw">if</span> isinstance(res, Exception):
            logger.error(<span class="str">f"WB API error: {res}"</span>)
            <span class="kw">continue</span>
        <span class="kw">for</span> record <span class="kw">in</span> res:
            <span class="kw">await</span> upsert_metric(record)  <span class="cm"># idempotent upsert</span>`}</Code>

      <SH title="Path B — HTML Scraper (Static Pages: CBI, ED, CAG, PIB)" />
      <Code>{`<span class="cm"># opposition/scrapers/html/cbi_press.py</span>
<span class="kw">import</span> scrapy, hashlib, json
<span class="kw">from</span> datetime <span class="kw">import</span> datetime, timezone
<span class="kw">from</span> opposition.storage <span class="kw">import</span> save_raw, already_ingested

<span class="kw">class</span> <span class="fn">CBIPressSpider</span>(scrapy.Spider):
    name = <span class="str">"cbi_press"</span>
    start_urls = [<span class="str">"https://cbi.gov.in/press-releases/"</span>]
    custom_settings = {
        <span class="str">"DOWNLOAD_DELAY"</span>: <span class="num">10</span>,          <span class="cm"># 1 req/10s — respect the server</span>
        <span class="str">"ROBOTSTXT_OBEY"</span>: <span class="kw">True</span>,
        <span class="str">"USER_AGENT"</span>: <span class="str">"OPPOSITIONBot/1.0 (civic data; +https://opposition.in/bot)"</span>,
        <span class="str">"AUTOTHROTTLE_ENABLED"</span>: <span class="kw">True</span>,   <span class="cm"># adaptive rate limiting</span>
    }

    <span class="kw">def</span> <span class="fn">parse</span>(self, response):
        <span class="kw">for</span> link <span class="kw">in</span> response.css(<span class="str">"a.press-release-link"</span>):
            url = response.urljoin(link.attrib[<span class="str">"href"</span>])
            fingerprint = hashlib.sha256(url.encode()).hexdigest()

            <span class="kw">if</span> already_ingested(fingerprint):
                <span class="kw">continue</span>  <span class="cm"># idempotency check</span>

            <span class="kw">yield</span> scrapy.Request(url, callback=self.parse_release,
                                  meta={<span class="str">"fingerprint"</span>: fingerprint})

    <span class="kw">def</span> <span class="fn">parse_release</span>(self, response):
        raw = {
            <span class="str">"source"</span>:      <span class="str">"CBI"</span>,
            <span class="str">"source_url"</span>:  response.url,
            <span class="str">"fingerprint"</span>: response.meta[<span class="str">"fingerprint"</span>],
            <span class="str">"scraped_at"</span>:  datetime.now(timezone.utc).isoformat(),
            <span class="str">"title"</span>:       response.css(<span class="str">"h1.release-title::text"</span>).get(<span class="str">""</span>).strip(),
            <span class="str">"date_text"</span>:   response.css(<span class="str">"span.release-date::text"</span>).get(<span class="str">""</span>).strip(),
            <span class="str">"body_html"</span>:   response.css(<span class="str">"div.release-body"</span>).get(<span class="str">""</span>),
            <span class="str">"body_text"</span>:   <span class="str">" "</span>.join(response.css(<span class="str">"div.release-body *::text"</span>).getall()),
        }

        <span class="cm"># Save raw to R2 before any parsing</span>
        save_raw(fingerprint, raw, bucket=<span class="str">"cbi-press-raw"</span>)

        <span class="cm"># Route to CBI parser for structured extraction</span>
        <span class="kw">yield</span> {<span class="str">"type"</span>: <span class="str">"cbi_press"</span>, <span class="str">"data"</span>: raw}`}</Code>

      <SH title="Path C — JavaScript-Rendered Pages (Playwright)" />
      <Code>{`<span class="cm"># opposition/scrapers/playwright/pfms_dbt.py</span>
<span class="cm"># Used for: pfms.nic.in, sansad.in, some ministry portals</span>
<span class="kw">from</span> playwright.async_api <span class="kw">import</span> async_playwright
<span class="kw">import</span> asyncio, json
<span class="kw">from</span> opposition.storage <span class="kw">import</span> save_raw

<span class="kw">async def</span> <span class="fn">scrape_pfms_summary</span>():
    <span class="kw">async with</span> async_playwright() <span class="kw">as</span> pw:
        browser = <span class="kw">await</span> pw.chromium.launch(headless=<span class="kw">True</span>)
        ctx = <span class="kw">await</span> browser.new_context(
            user_agent=<span class="str">"OPPOSITIONBot/1.0"</span>,
            viewport={<span class="str">"width"</span>: <span class="num">1280</span>, <span class="str">"height"</span>: <span class="num">800</span>}
        )
        page = <span class="kw">await</span> ctx.new_page()

        <span class="kw">await</span> page.goto(<span class="str">"https://pfms.nic.in/Reports/..."</span>, wait_until=<span class="str">"networkidle"</span>)
        <span class="kw">await</span> page.wait_for_selector(<span class="str">"table#dbtSummaryTable"</span>, timeout=<span class="num">30000</span>)

        <span class="cm"># Intercept XHR responses (faster than parsing DOM)</span>
        raw_data = []
        <span class="kw">async def</span> <span class="fn">capture_response</span>(response):
            <span class="kw">if</span> <span class="str">"api/dbt-summary"</span> <span class="kw">in</span> response.url:
                raw_data.append(<span class="kw">await</span> response.json())

        page.on(<span class="str">"response"</span>, capture_response)
        <span class="kw">await</span> page.click(<span class="str">"button#loadData"</span>)
        <span class="kw">await</span> asyncio.sleep(<span class="num">3</span>)

        <span class="cm"># Screenshot for audit trail</span>
        screenshot = <span class="kw">await</span> page.screenshot(full_page=<span class="kw">True</span>)
        save_raw(<span class="str">"pfms_dbt_screenshot"</span>, screenshot, bucket=<span class="str">"screenshots"</span>)

        <span class="kw">await</span> browser.close()
        <span class="kw">return</span> raw_data`}</Code>

      <SH title="RSS Aggregator for News & Alerts" />
      <Code>{`<span class="cm"># opposition/scrapers/rss/aggregator.py</span>
<span class="kw">import</span> feedparser, httpx
<span class="kw">from</span> opposition.parsers.alert_classifier <span class="kw">import</span> classify_alert

<span class="dec">RSS_FEEDS</span> = [
    {<span class="str">"name"</span>: <span class="str">"PIB"</span>,        <span class="str">"url"</span>: <span class="str">"https://pib.gov.in/RssMain.aspx"</span>,          <span class="str">"module"</span>: <span class="str">"statements"</span>},
    {<span class="str">"name"</span>: <span class="str">"AltNews"</span>,    <span class="str">"url"</span>: <span class="str">"https://www.altnews.in/feed/"</span>,             <span class="str">"module"</span>: <span class="str">"fact_check"</span>},
    {<span class="str">"name"</span>: <span class="str">"Boom"</span>,       <span class="str">"url"</span>: <span class="str">"https://www.boomlive.in/feed"</span>,             <span class="str">"module"</span>: <span class="str">"fact_check"</span>},
    {<span class="str">"name"</span>: <span class="str">"AFWA"</span>,       <span class="str">"url"</span>: <span class="str">"https://factcheck.afp.com/en/feed?country=in"</span>,<span class="str">"module"</span>: <span class="str">"fact_check"</span>},
    {<span class="str">"name"</span>: <span class="str">"RSF"</span>,        <span class="str">"url"</span>: <span class="str">"https://rsf.org/en/rss/news-india"</span>,          <span class="str">"module"</span>: <span class="str">"rankings"</span>},
]

<span class="kw">async def</span> <span class="fn">poll_all_feeds</span>():
    results = []
    <span class="kw">async with</span> httpx.AsyncClient() <span class="kw">as</span> client:
        <span class="kw">for</span> feed <span class="kw">in</span> <span class="dec">RSS_FEEDS</span>:
            <span class="kw">try</span>:
                r = <span class="kw">await</span> client.get(feed[<span class="str">"url"</span>], timeout=<span class="num">20</span>)
                parsed = feedparser.parse(r.text)
                <span class="kw">for</span> entry <span class="kw">in</span> parsed.entries:
                    results.append({
                        <span class="str">"source"</span>:     feed[<span class="str">"name"</span>],
                        <span class="str">"module"</span>:     feed[<span class="str">"module"</span>],
                        <span class="str">"title"</span>:      entry.get(<span class="str">"title"</span>, <span class="str">""</span>),
                        <span class="str">"url"</span>:        entry.get(<span class="str">"link"</span>, <span class="str">""</span>),
                        <span class="str">"published"</span>:  entry.get(<span class="str">"published"</span>, <span class="str">""</span>),
                        <span class="str">"summary"</span>:    entry.get(<span class="str">"summary"</span>, <span class="str">""</span>),
                        <span class="str">"alert_type"</span>: classify_alert(entry.get(<span class="str">"title"</span>, <span class="str">""</span>)),
                    })
            <span class="kw">except</span> Exception <span class="kw">as</span> e:
                logger.warning(<span class="str">f"RSS feed {feed['name']} failed: {e}"</span>)
    <span class="kw">return</span> results`}</Code>
    </div>
  );
}

function Pipeline() {
  return (
    <div className="content fu">
      <InfoBox color={T.violet} head="Orchestrator: Prefect 3 (chosen over Airflow)">
        Prefect is chosen over Apache Airflow because: (1) Python-native with minimal boilerplate, (2) built-in failure recovery with automatic retries, (3) dynamic flow construction — scrapers are parameterised, not hard-coded, (4) simpler deployment on a small team. <strong>Dagster</strong> was considered for its asset-centric model but adds complexity beyond what a lean editorial team can maintain.
      </InfoBox>

      <SH title="Prefect Flow Definitions — Master Schedule" />
      <Code>{`<span class="cm"># opposition/flows/master_schedule.py</span>
<span class="kw">from</span> prefect <span class="kw">import</span> flow, task, serve
<span class="kw">from</span> prefect.schedules <span class="kw">import</span> CronSchedule
<span class="kw">from</span> prefect.task_runners <span class="kw">import</span> ConcurrentTaskRunner

<span class="cm"># ── TIER 1: Alert-critical sources (every 2 hours) ──</span>
<span class="kw">@flow</span>(name=<span class="str">"alert_sources"</span>, task_runner=ConcurrentTaskRunner())
<span class="kw">async def</span> <span class="fn">alert_sources_flow</span>():
    <span class="cm">"""CBI, ED, PIB, RSF — anything that triggers alerts"""</span>
    <span class="kw">await</span> asyncio.gather(
        scrape_cbi_press(),     <span class="cm"># CBI press releases</span>
        scrape_ed_press(),      <span class="cm"># ED press releases</span>
        poll_pib_rss(),         <span class="cm"># PIB RSS — policy/statement alerts</span>
        poll_factcheck_feeds(), <span class="cm"># AltNews, Boom, AFWA RSS</span>
    )

<span class="cm"># ── TIER 2: Daily sources ──</span>
<span class="kw">@flow</span>(name=<span class="str">"daily_sources"</span>)
<span class="kw">async def</span> <span class="fn">daily_sources_flow</span>():
    <span class="kw">await</span> asyncio.gather(
        fetch_rbi_dbie(),        <span class="cm"># Forex, repo rate (updates daily)</span>
        scrape_sc_causelist(),   <span class="cm"># Supreme Court cause list</span>
        poll_sansad_qa(),        <span class="cm"># Parliament Q&A during sessions</span>
    )

<span class="cm"># ── TIER 3: Monthly sources ──</span>
<span class="kw">@flow</span>(name=<span class="str">"monthly_sources"</span>)
<span class="kw">async def</span> <span class="fn">monthly_sources_flow</span>():
    <span class="kw">await</span> asyncio.gather(
        download_cga_monthly(),  <span class="cm"># CGA monthly expenditure accounts</span>
        fetch_world_bank_api(),  <span class="cm"># WB indicators update</span>
        fetch_imf_weo(),         <span class="cm"># IMF WEO data</span>
    )

<span class="cm"># ── TIER 4: Annual / event-driven sources ──</span>
<span class="kw">@flow</span>(name=<span class="str">"budget_day"</span>)
<span class="kw">async def</span> <span class="fn">budget_day_flow</span>(budget_year: int):
    <span class="cm">"""Triggered manually on Feb 1 each year"""</span>
    pdfs = <span class="kw">await</span> download_all_budget_pdfs(budget_year)
    <span class="kw">for</span> pdf <span class="kw">in</span> pdfs:
        <span class="kw">await</span> extract_budget_pdf.submit(pdf)  <span class="cm"># parallel PDF extraction</span>

<span class="cm"># ── Deployment definitions ──</span>
<span class="kw">if</span> __name__ == <span class="str">"__main__"</span>:
    serve(
        alert_sources_flow.to_deployment(
            name=<span class="str">"alert-sources"</span>,
            cron=<span class="str">"0 */2 * * *"</span>,          <span class="cm"># every 2 hours</span>
        ),
        daily_sources_flow.to_deployment(
            name=<span class="str">"daily-sources"</span>,
            cron=<span class="str">"30 6 * * *"</span>,            <span class="cm"># 6:30 AM IST daily</span>
        ),
        monthly_sources_flow.to_deployment(
            name=<span class="str">"monthly-sources"</span>,
            cron=<span class="str">"0 8 28 * *"</span>,            <span class="cm"># 28th of each month</span>
        ),
    )`}</Code>

      <SH title="Retry & Failure Strategy" />
      <Code>{`<span class="cm"># opposition/flows/retry_config.py</span>
<span class="kw">from</span> prefect <span class="kw">import</span> task
<span class="kw">from</span> prefect.tasks <span class="kw">import</span> exponential_backoff

<span class="cm"># Standard retry for HTTP sources</span>
<span class="kw">@task</span>(
    retries=<span class="num">3</span>,
    retry_delay_seconds=exponential_backoff(backoff_factor=<span class="num">60</span>),
    <span class="cm"># 1st retry: 60s, 2nd: 120s, 3rd: 240s</span>
    timeout_seconds=<span class="num">120</span>,
)
<span class="kw">async def</span> <span class="fn">scrape_with_retry</span>(url: str, parser_fn, **kwargs):
    <span class="kw">try</span>:
        raw = <span class="kw">await</span> fetch_url(url)
        <span class="kw">return</span> parser_fn(raw, **kwargs)
    <span class="kw">except</span> RateLimitError:
        <span class="cm"># Back off longer on explicit rate limit</span>
        <span class="kw">raise</span> Exception(<span class="str">"Rate limited — will retry"</span>)
    <span class="kw">except</span> PortalBlockedError:
        <span class="cm"># Rotate to proxy before retry</span>
        rotate_proxy()
        <span class="kw">raise</span>

<span class="cm"># Proxy rotation (for blocked portals)</span>
<span class="kw">class</span> <span class="fn">ProxyRotator</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self, proxy_list: list[str]):
        self._proxies = proxy_list
        self._idx = <span class="num">0</span>

    <span class="kw">def</span> <span class="fn">next</span>(self) -> str:
        proxy = self._proxies[self._idx % len(self._proxies)]
        self._idx += <span class="num">1</span>
        <span class="kw">return</span> proxy

<span class="cm"># Dead letter queue — failed scrapes after all retries</span>
<span class="kw">async def</span> <span class="fn">send_to_dlq</span>(source: str, url: str, error: str):
    <span class="kw">await</span> db.execute(<span class="str">"""
        INSERT INTO scrape_failures (source, url, error, ts)
        VALUES ($1, $2, $3, NOW())
    """</span>, source, url, error)
    <span class="cm"># Alert editor on Slack/email after 3rd consecutive failure</span>
    <span class="kw">if</span> <span class="kw">await</span> consecutive_failures(source) >= <span class="num">3</span>:
        <span class="kw">await</span> alert_editorial_team(source, error)`}</Code>
    </div>
  );
}

function Extraction() {
  return (
    <div className="content fu">
      <InfoBox color={T.amber} head="The PDF Problem">
        The Union Budget alone is ~3,000 pages across 8+ documents. CAG reports are hundreds of pages. ECI party returns are scanned PDFs. This layer is the hardest part of the pipeline and the one most likely to break year-over-year as the government changes document formats.
      </InfoBox>

      <SH title="Budget PDF Extraction — Table Parsing" />
      <Code>{`<span class="cm"># opposition/extractors/budget_pdf.py</span>
<span class="kw">import</span> camelot, pdfplumber, json, re
<span class="kw">from</span> pathlib <span class="kw">import</span> Path

<span class="dec">BUDGET_DOCS</span> = {
    <span class="str">"expenditure_vol1"</span>: <span class="str">"Ministry-wise expenditure; ministry summary tables"</span>,
    <span class="str">"receipt_budget"</span>:   <span class="str">"Tax revenue, non-tax revenue, capital receipts"</span>,
    <span class="str">"budget_at_glance"</span>: <span class="str">"High-level fiscal summary (most stable format)"</span>,
    <span class="str">"key_features"</span>:    <span class="str">"Narrative highlights (text extraction)"</span>,
}

<span class="kw">def</span> <span class="fn">extract_ministry_table</span>(pdf_path: Path) -> list[dict]:
    <span class="cm">"""
    Camelot is primary (best for grid tables in Budget PDFs).
    pdfplumber is fallback (handles merged cells better).
    """</span>
    tables = []

    <span class="cm"># Try Camelot lattice mode (for tables with visible borders)</span>
    <span class="kw">try</span>:
        camelot_tables = camelot.read_pdf(
            str(pdf_path),
            pages=<span class="str">"all"</span>,
            flavor=<span class="str">"lattice"</span>,  <span class="cm"># use "stream" for borderless tables</span>
            line_scale=<span class="num">40</span>,
        )
        <span class="kw">for</span> t <span class="kw">in</span> camelot_tables:
            <span class="kw">if</span> t.accuracy > <span class="num">85</span>:  <span class="cm"># reject low-quality extractions</span>
                df = t.df
                tables.extend(parse_ministry_df(df))
    <span class="kw">except</span> Exception <span class="kw">as</span> e:
        logger.warning(<span class="str">f"Camelot failed: {e}, falling back to pdfplumber"</span>)

        <span class="cm"># Fallback: pdfplumber</span>
        <span class="kw">with</span> pdfplumber.open(pdf_path) <span class="kw">as</span> pdf:
            <span class="kw">for</span> page <span class="kw">in</span> pdf.pages:
                tbl = page.extract_table()
                <span class="kw">if</span> tbl:
                    tables.extend(parse_ministry_table(tbl))

    <span class="kw">return</span> tables

<span class="kw">def</span> <span class="fn">parse_ministry_df</span>(df) -> list[dict]:
    records = []
    <span class="kw">for</span> _, row <span class="kw">in</span> df.iterrows():
        <span class="cm"># Normalise ₹ crore figures (handle "1,23,456" Indian number format)</span>
        <span class="kw">def</span> <span class="fn">parse_inr</span>(s: str) -> <span class="dec">float</span> | <span class="kw">None</span>:
            <span class="kw">if</span> <span class="kw">not</span> s <span class="kw">or</span> str(s).strip() <span class="kw">in</span> (<span class="str">"-"</span>, <span class="str">""</span>, <span class="str">"NA"</span>):
                <span class="kw">return None</span>
            cleaned = re.sub(<span class="str">r"[^\d.]"</span>, <span class="str">""</span>, str(s))
            <span class="kw">return float</span>(cleaned) <span class="kw">if</span> cleaned <span class="kw">else None</span>

        records.append({
            <span class="str">"ministry_name"</span>:    str(row.get(<span class="num">0</span>, <span class="str">""</span>)).strip(),
            <span class="str">"be_amount_crore"</span>:  parse_inr(row.get(<span class="num">2</span>)),  <span class="cm"># col idx varies by year</span>
            <span class="str">"re_amount_crore"</span>:  parse_inr(row.get(<span class="num">3</span>)),
            <span class="str">"actual_crore"</span>:     parse_inr(row.get(<span class="num">4</span>)),
        })
    <span class="kw">return</span> [r <span class="kw">for</span> r <span class="kw">in</span> records <span class="kw">if</span> r[<span class="str">"ministry_name"</span>]]  <span class="cm"># drop empty rows</span>

<span class="cm"># ── Annual column mapping (budget format changes every few years) ──</span>
<span class="dec">COLUMN_MAP</span> = {
    <span class="str">"2025"</span>: {<span class="str">"be"</span>: <span class="num">2</span>, <span class="str">"re"</span>: <span class="num">3</span>, <span class="str">"actual"</span>: <span class="num">4</span>},
    <span class="str">"2024"</span>: {<span class="str">"be"</span>: <span class="num">2</span>, <span class="str">"re"</span>: <span class="num">3</span>, <span class="str">"actual"</span>: <span class="num">4</span>},
    <span class="str">"2023"</span>: {<span class="str">"be"</span>: <span class="num">2</span>, <span class="str">"re"</span>: <span class="num">3</span>, <span class="str">"actual"</span>: <span class="num">4</span>},
    <span class="cm"># Update mapping each year after reviewing PDF structure</span>
}`}</Code>

      <SH title="Fraud Case Parser — CBI/ED Text Extraction" />
      <Code>{`<span class="cm"># opposition/parsers/fraud_case_parser.py</span>
<span class="kw">import</span> re, dateparser
<span class="kw">from</span> dataclasses <span class="kw">import</span> dataclass

<span class="dec">AMOUNT_PATTERN</span>   = re.compile(<span class="str">r"₹\s*([\d,]+(?:\.\d+)?)\s*(crore|lakh|thousand)?",</span> re.IGNORECASE)
<span class="dec">ATTACHED_PATTERN</span> = re.compile(<span class="str">r"attach\w*.*?₹\s*([\d,]+)\s*crore"</span>,             re.IGNORECASE)
<span class="dec">AGENCY_PATTERN</span>   = re.compile(<span class="str">r"\b(CBI|ED|SFIO|SIT|NIA|Income Tax)\b"</span>)

<span class="kw">@dataclass</span>
<span class="kw">class</span> <span class="fn">FraudCaseExtract</span>:
    source:        str   <span class="cm"># "CBI" or "ED"</span>
    source_url:    str
    title:         str
    date:          str | <span class="kw">None</span>
    amount_crore:  <span class="dec">float</span> | <span class="kw">None</span>
    attached_crore:<span class="dec">float</span> | <span class="kw">None</span>
    agencies:      list[str]
    raw_text:      str   <span class="cm"># preserved for editor review</span>

<span class="kw">def</span> <span class="fn">parse_press_release</span>(raw: dict) -> FraudCaseExtract:
    text = raw[<span class="str">"body_text"</span>]

    <span class="cm"># Extract primary amount</span>
    amt_match = <span class="dec">AMOUNT_PATTERN</span>.search(text)
    amount = <span class="kw">None</span>
    <span class="kw">if</span> amt_match:
        val = <span class="dec">float</span>(amt_match.group(<span class="num">1</span>).replace(<span class="str">","</span>, <span class="str">""</span>))
        unit = (amt_match.group(<span class="num">2</span>) <span class="kw">or</span> <span class="str">"crore"</span>).lower()
        amount = val <span class="kw">if</span> unit == <span class="str">"crore"</span> <span class="kw">else</span> val / <span class="num">100</span>  <span class="cm"># lakh → crore</span>

    <span class="cm"># Extract attachment amount</span>
    att_match = <span class="dec">ATTACHED_PATTERN</span>.search(text)
    attached = <span class="dec">float</span>(att_match.group(<span class="num">1</span>).replace(<span class="str">","</span>,<span class="str">""</span>)) <span class="kw">if</span> att_match <span class="kw">else None</span>

    <span class="kw">return</span> FraudCaseExtract(
        source=raw[<span class="str">"source"</span>],
        source_url=raw[<span class="str">"source_url"</span>],
        title=raw[<span class="str">"title"</span>],
        date=dateparser.parse(raw[<span class="str">"date_text"</span>], settings={<span class="str">"TIMEZONE"</span>: <span class="str">"IST"</span>}),
        amount_crore=amount,
        attached_crore=attached,
        agencies=<span class="dec">AGENCY_PATTERN</span>.findall(text),
        raw_text=text,
    )

<span class="cm"># ⚠️  This extract goes to EDITOR QUEUE — never auto-publishes
# Editor must verify accused names against official FIR before DB write</span>`}</Code>
    </div>
  );
}

function Validation() {
  return (
    <div className="content fu">
      <InfoBox color={T.blue} head="Two-Gate Validation">
        Gate 1 is automated (Pydantic + statistical checks). Gate 2 is human (editorial queue). <strong>Every record that names an individual in a fraud or controversy context must pass Gate 2.</strong> Automated data (budget figures, international rankings, economic indicators) can auto-publish after Gate 1 if anomaly score is below threshold.
      </InfoBox>

      <SH title="Gate 1 — Pydantic Schema Validation" />
      <Code>{`<span class="cm"># opposition/models/budget.py — Pydantic v2 models enforce data quality</span>
<span class="kw">from</span> pydantic <span class="kw">import</span> BaseModel, Field, field_validator, model_validator
<span class="kw">from</span> enum <span class="kw">import</span> StrEnum
<span class="kw">from</span> datetime <span class="kw">import</span> date

<span class="kw">class</span> <span class="fn">BudgetType</span>(StrEnum):
    BE = <span class="str">"BE"</span>   <span class="cm"># Budget Estimate</span>
    RE = <span class="str">"RE"</span>   <span class="cm"># Revised Estimate</span>
    ACT = <span class="str">"ACT"</span> <span class="cm"># Actuals</span>

<span class="kw">class</span> <span class="fn">BudgetAllocation</span>(BaseModel):
    fiscal_year:      str   = Field(pattern=<span class="str">r"^\d{4}-\d{2}$"</span>)  <span class="cm"># "2025-26"</span>
    ministry_code:    str   = Field(min_length=<span class="num">2</span>, max_length=<span class="num">10</span>)
    ministry_name:    str   = Field(min_length=<span class="num">5</span>)
    budget_type:      BudgetType
    amount_crore:     <span class="dec">float</span> = Field(gt=<span class="num">0</span>, le=<span class="num">2_000_000</span>)  <span class="cm"># max ₹20L Cr sanity cap</span>
    source_url:       str   = Field(min_length=<span class="num">10</span>)
    source_date:      date
    editor_id:        str | <span class="kw">None</span> = <span class="kw">None</span>  <span class="cm"># None for automated data</span>

    <span class="kw">@field_validator</span>(<span class="str">"amount_crore"</span>)
    <span class="kw">@classmethod</span>
    <span class="kw">def</span> <span class="fn">validate_amount</span>(cls, v):
        <span class="kw">if</span> v <= <span class="num">0</span>:
            <span class="kw">raise</span> ValueError(<span class="str">"Amount must be positive"</span>)
        <span class="kw">if</span> v > <span class="num">1_500_000</span>:  <span class="cm"># > ₹15L Cr is suspicious for single ministry</span>
            <span class="kw">raise</span> ValueError(<span class="str">f"Suspiciously large: {v}. Manual review required."</span>)
        <span class="kw">return round</span>(v, <span class="num">2</span>)

    <span class="kw">@model_validator</span>(mode=<span class="str">"after"</span>)
    <span class="kw">def</span> <span class="fn">validate_source_freshness</span>(self):
        <span class="kw">from</span> datetime <span class="kw">import</span> date, timedelta
        age_days = (date.today() - self.source_date).days
        <span class="kw">if</span> age_days > <span class="num">365</span>:
            <span class="kw">raise</span> ValueError(<span class="str">f"Source is {age_days} days old — may be stale"</span>)
        <span class="kw">return</span> self

<span class="cm"># Fraud case model — stricter (goes to editor queue always)</span>
<span class="kw">class</span> <span class="fn">FraudCase</span>(BaseModel):
    case_name:       str   = Field(min_length=<span class="num">5</span>)
    agency:          str
    amount_crore:    <span class="dec">float</span> | <span class="kw">None</span>
    attached_crore:  <span class="dec">float</span> | <span class="kw">None</span>
    source_url:      str   = Field(min_length=<span class="num">10</span>)
    source_type:     str   = Field(pattern=<span class="str">r"^(CBI|ED|SFIO|SIT|CAG|COURT)$"</span>)
    accused_count:   <span class="dec">int</span>   = Field(ge=<span class="num">0</span>)
    status:          str

    model_config = {<span class="str">"requires_editor_review"</span>: <span class="kw">True</span>}  <span class="cm"># custom flag</span>`}</Code>

      <SH title="Gate 1 — Statistical Anomaly Detection" />
      <Code>{`<span class="cm"># opposition/validators/anomaly.py</span>
<span class="kw">from</span> statistics <span class="kw">import</span> mean, stdev
<span class="kw">from</span> enum <span class="kw">import</span> IntEnum

<span class="kw">class</span> <span class="fn">AnomalyScore</span>(IntEnum):
    OK    = <span class="num">0</span>
    LOW   = <span class="num">1</span>   <span class="cm"># log only</span>
    MED   = <span class="num">2</span>   <span class="cm"># flag for data editor review</span>
    HIGH  = <span class="num">3</span>   <span class="cm"># block auto-publish, require editor</span>

<span class="kw">async def</span> <span class="fn">score_budget_entry</span>(entry: BudgetAllocation, db) -> AnomalyScore:
    <span class="cm"># Get last 3 years of same ministry allocation</span>
    historical = <span class="kw">await</span> db.fetch(<span class="str">"""
        SELECT amount_crore FROM budget_allocations
        WHERE ministry_code = $1 AND budget_type = $2
        ORDER BY fiscal_year DESC LIMIT 3
    """</span>, entry.ministry_code, entry.budget_type)

    <span class="kw">if len</span>(historical) < <span class="num">2</span>:
        <span class="kw">return</span> AnomalyScore.LOW  <span class="cm"># not enough history</span>

    vals = [r[<span class="str">"amount_crore"</span>] <span class="kw">for</span> r <span class="kw">in</span> historical]
    avg, sd = mean(vals), stdev(vals)
    deviation = abs(entry.amount_crore - avg) / sd <span class="kw">if</span> sd > <span class="num">0</span> <span class="kw">else</span> <span class="num">0</span>

    <span class="kw">if</span>   deviation > <span class="num">3.0</span>: <span class="kw">return</span> AnomalyScore.HIGH  <span class="cm"># &gt;3σ from mean</span>
    <span class="kw">elif</span> deviation > <span class="num">2.0</span>: <span class="kw">return</span> AnomalyScore.MED
    <span class="kw">elif</span> deviation > <span class="num">1.5</span>: <span class="kw">return</span> AnomalyScore.LOW
    <span class="kw">else</span>:                  <span class="kw">return</span> AnomalyScore.OK

<span class="cm"># Content sensitivity classifier — routes to human queue</span>
<span class="kw">def</span> <span class="fn">requires_human_review</span>(record_type: str, data: dict) -> bool:
    <span class="kw">return any</span>([
        record_type <span class="kw">in</span> (<span class="str">"fraud_case"</span>, <span class="str">"statement"</span>),   <span class="cm"># always human</span>
        <span class="str">"accused"</span>     <span class="kw">in</span> str(data).lower(),              <span class="cm"># named individuals</span>
        <span class="str">"arrested"</span>    <span class="kw">in</span> str(data).lower(),
        <span class="str">"verdict"</span>     <span class="kw">in</span> str(data).lower(),
        data.get(<span class="str">"anomaly_score"</span>, <span class="num">0</span>) >= AnomalyScore.MED,
    ])`}</Code>

      <SH title="Gate 2 — Editor Queue (FastAPI Admin)" />
      <Code>{`<span class="cm"># opposition/api/editor_queue.py</span>
<span class="kw">from</span> fastapi <span class="kw">import</span> FastAPI, Depends, HTTPException
<span class="kw">from</span> opposition.auth <span class="kw">import</span> require_editor_role

router = APIRouter(prefix=<span class="str">"/admin/queue"</span>)

<span class="kw">@router</span>.get(<span class="str">"/"</span>)
<span class="kw">async def</span> <span class="fn">list_queue</span>(editor=Depends(require_editor_role), db=Depends(get_db)):
    <span class="kw">return await</span> db.fetch(<span class="str">"""
        SELECT id, record_type, record_data, anomaly_score,
               source_url, queued_at
        FROM editorial_queue
        WHERE status = 'PENDING'
        ORDER BY anomaly_score DESC, queued_at ASC
        LIMIT 50
    """</span>)

<span class="kw">@router</span>.post(<span class="str">"/{queue_id}/approve"</span>)
<span class="kw">async def</span> <span class="fn">approve_record</span>(
    queue_id: <span class="dec">int</span>,
    notes: str = <span class="str">""</span>,
    editor=Depends(require_editor_role),
    db=Depends(get_db)
):
    record = <span class="kw">await</span> db.fetchrow(<span class="str">"SELECT * FROM editorial_queue WHERE id=$1"</span>, queue_id)
    <span class="cm"># Write to main DB with editor attribution</span>
    <span class="kw">await</span> write_to_db(record[<span class="str">"record_type"</span>], record[<span class="str">"record_data"</span>],
                      editor_id=editor.id, notes=notes)
    <span class="kw">await</span> db.execute(<span class="str">"""
        UPDATE editorial_queue SET status='APPROVED',
        approved_by=$1, approved_at=NOW(), editor_notes=$2
        WHERE id=$3
    """</span>, editor.id, notes, queue_id)
    <span class="kw">return</span> {<span class="str">"status"</span>: <span class="str">"approved"</span>, <span class="str">"published"</span>: <span class="kw">True</span>}

<span class="kw">@router</span>.post(<span class="str">"/{queue_id}/reject"</span>)
<span class="kw">async def</span> <span class="fn">reject_record</span>(queue_id: <span class="dec">int</span>, reason: str, editor=Depends(require_editor_role), db=Depends(get_db)):
    <span class="kw">await</span> db.execute(<span class="str">"""
        UPDATE editorial_queue SET status='REJECTED',
        rejected_by=$1, rejection_reason=$2, updated_at=NOW()
        WHERE id=$3
    """</span>, editor.id, reason, queue_id)
    <span class="kw">return</span> {<span class="str">"status"</span>: <span class="str">"rejected"</span>}`}</Code>
    </div>
  );
}

function Database() {
  return (
    <div className="content fu">
      <InfoBox color={T.orange} head="Database Design Principles">
        (1) Every table has a <code>source_id</code> FK — zero orphaned data points. (2) <code>raw_ingest</code> table is append-only — every scrape leaves an immutable record. (3) TimescaleDB hypertables for time-series (metrics, spending trends) with automatic chunk partitioning. (4) Soft deletes — records are marked <code>is_active=false</code>, never hard-deleted.
      </InfoBox>

      <SH title="Core Schema — PostgreSQL + TimescaleDB" />
      <Code>{`<span class="cm">-- opposition/db/schema.sql</span>

<span class="cm">-- ── SOURCE REGISTRY (every record references this) ────────────</span>
<span class="dec">CREATE TABLE</span> sources (
    id           SERIAL PRIMARY KEY,
    source_name  TEXT NOT NULL,                             <span class="cm">-- "CBI", "World Bank"</span>
    source_url   TEXT NOT NULL UNIQUE,
    source_type  TEXT CHECK (source_type IN (
                   'OFFICIAL_GOVT','INTERNATIONAL_BODY',
                   'CIVIL_SOCIETY','MEDIA')),
    pub_date     DATE,
    retrieved_at TIMESTAMPTZ DEFAULT NOW(),
    link_alive   BOOLEAN DEFAULT TRUE,
    last_checked TIMESTAMPTZ
);

<span class="cm">-- ── RAW INGEST LOG (append-only audit trail) ───────────────────</span>
<span class="dec">CREATE TABLE</span> raw_ingest (
    id           BIGSERIAL PRIMARY KEY,
    fingerprint  TEXT NOT NULL UNIQUE,    <span class="cm">-- SHA-256 of URL+content</span>
    source_name  TEXT NOT NULL,
    source_url   TEXT NOT NULL,
    ingested_at  TIMESTAMPTZ DEFAULT NOW(),
    r2_key       TEXT,                    <span class="cm">-- path in Cloudflare R2</span>
    parse_status TEXT DEFAULT 'PENDING',  <span class="cm">-- PENDING/PARSED/FAILED/SKIPPED</span>
    error_msg    TEXT
);
<span class="dec">CREATE INDEX</span> idx_raw_ingest_fp ON raw_ingest(fingerprint);
<span class="dec">CREATE INDEX</span> idx_raw_ingest_source ON raw_ingest(source_name, ingested_at);

<span class="cm">-- ── BUDGET ALLOCATIONS ─────────────────────────────────────────</span>
<span class="dec">CREATE TABLE</span> budget_allocations (
    id             SERIAL PRIMARY KEY,
    fiscal_year    TEXT NOT NULL,          <span class="cm">-- "2025-26"</span>
    ministry_code  TEXT NOT NULL,
    ministry_name  TEXT NOT NULL,
    dept_code      TEXT,
    scheme_code    TEXT,
    scheme_name    TEXT,
    budget_type    TEXT NOT NULL,          <span class="cm">-- BE/RE/ACT</span>
    amount_crore   NUMERIC(14,2) NOT NULL,
    vs_prev_yr_pct NUMERIC(6,2),
    source_id      INT REFERENCES sources(id),
    editor_id      INT,                    <span class="cm">-- NULL = automated</span>
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    is_active      BOOLEAN DEFAULT TRUE,
    UNIQUE (fiscal_year, ministry_code, scheme_code, budget_type)
);

<span class="cm">-- ── FRAUD CASES ────────────────────────────────────────────────</span>
<span class="dec">CREATE TABLE</span> fraud_cases (
    id              SERIAL PRIMARY KEY,
    case_code       TEXT NOT NULL UNIQUE,  <span class="cm">-- internal ID e.g. "FRAUD-CBI-2018-001"</span>
    case_name       TEXT NOT NULL,
    category        TEXT NOT NULL,         <span class="cm">-- BANK/EXAM/POLITICAL/CORPORATE/GOVT</span>
    year            INT,
    amount_crore    NUMERIC(14,2),
    attached_crore  NUMERIC(14,2),
    recovery_pct    NUMERIC(5,2),
    fir_date        DATE,
    agencies        TEXT[],               <span class="cm">-- {"CBI","ED"}</span>
    court_status    TEXT,                 <span class="cm">-- INVESTIGATION/CHARGESHEET/TRIAL/etc</span>
    accused_summary TEXT,                 <span class="cm">-- "Accused per FIR" — never editorial claim</span>
    source_id       INT NOT NULL REFERENCES sources(id),
    editor_id       INT NOT NULL,          <span class="cm">-- REQUIRED for fraud cases</span>
    approved_at     TIMESTAMPTZ,
    last_updated    TIMESTAMPTZ DEFAULT NOW(),
    is_active       BOOLEAN DEFAULT TRUE
);

<span class="cm">-- ── INTERNATIONAL METRICS (TimescaleDB hypertable) ─────────────</span>
<span class="dec">CREATE TABLE</span> intl_metrics (
    ts             TIMESTAMPTZ NOT NULL,   <span class="cm">-- publication timestamp</span>
    index_name     TEXT NOT NULL,
    publisher      TEXT NOT NULL,
    country_code   TEXT DEFAULT 'IND',
    india_rank     INT,
    total_countries INT,
    india_score    TEXT,                   <span class="cm">-- TEXT to handle "Partly Free", "High"</span>
    category       TEXT,                   <span class="cm">-- economic/human/governance/environment</span>
    direction      TEXT,                   <span class="cm">-- good/bad (lower-is-better varies)</span>
    delta_prev_yr  INT,
    source_id      INT REFERENCES sources(id)
);
<span class="cm">-- Convert to hypertable (TimescaleDB)</span>
SELECT create_hypertable(<span class="str">'intl_metrics'</span>, <span class="str">'ts'</span>, chunk_time_interval => INTERVAL <span class="str">'6 months'</span>);
<span class="dec">CREATE UNIQUE INDEX</span> idx_metrics_unique ON intl_metrics(ts, index_name, country_code);

<span class="cm">-- ── EDITORIAL QUEUE ─────────────────────────────────────────────</span>
<span class="dec">CREATE TABLE</span> editorial_queue (
    id            BIGSERIAL PRIMARY KEY,
    record_type   TEXT NOT NULL,           <span class="cm">-- "fraud_case"/"statement"/etc</span>
    record_data   JSONB NOT NULL,
    anomaly_score INT DEFAULT 0,
    source_url    TEXT,
    queued_at     TIMESTAMPTZ DEFAULT NOW(),
    status        TEXT DEFAULT 'PENDING',  <span class="cm">-- PENDING/APPROVED/REJECTED</span>
    approved_by   INT,
    approved_at   TIMESTAMPTZ,
    rejection_reason TEXT,
    editor_notes  TEXT
);`}</Code>

      <SH title="Upsert Pattern — Idempotent Writes" />
      <Code>{`<span class="cm"># opposition/db/writers.py — All writes are idempotent (safe to replay)</span>

<span class="kw">async def</span> <span class="fn">upsert_budget_allocation</span>(record: BudgetAllocation, db) -> <span class="dec">int</span>:
    <span class="cm">"""
    ON CONFLICT DO UPDATE ensures replaying the same pipeline
    doesn't create duplicates. Returns the record ID.
    """</span>
    row = <span class="kw">await</span> db.fetchrow(<span class="str">"""
        INSERT INTO budget_allocations
            (fiscal_year, ministry_code, ministry_name, budget_type,
             amount_crore, source_id, editor_id)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        ON CONFLICT (fiscal_year, ministry_code, scheme_code, budget_type)
        DO UPDATE SET
            amount_crore  = EXCLUDED.amount_crore,
            source_id     = EXCLUDED.source_id,
            is_active     = TRUE,
            created_at    = NOW()
        RETURNING id
    """</span>, record.fiscal_year, record.ministry_code,
           record.ministry_name, record.budget_type,
           record.amount_crore, record.source_id, record.editor_id)
    <span class="kw">return</span> row[<span class="str">"id"</span>]

<span class="kw">async def</span> <span class="fn">log_scrape</span>(fingerprint: str, source: str, url: str, r2_key: str, db):
    <span class="cm">"""Always log to raw_ingest first — before any parsing"""</span>
    <span class="kw">await</span> db.execute(<span class="str">"""
        INSERT INTO raw_ingest (fingerprint, source_name, source_url, r2_key)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (fingerprint) DO NOTHING  -- truly idempotent
    """</span>, fingerprint, source, url, r2_key)`}</Code>
    </div>
  );
}

function Editorial() {
  return (
    <div className="content fu">
      <InfoBox color={T.red} head="Why Human Review is Non-Negotiable">
        The pipeline can auto-publish GDP figures and budget numbers. It cannot auto-publish "Anil Ambani accused of ₹7,000 Cr fraud." The legal exposure from a single incorrect accusation against a named individual can shut the platform. Human-in-the-loop for sensitive content is architectural, not optional.
      </InfoBox>

      <SH title="Content Sensitivity Routing Rules" />
      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th>Record Type</th><th>Auto-Publish?</th><th>Gate 1 Only?</th><th>Gate 2 Required?</th><th>Reason</th></tr></thead>
          <tbody>
            {[
              ["Budget allocation (ministry level)","✓ Yes","✓ Yes","No","Pure govt data; anomaly check sufficient"],
              ["International rankings (IMF/WB/etc)","✓ Yes","✓ Yes","No","Directly from official publisher dataset"],
              ["Economic indicators (RBI/MOSPI)","✓ Yes","✓ Yes","No","Official API data; no editorial judgment needed"],
              ["PIB policy announcements","✓ Yes (text)","✓ Yes","No","Verbatim government source; no interpretation"],
              ["Fact-check verdicts (AFWA/Boom/AltNews)","Partial","Gate 1","Editor assigns verdict label","We display their verdict, not ours — but editor confirms taxonomy mapping"],
              ["Government statements","No","Gate 1 flags","✓ Yes — ALWAYS","Involves named individuals; requires source verification"],
              ["Fraud/scam case entries","No","Gate 1 flags","✓ Yes — ALWAYS","Named accused; requires FIR/chargesheet source confirmation"],
              ["Party finance entries","No","Gate 1","✓ Yes","Named political parties; ECI source must be confirmed"],
              ["Promise tracker updates","No","Gate 1","✓ Yes","Editorial judgment on 'Partial' vs 'Not Met' status"],
              ["Project tracker updates","Partial","Gate 1","Editor for status changes","Auto for physical %; human for 'STALLED' status classification"],
            ].map(([t,a,g1,g2,r]) => (
              <tr key={t}>
                <td className="tw" style={{ fontSize:11 }}>{t}</td>
                <td style={{ color: a.includes("✓") ? T.green : T.red, fontSize:11, fontWeight:700 }}>{a}</td>
                <td style={{ color: T.dim, fontSize:10 }}>{g1}</td>
                <td style={{ color: g2.includes("✓") ? T.amber : T.dim, fontSize:10, fontWeight: g2.includes("✓") ? 700 : 400 }}>{g2}</td>
                <td style={{ fontSize:10, color:T.muted }}>{r}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SH title="Corrections Workflow — When Published Data is Wrong" />
      <Code>{`<span class="cm"># opposition/workflows/corrections.py</span>
<span class="kw">from</span> enum <span class="kw">import</span> StrEnum

<span class="kw">class</span> <span class="fn">CorrectionType</span>(StrEnum):
    FACTUAL_ERROR   = <span class="str">"factual_error"</span>    <span class="cm"># wrong number</span>
    STALE_STATUS    = <span class="str">"stale_status"</span>     <span class="cm"># case status changed</span>
    ACQUITTAL       = <span class="str">"acquittal"</span>        <span class="cm"># court acquitted accused</span>
    SOURCE_DEAD     = <span class="str">"source_dead"</span>      <span class="cm"># source link broken</span>
    EXTERNAL_CLAIM  = <span class="str">"external_claim"</span>   <span class="cm"># subject disputes the entry</span>

<span class="kw">async def</span> <span class="fn">apply_correction</span>(
    record_id: <span class="dec">int</span>,
    record_type: str,
    correction_type: CorrectionType,
    corrected_data: dict,
    editor_id: <span class="dec">int</span>,
    correction_note: str,
    db
):
    <span class="cm"># 1. Log the correction (immutable audit trail)</span>
    <span class="kw">await</span> db.execute(<span class="str">"""
        INSERT INTO corrections_log
        (record_id, record_type, correction_type, old_data,
         new_data, editor_id, correction_note, corrected_at)
        SELECT $1, $2, $3, row_to_json(t), $4, $5, $6, NOW()
        FROM {record_type} t WHERE id = $1
    """</span>, record_id, record_type, correction_type,
           json.dumps(corrected_data), editor_id, correction_note)

    <span class="cm"># 2. Apply the correction</span>
    <span class="kw">await</span> db.execute(<span class="str">f"""
        UPDATE {record_type} SET
            data = data || $1::jsonb,
            has_correction = TRUE,
            last_corrected = NOW()
        WHERE id = $2
    """</span>, json.dumps(corrected_data), record_id)

    <span class="cm"># 3. Invalidate Redis cache for this record</span>
    <span class="kw">await</span> redis.delete(<span class="str">f"cache:{record_type}:{record_id}"</span>)

    <span class="cm"># 4. Re-index in Elasticsearch</span>
    <span class="kw">await</span> es.index(index=record_type, id=record_id, body=corrected_data)

    <span class="cm"># ⚠️  ACQUITTAL fast path — prominent update within 24 hours
    if correction_type == CorrectionType.ACQUITTAL:
        await mark_acquitted(record_id, editor_id, db)
        await send_alert("ACQUITTAL_UPDATED", record_id)</span>`}</Code>
    </div>
  );
}

function Alerting() {
  return (
    <div className="content fu">
      <InfoBox color={T.green} head="Alert Architecture">
        Alerts are generated at the point of DB write — not via polling. A Celery signal fires after every successful DB upsert, evaluating the new record against user-defined alert rules. This means minimum latency between ED/CBI press release publication and the alert reaching subscribers.
      </InfoBox>

      <SH title="Alert Rule Engine" />
      <Code>{`<span class="cm"># opposition/alerts/rule_engine.py</span>
<span class="kw">from</span> dataclasses <span class="kw">import</span> dataclass
<span class="kw">from</span> enum <span class="kw">import</span> StrEnum

<span class="kw">class</span> <span class="fn">AlertSeverity</span>(StrEnum):
    CRITICAL = <span class="str">"critical"</span>   <span class="cm"># fraud arrest, ranking drop >10 places</span>
    WARNING  = <span class="str">"warning"</span>    <span class="cm"># budget under-utilisation, ranking drop</span>
    INFO     = <span class="str">"info"</span>       <span class="cm"># new policy, promise fulfilled</span>
    POSITIVE = <span class="str">"positive"</span>   <span class="cm"># ranking improvement, target met</span>

<span class="dec">ALERT_RULES</span> = [
    {
        <span class="str">"name"</span>:     <span class="str">"fraud_new_arrest"</span>,
        <span class="str">"table"</span>:    <span class="str">"fraud_cases"</span>,
        <span class="str">"condition"</span>:<span class="str">"NEW.court_status = 'ARREST'"</span>,
        <span class="str">"severity"</span>: AlertSeverity.CRITICAL,
        <span class="str">"template"</span>: <span class="str">"{agency} arrests in {case_name} — ₹{amount_crore} Cr case"</span>,
        <span class="str">"channels"</span>: [<span class="str">"push"</span>, <span class="str">"email_daily"</span>, <span class="str">"rss"</span>, <span class="str">"webhook"</span>],
    },
    {
        <span class="str">"name"</span>:     <span class="str">"ranking_drop_major"</span>,
        <span class="str">"table"</span>:    <span class="str">"intl_metrics"</span>,
        <span class="str">"condition"</span>:<span class="str">"NEW.delta_prev_yr < -5"</span>,
        <span class="str">"severity"</span>: AlertSeverity.CRITICAL,
        <span class="str">"template"</span>: <span class="str">"India falls {delta} places in {index_name} — now {rank}"</span>,
        <span class="str">"channels"</span>: [<span class="str">"push"</span>, <span class="str">"email_daily"</span>, <span class="str">"rss"</span>],
    },
    {
        <span class="str">"name"</span>:     <span class="str">"budget_utilisation_low"</span>,
        <span class="str">"table"</span>:    <span class="str">"budget_utilisation"</span>,
        <span class="str">"condition"</span>:<span class="str">"NEW.utilisation_pct < 65 AND NEW.quarter = 'Q3'"</span>,
        <span class="str">"severity"</span>: AlertSeverity.WARNING,
        <span class="str">"template"</span>: <span class="str">"{ministry} at {pct}% utilisation Q3 — risk of March rush"</span>,
        <span class="str">"channels"</span>: [<span class="str">"email_daily"</span>, <span class="str">"rss"</span>],
    },
    {
        <span class="str">"name"</span>:     <span class="str">"promise_fulfilled"</span>,
        <span class="str">"table"</span>:    <span class="str">"promises"</span>,
        <span class="str">"condition"</span>:<span class="str">"NEW.status = 'FULFILLED' AND OLD.status != 'FULFILLED'"</span>,
        <span class="str">"severity"</span>: AlertSeverity.POSITIVE,
        <span class="str">"template"</span>: <span class="str">"{party} promise fulfilled: {promise_text}"</span>,
        <span class="str">"channels"</span>: [<span class="str">"push"</span>, <span class="str">"rss"</span>],
    },
]

<span class="kw">async def</span> <span class="fn">evaluate_and_fire</span>(table: str, new_record: dict, old_record: dict | <span class="kw">None</span>):
    <span class="kw">for</span> rule <span class="kw">in</span> <span class="dec">ALERT_RULES</span>:
        <span class="kw">if</span> rule[<span class="str">"table"</span>] != table:
            <span class="kw">continue</span>
        <span class="kw">if</span> evaluate_condition(rule[<span class="str">"condition"</span>], new_record, old_record):
            message = rule[<span class="str">"template"</span>].format(**new_record)
            <span class="kw">await</span> dispatch_alert(
                severity=rule[<span class="str">"severity"</span>],
                message=message,
                source_url=new_record.get(<span class="str">"source_url"</span>),
                channels=rule[<span class="str">"channels"</span>],
            )`}</Code>

      <SH title="Delivery Channels" />
      <Code>{`<span class="cm"># opposition/alerts/delivery.py</span>
<span class="kw">async def</span> <span class="fn">dispatch_alert</span>(severity, message, source_url, channels):

    <span class="cm"># ── Push notifications (web push via VAPID) ──</span>
    <span class="kw">if</span> <span class="str">"push"</span> <span class="kw">in</span> channels:
        subscribers = <span class="kw">await</span> get_push_subscribers(severity)
        <span class="kw">for</span> sub <span class="kw">in</span> subscribers:
            <span class="kw">await</span> webpush(
                subscription_info=sub,
                data=json.dumps({<span class="str">"title"</span>: <span class="str">"OPPOSITION Alert"</span>, <span class="str">"body"</span>: message}),
                vapid_private_key=<span class="dec">VAPID_PRIVATE_KEY</span>,
                vapid_claims={<span class="str">"sub"</span>: <span class="str">"mailto:alerts@opposition.in"</span>}
            )

    <span class="cm"># ── Email (batched into daily/weekly digest) ──</span>
    <span class="kw">if</span> <span class="str">"email_daily"</span> <span class="kw">in</span> channels:
        <span class="kw">await</span> db.execute(<span class="str">"""
            INSERT INTO alert_digest_queue (severity, message, source_url, created_at)
            VALUES ($1, $2, $3, NOW())
        """</span>, severity, message, source_url)
        <span class="cm"># Celery beat sends digest at 8 AM IST daily</span>

    <span class="cm"># ── RSS feed (public, open) ──</span>
    <span class="kw">if</span> <span class="str">"rss"</span> <span class="kw">in</span> channels:
        <span class="kw">await</span> db.execute(<span class="str">"""
            INSERT INTO rss_items (title, description, link, pub_date, category)
            VALUES ($1, $2, $3, NOW(), $4)
        """</span>, f<span class="str">"[{severity.upper()}] {message}"</span>, message, source_url, severity)

    <span class="cm"># ── Webhook delivery (premium API subscribers) ──</span>
    <span class="kw">if</span> <span class="str">"webhook"</span> <span class="kw">in</span> channels:
        endpoints = <span class="kw">await</span> get_webhook_endpoints(severity)
        payload = {<span class="str">"severity"</span>: severity, <span class="str">"message"</span>: message, <span class="str">"source"</span>: source_url}
        <span class="kw">async for</span> ep <span class="kw">in</span> endpoints:
            <span class="kw">await</span> deliver_webhook(ep[<span class="str">"url"</span>], payload, ep[<span class="str">"secret"</span>])`}</Code>
    </div>
  );
}

function Monitoring() {
  return (
    <div className="content fu">
      <InfoBox color={T.cyan} head="Observability Stack">
        A civic platform under potential adversarial pressure (blocking, DDoS, legal) needs observability beyond standard uptime monitoring. We track scraper health, data freshness SLAs, source availability, and editorial queue depth as first-class metrics.
      </InfoBox>

      <SH title="Health Metrics Dashboard (Grafana)" />
      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th>Metric</th><th>Target</th><th>Alert Threshold</th><th>Source</th></tr></thead>
          <tbody>
            {[
              ["Scraper success rate","≥ 97%","< 90% over 1 hour","Prometheus / Prefect"],
              ["PIB RSS freshness","< 2 hours old","Alert if > 3 hours","Custom metric"],
              ["CBI/ED press releases lag","< 4 hours","Alert if > 6 hours","Last ingested_at"],
              ["Editorial queue depth","< 20 pending items","Alert if > 50","DB query"],
              ["DB write latency (p99)","< 200ms","Alert if > 500ms","Prometheus"],
              ["API response time (p95)","< 300ms","Alert if > 800ms","Prometheus"],
              ["Elasticsearch index lag","< 30 seconds","Alert if > 5 minutes","ES metrics"],
              ["R2 storage availability","99.9%","Any outage","Cloudflare API"],
              ["Source link freshness","Monthly check","Alert if > 5% dead links","Link checker job"],
              ["Fraud case status staleness","< 30 days","Alert if any case > 60 days unupdated","DB query"],
            ].map(([m,t,a,s]) => (
              <tr key={m}>
                <td className="tw" style={{ fontSize:11 }}>{m}</td>
                <td style={{ color:T.green, fontSize:11 }}>{t}</td>
                <td style={{ color:T.amber, fontSize:10 }}>{a}</td>
                <td style={{ color:T.muted, fontSize:10 }}>{s}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SH title="Disaster Recovery — Source Blocking" />
      <Code>{`<span class="cm"># opposition/resilience/source_monitor.py</span>
<span class="cm"># Government portals WILL block scrapers eventually.
# This module detects blocking and triggers fallback strategies.</span>

<span class="kw">class</span> <span class="fn">BlockDetector</span>:
    <span class="dec">BLOCK_SIGNALS</span> = [
        <span class="kw">lambda</span> r: r.status_code <span class="kw">in</span> (<span class="num">403</span>, <span class="num">429</span>, <span class="num">503</span>),
        <span class="kw">lambda</span> r: <span class="str">"cloudflare"</span> <span class="kw">in</span> r.text.lower() <span class="kw">and</span> r.status_code == <span class="num">403</span>,
        <span class="kw">lambda</span> r: <span class="str">"access denied"</span> <span class="kw">in</span> r.text.lower(),
        <span class="kw">lambda</span> r: <span class="str">"captcha"</span> <span class="kw">in</span> r.text.lower(),
        <span class="kw">lambda</span> r: len(r.content) < <span class="num">500</span>,  <span class="cm"># suspiciously small response</span>
    ]

    <span class="kw">def</span> <span class="fn">is_blocked</span>(self, response) -> bool:
        <span class="kw">return any</span>(signal(response) <span class="kw">for</span> signal <span class="kw">in</span> self.<span class="dec">BLOCK_SIGNALS</span>)

<span class="kw">async def</span> <span class="fn">handle_block</span>(source: str, url: str):
    <span class="kw">await</span> alert_team(<span class="str">f"BLOCKED: {source} at {url}"</span>)

    <span class="cm"># Fallback strategy per source:</span>
    <span class="kw">if</span> source == <span class="str">"indiabudget.gov.in"</span>:
        <span class="cm"># Budget PDFs are also mirrored by PRS, ADR, and press</span>
        <span class="kw">return</span> <span class="kw">await</span> fetch_from_prs_mirror(url)

    <span class="kw">if</span> source == <span class="str">"cbi.gov.in"</span>:
        <span class="cm"># CBI news also covered by PIB and IANS wire</span>
        <span class="kw">return</span> <span class="kw">await</span> poll_news_wires(<span class="str">"CBI"</span>)

    <span class="kw">if</span> source == <span class="str">"sansad.in"</span>:
        <span class="cm"># Parliament Q&A available via PRS and media archives</span>
        <span class="kw">return</span> <span class="kw">await</span> fetch_prs_parliament_data()

    <span class="cm"># Generic: switch to residential proxy pool for 24h</span>
    <span class="kw">await</span> enable_proxy_mode(source, duration_hours=<span class="num">24</span>)

<span class="cm"># ── Data freshness SLA monitor ──────────────────────────────────</span>
<span class="kw">async def</span> <span class="fn">check_freshness_slas</span>(db):
    <span class="dec">SLAS</span> = [
        (<span class="str">"CBI press releases"</span>, <span class="str">"fraud_cases"</span>,   <span class="str">"4 hours"</span>),
        (<span class="str">"PIB releases"</span>,       <span class="str">"statements"</span>,   <span class="str">"2 hours"</span>),
        (<span class="str">"CGA monthly"</span>,        <span class="str">"spending_data"</span>, <span class="str">"3 days"</span>),
        (<span class="str">"Intl rankings"</span>,      <span class="str">"intl_metrics"</span>, <span class="str">"7 days"</span>),
    ]
    <span class="kw">for</span> name, table, sla <span class="kw">in</span> <span class="dec">SLAS</span>:
        row = <span class="kw">await</span> db.fetchrow(<span class="str">f"""
            SELECT MAX(created_at) as last_updated
            FROM {table}
        """</span>)
        age = datetime.now(tz=utc) - row[<span class="str">"last_updated"</span>]
        <span class="kw">if</span> age > timedelta_from_str(sla):
            <span class="kw">await</span> alert_team(<span class="str">f"SLA BREACH: {name} last updated {age} ago"</span>)`}</Code>

      <SH title="Deployment Architecture" />
      <Code>{`<span class="cm"># docker-compose.prod.yml (simplified)</span>
services:
  <span class="fn">api</span>:          <span class="cm"># FastAPI — 2 replicas</span>
    image: opposition/api:<span class="str">"${TAG}"</span>
    replicas: <span class="num">2</span>
    env_file: .env.prod

  <span class="fn">worker</span>:       <span class="cm"># Celery — handles alerts, email, re-indexing</span>
    image: opposition/worker:<span class="str">"${TAG}"</span>
    command: celery -A opposition.worker worker -c <span class="num">4</span>

  <span class="fn">scheduler</span>:    <span class="cm"># Prefect agent — runs all scraper flows</span>
    image: opposition/scheduler:<span class="str">"${TAG}"</span>
    command: prefect agent start -q opposition-scrapers

  <span class="fn">postgres</span>:
    image: timescale/timescaledb:<span class="str">"2.13-pg16"</span>
    volumes: [<span class="str">"pgdata:/var/lib/postgresql/data"</span>]

  <span class="fn">redis</span>:
    image: redis:<span class="str">"7-alpine"</span>

  <span class="fn">elasticsearch</span>:
    image: elasticsearch:<span class="str">"8.12.0"</span>
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false

<span class="cm"># All deployed on Hetzner Cloud (Germany) — outside Indian jurisdiction
# Cloudflare sits in front — origin IP never exposed
# Nightly DB backup → Backblaze B2 (Germany region)</span>`}</Code>
    </div>
  );
}

/* ── VIEWS MAP ───────────────────────────────────────────────── */
const VIEWS = {
  overview: Overview, sources: Sources, scrapers: Scrapers,
  pipeline: Pipeline, extraction: Extraction, validation: Validation,
  database: Database, editorial: Editorial, alerting: Alerting,
  monitoring: Monitoring,
};

/* ── APP ─────────────────────────────────────────────────────── */
export default function App() {
  const [view, setView] = useState("overview");
  const [drawer, setDrawer] = useState(false);
  const nav = NAV.find(n => n.id === view) || NAV[0];
  const View = VIEWS[view] || Overview;

  const go = (id) => { setView(id); setDrawer(false); };

  function NavList() {
    return (
      <>
        <p className="sb-section">Pipeline Docs</p>
        {NAV.map(n => (
          <button key={n.id}
            className={`sb-btn${view === n.id ? " on" : ""}`}
            style={{ "--c": n.color, "--c-faint": n.color + "22" }}
            onClick={() => go(n.id)}>
            <span className="sb-icon">{n.icon}</span>
            <span className="sb-label">{n.label}</span>
          </button>
        ))}
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="root">

        {/* Header */}
        <header className="hdr">
          <div className="hdr-logo">◉</div>
          <div>
            <div className="hdr-title">OPPOSITION — Data Pipeline Architecture</div>
            <div className="hdr-sub">Web Scraping · Extraction · Validation · Database Loading · Monitoring</div>
          </div>
          <button className="hbtn" onClick={() => setDrawer(true)}>☰ Docs</button>
          <div className="hdr-badge">TECHNICAL SPEC</div>
        </header>

        {/* Drawer */}
        <div className={`drawer-mask${drawer ? " open" : ""}`} onClick={() => setDrawer(false)}>
          <nav className="drawer-panel" onClick={e => e.stopPropagation()}>
            <div className="drawer-top">
              <span style={{ color: T.saffron, fontFamily: T.serif, fontWeight: 700, fontSize: 14 }}>◉ Pipeline Docs</span>
              <button className="drawer-x" onClick={() => setDrawer(false)}>×</button>
            </div>
            <div className="drawer-inner"><NavList /></div>
          </nav>
        </div>

        {/* Body */}
        <div className="body">
          <aside className="sidebar"><div className="sb-inner"><NavList /></div></aside>

          <main className="main">
            <div className="main-bar" style={{ "--bc": nav.color }}>
              <div className="main-bar-icon">{nav.icon}</div>
              <div>
                <div className="main-bar-title">{nav.label}</div>
                <div className="main-bar-sub">OPPOSITION · Data Engineering · Python 3.12 · PostgreSQL 16 · Prefect 3</div>
              </div>
            </div>
            <View key={view} />
          </main>
        </div>

        {/* Mobile bottom nav */}
        <nav className="bnav">
          {NAV.slice(0, 8).map(n => (
            <button key={n.id}
              className={`bnav-btn${view === n.id ? " on" : ""}`}
              style={{ "--c": n.color }}
              onClick={() => setView(n.id)}>
              <span className="bnav-icon" style={{ color: view === n.id ? n.color : T.muted }}>{n.icon}</span>
              <span className="bnav-label">{n.short}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <footer className="footer">
          <span className="footer-text">◉ OPPOSITION</span>
          <span className="footer-text" style={{ color: T.faint }}>·</span>
          <span className="footer-text">Data Pipeline Architecture · Python 3.12 · Prefect 3 · PostgreSQL 16 + TimescaleDB · Elasticsearch 8 · Cloudflare R2</span>
          <span style={{ marginLeft:"auto", fontSize:10, color: T.faint, fontFamily: T.mono }}>v1.0 · May 2026</span>
        </footer>
      </div>
    </>
  );
}
