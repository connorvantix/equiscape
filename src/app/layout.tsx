import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EquiScape - Socioeconomic & Cultural Geo-Visualization Engine',
  description:
    'High-performance geospatial visualization engine triangulating U.S. Census demographics, USAspending federal outlays, and U.S. Religion Census metrics using Next.js and DuckDB-Wasm.',
  keywords: [
    'Geospatial Engine',
    'DuckDB Wasm',
    'Next.js',
    'MapLibre GL JS',
    'US Census Bureau',
    'USAspending.gov',
    'Religion Census',
    'Socioeconomic Analytics',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-slate-100 min-h-screen antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
