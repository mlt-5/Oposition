const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'opposition.db');

const app = express();

// CORS: allow requests from file:// (local HTML) and localhost
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Open DB (read-only for the API)
let db;
try {
  db = new Database(DB_PATH, { readonly: true });
  db.pragma('journal_mode = WAL');
} catch (err) {
  console.error(`Cannot open ${DB_PATH}. Run "node seed.js" first.`);
  process.exit(1);
}

// ─── ROUTES ──────────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: 'opposition.db', timestamp: new Date().toISOString() });
});

// Ministry budget utilisation
app.get('/api/budget/ministry', (req, res) => {
  const fy = req.query.fy || 'FY26';
  const et = req.query.et || 'BE';
  const rows = db.prepare(
    'SELECT id, name, alloc, spent, pct FROM ministry_budget WHERE fiscal_year = ? AND estimate_type = ? ORDER BY alloc DESC'
  ).all(fy, et);
  res.json(rows);
});

// Revenue sources
app.get('/api/budget/revenue', (req, res) => {
  const fy = req.query.fy || 'FY26';
  const et = req.query.et || 'BE';
  const rows = db.prepare(
    'SELECT id, name, amt, pct, type, yoy, color, note FROM revenue_sources WHERE fiscal_year = ? AND estimate_type = ? ORDER BY amt DESC'
  ).all(fy, et);
  res.json(rows);
});

// Expenditure sectors
app.get('/api/budget/expenditure', (req, res) => {
  const fy = req.query.fy || 'FY26';
  const et = req.query.et || 'BE';
  const rows = db.prepare(
    'SELECT id, sector, amt, pct, type, color, note FROM expenditure_sectors WHERE fiscal_year = ? AND estimate_type = ? ORDER BY pct DESC'
  ).all(fy, et);
  res.json(rows);
});

// CapEx breakdown
app.get('/api/budget/capex', (req, res) => {
  const fy = req.query.fy || 'FY26';
  const et = req.query.et || 'BE';
  const rows = db.prepare(
    'SELECT id, name, amt, yoy, pct_gdp, note FROM capex_breakdown WHERE fiscal_year = ? AND estimate_type = ? ORDER BY amt DESC'
  ).all(fy, et);
  res.json(rows);
});

// Sector GDP comparison
app.get('/api/budget/gdp-comparison', (req, res) => {
  const fy = req.query.fy || 'FY26';
  const et = req.query.et || 'BE';
  const rows = db.prepare(
    'SELECT id, sector, india, world_avg, developed, recommended FROM sector_gdp_comparison WHERE fiscal_year = ? AND estimate_type = ?'
  ).all(fy, et);
  res.json(rows);
});

// Fiscal trend
// ?canonical=1 → one best row per year: Actuals for FY25, RE for FY26, BE for all others
app.get('/api/budget/fiscal-trend', (req, res) => {
  if (req.query.canonical) {
    const rows = db.prepare(`
      SELECT yr, deficit, deficit_abs, debt, revenue, exp, estimate_type, note FROM fiscal_trend
      WHERE (yr = 'FY25' AND estimate_type = 'Actuals')
         OR (yr = 'FY26' AND estimate_type = 'RE')
         OR (yr NOT IN ('FY25','FY26') AND estimate_type = 'BE')
      ORDER BY yr ASC
    `).all();
    return res.json(rows);
  }
  const rows = db.prepare(
    'SELECT id, yr, deficit, deficit_abs, debt, revenue, exp, estimate_type, note FROM fiscal_trend ORDER BY yr ASC'
  ).all();
  res.json(rows);
});

// 404 fallback
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => {
  console.log(`Opposition API running at http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log(`  GET /api/health`);
  console.log(`  GET /api/budget/ministry?fy=FY26&et=BE`);
  console.log(`  GET /api/budget/revenue?fy=FY26&et=BE`);
  console.log(`  GET /api/budget/expenditure?fy=FY26&et=BE`);
  console.log(`  GET /api/budget/capex?fy=FY26&et=BE`);
  console.log(`  GET /api/budget/gdp-comparison?fy=FY26&et=BE`);
  console.log(`  GET /api/budget/fiscal-trend`);
  console.log(`  GET /api/budget/fiscal-trend?canonical=1`);
});
