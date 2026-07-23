'use client';

import React from 'react';
import { useFilterStore } from '@/lib/store/useFilterStore';
import { CITIES } from '@/lib/cities/cityData';
import { Sliders, DollarSign, Percent, Church, ShieldAlert, RotateCcw, Building2, MapPin } from 'lucide-react';

export function FilterPanel() {
  const {
    incomeRange,
    setIncomeRange,
    povertyRange,
    setPovertyRange,
    fedFundingRange,
    setFedFundingRange,
    religiousGroup,
    setReligiousGroup,
    religiousMinPct,
    setReligiousMinPct,
    defcOnly,
    setDefcOnly,
    selectedCityId,
    setSelectedCityId,
    selectedNeighborhoodId,
    setSelectedNeighborhoodId,
    setResolution,
    resetFilters,
  } = useFilterStore();

  const selectedCity = CITIES.find((c) => c.id === selectedCityId);

  const handleCityChange = (cityId: string) => {
    if (!cityId) {
      setSelectedCityId(null);
    } else {
      setSelectedCityId(cityId);
      setResolution('tract');
    }
  };

  return (
    <aside className="glass-panel rounded-2xl p-4 space-y-5 border border-white/10 text-xs w-full">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <Sliders className="h-4 w-4 text-indigo-400" />
          <h3 className="font-bold text-slate-200 text-sm">Cross-Filter Controls</h3>
        </div>
        <button
          onClick={resetFilters}
          className="text-slate-400 hover:text-slate-200 text-[11px] flex items-center space-x-1 transition"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* City & Neighborhood Selector Controls */}
      <div className="space-y-2.5 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-1.5 text-slate-200 font-semibold">
          <Building2 className="h-3.5 w-3.5 text-indigo-400" />
          <span>Metropolitan City & Neighborhood</span>
        </div>

        <div className="space-y-2">
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Target US City</label>
            <select
              value={selectedCityId || ''}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1.5 text-slate-200 font-medium"
            >
              <option value="">All US Cities & Counties</option>
              {CITIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}, {c.state}
                </option>
              ))}
            </select>
          </div>

          {selectedCity && (
            <div>
              <label className="block text-[10px] text-indigo-300 mb-1 font-semibold flex items-center space-x-1">
                <MapPin className="h-3 w-3 text-indigo-400" />
                <span>Select Neighborhood in {selectedCity.name}</span>
              </label>
              <select
                value={selectedNeighborhoodId || ''}
                onChange={(e) => setSelectedNeighborhoodId(e.target.value || null)}
                className="w-full bg-indigo-950/80 border border-indigo-500/50 rounded-lg px-2 py-1.5 text-indigo-200 font-medium"
              >
                <option value="">All Neighborhoods in {selectedCity.name}</option>
                {selectedCity.neighborhoods.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Median Household Income Slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-slate-300">
          <span className="font-semibold flex items-center space-x-1">
            <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
            <span>Median Household Income</span>
          </span>
          <span className="text-emerald-400 font-mono font-bold">
            ${incomeRange[0].toLocaleString()} - ${incomeRange[1].toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min="25000"
          max="150000"
          step="5000"
          value={incomeRange[1]}
          onChange={(e) => setIncomeRange([incomeRange[0], parseInt(e.target.value)])}
          className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
        />
      </div>

      {/* Poverty Rate Slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-slate-300">
          <span className="font-semibold flex items-center space-x-1">
            <Percent className="h-3.5 w-3.5 text-rose-400" />
            <span>Poverty Rate Threshold</span>
          </span>
          <span className="text-rose-400 font-mono font-bold">
            {povertyRange[0]}% - {povertyRange[1]}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="45"
          step="1"
          value={povertyRange[1]}
          onChange={(e) => setPovertyRange([povertyRange[0], parseInt(e.target.value)])}
          className="w-full accent-rose-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
        />
      </div>

      {/* Federal Funding Per Capita Slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-slate-300">
          <span className="font-semibold flex items-center space-x-1">
            <DollarSign className="h-3.5 w-3.5 text-cyan-400" />
            <span>Fed Outlays / Capita</span>
          </span>
          <span className="text-cyan-400 font-mono font-bold">
            ${fedFundingRange[0]} - ${fedFundingRange[1]}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="5000"
          step="100"
          value={fedFundingRange[1]}
          onChange={(e) => setFedFundingRange([fedFundingRange[0], parseInt(e.target.value)])}
          className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
        />
      </div>

      {/* U.S. Religion Census Filter */}
      <div className="space-y-2 border-t border-white/10 pt-3">
        <div className="flex items-center space-x-1.5 text-slate-300 font-semibold">
          <Church className="h-3.5 w-3.5 text-purple-400" />
          <span>Cultural & Religious Adherence</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Religious Body</label>
            <select
              value={religiousGroup}
              onChange={(e) => setReligiousGroup(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1 text-slate-200"
            >
              <option value="all">All Groups</option>
              <option value="catholic_pct">Catholic</option>
              <option value="evangelical_pct">Evangelical Protestant</option>
              <option value="mainline_pct">Mainline Protestant</option>
              <option value="black_prot_pct">Black Protestant</option>
              <option value="muslim_pct">Muslim</option>
              <option value="jewish_pct">Jewish</option>
              <option value="unclaimed_pct">Unclaimed / Non-religious</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Min Adherence ({religiousMinPct}%)</label>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={religiousMinPct}
              onChange={(e) => setReligiousMinPct(parseInt(e.target.value))}
              className="w-full accent-purple-500 bg-slate-800 rounded-lg cursor-pointer h-1.5 mt-2"
            />
          </div>
        </div>
      </div>

      {/* Emergency Disaster Funding DEFC Checkbox */}
      <div className="border-t border-white/10 pt-3">
        <label className="flex items-center space-x-2.5 cursor-pointer text-slate-300">
          <input
            type="checkbox"
            checked={defcOnly}
            onChange={(e) => setDefcOnly(e.target.checked)}
            className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
          />
          <div className="flex items-center space-x-1.5">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-semibold text-slate-200">Isolate Disaster Relief Outlays (DEFC)</span>
          </div>
        </label>
      </div>
    </aside>
  );
}
