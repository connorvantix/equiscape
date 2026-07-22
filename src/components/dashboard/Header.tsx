'use client';

import React, { useState } from 'react';
import { useFilterStore, GeoResolution } from '@/lib/store/useFilterStore';
import { Layers, Search, Share2, Upload, BookOpen, RefreshCw, Database } from 'lucide-react';

interface HeaderProps {
  onOpenByod: () => void;
  onOpenStories: () => void;
  totalRecordsCount: number;
}

export function Header({ onOpenByod, onOpenStories, totalRecordsCount }: HeaderProps) {
  const { resolution, setResolution, searchQuery, setSearchQuery, resetFilters } = useFilterStore();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

      {/* Center Search & Geographic Resolution Toggle */}
      <div className="flex items-center space-x-3 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search state or county name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl pl-9 pr-4 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Resolution Toggle */}
        <div className="glass-pill p-1 rounded-xl flex items-center border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setResolution('county')}
            className={`px-3 py-1 rounded-lg transition-all ${
              resolution === 'county'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            County ({totalRecordsCount})
          </button>
          <button
            onClick={() => setResolution('tract')}
            className={`px-3 py-1 rounded-lg transition-all ${
              resolution === 'tract'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Census Tract
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
          <span>Guided Stories</span>
        </button>

        <button
          onClick={onOpenByod}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition"
        >
          <Upload className="h-3.5 w-3.5 text-indigo-400" />
          <span>BYOD Upload</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold transition"
        >
          <Share2 className="h-3.5 w-3.5 text-slate-400" />
          <span>{copied ? 'Copied!' : 'Share State'}</span>
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
