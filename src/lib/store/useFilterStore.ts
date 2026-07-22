import { create } from 'zustand';

export type GeoResolution = 'county' | 'tract';

export interface FilterState {
  resolution: GeoResolution;
  incomeRange: [number, number];
  povertyRange: [number, number];
  fedFundingRange: [number, number];
  religiousGroup: string;
  religiousMinPct: number;
  defcOnly: boolean;
  bivariateMode: boolean;
  bivariateVarX: string;
  bivariateVarY: string;
  searchQuery: string;
  activeStoryId: string | null;
  selectedFeature: any | null;
  generatedSql: string;

  // Actions
  setResolution: (res: GeoResolution) => void;
  setIncomeRange: (range: [number, number]) => void;
  setPovertyRange: (range: [number, number]) => void;
  setFedFundingRange: (range: [number, number]) => void;
  setReligiousGroup: (group: string) => void;
  setReligiousMinPct: (min: number) => void;
  setDefcOnly: (val: boolean) => void;
  setBivariateMode: (val: boolean) => void;
  setBivariateVars: (x: string, y: string) => void;
  setSearchQuery: (q: string) => void;
  setActiveStoryId: (id: string | null) => void;
  setSelectedFeature: (feature: any | null) => void;
  setGeneratedSql: (sql: string) => void;
  resetFilters: () => void;
}

export const INITIAL_VALUES = {
  resolution: 'county' as GeoResolution,
  incomeRange: [25000, 150000] as [number, number],
  povertyRange: [0, 45] as [number, number],
  fedFundingRange: [0, 5000] as [number, number],
  religiousGroup: 'all',
  religiousMinPct: 0,
  defcOnly: false,
  bivariateMode: true,
  bivariateVarX: 'poverty_ratio',
  bivariateVarY: 'fed_per_capita',
  searchQuery: '',
  activeStoryId: null as string | null,
  selectedFeature: null as any | null,
  generatedSql: '',
};

export function buildDuckDBSql(state: FilterState | typeof INITIAL_VALUES) {
  const table = state.resolution === 'county' ? 'counties' : 'tracts';
  const conditions: string[] = [];

  const inc = state.incomeRange || [25000, 150000];
  if (inc[0] > 25000 || inc[1] < 150000) {
    conditions.push(`median_income BETWEEN ${inc[0]} AND ${inc[1]}`);
  }

  const pov = state.povertyRange || [0, 45];
  if (pov[0] > 0 || pov[1] < 45) {
    conditions.push(`poverty_ratio BETWEEN ${pov[0]} AND ${pov[1]}`);
  }

  const fed = state.fedFundingRange || [0, 5000];
  if (fed[0] > 0 || fed[1] < 5000) {
    conditions.push(`fed_per_capita BETWEEN ${fed[0]} AND ${fed[1]}`);
  }

  if (state.religiousGroup && state.religiousGroup !== 'all' && (state.religiousMinPct || 0) > 0) {
    conditions.push(`${state.religiousGroup} >= ${state.religiousMinPct}`);
  }

  if (state.defcOnly) {
    conditions.push(`disaster_funding > 0`);
  }

  if (state.searchQuery && state.searchQuery.trim()) {
    const q = state.searchQuery.trim().replace(/'/g, "''");
    conditions.push(`(name ILIKE '%${q}%' OR state ILIKE '%${q}%')`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  return `SELECT geoid, name, state, median_income, poverty_ratio, fed_per_capita, total_pop, minority_pct, catholic_pct, evangelical_pct, mainline_pct, muslim_pct, jewish_pct, unclaimed_pct, disaster_funding, latitude, longitude FROM ${table} ${whereClause} ORDER BY total_pop DESC;`;
}

export const useFilterStore = create<FilterState>((set) => ({
  ...INITIAL_VALUES,
  setResolution: (res) => set({ resolution: res }),
  setIncomeRange: (range) => set({ incomeRange: range }),
  setPovertyRange: (range) => set({ povertyRange: range }),
  setFedFundingRange: (range) => set({ fedFundingRange: range }),
  setReligiousGroup: (group) => set({ religiousGroup: group }),
  setReligiousMinPct: (min) => set({ religiousMinPct: min }),
  setDefcOnly: (val: boolean) => set({ defcOnly: val }),
  setBivariateMode: (val: boolean) => set({ bivariateMode: val }),
  setBivariateVars: (x: string, y: string) => set({ bivariateVarX: x, bivariateVarY: y }),
  setSearchQuery: (q: string) => set({ searchQuery: q }),
  setActiveStoryId: (id: string | null) => set({ activeStoryId: id }),
  setSelectedFeature: (feature: any | null) => set({ selectedFeature: feature }),
  setGeneratedSql: (sql: string) => set({ generatedSql: sql }),
  resetFilters: () => set({ ...INITIAL_VALUES }),
}));
