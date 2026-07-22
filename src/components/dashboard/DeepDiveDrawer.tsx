'use client';

import React from 'react';
import { useFilterStore } from '@/lib/store/useFilterStore';
import { X, MapPin, DollarSign, Percent, Church, ShieldAlert, Users } from 'lucide-react';

export function DeepDiveDrawer() {
  const { selectedFeature, setSelectedFeature } = useFilterStore();

  if (!selectedFeature) return null;

  const props = selectedFeature;
  const name = props.name || 'Selected Region';
  const state = props.state || '';
  const totalPop = Number(props.total_pop || 0).toLocaleString();
  const medianIncome = `$${Number(props.median_income || 0).toLocaleString()}`;
  const povertyRate = `${props.poverty_ratio || 0}%`;
  const fedOutlays = `$${Number(props.fed_obligations || (props.fed_per_capita * props.total_pop) || 0).toLocaleString()}`;
  const fedPerCapita = `$${Number(props.fed_per_capita || 0).toLocaleString()}`;
  const disasterFunding = `$${Number(props.disaster_funding || 0).toLocaleString()}`;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900/95 border-l border-white/10 backdrop-blur-2xl p-6 shadow-2xl overflow-y-auto space-y-6 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
              Localized Narrative Analysis
            </span>
            <h2 className="text-xl font-extrabold text-slate-100 mt-0.5">{name}</h2>
            {state && <p className="text-xs text-slate-400 font-medium">FIPS: {props.geoid} | State: {state}</p>}
          </div>
          <button
            onClick={() => setSelectedFeature(null)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Narrative Summary Card */}
        <div className="mt-4 p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed font-medium">
          💡 <strong>Storytelling Insight:</strong> {name} has a population of <strong>{totalPop}</strong> with a median household income of <strong>{medianIncome}</strong> and a poverty rate of <strong>{povertyRate}</strong>. It received <strong>{fedOutlays}</strong> in total federal funding obligations (<strong>{fedPerCapita}</strong> per capita) and contains <strong>{props.tot_congregations || 0}</strong> registered religious congregations.
        </div>

        {/* Metric Cards Grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
          <div className="glass-panel p-3 rounded-xl border border-white/10 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-400 font-semibold">
              <Users className="h-3.5 w-3.5 text-blue-400" />
              <span>Demographics</span>
            </div>
            <p className="text-base font-bold text-slate-100">{totalPop}</p>
            <p className="text-[11px] text-slate-400">Minority Ratio: {props.minority_pct || 0}%</p>
          </div>

          <div className="glass-panel p-3 rounded-xl border border-white/10 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-400 font-semibold">
              <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
              <span>Economic Income</span>
            </div>
            <p className="text-base font-bold text-slate-100">{medianIncome}</p>
            <p className="text-[11px] text-slate-400">Poverty Rate: {povertyRate}</p>
          </div>

          <div className="glass-panel p-3 rounded-xl border border-white/10 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-400 font-semibold">
              <DollarSign className="h-3.5 w-3.5 text-cyan-400" />
              <span>Fed Funding / Cap</span>
            </div>
            <p className="text-base font-bold text-slate-100">{fedPerCapita}</p>
            <p className="text-[11px] text-slate-400">Total: {fedOutlays}</p>
          </div>

          <div className="glass-panel p-3 rounded-xl border border-white/10 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-400 font-semibold">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
              <span>Disaster Outlays</span>
            </div>
            <p className="text-base font-bold text-slate-100">{disasterFunding}</p>
            <p className="text-[11px] text-slate-400">DEFC Emergency Code</p>
          </div>
        </div>

        {/* Religious Census Breakdown */}
        <div className="mt-5 glass-panel p-4 rounded-xl border border-white/10 space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-200">
            <div className="flex items-center space-x-1.5">
              <Church className="h-4 w-4 text-purple-400" />
              <span>U.S. Religion Census Adherence</span>
            </div>
            <span className="text-purple-400">{props.tot_congregations || 0} Congregations</span>
          </div>

          <div className="space-y-1.5 pt-1 text-slate-300">
            <div className="flex justify-between">
              <span>Catholic:</span>
              <span className="font-semibold text-purple-300">{props.catholic_pct || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span>Evangelical Protestant:</span>
              <span className="font-semibold text-pink-300">{props.evangelical_pct || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span>Mainline Protestant:</span>
              <span className="font-semibold text-blue-300">{props.mainline_pct || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span>Black Protestant:</span>
              <span className="font-semibold text-emerald-300">{props.black_prot_pct || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span>Muslim:</span>
              <span className="font-semibold text-amber-300">{props.muslim_pct || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span>Unclaimed / Non-religious:</span>
              <span className="font-semibold text-slate-400">{props.unclaimed_pct || 0}%</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setSelectedFeature(null)}
        className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
      >
        Close Deep Dive
      </button>
    </div>
  );
}
