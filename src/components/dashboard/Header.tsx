'use client';

import React, { useState } from 'react';
import { useFilterStore, GeoResolution } from '@/lib/store/useFilterStore';
import { CITIES } from '@/lib/cities/cityData';
import { Search, Share2, Upload, BookOpen, RefreshCw, Database, Building2, MapPin } from 'lucide-react';

interface HeaderProps {
  onOpenByod: () => void;
  onOpenStories: () => void;
  totalRecordsCount: number;
}

export function Header({ onOpenByod, onOpenStories, totalRecordsCount }: HeaderProps) {
  const {
    resolution,
    setResolution,
    searchQuery,
    setSearchQuery,
    selectedCityId,
    setSelectedCityId,
    selectedNeighborhoodId,
    setSelectedNeighborhoodId,
    resetFilters,
  } = useFilterStore();
  const [copied, setCopied] = useState(false);

  const selectedCity = CITIES.find((c) => c.id === selectedCityId);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCityChange = (cityId: string) => {
    if (!cityId) {
      setSelectedCityId(null);
    } else {
      setSelectedCityId(cityId);
      setResolution('tract'); // Auto-switch to Neighborhood / Tract level when city selected!
    }
  };

  return (
    <header className="glass-panel border-b border-white/10 px-4 py-3 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Database className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold gradient-text tracking-wide leading-tight">EquiScape</h1>
          <p className="text-xs text-slate-400 font-medium">Socioeconomic & Cultural Geo-Visualization Engine</p>
        </div>
      </div>

      {/* Center Search, City & Neighborhood Selectors */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1 max-w-2xl">
        {/* City Filter Selector */}
        <div className="relative">
          <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200">
            <Building2 className="h-3.5 w-3.5 text-indigo-400" />
            <select
              value={selectedCityId || ''}
              onChange={(e) => handleCityChange(e.target.value)}
              className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-slate-900 text-slate-400">All US Cities</option>
              {CITIES.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">
                  {c.name}, {c.state}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Neighborhood Selector (if city selected) */}
        {selectedCity && (
          <div className="relative">
            <div className="flex items-center space-x-1.5 bg-indigo-950/70 border border-indigo-500/40 rounded-xl px-2.5 py-1.5 text-xs text-indigo-200">
              <MapPin className="h-3.5 w-3.5 text-indigo-400" />
              <select
                value={selectedNeighborhoodId || ''}
                onChange={(e) => setSelectedNeighborhoodId(e.target.value || null)}
                className="bg-transparent text-xs text-indigo-200 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="" className="bg-slate-900 text-slate-400">All Neighborhoods in {selectedCity.name}</option>
                {selectedCity.neighborhoods.map((n) => (
                  <option key={n.id} value={n.id} className="bg-slate-900 text-slate-200">
                    {n.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Search Input */}
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search state, county, or neighborhood..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Resolution Toggle */}
        <div className="glass-pill p-1 rounded-xl flex items-center border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setResolution('county')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              resolution === 'county'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            County ({totalRecordsCount})
          </button>
          <button
            onClick={() => setResolution('tract')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              resolution === 'tract'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Neighborhood / Tract
          </button>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenStories}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-semibold transition"
        >
          <BookOpen className="h-3.5 w-3.5 text-purple-400" />
          <span className="hidden sm:inline">Guided Stories</span>
        </button>

        <button
          onClick={onOpenByod}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition"
        >
          <Upload className="h-3.5 w-3.5 text-indigo-400" />
          <span className="hidden sm:inline">BYOD</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold transition"
        >
          <Share2 className="h-3.5 w-3.5 text-slate-400" />
          <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
        </button>

        <button
          onClick={resetFilters}
          title="Reset Filters"
          className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
