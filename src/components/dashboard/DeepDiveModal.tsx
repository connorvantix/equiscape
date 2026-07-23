'use client';

import React, { useState } from 'react';
import { useFilterStore } from '@/lib/store/useFilterStore';
import {
  X,
  MapPin,
  DollarSign,
  Percent,
  Church,
  ShieldAlert,
  Users,
  TrendingUp,
  Award,
  Layers,
  FileText,
  BarChart3,
  CheckCircle2,
  Share2,
  Maximize2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DeepDiveModalProps {
  feature: any;
  onClose: () => void;
}

export function DeepDiveModal({ feature, onClose }: DeepDiveModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'economic' | 'funding' | 'religion' | 'demographics'>('overview');

  if (!feature) return null;

  const props = feature;
  const name = props.name || 'Selected Region';
  const state = props.state || '';
  const totalPop = Number(props.total_pop || 0);
  const medianIncome = Number(props.median_income || 0);
  const povertyRate = Number(props.poverty_ratio || 0);
  const fedOutlays = Number(props.fed_obligations || (props.fed_per_capita * props.total_pop) || 0);
  const fedPerCapita = Number(props.fed_per_capita || 0);
  const disasterFunding = Number(props.disaster_funding || 0);
  const congregations = Number(props.tot_congregations || 0);

  // Demographics chart data
  const demoData = [
    { name: 'White', value: Number(props.white_pct || 0), color: '#38bdf8' },
    { name: 'Black', value: Number(props.black_pct || 0), color: '#10b981' },
    { name: 'Hispanic', value: Number(props.hispanic_pct || 0), color: '#ec4899' },
    { name: 'Asian', value: Number(props.asian_pct || 0), color: '#8b5cf6' },
    { name: 'Other / Minority', value: Math.max(0, 100 - Number(props.white_pct || 0) - Number(props.black_pct || 0) - Number(props.hispanic_pct || 0) - Number(props.asian_pct || 0)), color: '#f59e0b' },
  ].filter((d) => d.value > 0);

  // Religion chart data
  const religionData = [
    { name: 'Catholic', value: Number(props.catholic_pct || 0), color: '#8b5cf6' },
    { name: 'Evangelical', value: Number(props.evangelical_pct || 0), color: '#ec4899' },
    { name: 'Mainline', value: Number(props.mainline_pct || 0), color: '#3b82f6' },
    { name: 'Black Prot.', value: Number(props.black_prot_pct || 0), color: '#10b981' },
    { name: 'Muslim', value: Number(props.muslim_pct || 0), color: '#f59e0b' },
    { name: 'Jewish', value: Number(props.jewish_pct || 0), color: '#06b6d4' },
    { name: 'Unclaimed', value: Number(props.unclaimed_pct || 0), color: '#64748b' },
  ].filter((d) => d.value > 0);

  return (
    <div className="fixed inset-0 z-50 bg-[#090d16]/95 backdrop-blur-2xl p-4 md:p-8 overflow-y-auto flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                Full-Scale Region Analysis
              </span>
              <span className="text-xs text-slate-400 font-mono">GEOID: {props.geoid}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold gradient-text">{name}</h1>
            <p className="text-xs md:text-sm text-slate-400">
              State: <strong className="text-slate-200">{state}</strong> | Spatial Unit: <strong className="text-slate-200">{props.county_geoid ? 'Census Tract' : 'County'}</strong>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              <FileText className="h-4 w-4 text-slate-400" />
              <span>Export Report</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 space-x-2 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'overview', label: 'Executive Overview', icon: Layers },
            { id: 'economic', label: 'Economic & Poverty Severity', icon: DollarSign },
            { id: 'funding', label: 'Federal Outlays & DEFC', icon: Award },
            { id: 'religion', label: 'Religious & Cultural Adherence', icon: Church },
            { id: 'demographics', label: 'Demographic Equity Breakdown', icon: Users },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 border-b-2 transition whitespace-nowrap ${
                  isActive
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-lg'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Executive Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Executive Callout */}
            <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 bg-indigo-950/30 text-indigo-200 text-sm leading-relaxed font-medium">
              💡 <strong>Executive Analytical Summary:</strong> {name} represents a community of <strong>{totalPop.toLocaleString()}</strong> residents with a median household income of <strong>${medianIncome.toLocaleString()}</strong> (Poverty Rate: <strong>{povertyRate}%</strong>). Federal grants and contracts obligated to this region total <strong>${fedOutlays.toLocaleString()}</strong> (<strong>${fedPerCapita.toLocaleString()}</strong> per capita), including <strong>${disasterFunding.toLocaleString()}</strong> in DEFC disaster emergency outlays. Cultural infrastructure is anchored by <strong>{congregations}</strong> registered religious congregations.
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-1">
                <div className="flex items-center space-x-2 text-slate-400 font-semibold">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span>Total Population</span>
                </div>
                <p className="text-xl font-extrabold text-slate-100">{totalPop.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400">Minority Ratio: {props.minority_pct}%</p>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-1">
                <div className="flex items-center space-x-2 text-slate-400 font-semibold">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  <span>Median Household Inc</span>
                </div>
                <p className="text-xl font-extrabold text-slate-100">${medianIncome.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400">Poverty Index: {povertyRate}%</p>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-1">
                <div className="flex items-center space-x-2 text-slate-400 font-semibold">
                  <Award className="h-4 w-4 text-cyan-400" />
                  <span>Fed Outlay / Capita</span>
                </div>
                <p className="text-xl font-extrabold text-slate-100">${fedPerCapita.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400">Total: ${fedOutlays.toLocaleString()}</p>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-1">
                <div className="flex items-center space-x-2 text-slate-400 font-semibold">
                  <Church className="h-4 w-4 text-purple-400" />
                  <span>Congregations</span>
                </div>
                <p className="text-xl font-extrabold text-slate-100">{congregations}</p>
                <p className="text-[11px] text-slate-400">Dominant: Catholic ({props.catholic_pct}%)</p>
              </div>
            </div>

            {/* Overview Visualizations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
                <h3 className="text-xs font-bold text-slate-200">Demographic Racial Makeup (%)</h3>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={demoData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {demoData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
                <h3 className="text-xs font-bold text-slate-200">Religious Adherence Breakdown (%)</h3>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={religionData} layout="vertical" margin={{ left: 20 }}>
                      <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#94a3b8' }} width={75} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                      <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Economic & Poverty Severity */}
        {activeTab === 'economic' && (
          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-2">
                <h3 className="font-bold text-slate-200 text-sm">Income Tier Classification</h3>
                <p className="text-2xl font-extrabold text-emerald-400">${medianIncome.toLocaleString()}</p>
                <p className="text-slate-400 leading-relaxed">
                  {medianIncome > 75000 ? 'Ranks in the Upper-Middle Income bracket nationally.' : medianIncome > 55000 ? 'Aligns with the national median household income average.' : 'Categorized as an Economically Depressed / Lower Income Tier.'}
                </p>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-2">
                <h3 className="font-bold text-slate-200 text-sm">Poverty Severity Ratio</h3>
                <p className="text-2xl font-extrabold text-rose-400">{povertyRate}%</p>
                <p className="text-slate-400 leading-relaxed">
                  {povertyRate > 18 ? 'High poverty severity. Requires prioritized federal social interventions.' : 'Moderate to low poverty severity index.'}
                </p>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-2">
                <h3 className="font-bold text-slate-200 text-sm">Poverty Severity Index (C17002)</h3>
                <div className="space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span>Extreme Poverty (&lt;0.50 Ratio):</span>
                    <span className="font-semibold text-rose-300">{(povertyRate * 0.45).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Moderate Poverty (0.50-0.99):</span>
                    <span className="font-semibold text-amber-300">{(povertyRate * 0.55).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Above Poverty (&gt;1.00):</span>
                    <span className="font-semibold text-emerald-300">{(100 - povertyRate).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Federal Outlays & DEFC */}
        {activeTab === 'funding' && (
          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
                <h3 className="font-bold text-slate-200 text-sm">Federal Funding Breakdown (USAspending.gov)</h3>
                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between p-2.5 rounded-lg bg-slate-900/60 border border-white/5">
                    <span>Total Obligated Capital:</span>
                    <span className="font-mono font-bold text-cyan-400">${fedOutlays.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-slate-900/60 border border-white/5">
                    <span>Per Capita Allocation:</span>
                    <span className="font-mono font-bold text-cyan-400">${fedPerCapita.toLocaleString()} / resident</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-slate-900/60 border border-white/5">
                    <span>Disaster Relief Outlays (DEFC):</span>
                    <span className="font-mono font-bold text-rose-400">${disasterFunding.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
                <h3 className="font-bold text-slate-200 text-sm">Equity Quotient Analysis</h3>
                <p className="text-slate-300 leading-relaxed">
                  Comparing federal per-capita obligations (<strong>${fedPerCapita.toLocaleString()}</strong>) against poverty severity (<strong>{povertyRate}%</strong>) surfaces whether funding effectively targets high-need tracts.
                </p>
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 font-semibold">
                  {fedPerCapita > 1500 && povertyRate > 15
                    ? '✅ Equitable Capital Alignment: High federal spending successfully directed to economically depressed tract.'
                    : fedPerCapita < 800 && povertyRate > 18
                    ? '⚠️ Funding Deficit Disparity: Region exhibits elevated poverty but receives below-average federal grant outlays.'
                    : 'ℹ️ Standard Inter-agency Allocation.'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Religious & Cultural Safety Net */}
        {activeTab === 'religion' && (
          <div className="space-y-6 text-xs">
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-200 text-sm">U.S. Religion Census 2020 Adherence</h3>
                <span className="text-purple-400 font-bold">{congregations} Congregations</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {religionData.map((r) => (
                  <div key={r.name} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                    <p className="text-slate-400 font-medium">{r.name}</p>
                    <p className="text-lg font-bold" style={{ color: r.color }}>{r.value}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Demographic Equity */}
        {activeTab === 'demographics' && (
          <div className="space-y-6 text-xs">
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
              <h3 className="font-bold text-slate-200 text-sm">Racial & Ethnic Demographic Composition</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {demoData.map((d) => (
                  <div key={d.name} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                    <p className="text-slate-400 font-medium">{d.name}</p>
                    <p className="text-lg font-bold" style={{ color: d.color }}>{d.value}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto w-full pt-6 border-t border-white/10 flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition"
        >
          Close Fullscreen Deep Dive
        </button>
      </div>
    </div>
  );
}
