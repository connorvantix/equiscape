'use client';

import React, { useState } from 'react';
import { useFilterStore } from '@/lib/store/useFilterStore';
import { Terminal, Copy, Check, ChevronDown, ChevronUp, Zap } from 'lucide-react';

interface SqlViewerProps {
  executionTimeMs: number;
  resultCount: number;
}

export function SqlViewer({ executionTimeMs, resultCount }: SqlViewerProps) {
  const { generatedSql } = useFilterStore();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel rounded-xl border border-white/10 overflow-hidden text-xs">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-3 py-2 bg-slate-900/90 cursor-pointer hover:bg-slate-800/80 transition"
      >
        <div className="flex items-center space-x-2">
          <Terminal className="h-3.5 w-3.5 text-indigo-400" />
          <span className="font-mono font-semibold text-slate-300">Live DuckDB SQL Engine Query</span>
          <div className="flex items-center space-x-1.5 ml-2 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px]">
            <Zap className="h-2.5 w-2.5 text-amber-400" />
            <span>{executionTimeMs}ms execution</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">({resultCount} rows returned)</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
            title="Copy SQL"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </div>
      </div>

      {isOpen && (
        <div className="p-3 bg-slate-950/90 font-mono text-[11px] text-indigo-200 border-t border-white/10 overflow-x-auto whitespace-pre-wrap leading-relaxed">
          {generatedSql || 'SELECT * FROM counties;'}
        </div>
      )}
    </div>
  );
}
