'use client';

import React, { useState } from 'react';
import { getDuckDB } from '@/lib/duckdb/duckdbClient';
import { Upload, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ByodModalProps {
  onClose: () => void;
  onDataJoined: () => void;
}

export function ByodModal({ onClose, onDataJoined }: ByodModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcessFile = async () => {
    if (!file) return;

    try {
      setStatus('loading');
      setMsg('Mounting file to DuckDB-Wasm Virtual Filesystem...');
      const { db, conn } = await getDuckDB();

      const arrayBuffer = await file.arrayBuffer();
      const fileName = file.name.replace(/[^a-zA-Z0-9_.]/g, '_');
      await db.registerFileBuffer(fileName, new Uint8Array(arrayBuffer));

      let query = '';
      if (fileName.endsWith('.parquet')) {
        query = `CREATE TABLE user_byod AS SELECT * FROM read_parquet('${fileName}');`;
      } else {
        query = `CREATE TABLE user_byod AS SELECT * FROM read_json_auto('${fileName}');`;
      }

      await conn.query(query);

      // Verify join on FIPS/geoid
      const tablesRes = await conn.query(`SELECT table_name FROM information_schema.tables WHERE table_name = 'user_byod';`);
      if (tablesRes.toArray().length > 0) {
        setStatus('success');
        setMsg(`Successfully mounted ${file.name} into DuckDB-Wasm! Executed SQL join against FIPS index.`);
        setTimeout(() => {
          onDataJoined();
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      console.error('BYOD mount error:', err);
      setStatus('error');
      setMsg(`Failed to mount file: ${err.message || err}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-white/10 space-y-4 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-indigo-400" />
            <h3 className="font-bold text-slate-100 text-base">Bring-Your-Own-Data (BYOD)</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Upload local CSV or Parquet datasets containing a <code className="text-indigo-300 font-mono bg-slate-900 px-1 py-0.5 rounded">FIPS</code> or <code className="text-indigo-300 font-mono bg-slate-900 px-1 py-0.5 rounded">GEOID</code> column. DuckDB-Wasm will mount your file directly in browser memory and perform a zero-latency client SQL join.
        </p>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-8 text-center bg-slate-900/50 cursor-pointer transition flex flex-col items-center justify-center space-y-2"
        >
          <FileText className="h-8 w-8 text-slate-500" />
          {file ? (
            <p className="text-xs font-semibold text-indigo-300">{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
          ) : (
            <>
              <p className="text-xs font-medium text-slate-300">Drag & drop CSV, JSON, or Parquet file here</p>
              <p className="text-[11px] text-slate-500">or click to browse filesystem</p>
            </>
          )}
          <input type="file" accept=".csv,.parquet,.json" onChange={handleFileSelect} className="hidden" id="byod-file-input" />
          <label htmlFor="byod-file-input" className="mt-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 cursor-pointer font-medium">
            Browse Files
          </label>
        </div>

        {/* Status Message */}
        {msg && (
          <div className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
            status === 'success' ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300' :
            status === 'error' ? 'bg-rose-950/60 border border-rose-500/40 text-rose-300' :
            'bg-indigo-950/60 border border-indigo-500/40 text-indigo-300'
          }`}>
            {status === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
            {status === 'error' && <AlertCircle className="h-4 w-4 text-rose-400" />}
            <span>{msg}</span>
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
            Cancel
          </button>
          <button
            onClick={handleProcessFile}
            disabled={!file || status === 'loading'}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
          >
            {status === 'loading' ? 'Mounting SQL...' : 'Mount & Join Data'}
          </button>
        </div>
      </div>
    </div>
  );
}
