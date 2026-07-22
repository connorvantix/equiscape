'use client';

import React from 'react';
import { useFilterStore } from '@/lib/store/useFilterStore';
import { Layers } from 'lucide-react';

export const BIVARIATE_PALETTE = [
  ['#e8e8e8', '#ace4e4', '#5ac8c8'], // Low Y (X: Low, Med, High)
  ['#8a5e8f', '#8e8aa0', '#6bb1cc'], // Med Y (X: Low, Med, High)
  ['#3f297e', '#4354a5', '#2b83ba'], // High Y (X: Low, Med, High)
];

const VAR_LABELS: Record<string, string> = {
  median_income: 'Median Income',
  poverty_ratio: 'Poverty Rate %',
  fed_per_capita: 'Fed Funding / Cap',
  minority_pct: 'Minority %',
  catholic_pct: 'Catholic %',
  evangelical_pct: 'Evangelical %',
  disaster_funding: 'Disaster Outlays',
};

export function BivariateLegend() {
  const { bivariateMode, bivariateVarX, bivariateVarY, setBivariateMode, setBivariateVars } = useFilterStore();

  const xLabel = VAR_LABELS[bivariateVarX] || bivariateVarX;
  const yLabel = VAR_LABELS[bivariateVarY] || bivariateVarY;

  return (
    <div className="glass-panel rounded-2xl p-3 border border-white/10 text-xs w-64 shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1.5 font-bold text-slate-200">
          <Layers className="h-3.5 w-3.5 text-indigo-400" />
          <span>Bivariate Choropleth</span>
        </div>
        <button
          onClick={() => setBivariateMode(!bivariateMode)}
          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
            bivariateMode ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
          }`}
        >
          {bivariateMode ? 'ON' : 'OFF'}
        </button>
      </div>

      {bivariateMode ? (
        <div>
          {/* Variable selectors */}
          <div className="grid grid-cols-2 gap-1.5 mb-2.5">
            <div>
              <label className="block text-[10px] text-slate-400 font-medium mb-0.5">X-Axis (Horizontal)</label>
              <select
                value={bivariateVarX}
                onChange={(e) => setBivariateVars(e.target.value, bivariateVarY)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-[11px] text-slate-200"
              >
                <option value="poverty_ratio">Poverty Rate %</option>
                <option value="median_income">Median Income</option>
                <option value="minority_pct">Minority %</option>
                <option value="catholic_pct">Catholic %</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Y-Axis (Vertical)</label>
              <select
                value={bivariateVarY}
                onChange={(e) => setBivariateVars(bivariateVarX, e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-[11px] text-slate-200"
              >
                <option value="fed_per_capita">Fed Funding / Cap</option>
                <option value="disaster_funding">Disaster Outlays</option>
                <option value="evangelical_pct">Evangelical %</option>
                <option value="catholic_pct">Catholic %</option>
              </select>
            </div>
          </div>

          {/* 3x3 Grid Matrix */}
          <div className="relative pt-4 pl-4">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-slate-400 font-semibold uppercase tracking-wider origin-center">
              {yLabel} ↑
            </div>

            <div className="grid grid-cols-3 gap-1 w-36 h-36 mx-auto">
              {[2, 1, 0].map((yIdx) =>
                [0, 1, 2].map((xIdx) => (
                  <div
                    key={`${xIdx}-${yIdx}`}
                    style={{ backgroundColor: BIVARIATE_PALETTE[yIdx][xIdx] }}
                    className="rounded-sm transition-transform hover:scale-105 border border-black/20"
                    title={`X: ${xLabel} (${xIdx === 0 ? 'Low' : xIdx === 1 ? 'Med' : 'High'}), Y: ${yLabel} (${yIdx === 0 ? 'Low' : yIdx === 1 ? 'Med' : 'High'})`}
                  />
                ))
              )}
            </div>

            <div className="text-center mt-1.5 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {xLabel} →
            </div>
          </div>
        </div>
      ) : (
        <p className="text-[11px] text-slate-400">Univariate rendering mode active.</p>
      )}
    </div>
  );
}
