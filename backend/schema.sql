-- Opposition Budget Tracker Schema
-- Run via: node seed.js (which executes this automatically)

CREATE TABLE IF NOT EXISTS ministry_budget (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  fiscal_year   TEXT    NOT NULL DEFAULT 'FY26',
  estimate_type TEXT    NOT NULL DEFAULT 'BE',
  name          TEXT    NOT NULL,
  alloc         INTEGER NOT NULL,
  spent         INTEGER NOT NULL,
  pct           INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS revenue_sources (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  fiscal_year   TEXT    NOT NULL DEFAULT 'FY26',
  estimate_type TEXT    NOT NULL DEFAULT 'BE',
  name          TEXT    NOT NULL,
  amt           INTEGER NOT NULL,
  pct           REAL    NOT NULL,
  type          TEXT    NOT NULL,
  yoy           REAL    NOT NULL,
  color         TEXT    NOT NULL,
  note          TEXT
);

CREATE TABLE IF NOT EXISTS expenditure_sectors (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  fiscal_year   TEXT    NOT NULL DEFAULT 'FY26',
  estimate_type TEXT    NOT NULL DEFAULT 'BE',
  sector        TEXT    NOT NULL,
  amt           INTEGER NOT NULL,
  pct           REAL    NOT NULL,
  type          TEXT    NOT NULL,
  color         TEXT    NOT NULL,
  note          TEXT
);

CREATE TABLE IF NOT EXISTS capex_breakdown (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  fiscal_year   TEXT    NOT NULL DEFAULT 'FY26',
  estimate_type TEXT    NOT NULL DEFAULT 'BE',
  name          TEXT    NOT NULL,
  amt           INTEGER NOT NULL,
  yoy           REAL    NOT NULL,
  pct_gdp       REAL    NOT NULL,
  note          TEXT
);

CREATE TABLE IF NOT EXISTS sector_gdp_comparison (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  fiscal_year   TEXT    NOT NULL DEFAULT 'FY26',
  estimate_type TEXT    NOT NULL DEFAULT 'BE',
  sector        TEXT    NOT NULL,
  india         REAL    NOT NULL,
  world_avg     REAL    NOT NULL,
  developed     REAL    NOT NULL,
  recommended   REAL    NOT NULL
);

CREATE TABLE IF NOT EXISTS fiscal_trend (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  yr            TEXT    NOT NULL,
  estimate_type TEXT    NOT NULL DEFAULT 'BE',
  deficit       REAL    NOT NULL,
  deficit_abs   INTEGER NOT NULL DEFAULT 0,
  debt          REAL    NOT NULL,
  revenue       INTEGER NOT NULL,
  exp           INTEGER NOT NULL,
  note          TEXT,
  UNIQUE (yr, estimate_type)
);

CREATE INDEX IF NOT EXISTS idx_ministry_fy    ON ministry_budget(fiscal_year, estimate_type);
CREATE INDEX IF NOT EXISTS idx_revenue_fy     ON revenue_sources(fiscal_year, estimate_type);
CREATE INDEX IF NOT EXISTS idx_expenditure_fy ON expenditure_sectors(fiscal_year, estimate_type);
CREATE INDEX IF NOT EXISTS idx_capex_fy       ON capex_breakdown(fiscal_year, estimate_type);
CREATE INDEX IF NOT EXISTS idx_gdpcomp_fy     ON sector_gdp_comparison(fiscal_year, estimate_type);
