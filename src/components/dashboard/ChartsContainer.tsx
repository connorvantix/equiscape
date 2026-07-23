'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  CartesianGrid,
} from 'recharts';
import { BarChart3, ScatterChart as ScatterIcon, TrendingUp } from 'lucide-react';

interface ChartsContainerProps {
  records: Record<string, any>[];
}

export function ChartsContainer({ records }: ChartsContainerProps) {
  // Aggregate Top 8 regions by Federal Per Capita spending
  const topSpendingData = [...records]
    .sort((a, b) => Number(b.fed_per_capita || 0) - Number(a.fed_per_capita || 0))
    .slice(0, 8)
    .map((r) => ({
      name: (r.name || 'Region').split(',')[0],
      fedPerCap: Number(r.fed_per_capita || 0),
      poverty: Number(r.poverty_ratio || 0),
      income: Number(r.median_income || 0),
    }));

  // Scatter plot data for Minority % vs Federal Per Capita
  const scatterData = records.slice(0, 30).map((r) => ({
    x: Number(r.minority_pct || 0),
    y: Number(r.fed_per_capita || 0),
    z: Number(r.total_pop || 1000),
    name: r.name,
  }));

  // Calculate average religious adherence breakdown across current filtered dataset
  const avgCatholic = Math.round(records.reduce((acc, r) => acc + Number(r.catholic_pct || 0), 0) / Math.max(1, records.length));
  const avgEvan = Math.round(records.reduce((acc, r) => acc + Number(r.evangelical_pct || 0), 0) / Math.max(1, records.length));
  const avgMain = Math.round(records.reduce((acc, r) => acc + Number(r.mainline_pct || 0), 0) / Math.max(1, records.length));
  const avgBlackProt = Math.round(records.reduce((acc, r) => acc + Number(r.black_prot_pct || 0), 0) / Math.max(1, records.length));
  const avgMuslim = Math.round(records.reduce((acc, r) => acc + Number(r.muslim_pct || 0), 0) / Math.max(1, records.length));
  const avgUnclaimed = Math.round(records.reduce((acc, r) => acc + Number(r.unclaimed_pct || 0), 0) / Math.max(1, records.length));

  const religionChartData = [
    { group: 'Catholic', pct: avgCatholic, fill: '#8b5cf6' },
    { group: 'Evangelical', pct: avgEvan, fill: '#ec4899' },
    { group: 'Mainline', pct: avgMain, fill: '#3b82f6' },
    { group: 'Black Prot.', pct: avgBlackProt, fill: '#10b981' },
    { group: 'Muslim', pct: avgMuslim, fill: '#f59e0b' },
    { group: 'Unclaimed', pct: avgUnclaimed, fill: '#64748b' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
      {/* Chart 1: Federal Outlays / Capita */}
      <div className="glass-panel rounded-2xl p-3.5 border border-white/10 flex flex-col justify-between">
        <div className="flex items-center space-x-2 mb-2">
          <BarChart3 className="h-4 w-4 text-cyan-400" />
          <h4 className="text-xs font-bold text-slate-200">Top Fed Spending / Capita ($)</h4>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topSpendingData} margin={{ top: 5, right: 10, left: -20, bottom: 25 }}>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} angle={-25} textAnchor="end" />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
              />
              <Bar dataKey="fedPerCap" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Religious Adherence Profile */}
      <div className="glass-panel rounded-2xl p-3.5 border border-white/10 flex flex-col justify-between">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="h-4 w-4 text-purple-400" />
          <h4 className="text-xs font-bold text-slate-200">Filtered Religious Adherence Avg (%)</h4>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={religionChartData} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
              <XAxis type="number" tick={{ fontSize: 9, fill: '#94a3b8' }} />
              <YAxis dataKey="group" type="category" tick={{ fontSize: 9, fill: '#94a3b8' }} width={65} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
              />
              <Bar dataKey="pct" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Demographic Equity Scatter Plot */}
      <div className="glass-panel rounded-2xl p-3.5 border border-white/10 flex flex-col justify-between">
        <div className="flex items-center space-x-2 mb-2">
          <ScatterIcon className="h-4 w-4 text-pink-400" />
          <h4 className="text-xs font-bold text-slate-200">Minority % vs Fed Grants / Capita</h4>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" dataKey="x" name="Minority %" unit="%" tick={{ fontSize: 9, fill: '#94a3b8' }} />
              <YAxis type="number" dataKey="y" name="Fed Outlay" unit="$" tick={{ fontSize: 9, fill: '#94a3b8' }} />
              <ZAxis type="number" dataKey="z" range={[40, 200]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
              />
              <Scatter data={scatterData} fill="#ec4899" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
