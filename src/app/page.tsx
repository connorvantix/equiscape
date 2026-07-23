'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useFilterStore, buildDuckDBSql } from '@/lib/store/useFilterStore';
import { runQuery } from '@/lib/duckdb/duckdbClient';
import { Header } from '@/components/dashboard/Header';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { MapView } from '@/components/map/MapView';
import { BivariateLegend } from '@/components/map/BivariateLegend';
import { ChartsContainer } from '@/components/dashboard/ChartsContainer';
import { SqlViewer } from '@/components/dashboard/SqlViewer';
import { StoryBar } from '@/components/stories/StoryBar';
import { DeepDiveDrawer } from '@/components/dashboard/DeepDiveDrawer';
import { ByodModal } from '@/components/dashboard/ByodModal';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const filterState = useFilterStore();
  const { setGeneratedSql } = filterState;

  const [records, setRecords] = useState<Record<string, any>[]>([]);
  const [executionTimeMs, setExecutionTimeMs] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [showStories, setShowStories] = useState(true);
  const [showByod, setShowByod] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Execute DuckDB WASM query whenever filter state mutates
  useEffect(() => {
    const sql = buildDuckDBSql(filterState);
    setGeneratedSql(sql);

    const startTime = performance.now();
    startTransition(async () => {
      try {
        const results = await runQuery(sql);
        const endTime = performance.now();
        setExecutionTimeMs(Math.round(endTime - startTime));
        setRecords(results);
      } catch (err) {
        console.error('Failed executing DuckDB query:', err);
      } finally {
        setInitialLoading(false);
      }
    });
  }, [
    filterState.resolution,
    filterState.incomeRange,
    filterState.povertyRange,
    filterState.fedFundingRange,
    filterState.religiousGroup,
    filterState.religiousMinPct,
    filterState.defcOnly,
    filterState.searchQuery,
    filterState.selectedCityId,
    filterState.selectedNeighborhoodId,
    setGeneratedSql,
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 font-sans">
      {/* Header Bar */}
      <Header
        onOpenByod={() => setShowByod(true)}
        onOpenStories={() => setShowStories(!showStories)}
        totalRecordsCount={records.length}
      />

      {/* Guided Narratives Bar */}
      {showStories && <StoryBar onClose={() => setShowStories(false)} />}

      {/* Main App Workspace */}
      <main className="flex-1 p-4 max-w-[1720px] mx-auto w-full space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
          {/* Left Column: Filter Controls & Bivariate Legend */}
          <div className="lg:col-span-1 space-y-4">
            <FilterPanel />
            <BivariateLegend />
          </div>

          {/* Right Column: High-Performance Map View */}
          <div className="lg:col-span-3 h-[580px] relative">
            {(initialLoading || isPending) && (
              <div className="absolute top-4 right-4 z-20 glass-pill px-3 py-1.5 rounded-full flex items-center space-x-2 text-xs font-medium text-indigo-300 shadow-lg">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
                <span>DuckDB WASM Querying...</span>
              </div>
            )}
            <MapView filteredRecords={records} />
          </div>
        </div>

        {/* Bottom Section: Analytical Charts & SQL Query Engine Viewer */}
        <div className="space-y-4">
          <ChartsContainer records={records} />
          <SqlViewer executionTimeMs={executionTimeMs} resultCount={records.length} />
        </div>
      </main>

      {/* Localized Storytelling Deep Dive Drawer & Modal */}
      <DeepDiveDrawer />

      {/* Bring-Your-Own-Data Upload Modal */}
      {showByod && (
        <ByodModal
          onClose={() => setShowByod(false)}
          onDataJoined={() => {
            const sql = buildDuckDBSql(filterState);
            runQuery(sql).then(setRecords);
          }}
        />
      )}
    </div>
  );
}
