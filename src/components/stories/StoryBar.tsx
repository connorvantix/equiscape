'use client';

import React from 'react';
import { useFilterStore } from '@/lib/store/useFilterStore';
import { Sparkles, DollarSign, ShieldAlert, Church, X } from 'lucide-react';

interface StoryBarProps {
  onClose: () => void;
}

export function StoryBar({ onClose }: StoryBarProps) {
  const {
    setPovertyRange,
    setReligiousGroup,
    setReligiousMinPct,
    setFedFundingRange,
    setDefcOnly,
    setBivariateVars,
    setActiveStoryId,
    activeStoryId,
  } = useFilterStore();

  const stories = [
    {
      id: 'religious_clustering',
      title: 'Economics of Religious Clustering',
      icon: Church,
      color: 'from-amber-500 to-orange-600',
      description: 'Analyze regions where high poverty rates (>18%) intersect with dense Catholic and Evangelical congregations.',
      apply: () => {
        setActiveStoryId('religious_clustering');
        setPovertyRange([18, 45]);
        setReligiousGroup('catholic_pct');
        setReligiousMinPct(25);
        setBivariateVars('poverty_ratio', 'catholic_pct');
      },
    },
    {
      id: 'funding_equity',
      title: 'Federal Funding vs Demographic Equity',
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-600',
      description: 'Expose whether federal grants and contracts target communities with high minority population density.',
      apply: () => {
        setActiveStoryId('funding_equity');
        setPovertyRange([0, 45]);
        setReligiousGroup('all');
        setReligiousMinPct(0);
        setFedFundingRange([500, 5000]);
        setBivariateVars('minority_pct', 'fed_per_capita');
      },
    },
    {
      id: 'disaster_resilience',
      title: 'Disaster Relief & Systemic Shocks',
      icon: ShieldAlert,
      color: 'from-rose-500 to-red-600',
      description: 'Track DEFC emergency outlays (COVID/Natural Disasters) mapped against economically vulnerable tracts.',
      apply: () => {
        setActiveStoryId('disaster_resilience');
        setDefcOnly(true);
        setPovertyRange([15, 45]);
        setBivariateVars('poverty_ratio', 'disaster_funding');
      },
    },
  ];

  return (
    <div className="glass-panel border-b border-indigo-500/20 bg-slate-900/90 p-4 relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-slate-200">Guided Analytical Narratives</h2>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {stories.map((s) => {
          const Icon = s.icon;
          const isActive = activeStoryId === s.id;
          return (
            <div
              key={s.id}
              onClick={s.apply}
              className={`cursor-pointer p-3 rounded-xl border transition-all ${
                isActive
                  ? 'bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-2.5 mb-1.5">
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${s.color} text-white`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-xs font-bold text-slate-100">{s.title}</h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">{s.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
