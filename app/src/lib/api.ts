export interface MinistryRow   { id:number; name:string; alloc:number; spent:number; pct:number }
export interface RevenueRow    { id:number; name:string; amt:number; pct:number; type:string; yoy:number; color:string; note:string }
export interface ExpenditureRow{ id:number; sector:string; amt:number; pct:number; type:string; color:string; note:string }
export interface CapexRow      { id:number; name:string; amt:number; yoy:number; pct_gdp:number; note:string }
export interface GdpCompRow    { id:number; sector:string; india:number; world_avg:number; developed:number; recommended:number }
export interface FiscalRow     { id:number; yr:string; deficit:number; deficit_abs:number; debt:number; revenue:number; exp:number; note:string; estimate_type:string }

const get = <T>(url: string): Promise<T> => fetch(url).then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() as Promise<T>; });

export const api = {
  ministry:      (fy = 'FY26', et = 'BE') => get<MinistryRow[]>(`/api/budget/ministry?fy=${fy}&et=${et}`),
  revenue:       (fy = 'FY26', et = 'BE') => get<RevenueRow[]>(`/api/budget/revenue?fy=${fy}&et=${et}`),
  expenditure:   (fy = 'FY26', et = 'BE') => get<ExpenditureRow[]>(`/api/budget/expenditure?fy=${fy}&et=${et}`),
  capex:         (fy = 'FY26', et = 'BE') => get<CapexRow[]>(`/api/budget/capex?fy=${fy}&et=${et}`),
  gdpComparison: (fy = 'FY26', et = 'BE') => get<GdpCompRow[]>(`/api/budget/gdp-comparison?fy=${fy}&et=${et}`),
  fiscalTrend:   (canonical = false)      => get<FiscalRow[]>(`/api/budget/fiscal-trend${canonical ? '?canonical=1' : ''}`),
};
