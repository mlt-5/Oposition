import { useState, useEffect, useRef } from "react";

/* ─── DESIGN TOKENS ──────────────────────────────────────────────── */
const T = {
  ink:      "#0e0e14",
  ink2:     "#1a1a2e",
  ink3:     "#252540",
  muted:    "#6b7280",
  dim:      "#9ca3af",
  border:   "#2d2d4e",
  paper:    "#f7f6f2",
  paper2:   "#eeecea",
  white:    "#ffffff",
  saffron:  "#FF9933",
  saffronD: "#e07a1a",
  red:      "#E8472A",
  green:    "#16a34a",
  amber:    "#d97706",
  blue:     "#2563EB",
  violet:   "#7C3AED",
  indigo:   "#4338CA",
};

/* ─── GLOBAL STYLES ──────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Source+Sans+3:wght@300;400;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; overflow: hidden; }
  body { background: ${T.ink}; font-family: 'Source Sans 3', sans-serif; -webkit-font-smoothing: antialiased; }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: ${T.muted}; }

  .opp-root { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }

  /* ── HEADER ── */
  .opp-header {
    flex-shrink: 0;
    background: ${T.ink2};
    border-bottom: 2px solid ${T.saffron};
    display: flex; align-items: center; gap: 12px;
    padding: 0 16px;
    height: 56px;
    position: relative; z-index: 50;
  }
  .opp-logo-ring {
    width: 36px; height: 36px; border-radius: 50%;
    background: ${T.saffron}; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; color: ${T.ink}; font-weight: 900; line-height:1;
  }
  .opp-brand { flex: 1; min-width: 0; }
  .opp-brand-name {
    font-family: 'Playfair Display', serif;
    font-weight: 700; font-size: 15px;
    color: ${T.saffron}; letter-spacing: 1.5px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .opp-brand-sub { font-size: 9px; color: ${T.muted}; letter-spacing: 1px; display: none; }
  .opp-badge {
    background: ${T.red}; color: #fff;
    font-size: 9px; font-weight: 700; letter-spacing: 1.5px;
    padding: 3px 8px; border-radius: 3px; white-space: nowrap; flex-shrink: 0;
  }
  .opp-hamburger {
    background: rgba(255,153,51,0.1); border: 1px solid rgba(255,153,51,0.25);
    color: ${T.saffron}; border-radius: 6px; padding: 7px 10px;
    cursor: pointer; font-size: 13px; font-weight: 600;
    display: flex; align-items: center; gap: 6px;
    flex-shrink: 0; transition: background 0.15s;
  }
  .opp-hamburger:hover { background: rgba(255,153,51,0.2); }

  /* ── BODY SHELL ── */
  .opp-body { display: flex; flex: 1; min-height: 0; overflow: hidden; }

  /* ── SIDEBAR ── */
  .opp-sidebar {
    width: 260px; flex-shrink: 0;
    background: ${T.ink2};
    border-right: 1px solid ${T.border};
    display: none; flex-direction: column;
    overflow: hidden;
  }
  .opp-sidebar-inner { flex: 1; overflow-y: auto; padding: 12px 0 80px; }
  .opp-sidebar-label {
    padding: 8px 18px 6px;
    font-size: 9px; font-weight: 700; letter-spacing: 2.5px;
    color: ${T.muted}; text-transform: uppercase;
  }
  .opp-nav-item {
    width: 100%; background: transparent; border: none;
    border-left: 3px solid transparent;
    padding: 10px 18px; cursor: pointer;
    display: flex; align-items: flex-start; gap: 11px;
    text-align: left; transition: all 0.15s;
  }
  .opp-nav-item:hover { background: rgba(255,255,255,0.04); }
  .opp-nav-item.active {
    background: rgba(255,153,51,0.1);
    border-left-color: var(--doc-color, ${T.saffron});
  }
  .opp-nav-icon { font-size: 15px; margin-top: 1px; flex-shrink: 0; }
  .opp-nav-code { font-size: 8px; letter-spacing: 1.5px; color: ${T.muted}; margin-bottom: 2px; }
  .opp-nav-title {
    font-size: 12px; line-height: 1.4;
    color: ${T.dim}; font-weight: 400;
  }
  .opp-nav-item.active .opp-nav-title { color: #fff; font-weight: 600; }
  .opp-sidebar-legend {
    padding: 12px 18px;
    border-top: 1px solid ${T.border};
    flex-shrink: 0;
  }
  .opp-legend-title { font-size: 9px; letter-spacing: 2px; color: ${T.muted}; margin-bottom: 8px; }
  .opp-legend-row { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; font-size: 11px; color: ${T.muted}; }

  /* ── DRAWER ── */
  .opp-drawer-mask {
    display: none; position: fixed; inset: 0;
    background: rgba(0,0,0,0.75); z-index: 200;
    backdrop-filter: blur(2px);
  }
  .opp-drawer-mask.open { display: block; }
  .opp-drawer-panel {
    position: absolute; left: 0; top: 0; bottom: 0; width: 280px;
    background: ${T.ink2}; overflow-y: auto;
    display: flex; flex-direction: column;
    transform: translateX(-100%);
    transition: transform 0.25s cubic-bezier(.4,0,.2,1);
  }
  .opp-drawer-mask.open .opp-drawer-panel { transform: translateX(0); }
  .opp-drawer-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 18px; border-bottom: 1px solid ${T.border}; flex-shrink: 0;
  }
  .opp-drawer-close {
    background: rgba(255,255,255,0.08); border: none; color: ${T.dim};
    border-radius: 50%; width: 28px; height: 28px; cursor: pointer; font-size: 16px;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s;
  }
  .opp-drawer-close:hover { background: rgba(255,255,255,0.15); color: #fff; }
  .opp-drawer-inner { flex: 1; overflow-y: auto; padding: 8px 0 24px; }

  /* ── MAIN CONTENT ── */
  .opp-main { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: hidden; }

  /* Doc header bar */
  .opp-doc-bar {
    flex-shrink: 0; background: ${T.paper};
    border-bottom: 2px solid ${T.paper2};
    padding: 14px 18px;
    display: flex; align-items: center; gap: 12px;
  }
  .opp-doc-icon { font-size: 22px; flex-shrink: 0; }
  .opp-doc-meta { flex: 1; min-width: 0; }
  .opp-doc-code { font-size: 9px; letter-spacing: 2.5px; font-weight: 700; color: ${T.muted}; margin-bottom: 3px; }
  .opp-doc-title {
    font-family: 'Playfair Display', serif;
    font-weight: 700; font-size: 17px; color: ${T.ink};
    line-height: 1.25; margin: 0;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .opp-doc-count {
    font-size: 11px; color: ${T.muted}; flex-shrink: 0;
    background: ${T.paper2}; padding: 3px 8px; border-radius: 12px;
  }

  /* Scrollable content area */
  .opp-content { flex: 1; overflow-y: auto; padding: 16px; background: ${T.paper}; }

  /* ── SECTION CARDS ── */
  .opp-card {
    background: ${T.white}; border: 1px solid #e2e1dd;
    border-radius: 10px; margin-bottom: 12px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    transition: box-shadow 0.2s;
  }
  .opp-card:hover { box-shadow: 0 3px 12px rgba(0,0,0,0.1); }
  .opp-card-header {
    width: 100%; padding: 14px 16px;
    background: #fcfbf9; border: none; cursor: pointer;
    display: flex; align-items: center; gap: 11px;
    text-align: left; transition: background 0.15s;
  }
  .opp-card-header:hover { background: #f5f4f0; }
  .opp-card-header.open { border-bottom: 2px solid var(--doc-color); background: #f9f8f5; }
  .opp-card-num {
    width: 26px; height: 26px; border-radius: 5px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: #fff;
    background: var(--doc-color);
  }
  .opp-card-heading {
    flex: 1; min-width: 0;
    font-family: 'Playfair Display', serif;
    font-size: 13.5px; font-weight: 600; color: ${T.ink};
    line-height: 1.35;
  }
  .opp-card-toggle {
    font-size: 20px; color: ${T.muted}; flex-shrink: 0; line-height: 1;
    transition: transform 0.2s;
  }
  .opp-card-header.open .opp-card-toggle { transform: rotate(45deg); }
  .opp-card-body { padding: 16px 18px 14px; }

  /* ── BODY TEXT RENDERING ── */
  .body-p { font-size: 13.5px; color: #374151; line-height: 1.75; margin-bottom: 8px; }
  .body-p:last-child { margin-bottom: 0; }
  .body-strong { font-weight: 700; color: ${T.ink}; }
  .body-em { font-style: italic; }
  .body-code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px; background: #f0eeea;
    padding: 1px 5px; border-radius: 3px; color: #c0392b;
  }
  .body-pre {
    font-family: 'JetBrains Mono', monospace;
    background: #0d1117; color: #e6edf3;
    border: 1px solid #30363d; border-radius: 8px;
    padding: 14px 16px; overflow-x: auto;
    font-size: 11.5px; line-height: 1.65;
    margin: 10px 0;
  }
  .body-ul { margin: 8px 0 8px 20px; }
  .body-ol { margin: 8px 0 8px 20px; }
  .body-li { font-size: 13.5px; color: #374151; line-height: 1.7; margin-bottom: 5px; }
  .body-checklist { margin: 8px 0; list-style: none; padding: 0; }
  .body-check-item {
    display: flex; align-items: flex-start; gap: 8px;
    margin-bottom: 6px; font-size: 13px; color: #374151;
  }
  .body-check-icon { margin-top: 2px; font-size: 14px; flex-shrink: 0; }
  .body-section-head { font-weight: 700; color: ${T.ink}; font-size: 13px; margin: 10px 0 4px; }
  .body-table-wrap { overflow-x: auto; margin: 12px 0; border-radius: 6px; border: 1px solid #e2e1dd; }
  .body-table { width: 100%; border-collapse: collapse; font-size: 12.5px; min-width: 400px; }
  .body-table th {
    background: ${T.ink}; color: ${T.saffron};
    padding: 9px 12px; text-align: left; font-weight: 700;
    font-size: 11px; letter-spacing: 0.5px; white-space: nowrap;
  }
  .body-table td {
    padding: 8px 12px; border-bottom: 1px solid #eee;
    color: #374151; vertical-align: top; line-height: 1.5;
  }
  .body-table tr:last-child td { border-bottom: none; }
  .body-table tr:nth-child(even) td { background: #fafaf8; }
  .body-blockquote {
    border-left: 3px solid var(--doc-color, ${T.saffron});
    margin: 10px 0; padding: 10px 14px;
    background: #fafaf8; border-radius: 0 6px 6px 0;
    font-size: 13px; color: #4b5563; font-style: italic;
    line-height: 1.65;
  }
  .spacer { height: 8px; }

  /* ── MOBILE BOTTOM NAV ── */
  .opp-bottom-nav {
    display: flex; background: ${T.ink2};
    border-top: 1px solid ${T.border};
    flex-shrink: 0; height: 56px; overflow-x: auto;
    scrollbar-width: none;
  }
  .opp-bottom-nav::-webkit-scrollbar { display: none; }
  .opp-bottom-btn {
    flex: 1; min-width: 56px; max-width: 80px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 3px; background: transparent; border: none; cursor: pointer;
    padding: 6px 4px; border-top: 2px solid transparent;
    transition: all 0.15s;
  }
  .opp-bottom-btn.active { border-top-color: var(--doc-color, ${T.saffron}); }
  .opp-bottom-btn-icon { font-size: 14px; line-height: 1; }
  .opp-bottom-btn-label { font-size: 7.5px; color: ${T.muted}; letter-spacing: 0.5px; text-align: center; line-height: 1.2; }
  .opp-bottom-btn.active .opp-bottom-btn-label { color: var(--doc-color, ${T.saffron}); }

  /* ── FOOTER ── */
  .opp-footer {
    display: none; flex-shrink: 0;
    background: ${T.ink2}; border-top: 1px solid ${T.border};
    padding: 8px 20px; align-items: center; gap: 12px; flex-wrap: wrap;
  }
  .opp-footer-brand { font-family: 'Playfair Display', serif; color: ${T.saffron}; font-size: 12px; }
  .opp-footer-text { color: ${T.muted}; font-size: 10px; }
  .opp-footer-tagline { margin-left: auto; color: ${T.muted}; font-size: 10px; font-style: italic; }

  /* ── STATUS CHIPS ── */
  .chip { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 12px; letter-spacing: 0.3px; }
  .chip-red { background: #fef2f2; color: ${T.red}; }
  .chip-green { background: #f0fdf4; color: ${T.green}; }
  .chip-amber { background: #fffbeb; color: ${T.amber}; }

  /* ── RESPONSIVE ── */
  @media (min-width: 768px) {
    .opp-header { padding: 0 24px; height: 60px; }
    .opp-brand-name { font-size: 17px; letter-spacing: 2px; }
    .opp-brand-sub { display: block; }
    .opp-hamburger { display: none !important; }
    .opp-sidebar { display: flex; }
    .opp-doc-bar { padding: 18px 28px; }
    .opp-doc-title { font-size: 20px; white-space: normal; }
    .opp-content { padding: 24px 28px; }
    .opp-card-header { padding: 16px 20px; }
    .opp-card-heading { font-size: 14.5px; }
    .opp-card-body { padding: 20px 22px 18px; }
    .body-p { font-size: 14px; }
    .body-li { font-size: 14px; }
    .opp-bottom-nav { display: none; }
    .opp-footer { display: flex; }
    .opp-logo-ring { width: 40px; height: 40px; font-size: 19px; }
    .opp-badge { font-size: 10px; }
  }
  @media (min-width: 1024px) {
    .opp-sidebar { width: 280px; }
    .opp-content { padding: 28px 36px; }
  }
  @media (max-width: 767px) {
    .opp-doc-title { font-size: 15px; }
    .opp-drawer-mask { display: none; }
    .opp-drawer-mask.open { display: block; }
  }

  /* ── ANIMATIONS ── */
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .opp-card { animation: fadeSlideIn 0.2s ease both; }
  .opp-card:nth-child(1) { animation-delay: 0ms; }
  .opp-card:nth-child(2) { animation-delay: 40ms; }
  .opp-card:nth-child(3) { animation-delay: 80ms; }
  .opp-card:nth-child(4) { animation-delay: 120ms; }
  .opp-card:nth-child(5) { animation-delay: 160ms; }
  .opp-card:nth-child(6) { animation-delay: 200ms; }

  @keyframes bodyReveal {
    from { opacity: 0; max-height: 0; }
    to   { opacity: 1; max-height: 9999px; }
  }
  .opp-card-body { animation: bodyReveal 0.25s ease both; }

  /* ── PROGRESS BAR (top of page) ── */
  .opp-progress {
    position: absolute; top: 0; left: 0; height: 2px;
    background: linear-gradient(90deg, ${T.saffron}, ${T.red});
    transition: width 0.3s ease; pointer-events: none; z-index: 60;
  }
`;

/* ─── DOCS DATA ──────────────────────────────────────────────────── */
const DOCS = [
  {
    id: "vision", code: "DOC-01", icon: "◉", color: T.red,
    title: "Vision & Mission",
    shortTitle: "Vision",
    sections: [
      { h: "Product Name & Identity", b: `**Product Name:** OPPOSITION (विपक्ष)\n**Tagline:** "Ye Desh Ka Hisaab Hai" — This Is The Nation's Account\n**Nature:** Civic transparency web application — India-specific, non-partisan, evidence-driven.\n\nThe name is intentional. Opposition in a democracy is not a party — it is the citizen. Every taxpayer, every voter is the permanent opposition. This platform gives them the data to exercise that role.` },
      { h: "The Problem We Solve", b: `India is the world's largest democracy with 970 million+ registered voters, yet citizens have almost no unified, real-time, verified interface to hold their government accountable.\n\n**The gaps today:**\n- Budget data exists on indiabudget.gov.in but is raw PDFs with zero visualization or tracking\n- Political party funding was opaque (Electoral Bonds struck down 2024 by SC) and is still largely obscure\n- Government promise tracking is done by a handful of NGOs (Informed Voter Project, PRS) but not at scale\n- International rankings (India is 151st in Press Freedom 2025, 132nd in HDI 2025, 102nd in Global Hunger Index 2025) are never presented in a single dashboard\n- Scam/fraud tracking is scattered across ED press releases, CBI FIRs, and news archives\n- Fact-checking is fragmented across AFWA, Boom, AltNews — never aggregated into a government statement record\n\n**The result:** Citizens are data-poor in a country that generates enormous public data.` },
      { h: "Our Mission", b: `To build the most comprehensive, non-partisan, evidence-backed civic accountability platform India has ever seen — giving every citizen the same quality of governance data that policy researchers, journalists, and institutional investors currently pay thousands of rupees to access.\n\n**We track the negative. We record the positive. We do not editorialize.**\n\nEvery data point has a source. Every claim is cited. Every rating has a methodology. We are not a media house. We are a data infrastructure for Indian democracy.` },
      { h: "Core Principles", b: `1. **Source Supremacy** — Every single data point must be traceable to an official government source, a recognized international body, or a verified reputed media outlet. No anonymous sourcing.\n\n2. **Party Agnosticism** — We track every party with Parliamentary representation equally. BJP, INC, AAP, TMC, SP, BSP, CPI(M), NCP, DMK — all on the same standard.\n\n3. **Negative First, Positive Recorded** — Our interface leads with failure, shortfall, and controversy. But a dedicated "+ve Record" section logs achievements, fulfilled promises, and positive rankings. We show the full picture; the framing leads with accountability.\n\n4. **No Editorializing** — We present data. We provide context. We cite sources. We do not write opinion. The citizen draws conclusions.\n\n5. **Legal Defensibility First** — Every content decision is made with the IT Act 2000, IT Rules 2021, DPDP Act 2023, IPC 499-500 (defamation), and BNS 2023 in view. When in doubt, we cite and attribute rather than assert.\n\n6. **Radical Transparency About Ourselves** — Our own funding sources, editorial team, methodology, and data update frequency are fully public.` },
      { h: "Success Metrics (Year 1)", b: `- 500,000 monthly active users within 12 months of launch\n- Coverage: All 9 modules live at launch with Central Government data\n- Data freshness: Budget/spending data updated within 48 hours of government release\n- International metrics: 25+ indices tracked with historical trend data\n- Fraud tracker: 200+ documented cases with status, amount, and agency tracking\n- Promise tracker: All manifesto promises from 2019 and 2024 general elections tracked\n- Zero successful legal takedowns — every piece of content fully attributable to public sources` },
    ]
  },
  {
    id: "personas", code: "DOC-02", icon: "◈", color: T.blue,
    title: "User Personas & Journey Maps",
    shortTitle: "Personas",
    sections: [
      { h: "Persona 1: The Informed Voter — Rahul, 28, Pune", b: `**Background:** Software engineer. Votes in every election. Reads news but feels overwhelmed by partisan framing. Wants raw facts.\n\n**Goals:** Understand what the budget actually allocates to education vs defence. See if the PM's 5 crore jobs promise was met. Share a data point on Twitter when arguing with relatives.\n\n**Pain Points:** Can't navigate 1,000-page budget PDFs. Doesn't know which fact-checkers to trust. News is sensationalized.\n\n**Journey:**\n1. Lands on homepage from a tweet → sees Breaking: ₹2.4 lakh crore defence vs ₹1.28 lakh crore education\n2. Explores Budget Tracker → drills from Ministry → Scheme → Line Item\n3. Finds the Promise Tracker → shares "only 23% of 2024 manifesto promises fulfilled" card on social media\n4. Returns weekly for the India Rankings Dashboard update\n\n**Key Feature Needed:** One-click shareable data cards with source attribution baked in.` },
      { h: "Persona 2: The Journalist — Priya, 34, Delhi", b: `**Background:** Senior reporter at a national English daily. Covers Parliament and economic policy. Constantly under deadline pressure. Needs verified data fast.\n\n**Goals:** Cross-check government claims in real time during press conferences. Find historical spending data for investigative pieces. Get alerts when new fraud cases are filed.\n\n**Pain Points:** Switching between 15 different government portals. Data in PDFs that take hours to parse. No single source for international rankings.\n\n**Journey:**\n1. Gets API access (premium tier) → integrates OPPOSITION data into her workflow\n2. During a budget speech, live-checks allocation vs previous year in real time\n3. Gets an ED attachment alert → immediately accesses the fraud case page with full CBI/ED source links\n4. Uses the Statement Tracker to find the original quote when a minister "clarifies" a claim\n\n**Key Feature Needed:** API access, real-time alerts, downloadable data in CSV/JSON.` },
      { h: "Persona 3: The Student Activist — Aisha, 21, Hyderabad", b: `**Background:** Political science student. Involved in campus activism. Wants to understand systemic issues, not just current events.\n\n**Goals:** Track how India's HDI rank has changed over a decade. Understand the pattern of exam paper leaks. See party-wise funding data to understand political economy.\n\n**Pain Points:** Academic papers are paywalled. Government portals are confusing. Information is not contextualised.\n\n**Journey:**\n1. Uses the International Metrics Tracker → builds a mental model of India's position\n2. Explores the Corruption & Fraud Timeline → finds pattern of bank frauds\n3. Uses the Party Spending Tracker → sees the funding asymmetry between BJP and INC\n4. Downloads data for a research paper\n\n**Key Feature Needed:** Historical trend charts, downloadable datasets, clear methodology documentation.` },
      { h: "Persona 4: The NRI Diaspora — Vikram, 42, London", b: `**Background:** Finance professional. Sends money home. Has family in Rajasthan. Deeply invested in India's trajectory but disconnected from ground reality.\n\n**Goals:** Get a clean dashboard view of India's economic health. Track governance quality. Understand where his tax money (when visiting India) goes.\n\n**Pain Points:** English-language media is either too partisan or too shallow. Can't navigate Hindi government sites. Time zone means missing real-time news.\n\n**Journey:**\n1. Bookmarks the India Rankings Dashboard as his weekly India pulse check\n2. Uses the Budget Tracker to understand the fiscal deficit trend\n3. Sets up email digest for weekly governance summary\n\n**Key Feature Needed:** Clean summary dashboard, weekly digest newsletter, mobile-responsive for on-the-go reading.` },
      { h: "Persona 5: Research Institution — Centre for Policy Research, Delhi", b: `**Background:** Policy think-tank with 50+ researchers. Currently pays for multiple data subscriptions. Needs reliable, citable data infrastructure.\n\n**Goals:** Access structured budget data across years. Cross-reference policy announcements with spending. Track implementation gaps.\n\n**Pain Points:** Data is inconsistent across government portals. No single API for governance data. Manual data cleaning takes enormous researcher time.\n\n**Journey:**\n1. Institutional API subscription → direct data feed for researchers\n2. Uses the Policy Tracker database for systematic policy analysis\n3. Cites OPPOSITION as a data source in publications (increasing platform credibility)\n\n**Key Feature Needed:** Institutional API tier, bulk data download, documented data schema, update logs.` },
    ]
  },
  {
    id: "modules", code: "DOC-03", icon: "⬡", color: T.green,
    title: "Module Specification",
    shortTitle: "Modules",
    sections: [
      { h: "MODULE 1: Union Budget Tracker", b: `**Primary Data Source:** indiabudget.gov.in, Controller General of Accounts (cga.nic.in), PRS Legislative Research\n\n**Coverage:** FY 2019-20 to FY 2026-27 (current year)\n\n**Data Hierarchy:**\n\`\`\`\nUnion Budget\n├── Revenue Receipts\n│   ├── Tax Revenue (Direct & Indirect)\n│   └── Non-Tax Revenue\n├── Capital Receipts\n│   ├── Borrowings & Other Liabilities\n│   └── Recovery of Loans\n└── Total Expenditure\n    ├── Central Sector Schemes (~35 major schemes)\n    │   └── [Scheme Name] → Allocated vs Revised vs Actual Spent\n    ├── Centrally Sponsored Schemes\n    │   └── [CSS Name] → State-wise disbursement where available\n    ├── Ministry-wise Breakdown (31 Ministries)\n    │   └── [Ministry] → Department → Scheme → Line Item\n    └── Fiscal Deficit Tracking\n        └── Target vs Actual vs % of GDP\n\`\`\`\n\n**Negative Flags System:**\n- 🔴 Red: Actual spending < 70% of allocation (under-utilization)\n- 🟡 Orange: Scheme discontinued mid-year without explanation\n- 🟡 Yellow: Reallocation from welfare to administration\n\n**Update Frequency:** Budget day (Feb 1) → BE; Revised Estimates (Dec); Actuals via CGA monthly statements` },
      { h: "MODULE 2: Government Spending Tracker", b: `**Primary Data Source:** Public Financial Management System (pfms.nic.in), Controller General of Accounts, CAG Reports\n\n**This is different from the Budget Tracker** — this tracks real-money-out-the-door vs. what was budgeted.\n\n**Sub-modules:**\n1. **Monthly Expenditure Dashboard** — CGA releases monthly accounts; we parse and visualize\n2. **PFMS Real-time Feed** — Public Financial Management System tracks actual fund releases to implementing agencies\n3. **CAG Audit Findings** — Comptroller and Auditor General reports; we track paragraphs flagging misuse, non-utilization, and diversions\n4. **Direct Benefit Transfer (DBT) Tracker** — ₹38 lakh crore transferred since inception; track scheme-wise leakage reduction claims vs independent verification\n5. **State Finance Commission Data** — Centre-to-State transfers under Finance Commission devolution\n\n**Negative Alert Categories:**\n- Funds parked in savings accounts earning interest (CAG flag)\n- Unspent balance returned to Consolidated Fund\n- Expenditure in Q4 March rush (quality concerns)\n- CAG adverse observations\n\n**Update Frequency:** Monthly (CGA data), Annual (CAG reports), Quarterly (PFMS summary)` },
      { h: "MODULE 3: Political Party Finance Tracker", b: `**Primary Data Source:** Election Commission of India (eci.gov.in); ADR (adrindia.org); Form 24A and 24B filings\n\n**Legal Context:** Post Electoral Bond SC verdict (Feb 15, 2024), funding reverted to Electoral Trusts and direct donations above ₹20,000 (mandatory disclosure).\n\n**Parties Tracked:** All parties with current Lok Sabha or Rajya Sabha seats — BJP, INC, AAP, TMC, SP, BSP, CPI(M), NCP(SP), NCP(AP), DMK, AIADMK, TDP, JDU, SHS, BJD, RJD, YSRCP, BRS, and others.\n\n**Data Points Per Party:**\n- Total donations received (FY-wise)\n- Donor-wise breakdown (for donations >₹20,000)\n- Electoral Trust receipts and disbursements\n- Expenditure: election vs party operations vs administration\n- Asset declarations (annual returns to ECI)\n- Income Tax exemption status\n\n**Negative Flags:**\n- Donations from companies with government contracts\n- Funding surge in election years without disclosed source\n- Mismatch between declared expenditure and EC submissions\n\n**Update Frequency:** Annual (ECI mandated filing by Sep 30 each year)` },
      { h: "MODULE 4: Government Policy Tracker", b: `**Primary Data Source:** PIB (pib.gov.in), MyScheme Portal, PM India website, Ministry-specific portals, PRS Legislative India\n\n**Scope:** All major Central Government policies, schemes, and Acts introduced/amended since 2014.\n\n**Data Structure Per Policy:**\n\`\`\`\nPolicy Card\n├── Name & Policy Code\n├── Ministry Responsible\n├── Date Announced / Date Notified\n├── Budget Allocation (linked to Module 1)\n├── Target Beneficiaries\n├── Stated Objectives (official language)\n├── Implementation Status\n│   ├── Active / Stalled / Discontinued / Modified\n│   └── Implementation Agency\n├── Progress Metrics\n│   ├── Official claims (source: PIB/Ministry)\n│   └── Independent verification (CAG/NGO/Academic)\n├── Controversy Log\n│   └── Challenges, protests, court orders\n└── Source Links (all primary)\n\`\`\`\n\n**Negative Alert Types:**\n- Policy announced but not notified (just PR)\n- Budget allocated but 0% utilization in Year 1\n- Policy discontinued without explanation\n- Official vs independent data divergence (e.g., official unemployment claim vs CMIE data)\n\n**Update Frequency:** Real-time for PIB announcements; quarterly for progress data` },
      { h: "MODULE 5: Fraud, Corruption & Scam Tracker", b: `**Primary Data Sources:** CBI (cbi.gov.in), ED (enforcementdirectorate.gov.in), CAG Reports, Lok Sabha/Rajya Sabha Questions, Supreme Court/High Court orders, ADR data\n\n**Categories of Cases:**\n1. **Bank/Financial Fraud** — PNB-Nirav Modi (₹14,356 Cr), IL&FS, Yes Bank, DHFL, PMC Bank, NBFC failures\n2. **Government Contract Fraud** — Overpricing, kickbacks, substandard work\n3. **MGNREGS/DBT Diversion** — Rural employment scheme fund leakage\n4. **Mining/Land Scams** — Coal block allocations, land acquisition irregularities\n5. **Exam Paper Leaks** — NEET 2024, SSC CGL, UPSC controversies, state PSC leaks\n6. **Political Corruption** — Hawala cases, assets disproportionate to income\n7. **Corporate-Political Nexus** — Post-electoral bond data linking donors to policy benefits\n\n**Legal Safeguard:** Every case entry is based only on official FIR, charge sheet, court order, or agency press release. We display "Accused" not "Guilty" until conviction. Acquittals are prominently updated.\n\n**Update Frequency:** Weekly scrape of CBI/ED press releases + SC cause list` },
      { h: "MODULE 6: Project & Promise Tracker", b: `**Primary Data Sources:** Election manifestos (BJP 2019, BJP 2024, INC 2024, AAP, others), PIB announcements, Ministry annual reports, Parliament Questions, Informed Voter Project research\n\n**A. Election Promise Tracker**\n- Catalogue all promises from 2019 and 2024 BJP manifesto (ruling party) + major opposition manifestos\n- Each promise gets: Status (Fulfilled / Partial / Not Started / Abandoned / In Progress), Evidence, Source\n- Progress indicator: 0-100% completion with methodology\n\n**B. Government Project Tracker (announced ≥ ₹500 Crore)**\n\`\`\`\nProject Card\n├── Project Name\n├── Ministry / Implementing Agency\n├── Announced Date\n├── Original Completion Date\n├── Current Status\n│   ├── On Time / Delayed / Cost Overrun / Stalled / Completed\n│   └── Current Estimated Completion\n├── Budget\n│   ├── Original Estimate\n│   ├── Revised Estimate (with % increase)\n│   └── Spent to Date\n├── Physical Progress (%)\n└── Sources: PIB, Ministry, CAG, Media\n\`\`\`\n\n**Negative Alert:** Projects with > 1 year delay and > 20% cost overrun get Red Status banner.\n\n**Update Frequency:** Quarterly via Ministry Annual Reports; Real-time for PIB announcements` },
      { h: "MODULE 7: Statement & Fact-Check Tracker", b: `**Primary Data Sources:** PIB transcripts, Lok Sabha/Rajya Sabha debates (sansad.in), Ministry press conferences, PM/CM official speeches; Fact-check sources: AFWA, Boom, FactCheck India, AltNews, Vishvas News, The Quint WebQoof\n\n**Architecture:**\n\n**A. Statement Database**\nEvery major quantitative or verifiable claim by a Union Minister, PM, or official spokesperson is logged:\n- Speaker name + position\n- Platform (Parliament / Press Conference / Rally / Tweet)\n- Date and verbatim quote (within fair use limits)\n- Topic category\n\n**B. Fact-Check Aggregation**\n- Pull verified verdicts from established fact-checkers (AFWA, Boom, AltNews)\n- Display: TRUE / MOSTLY TRUE / MISLEADING / FALSE / UNVERIFIABLE\n- Link to original fact-check with methodology\n- Our own human editor adds a "OPPOSITION Verdict" only when multiple independent sources agree\n\n**Legal Protocol:** We display verdicts of other organizations, not solely our own. For our own analysis, we use language like "Data shows X, Government claims Y" — never "Government lied."\n\n**Example Entry:**\n> PM Modi, June 2024 Rally: "We have created 10 crore jobs in the last 5 years"\n> CMIE data shows unemployment rate at 8.1% (Jan 2024)\n> AFWA Verdict: MISLEADING (govt uses PLFS methodology which counts 1 hour/week as employment)\n\n**Update Frequency:** Real-time for major speeches; weekly batch for Parliament debates` },
      { h: "MODULE 8: India International Rankings Dashboard", b: `**25+ Indices Tracked:**\n\n**Economic Indices:**\n| Index | Publisher | India 2025 Rank | Frequency |\n|---|---|---|---|\n| GDP (Nominal) | IMF | 4th | Quarterly |\n| GDP Per Capita | IMF | ~140th | Annual |\n| GDP Growth Rate | IMF/World Bank | 6.5% | Quarterly |\n| Fiscal Deficit | MoF / IMF | 4.3% GDP | Annual |\n| Forex Reserves | RBI | ~$680 bn | Weekly |\n| Global Competitiveness | IMD | 39th | Annual |\n| Innovation Index | WIPO | 39th | Annual |\n\n**Human Development:**\n| Index | Publisher | India 2025 | Frequency |\n|---|---|---|---|\n| Human Development Index | UNDP | 132nd/193 | Annual |\n| Global Hunger Index | Concern/WHH | 102nd/123 | Annual |\n| Global Gender Gap | WEF | 127th | Annual |\n| World Happiness Report | UN | 118th/147 | Annual |\n\n**Governance & Freedom:**\n| Index | Publisher | India 2025 | Frequency |\n|---|---|---|---|\n| Press Freedom Index | RSF | 151st | Annual |\n| Freedom in the World | Freedom House | Partly Free (63/100) | Annual |\n| Rule of Law Index | WJP | Track | Annual |\n\n**Environment:**\n| Index | Publisher | India 2025 | Frequency |\n|---|---|---|---|\n| Environmental Performance | Yale/Columbia | 180th | Biennial |\n| Climate Change Perf. | Germanwatch | 10th | Annual |\n\n**Visualization:** Each index shows:\n1. Current rank + score\n2. Historical trend (10-year sparkline)\n3. Comparison with peer countries (China, Brazil, Bangladesh, Pakistan)\n4. The DELTA: change since 2014 (for political context, not editorial comment)\n\n**Update Frequency:** As each index publishes (most annual); live data (AQI) via API` },
      { h: "MODULE 9: Breaking Alerts & Real-Time Feed", b: `**This module is the live pulse of Indian governance accountability.**\n\n**Alert Categories:**\n1. **ED/CBI Action Alerts** — Arrests, raids, attachments (source: agency press releases)\n2. **CAG Report Drop** — New audit report tabled in Parliament\n3. **Budget Variance Alert** — Monthly CGA data deviates significantly from projection\n4. **New Scam FIR** — Major FIR filed in any HC or SC with political/governance angle\n5. **International Ranking Drop/Rise** — Any Indian ranking change >5 positions\n6. **Policy Status Change** — Scheme discontinued, budget cut >25%, or new launch\n7. **Promise Fulfillment Milestone** — Promise moved to Fulfilled or Abandoned\n8. **Statement Fact-Check Published** — New fact-check on government claim by established checker\n9. **SC/HC Judgment** — Significant court order on governance accountability\n\n**Delivery Channels:**\n- In-app notification (web push)\n- Email digest (daily/weekly — user choice)\n- RSS feed (open)\n- Public API endpoint (premium tier)\n\n**Sourcing Protocol:** Alerts fire only after primary source confirmation — not based on media reports alone. ED press release → alert. News article about ED action → queued for verification.` },
    ]
  },
  {
    id: "datasources", code: "DOC-04", icon: "⬢", color: T.violet,
    title: "Data Sources & API Architecture",
    shortTitle: "Data",
    sections: [
      { h: "Tier 1: Official Government Data Sources (India)", b: `These are primary, legally authoritative, freely accessible sources:\n\n| Source | URL | Data Type | Access Method |\n|---|---|---|---|\n| India Budget Portal | indiabudget.gov.in | Budget documents, statements | PDF scrape + manual |\n| Open Government Data | data.gov.in | 500,000+ datasets, APIs | REST API (free) |\n| PFMS | pfms.nic.in | Fund releases, DBT | Web scrape |\n| Controller General of Accounts | cga.nic.in | Monthly expenditure accounts | PDF scrape |\n| Election Commission | eci.gov.in | Party financials, election data | PDF + structured data |\n| Parliament | sansad.in | Debates, Q&A, bills | Web scrape |\n| PIB | pib.gov.in | Press releases, statements | Web scrape + RSS |\n| RBI DBIE | dbie.rbi.org.in | Economic indicators | REST API |\n| MOSPI | mospi.gov.in | GDP, CPI, NAS, NSO data | REST API |\n| CAG | cag.gov.in | Audit reports | PDF scrape |\n| Supreme Court | sci.gov.in | Judgments, cause list | Web scrape |\n| CBI | cbi.gov.in | Press releases | RSS + scrape |\n| ED | enforcementdirectorate.gov.in | Attachment orders, arrests | RSS + scrape |\n| PM India | pmindia.gov.in | Speeches, announcements | RSS |` },
      { h: "Tier 2: Official International Data Sources", b: `| Source | Data | API/Access |\n|---|---|---|\n| World Bank Open Data | GDP, poverty, development | Free REST API |\n| IMF Data API | GDP, inflation, fiscal | Free JSON API |\n| UNDP Human Development | HDI, poverty indices | Free API |\n| WHO GHO | Health metrics | Free REST API |\n| UN Comtrade | Trade data (imports/exports) | Free + paid tiers |\n| IQAir | Real-time AQI | API (paid) |\n| WIPO | Innovation Index | Annual PDF + dataset |\n| Transparency International | CPI | Annual dataset |\n| Freedom House | Freedom ratings | Annual dataset |\n| RSF (Reporters Sans Frontières) | Press Freedom Index | Annual dataset |\n| WEF | Gender Gap, Competitiveness | Annual dataset |\n| Global Hunger Index | GHI | Annual dataset |\n| UN World Happiness | Happiness Report | Annual dataset |` },
      { h: "Tier 3: Verified Civil Society Sources", b: `These are used for independent verification of official claims and for tracking political funding:\n\n| Organization | Focus | URL |\n|---|---|---|\n| PRS Legislative Research | Budget analysis, bills, policy | prsindia.org |\n| ADR (Association for Democratic Reforms) | Party funding, criminal records of candidates | adrindia.org |\n| CMIE | Employment, economic indicators | cmie.com (subscription; cite publicly available data) |\n| FactChecker.in | Government statistics fact-checking | factchecker.in |\n| Informed Voter Project | Manifesto promise tracking | informedvoterproject.org |\n| Internet Freedom Foundation | Digital rights, surveillance | internetfreedom.in |\n| IndiaSpend | Data journalism | indiaspend.com |\n| BOOM | Fact-checking | boomlive.in |\n| AFWA (AFP Fact Check India) | Fact-checking | factcheck.afp.com |\n| AltNews | Fact-checking | altnews.in |` },
      { h: "Data Pipeline Architecture", b: `\`\`\`\nDATA INGESTION LAYER\n├── Scheduled Scrapers (Python/Scrapy)\n│   ├── PIB RSS → Statement Parser → DB\n│   ├── CBI/ED Press Release RSS → Case Parser → DB\n│   ├── Sansad.in → Parliament Q&A Scraper → DB\n│   └── CAG Portal → Report Parser → DB\n├── API Integrations (Python/httpx)\n│   ├── data.gov.in REST API → Budget/Spending DB\n│   ├── RBI DBIE API → Economic Indicators DB\n│   ├── World Bank API → International Metrics DB\n│   └── IMF API → Macroeconomic DB\n└── Real-time Feeds\n    ├── IQAir API → AQI Dashboard (live)\n    └── RBI Weekly Forex → Forex widget (weekly)\n\nVERIFICATION LAYER (Hybrid AI + Human)\n├── AI flagging: anomaly detection, duplicate detection, source mismatch\n├── Human editor queue: sensitive claims, new fraud cases, statement verdicts\n└── Legal review gate: any content touching identifiable individuals\n\nSTORAGE LAYER\n├── PostgreSQL (primary relational DB)\n├── Redis (caching layer, API rate limiting)\n├── S3/R2 (PDF archives, source document storage)\n└── Elasticsearch (full-text search across all collections)\n\nSERVING LAYER\n├── REST API (FastAPI) → Web frontend\n├── Public API (rate-limited, auth) → Premium users\n└── Webhooks → Alert subscriptions\n\`\`\`` },
      { h: "Legal & Attribution Protocol", b: `**Every data point stored in the DB must have:**\n1. \`source_name\` — full name of publishing organization\n2. \`source_url\` — direct URL to source document\n3. \`source_date\` — date of source publication\n4. \`source_type\` — enum: OFFICIAL_GOVT / INTERNATIONAL_BODY / CIVIL_SOCIETY / MEDIA\n5. \`last_verified\` — date our team last verified the link is live\n6. \`editor_id\` — ID of human editor who approved the entry\n\n**What this means for the frontend:**\nEvery number, chart, and claim on OPPOSITION shows:\n> Source: [Organization Name] | [Date] | [↗ View Source]\n\nThis is non-negotiable. It is our primary legal defense and our credibility foundation.` },
    ]
  },
  {
    id: "legal", code: "DOC-05", icon: "⚖", color: T.red,
    title: "Legal & Compliance Framework",
    shortTitle: "Legal",
    sections: [
      { h: "Applicable Laws & Risk Matrix", b: `| Law | Relevance | Risk Level | Mitigation |\n|---|---|---|---|\n| IT Rules 2021 (Intermediary Guidelines) | Takedown requests from government | HIGH | Maintain content appeals process; respond within 72hr statutory window |\n| IPC S.499-500 / BNS S.356 (Defamation) | Individuals named in fraud cases | HIGH | Only cite official FIR/chargesheet; use "accused" not "convicted" |\n| IPC S.124A / BNS S.152 (Sedition equivalent) | Political content | MEDIUM | All content is data-driven, not opinion; never incite action |\n| Prevention of Corruption Act | Our editorial about corruption | LOW | We report on cases; we don't investigate ourselves |\n| RTI Act 2005 | Data access | POSITIVE | Use RTI proactively to obtain govt data |\n| DPDP Act 2023 + Rules 2025 | User data we collect | MEDIUM | Minimize PII collection; privacy policy; consent architecture |\n| Copyright Act 1957 | Government documents | LOW | Govt works are public domain under S.52(1)(q); attribute all sources |\n| Representation of People Act 1951 | Electoral data | MEDIUM | EC data is public record; no exit poll violations |` },
      { h: "Content Policy — The 10 Commandments", b: `1. **Thou shalt cite every claim.** No data point published without an authoritative source URL.\n\n2. **Thou shalt use "accused" not "convicted."** Every person named in fraud/corruption is accused until a court convicts. Update status on acquittal prominently.\n\n3. **Thou shalt not editorialize.** "The government allocated X% less to education" is a fact. "The government doesn't care about education" is opinion and is banned.\n\n4. **Thou shalt track all parties equally.** If we track BJP's Rafale controversy, we track Congress's 2G scam and AAP's liquor policy scam with equal rigour.\n\n5. **Thou shalt attribute international indices accurately.** We report India's rank as published. We do not "disagree" with indices or add our own adjustments.\n\n6. **Thou shalt have a transparent editorial board.** The names, qualifications, and conflict disclosures of all editors are publicly listed on the site.\n\n7. **Thou shalt publish our own funding.** Our donors, grants, and revenue sources are disclosed on a dedicated Transparency page.\n\n8. **Thou shalt have a corrections policy.** Errors are corrected within 24 hours and the correction is published in-place with the original, not deleted.\n\n9. **Thou shalt have a takedown appeal process.** Any person or entity that believes data about them is inaccurate can submit a formal challenge. We respond within 14 days.\n\n10. **Thou shalt not publish unverified allegations.** Community-submitted data goes into a "Unverified Submissions" queue, never directly live.` },
      { h: "Entity Structure & Jurisdiction", b: `**Recommended Structure:**\n\n**Option A: Section 8 Company (Not-for-profit)**\n- Tax exemption under S.12A/80G\n- More credibility as civic infrastructure\n- Donation-eligible, grant-eligible\n- Limits commercial revenue but allows freemium\n\n**Option B: Private Limited Company**\n- Commercial flexibility for API monetization\n- Can raise angel/VC funding\n- Higher regulatory burden\n\n**Recommendation:** Section 8 Company for editorial/data arm + Private Limited subsidiary for commercial API products. This separates editorial independence from revenue operations.\n\n**Hosting Jurisdiction:**\n- Primary servers: EU (Netherlands/Germany) — GDPR protected, difficult for Indian government to compel takedown\n- CDN: Cloudflare (automatic global, including India PoPs for performance)\n- Domain: .in for trust + .org as backup\n- DNS: Cloudflare — provides DDoS protection and can resist takedown attempts longer\n\n**Legal Counsel Required:**\n- 1 media law specialist (defamation, IT Act)\n- 1 technology law specialist (DPDP, IT Rules)\n- 1 election law specialist (ECI regulations, RPA)\nRetainer basis, not full-time.` },
      { h: "DPDP Act 2023 Compliance", b: `The Digital Personal Data Protection Act (notified Nov 2025 with Rules) applies to any platform collecting personal data.\n\n**Data We Collect:**\n- Email (for newsletter/alerts) → consent required, purpose-limited\n- Usage analytics (anonymous) → no PII\n- Premium account: name, email, payment → full DPDP compliance needed\n\n**Compliance Actions Required:**\n1. Privacy Notice: Clear, itemized description of data collected and purpose (per DPDP Rules 2025 Rule 3)\n2. Consent Manager: Granular consent for each data use; withdrawal mechanism\n3. Data Retention Policy: Define and enforce retention periods\n4. Breach Notification: 72-hour notification to DPBI if breach occurs (post-enforcement)\n5. Data Principal Rights: Correction, erasure, grievance redressal mechanism\n6. DPO (Data Protection Officer): Required when designated as Significant Data Fiduciary; appoint early\n\n**Key Risk:** DPDP Act S.44(3) amends RTI Act S.8(1)(j) — this may restrict access to personal information in government records. We must monitor the Supreme Court challenge (Reporters Collective Trust v. Union of India, W.P.(C) 211/2026) closely.` },
    ]
  },
  {
    id: "tech", code: "DOC-06", icon: "⬛", color: T.indigo,
    title: "Technical Architecture",
    shortTitle: "Tech",
    sections: [
      { h: "Technology Stack", b: `\`\`\`\nFRONTEND\n├── Framework: Next.js 14 (App Router)\n├── UI Library: Shadcn/UI + Radix primitives\n├── Styling: Tailwind CSS\n├── Charts: Recharts (primary) + D3.js (custom visualizations)\n├── State: Zustand (global) + React Query (server state)\n├── Maps: Leaflet.js (India state-level visualizations)\n└── Mobile: Responsive web (PWA-enabled for mobile app-like experience)\n\nBACKEND\n├── API Framework: FastAPI (Python 3.12)\n├── Task Queue: Celery + Redis (scheduled scrapers, alerts)\n├── ORM: SQLAlchemy + Alembic (migrations)\n├── Search: Elasticsearch 8.x\n├── Authentication: Auth.js / NextAuth (OAuth: Google + email magic link)\n└── File Processing: Camelot + Tabula (PDF table extraction), pdfplumber\n\nDATABASE\n├── Primary: PostgreSQL 16 (relational, ACID)\n├── Cache: Redis 7 (session, API cache, rate limiting)\n├── Search: Elasticsearch (full-text across all collections)\n├── Object Storage: Cloudflare R2 (source PDFs, media)\n└── Time Series: TimescaleDB extension on Postgres (metrics history)\n\nINFRASTRUCTURE\n├── Hosting: Hetzner Cloud (Germany) — 3 app servers, 1 DB server\n├── CDN: Cloudflare (global, India PoPs, DDoS protection)\n├── CI/CD: GitHub Actions → Docker → Hetzner\n├── Monitoring: Grafana + Prometheus\n├── Error Tracking: Sentry\n└── Backups: Daily automated to Backblaze B2\n\`\`\`\n\n**Why Not AWS India?** Indian government can issue blocking orders to AWS India. Hetzner (Germany) is outside Indian jurisdiction. Cloudflare provides performance + protection. This is a deliberate resilience decision.` },
      { h: "Database Schema (Core Tables)", b: `\`\`\`sql\n-- Budget data (hierarchical)\nbudget_allocations (\n  id, fiscal_year, ministry_code, department_code,\n  scheme_code, scheme_name, budget_type (BE/RE/Actual),\n  amount_crore, vs_previous_year_pct, source_id, updated_at\n)\n\n-- Party finance\nparty_finance (\n  id, party_code, party_name, fiscal_year,\n  total_income, donation_above_20k, electoral_trust_receipt,\n  total_expenditure, election_expenditure, assets_value,\n  source_id, verified_by_editor_id, updated_at\n)\n\n-- Fraud/corruption cases\nfraud_cases (\n  id, case_name, case_code, category,\n  amount_involved_crore, amount_attached_crore, recovery_pct,\n  fir_date, accused_names_json, agencies_json,\n  court_status (INVESTIGATION/CHARGESHEET/TRIAL/CONVICTED/ACQUITTED),\n  last_update, source_id, editor_id\n)\n\n-- International metrics\nintl_metrics (\n  id, index_name, publisher, india_rank, india_score,\n  total_countries, peer_comparison_json,\n  publication_date, fiscal_year, source_id\n)\n\n-- Government statements + fact checks\nstatements (\n  id, speaker_name, speaker_designation, party,\n  platform, statement_date, statement_text_excerpt, topic_category,\n  fc_verdict (TRUE/MOSTLY_TRUE/MISLEADING/FALSE/UNVERIFIABLE),\n  fc_source_id, opposition_verdict, source_id, editor_id\n)\n\n-- Promise tracker\npromises (\n  id, promise_text, party, manifesto_year, category,\n  timeline_promised,\n  status (FULFILLED/PARTIAL/IN_PROGRESS/NOT_STARTED/ABANDONED),\n  evidence TEXT, evidence_source_id, last_reviewed\n)\n\`\`\`` },
      { h: "API Design (Public & Internal)", b: `\`\`\`\nPUBLIC API (v1) — Rate limited, JWT auth\n\nGET /api/v1/budget/{year}/summary\nGET /api/v1/budget/{year}/ministry/{ministry_code}\nGET /api/v1/budget/{year}/scheme/{scheme_code}\nGET /api/v1/budget/compare?years=2020,2021,2022,2023,2024,2025\n\nGET /api/v1/parties\nGET /api/v1/parties/{party_code}/finance?fy=2024\nGET /api/v1/parties/compare?year=2024\n\nGET /api/v1/fraud-cases?category=BANK&status=TRIAL&page=1\nGET /api/v1/fraud-cases/{case_id}\n\nGET /api/v1/metrics/india?index=HDI&years=10\nGET /api/v1/metrics/india/all?year=2025\nGET /api/v1/metrics/compare?country=IN,CN,BR&index=HDI\n\nGET /api/v1/promises?party=BJP&year=2024&status=FULFILLED\nGET /api/v1/statements?verdict=FALSE&from=2024-01-01\n\nGET /api/v1/feed/alerts?categories=ED,BUDGET&limit=20\n\nRATE LIMITS:\n├── Free tier: 100 requests/day, 10 requests/minute\n├── Registered (free): 1,000/day, 30/minute\n└── Premium: 10,000/day, 100/minute, webhooks enabled\n\`\`\`` },
      { h: "Security Architecture", b: `**Given the political sensitivity of this platform, security is existential.**\n\n**Application Security:**\n- All endpoints behind Cloudflare WAF\n- Rate limiting at CDN level (not just application)\n- SQL injection protection: SQLAlchemy parameterized queries only\n- XSS protection: Content Security Policy headers\n- HTTPS enforced: HSTS preload list\n- Admin panel: Separate subdomain, IP whitelisted, MFA mandatory\n- API keys: Hashed in DB (never stored plain)\n\n**Infrastructure Security:**\n- DB server not publicly accessible (only accessible from app server via private network)\n- SSH key auth only on all servers; no password auth\n- Automated security patches (unattended-upgrades)\n- Firewall: UFW with minimal open ports (80, 443 only public-facing)\n- Log retention: 90 days on server, 1 year in offsite storage\n\n**DDoS Resilience:**\n- Cloudflare DDoS protection (automatic)\n- Rate limiting: 1000 req/IP/minute at CDN\n- Origin IP never exposed (only Cloudflare)\n\n**Backup & Recovery:**\n- Daily automated DB backups → Backblaze B2 (Germany region)\n- 30-day retention\n- Recovery Time Objective (RTO): 4 hours\n- Recovery Point Objective (RPO): 24 hours` },
    ]
  },
  {
    id: "ux", code: "DOC-07", icon: "◇", color: T.amber,
    title: "UX Architecture & Design System",
    shortTitle: "UX",
    sections: [
      { h: "Design Philosophy", b: `OPPOSITION is not a news site. It is not a government portal. It is civic infrastructure.\n\n**Design Tone:** Authoritative, clinical, trustworthy. Like a forensic auditor's report — not a tabloid headline and not a dull government PDF.\n\n**Visual Language:**\n- **Primary Palette:** Deep charcoal (#1a1a2e) base + saffron accent (#FF9933) + white + crisp red for negative indicators (#E8472A) + green for positive (#16a34a)\n- **Typography:**\n  - Display: Playfair Display (authority, gravitas)\n  - Body: Source Sans 3 (readability, neutral)\n  - Data/Numbers: JetBrains Mono (precision, data density)\n- **Grid:** 12-column, data-dense but breathable.\n- **Mobile:** Full feature parity. India is mobile-first. Data cards stack cleanly on 375px width.\n\n**The Negative Indicator System (NIS):**\nThree visual signals that run through the entire app:\n- 🔴 Red: Failure, shortfall, violation, scam active/ongoing\n- 🟡 Amber: Warning, delay, partial, under scrutiny\n- 🟢 Green: Fulfilled, on-track, positive ranking improvement\n\n**The Source Badge:**\nEvery data point shows a persistent source attribution chip:\n[PIB] [Mar 2025] [↗]\nThis chip is non-removable by design — it is the trust anchor of the entire platform.` },
      { h: "Information Architecture (Sitemap)", b: `\`\`\`\n/ (Homepage — India Accountability Dashboard)\n├── /budget\n│   ├── /budget/overview\n│   ├── /budget/ministries (all 31 ministries, sortable)\n│   ├── /budget/ministry/[slug]\n│   ├── /budget/schemes\n│   └── /budget/compare (year-over-year tool)\n├── /spending\n│   ├── /spending/monthly\n│   ├── /spending/cag-findings\n│   └── /spending/dbt\n├── /parties\n│   ├── /parties/overview\n│   └── /parties/[party-slug]\n├── /policies\n│   ├── /policies/by-ministry\n│   ├── /policies/by-status\n│   └── /policies/[policy-slug]\n├── /fraud\n│   ├── /fraud/overview\n│   ├── /fraud/by-category\n│   ├── /fraud/exam-leaks\n│   └── /fraud/[case-slug]\n├── /projects\n│   ├── /projects/promises\n│   ├── /projects/infrastructure\n│   └── /projects/[project-slug]\n├── /statements\n│   ├── /statements/recent\n│   ├── /statements/by-verdict\n│   └── /statements/[statement-slug]\n├── /india-rankings\n│   ├── /india-rankings/economic\n│   ├── /india-rankings/human-development\n│   ├── /india-rankings/governance\n│   └── /india-rankings/environment\n├── /alerts\n├── /about\n│   ├── /about/methodology\n│   ├── /about/team\n│   ├── /about/funding\n│   └── /about/corrections\n└── /api (API documentation)\n\`\`\`` },
      { h: "Homepage Dashboard — Hero Layout", b: `The homepage is a live accountability dashboard. It loads with 8 "accountability cards" showing the most critical current data points:\n\n**Row 1: Economic Reality Strip (live)**\nGDP Growth: 6.5% | Inflation: 4.2% | Fiscal Deficit: 4.3% GDP | Forex: $682B | Unemployment: 8.1% (CMIE)\n\n**Row 2: The 4 Big Accountability Cards**\n1. 🔴 **Budget Utilization** — "₹4,820 lakh crore budgeted. ₹X lakh crore spent so far (Q3 FY26)" — links to Budget Tracker\n2. 🟡 **Promise Status** — "Only 38% of 2024 BJP manifesto promises are Fulfilled or In Progress" — links to Promise Tracker\n3. 🔴 **Active Scams** — "₹X,XXX Crore under ED/CBI investigation — 47 active major cases" — links to Fraud Tracker\n4. 🔴 **India Global Ranks** — "Press Freedom: 151st | Hunger: 102nd | Happiness: 118th" — links to Rankings\n\n**Row 3: Live Alert Feed (last 5 alerts)**\n\n**Row 4: Module Navigation Grid**\n8 cards, one per major module, with a live data teaser each.\n\n**The Positive Record Strip (bottom of homepage)**\nA deliberately smaller but present section:\n✅ "GDP now 4th largest globally | FDI highest in 5 years | Climate Performance Index: 10th | Polio-free since 2014"\nThis is the +ve record. It is real, sourced, and shown — just not leading.` },
      { h: "Mobile UX Specification", b: `India has 750M+ mobile internet users. 60%+ of our expected audience will access via mobile.\n\n**Mobile-First Decisions:**\n- Navigation: Bottom tab bar (5 tabs: Home, Budget, Fraud, Rankings, More)\n- Data cards: Full-width, stacked vertically, swipeable in comparison views\n- Charts: Simplified for small screens; tap for full-screen drill-down\n- Tables: Horizontal scroll with sticky first column (ministry/party name)\n- Source badges: Tap to expand → shows full source info\n- Share: Native share sheet integration — every card has a share button\n- Offline: Service worker caches last-viewed data for offline viewing\n- Language: English primary; Hindi toggle for key stats (Phase 2)\n- Font sizes: Minimum 16px body, 14px secondary. No 12px data labels on mobile.\n- Touch targets: Minimum 44×44px for all interactive elements\n\n**PWA Configuration:**\n- Installable as home screen app (no app store needed)\n- Push notifications for alerts (user opt-in)\n- Offline mode for cached module data\n- App icon: Opposition "◉" symbol in saffron on dark background` },
    ]
  },
  {
    id: "editorial", code: "DOC-08", icon: "✦", color: "#0891B2",
    title: "Editorial Operations Manual",
    shortTitle: "Editorial",
    sections: [
      { h: "Editorial Team Structure", b: `**Year 1 Minimum Team (8 people):**\n\n| Role | Count | Responsibility |\n|---|---|---|\n| Editor-in-Chief | 1 | Final editorial decisions; legal compliance; public spokesperson |\n| Senior Data Editor | 1 | Budget + Economic data accuracy; methodology ownership |\n| Political Finance Editor | 1 | Party funding, electoral data, ECI filings |\n| Fraud/Corruption Desk | 1 | CBI/ED case tracking; court status monitoring |\n| Policy & Promises Desk | 1 | Policy tracker, manifesto tracking, project tracking |\n| Fact-Check Editor | 1 | Statement verification; coordinating with external fact-checkers |\n| International Metrics | 1 | Index tracking; data ingestion from international bodies |\n| Legal Reviewer | 1 (part-time/retainer) | Review before publication of sensitive entries |\n\n**All editors must:**\n- Disclose their professional background publicly on the About/Team page\n- Disclose any political donations, party memberships, or affiliations\n- Sign an editorial independence agreement\n- Recuse themselves from editing content touching their disclosed affiliations` },
      { h: "Content Lifecycle", b: `\`\`\`\nAUTOMATED DATA (80% of content volume)\n→ Scraper/API fetches raw data\n→ Automated parser structures into DB schema\n→ Anomaly detection flags unusual values\n→ Data Editor reviews flagged items (daily 1-hour review)\n→ Auto-published if no flags; queued for manual review if flagged\n→ Live on site\n\nHUMAN-CURATED CONTENT (20% of volume, 80% of legal sensitivity)\n→ Editor identifies new fraud case / policy / statement\n→ Drafts entry with full source documentation\n→ Second editor reviews (four-eyes principle for names/accusations)\n→ Legal review if entry names a specific individual in fraud context\n→ Published with editor ID logged\n→ Automated source link verification after 30/90/180 days\n\nCOMMUNITY SUBMISSIONS\n→ User submits tip via form\n→ Goes to "Unverified Tips" internal queue (never public)\n→ Editor evaluates: Does this have a verifiable primary source?\n→ If yes: treated as Human-Curated Content above\n→ If no: filed as tip; user receives response; never published without verification\n\nCORRECTIONS WORKFLOW\n→ Error reported (internal or external)\n→ Immediate internal review within 4 hours\n→ If confirmed: update DB, add correction notice to live page\n→ Log in public corrections archive (/about/corrections)\n\`\`\`` },
      { h: "The Neutrality Test", b: `Before publishing any non-automated content, editors ask 4 questions:\n\n**1. The Mirror Test:** Would we publish the equivalent content if it were about the opposition party doing the same thing? If No → Do Not Publish.\n\n**2. The Source Test:** Is every factual claim traceable to an official source or recognized organization? If No → Do Not Publish.\n\n**3. The Opinion Test:** Does this content express a political opinion rather than present data? If Yes → Rewrite as data, not opinion.\n\n**4. The Naming Test:** Does this content name an individual in a damaging context? If Yes → Is the name from a filed FIR, court order, or official charge sheet? If No → Remove the name, describe by position only.\n\n**The Symmetry Principle:**\nAny scam tracked during a BJP-governed state must be matched with equivalent scrutiny of Congress/AAP/TMC/others' governance records. No selective scandal coverage. Our fraud tracker covers Vyapam (BJP-era MP), Commonwealth Games (Congress-era), Delhi Liquor Policy (AAP), Bengal TMC allegations, and all others.` },
      { h: "Update Calendar", b: `**Daily:**\n- PIB press release scrape and statement parsing\n- CBI/ED press release alert monitoring\n- SC/HC cause list monitoring for major governance cases\n- AQI data update; Forex/economic indicators update\n\n**Weekly:**\n- Fact-check aggregation review (AFWA, Boom, AltNews)\n- Alert digest curation\n- New party finance filings check (ECI portal)\n- Data link verification sweep (broken source links)\n\n**Monthly:**\n- CGA monthly expenditure data ingestion and publishing\n- RBI monthly bulletin data update\n- CAG tabling alert and report ingestion if new\n- Budget utilization dashboard refresh\n\n**Quarterly:**\n- GDP data update (MOSPI advance estimates)\n- PFMS fund release data\n- Project tracker milestone review\n- Promise tracker status review\n\n**Annually:**\n- Budget Day (Feb 1): Full budget ingestion, all budget pages updated within 48 hours\n- ECI party financial statements (September deadline): Full party finance update\n- All major annual indices publication: HDI, GHI, GGI, CPI, Press Freedom, etc.\n- Editorial independence audit: External review of our editorial decisions for political balance` },
    ]
  },
  {
    id: "monetization", code: "DOC-09", icon: "◆", color: T.green,
    title: "Monetization & Sustainability",
    shortTitle: "Funding",
    sections: [
      { h: "Revenue Architecture", b: `OPPOSITION must be financially sustainable without compromising editorial independence. This requires diversified revenue with no single donor or client exceeding 20% of total revenue.\n\n**Revenue Streams:**\n\n**1. Freemium API (Target: 40% of revenue)**\n- Free tier: 100 API calls/day, non-commercial use\n- Developer tier: ₹999/month — 1,000 calls/day, attribution required\n- Professional: ₹4,999/month — 10,000 calls/day, webhooks, priority support\n- Institutional: ₹24,999/month — unlimited, dedicated support, bulk data exports\n- Target clients: Think tanks, media houses, academic institutions, civic tech startups\n\n**2. Donations (Target: 30% of revenue)**\n- Monthly supporter program: ₹99 / ₹499 / ₹999 tiers\n- Annual donor wall (named, with disclosed conflict statement)\n- No corporate donors to editorial entity — only individual donations\n\n**3. Grants (Target: 20% of revenue)**\n- Omidyar Network India (civic tech, democracy)\n- MacArthur Foundation; Google News Initiative\n- National Foundation for India\n- All grants disclosed publicly\n\n**4. Data Licensing (Target: 10% of revenue)**\n- Structured historical datasets (clean, schema-documented)\n- License to media, research, ESG analytics firms\n\n**What We Will Never Do:**\n- Display advertising (creates incentive to maximize outrage, not accuracy)\n- Sponsored content\n- Accept funding from political parties, their leaders, or affiliates\n- Sell user data` },
      { h: "Year 1 Financial Projection", b: `**Costs (Year 1):**\n| Item | Monthly (₹) | Annual (₹) |\n|---|---|---|\n| Team (8 people at market rates) | 12,00,000 | 1,44,00,000 |\n| Infrastructure (servers, CDN, APIs) | 1,50,000 | 18,00,000 |\n| Legal retainer | 1,00,000 | 12,00,000 |\n| Data subscriptions (CMIE, EIU, etc.) | 50,000 | 6,00,000 |\n| Miscellaneous + contingency | 50,000 | 6,00,000 |\n| **TOTAL** | **15,50,000** | **1,86,00,000** |\n\n**Revenue Target (Year 1):**\n| Stream | Annual (₹) |\n|---|---|\n| API (freemium + institutional) | 30,00,000 |\n| Donations | 25,00,000 |\n| Grants | 1,00,00,000 |\n| Data Licensing | 10,00,000 |\n| **TOTAL** | **1,65,00,000** |\n\n**Funding Gap Year 1: ~₹21 lakh** — covered by founder capital or initial grant.\n\n**Year 2 target:** Break-even on API + donations alone; grants become growth capital.` },
      { h: "Editorial Independence Safeguards", b: `Revenue must never influence editorial decisions. Structural safeguards:\n\n1. **Firewall:** Monetization team and editorial team are structurally separate. API/grant team cannot request content changes.\n\n2. **Editorial Independence Charter:** A legally binding document that prevents any revenue relationship from influencing what we publish or don't publish.\n\n3. **Donor Anonymity Exception:** No donor at any tier gets advance notice of, influence over, or ability to suppress any content.\n\n4. **Institutional Subscriber Agreement:** API subscribers explicitly agree that their subscription does not grant them any editorial influence. They subscribe for data access only.\n\n5. **Annual Independence Audit:** An independent body (proposed: Press Council of India or academic institution) reviews whether editorial decisions show any correlation with revenue sources.\n\n6. **Public Disclosure:** Every quarter, we publish:\n   - Total revenue by category\n   - Names of donors above ₹10,000\n   - List of institutional API subscribers (with their consent)\n   - Grant amounts and terms\n   - Any content removal requests received + our response` },
    ]
  },
  {
    id: "roadmap", code: "DOC-10", icon: "▶", color: T.violet,
    title: "Development Roadmap & Sprint Plan",
    shortTitle: "Roadmap",
    sections: [
      { h: "Phase 0: Pre-Launch Setup (Weeks 1-4)", b: `**Legal & Structural:**\n- [ ] Register entity (Section 8 Company recommended)\n- [ ] Engage media law counsel\n- [ ] Draft Editorial Independence Charter\n- [ ] Register domain (.in + .org)\n- [ ] Set up Cloudflare account with origin server in Hetzner (Germany)\n\n**Team:**\n- [ ] Hire/confirm 8 core team members\n- [ ] Run conflict disclosure process for all editors\n- [ ] Set up internal tools: Notion (documentation), Linear (dev tasks), Slack (communication)\n\n**Infrastructure:**\n- [ ] Provision Hetzner Cloud servers (2 app servers, 1 DB server, 1 scraper server)\n- [ ] Set up PostgreSQL + Redis + Elasticsearch\n- [ ] Configure CI/CD pipeline (GitHub Actions → Docker)\n- [ ] Set up Cloudflare CDN, WAF, DDoS protection\n- [ ] Configure daily backups to Backblaze B2` },
      { h: "Phase 1: Foundation Sprint (Weeks 5-12)", b: `**Sprint 1-2: Data Infrastructure (Weeks 5-8)**\n- [ ] Build all 15 core DB tables with migrations\n- [ ] Build data ingestion scrapers for: PIB, CBI, ED, ECI party finance, PRS budget data\n- [ ] Build PDF extraction pipeline (Budget PDFs → structured JSON)\n- [ ] Set up World Bank, IMF, RBI API integrations\n- [ ] Backfill historical data: Budget FY2019-FY2026, party finance, all international metrics\n\n**Sprint 3-4: Backend API (Weeks 9-12)**\n- [ ] Build all public API endpoints (FastAPI)\n- [ ] Build authentication system (JWT + API keys)\n- [ ] Build rate limiting (Redis)\n- [ ] Build alert system (Celery + email/push delivery)\n- [ ] Internal admin panel (content management, editorial workflow)\n- [ ] Write API documentation` },
      { h: "Phase 2: Frontend Build (Weeks 13-22)", b: `**Sprint 5-6: Core Shell + Homepage (Weeks 13-16)**\n- [ ] Next.js project setup with design system\n- [ ] Homepage dashboard (live economic strip, 4 accountability cards, alert feed)\n- [ ] Navigation (desktop sidebar + mobile bottom tabs)\n- [ ] Module landing pages (8 modules, data skeleton + live data integration)\n\n**Sprint 7-8: Budget + Spending Tracker (Weeks 17-20)**\n- [ ] Budget overview dashboard\n- [ ] Ministry drill-down pages (31 ministries)\n- [ ] Scheme-level pages with BE/RE/Actual comparison\n- [ ] Year-over-year comparison tool\n- [ ] Govt Spending Tracker (monthly CGA data, CAG findings)\n\n**Sprint 9: All Other 7 Modules (Weeks 21-22) — parallel teams**\n- [ ] Political Party Finance Tracker\n- [ ] Policy Tracker\n- [ ] Fraud/Corruption Tracker\n- [ ] Promise & Project Tracker\n- [ ] Statement Fact-Check Tracker\n- [ ] India Rankings Dashboard\n- [ ] Alert Feed + notification system` },
      { h: "Phase 3: Testing, Hardening & Launch (Weeks 23-28)", b: `**Week 23-24: QA & Data Verification**\n- [ ] Full data audit — every module's data verified against primary sources\n- [ ] Security penetration test (external firm)\n- [ ] Load testing (simulate 10,000 concurrent users)\n- [ ] Mobile responsiveness audit across 10+ device types\n- [ ] Accessibility audit (WCAG 2.1 AA compliance)\n- [ ] Legal review of all fraud case entries and statement entries\n\n**Week 25-26: Beta Launch (Private)**\n- [ ] Invite 200 beta users (journalists, researchers, activists)\n- [ ] Structured feedback collection\n- [ ] Bug fixes and UX iteration\n- [ ] Performance optimization (Core Web Vitals targets: LCP < 2.5s)\n\n**Week 27: Pre-Launch Preparation**\n- [ ] Press kit preparation\n- [ ] Outreach to media partners (The Wire, The Hindu, Scroll, IndiaSpend)\n- [ ] Social media presence setup\n- [ ] API documentation finalization\n- [ ] Onboard 5 institutional beta API clients\n\n**Week 28: Public Launch**\n- [ ] Staged rollout: 1,000 → 10,000 → unlimited over 72 hours\n- [ ] Press release distributed\n- [ ] Founder interviews with media\n- [ ] Monitor for legal challenges — legal team on standby\n- [ ] Real-time performance monitoring` },
      { h: "Phase 4: Post-Launch & Scale (Months 7-12)", b: `**Month 7-8: Stabilization**\n- Resolve all critical bugs from launch\n- Optimize DB query performance for scale\n- Complete scraper coverage gaps\n- Launch API premium tier\n\n**Month 9-10: Expansion**\n- Add top 5 state governments (UP, Maharashtra, Karnataka, Tamil Nadu, West Bengal)\n- Hindi language toggle for key statistics\n- Downloadable datasets for researchers\n- Weekly email digest launch\n\n**Month 11-12: Intelligence Layer**\n- AI-assisted statement monitoring (flag potential false claims for human review)\n- Budget anomaly detection algorithm\n- Trend analysis tools (spending patterns over years)\n- Partnership with fact-check organizations for real-time integration\n\n**Year 2 Vision:**\n- All 28 states + UTs in State Tracker\n- Native Android + iOS apps\n- Real-time Parliament debate monitoring\n- Whistleblower secure submission portal (SecureDrop-style)\n- Partnership with academic institutions for research data access` },
      { h: "Critical Risk Register", b: `| Risk | Probability | Impact | Mitigation |\n|---|---|---|---|\n| Government legal notice / takedown | HIGH | HIGH | Host outside India; every content item citable to public source; legal team on retainer |\n| Key editor resigns or is targeted | MEDIUM | HIGH | Document all editorial decisions; build institutional knowledge; succession plan |\n| Data quality error published | MEDIUM | HIGH | Four-eyes review for sensitive content; source verification pipeline; corrections process |\n| Funding shortfall year 1 | MEDIUM | HIGH | Founder bridge funding; grant pipeline active from day 1; lean team |\n| Scraper blocking by govt portals | HIGH | MEDIUM | Multiple IP rotation; respectful scraping (rate limits); manual backup for critical data |\n| DPDP Act compliance gap | LOW | MEDIUM | Engage DPO consultant; minimize PII collection; privacy-by-design |\n| Political framing as partisan | HIGH | MEDIUM | Symmetry principle enforced; track all parties equally; annual independent audit |\n| DDoS attack | MEDIUM | MEDIUM | Cloudflare protection; origin IP hidden; rate limiting |\n| Domain seizure | LOW | HIGH | .org backup domain; mirror on decentralized hosting; Tor onion service (Phase 2) |` },
    ]
  },
];

/* ─── BODY RENDERER ──────────────────────────────────────────────── */
function renderBody(text) {
  const lines = text.split('\n');
  const out = [];
  let i = 0;

  const inlineFormat = (s) =>
    s.replace(/\*\*(.*?)\*\*/g, '<strong class="body-strong">$1</strong>')
     .replace(/`(.*?)`/g, '<code class="body-code">$1</code>')
     .replace(/\*(.*?)\*/g, '<em class="body-em">$1</em>');

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.trimStart().startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      out.push(
        <pre key={`pre-${i}`} className="body-pre">
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      i++;
      continue;
    }

    // Table
    if (line.startsWith('|') && i + 1 < lines.length && lines[i+1].startsWith('|---')) {
      const headerCells = line.split('|').slice(1, -1).map(c => c.trim());
      i += 2; // skip separator
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        rows.push(lines[i].split('|').slice(1, -1).map(c => c.trim()));
        i++;
      }
      out.push(
        <div key={`tbl-${i}`} className="body-table-wrap">
          <table className="body-table">
            <thead>
              <tr>{headerCells.map((h,j) => <th key={j}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} dangerouslySetInnerHTML={{ __html: inlineFormat(cell) }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const bqLines = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        bqLines.push(lines[i].slice(2));
        i++;
      }
      out.push(
        <blockquote key={`bq-${i}`} className="body-blockquote"
          dangerouslySetInnerHTML={{ __html: bqLines.join('<br/>') }} />
      );
      continue;
    }

    // Checklist
    if (line.match(/^- \[[ x]\] /)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^- \[[ x]\] /)) {
        const done = lines[i][3] === 'x';
        const txt = lines[i].slice(6);
        items.push({ done, txt });
        i++;
      }
      out.push(
        <ul key={`chk-${i}`} className="body-checklist">
          {items.map((it, j) => (
            <li key={j} className="body-check-item">
              <span className="body-check-icon" style={{ color: it.done ? T.green : '#9ca3af' }}>{it.done ? '✓' : '☐'}</span>
              <span style={{ color: it.done ? '#9ca3af' : undefined, textDecoration: it.done ? 'line-through' : undefined }}
                dangerouslySetInnerHTML={{ __html: inlineFormat(it.txt) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Unordered list
    if (line.match(/^[-*] /)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        items.push(lines[i].replace(/^[-*] /, ''));
        i++;
      }
      out.push(
        <ul key={`ul-${i}`} className="body-ul">
          {items.map((it, j) => (
            <li key={j} className="body-li" dangerouslySetInnerHTML={{ __html: inlineFormat(it) }} />
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (line.match(/^\d+\. /)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(lines[i].replace(/^\d+\. /, ''));
        i++;
      }
      out.push(
        <ol key={`ol-${i}`} className="body-ol">
          {items.map((it, j) => (
            <li key={j} className="body-li" dangerouslySetInnerHTML={{ __html: inlineFormat(it) }} />
          ))}
        </ol>
      );
      continue;
    }

    // Standalone bold line (section sub-heading)
    if (line.match(/^\*\*[^*]+\*\*$/) || line.match(/^\*\*[^*]+\*\*:$/)) {
      out.push(
        <p key={`sh-${i}`} className="body-section-head">{line.replace(/\*\*/g, '')}</p>
      );
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      out.push(<div key={`sp-${i}`} className="spacer" />);
      i++;
      continue;
    }

    // Regular paragraph
    out.push(
      <p key={`p-${i}`} className="body-p"
        dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />
    );
    i++;
  }
  return out;
}

/* ─── NAV LIST (reused in sidebar + drawer) ──────────────────────── */
function NavList({ activeId, onSelect }) {
  return (
    <>
      <p className="opp-sidebar-label">Documents</p>
      {DOCS.map(doc => (
        <button
          key={doc.id}
          className={`opp-nav-item${activeId === doc.id ? ' active' : ''}`}
          style={{ '--doc-color': doc.color }}
          onClick={() => onSelect(doc.id)}
        >
          <span className="opp-nav-icon" style={{ color: doc.color }}>{doc.icon}</span>
          <div style={{ minWidth: 0 }}>
            <p className="opp-nav-code">{doc.code}</p>
            <p className="opp-nav-title">{doc.title}</p>
          </div>
        </button>
      ))}
      <div className="opp-sidebar-legend">
        <p className="opp-legend-title">Legend</p>
        {[['🔴','Critical / Failure'],['🟡','Warning / Partial'],['🟢','Positive / Fulfilled']].map(([ic,lb]) => (
          <div key={lb} className="opp-legend-row"><span>{ic}</span><span>{lb}</span></div>
        ))}
      </div>
    </>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────── */
export default function OppositionPRD() {
  const [activeId, setActiveId] = useState('vision');
  const [expanded, setExpanded] = useState({});
  const [drawer, setDrawer] = useState(false);
  const contentRef = useRef(null);
  const [scrollPct, setScrollPct] = useState(0);

  const doc = DOCS.find(d => d.id === activeId);

  // Scroll progress
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => {
      const pct = el.scrollHeight - el.clientHeight > 0
        ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100 : 0;
      setScrollPct(pct);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [activeId]);

  // Scroll to top on doc change; default expand first section
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
    setScrollPct(0);
    setExpanded(prev => {
      const key = `${activeId}-0`;
      return { ...prev, [key]: true };
    });
  }, [activeId]);

  const selectDoc = (id) => {
    setActiveId(id);
    setDrawer(false);
  };

  const toggle = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <div className="opp-root">

        {/* ── HEADER ── */}
        <header className="opp-header">
          <div className="opp-logo-ring">◉</div>
          <div className="opp-brand">
            <p className="opp-brand-name">OPPOSITION — विपक्ष</p>
            <p className="opp-brand-sub">Pre-Development Docs · {DOCS.length} Documents</p>
          </div>
          <button className="opp-hamburger" onClick={() => setDrawer(true)}>
            <span>☰</span><span>Docs</span>
          </button>
          <span className="opp-badge">CONFIDENTIAL</span>
          {/* Scroll progress bar */}
          <div className="opp-progress" style={{ width: `${scrollPct}%` }} />
        </header>

        {/* ── MOBILE DRAWER ── */}
        <div className={`opp-drawer-mask${drawer ? ' open' : ''}`} onClick={() => setDrawer(false)}>
          <nav className="opp-drawer-panel" onClick={e => e.stopPropagation()}>
            <div className="opp-drawer-head">
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ color: T.saffron, fontSize:14, fontFamily:'Georgia,serif', fontWeight:700 }}>◉ OPPOSITION</span>
              </div>
              <button className="opp-drawer-close" onClick={() => setDrawer(false)}>×</button>
            </div>
            <div className="opp-drawer-inner">
              <NavList activeId={activeId} onSelect={selectDoc} />
            </div>
          </nav>
        </div>

        {/* ── BODY ── */}
        <div className="opp-body">

          {/* Desktop sidebar */}
          <aside className="opp-sidebar">
            <div className="opp-sidebar-inner">
              <NavList activeId={activeId} onSelect={setActiveId} />
            </div>
          </aside>

          {/* Main */}
          <main className="opp-main">

            {/* Doc title bar */}
            {doc && (
              <div className="opp-doc-bar" style={{ borderBottomColor: doc.color + '33' }}>
                <span className="opp-doc-icon" style={{ color: doc.color }}>{doc.icon}</span>
                <div className="opp-doc-meta">
                  <p className="opp-doc-code">{doc.code}</p>
                  <h1 className="opp-doc-title" style={{ color: T.ink }}>{doc.title}</h1>
                </div>
                <span className="opp-doc-count">{doc.sections.length} §</span>
              </div>
            )}

            {/* Scrollable content */}
            <div className="opp-content" ref={contentRef}>
              {doc && doc.sections.map((sec, idx) => {
                const key = `${doc.id}-${idx}`;
                const open = expanded[key] !== false && (idx === 0 ? expanded[key] !== false : !!expanded[key]);
                return (
                  <div key={key} className="opp-card" style={{ '--doc-color': doc.color }}>
                    <button
                      className={`opp-card-header${open ? ' open' : ''}`}
                      onClick={() => toggle(key)}
                      aria-expanded={open}
                    >
                      <span className="opp-card-num"
                        style={{ background: doc.color }}>
                        {String(idx + 1).padStart(2,'0')}
                      </span>
                      <span className="opp-card-heading">{sec.h}</span>
                      <span className="opp-card-toggle">+</span>
                    </button>
                    {open && (
                      <div className="opp-card-body">
                        {renderBody(sec.b)}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Bottom padding for mobile nav */}
              <div style={{ height: 16 }} />
            </div>
          </main>
        </div>

        {/* ── MOBILE BOTTOM NAV ── */}
        <nav className="opp-bottom-nav">
          {DOCS.map(doc => (
            <button
              key={doc.id}
              className={`opp-bottom-btn${activeId === doc.id ? ' active' : ''}`}
              style={{ '--doc-color': doc.color }}
              onClick={() => setActiveId(doc.id)}
            >
              <span className="opp-bottom-btn-icon" style={{ color: activeId === doc.id ? doc.color : T.muted }}>
                {doc.icon}
              </span>
              <span className="opp-bottom-btn-label">{doc.shortTitle}</span>
            </button>
          ))}
        </nav>

        {/* ── DESKTOP FOOTER ── */}
        <footer className="opp-footer">
          <span className="opp-footer-brand">◉ OPPOSITION</span>
          <span className="opp-footer-text">Pre-Development Documentation Suite · v1.0 · {new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
          <span className="opp-footer-tagline">Ye Desh Ka Hisaab Hai</span>
        </footer>

      </div>
    </>
  );
}
