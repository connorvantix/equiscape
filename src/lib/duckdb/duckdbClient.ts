import * as duckdb from '@duckdb/duckdb-wasm';

let dbInstance: duckdb.AsyncDuckDB | null = null;
let connInstance: duckdb.AsyncDuckDBConnection | null = null;
let initPromise: Promise<{ db: duckdb.AsyncDuckDB; conn: duckdb.AsyncDuckDBConnection }> | null = null;

export async function getDuckDB() {
  if (dbInstance && connInstance) {
    return { db: dbInstance, conn: connInstance };
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      // Configure bundle URLs using jsDelivr CDN for reliability across bundlers and Vercel deployments
      const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
      const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
      
      const worker_url = URL.createObjectURL(
        new Blob([`importScripts("${bundle.mainWorker!}");`], { type: 'text/javascript' })
      );

      const worker = new Worker(worker_url);
      const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING);
      const db = new duckdb.AsyncDuckDB(logger, worker);

      await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
      URL.revokeObjectURL(worker_url);

      const conn = await db.connect();

      // Register virtual Parquet and JSON files for queries
      try {
        const countyParquetRes = await fetch('/data/county_data.parquet');
        if (countyParquetRes.ok) {
          const countyBuffer = new Uint8Array(await countyParquetRes.arrayBuffer());
          await db.registerFileBuffer('county_data.parquet', countyBuffer);
          await conn.query(`CREATE TABLE IF NOT EXISTS counties AS SELECT * FROM read_parquet('county_data.parquet');`);
        }
      } catch (e) {
        console.warn('Could not register county_data.parquet, falling back to JSON...', e);
      }

      try {
        const tractParquetRes = await fetch('/data/tract_data.parquet');
        if (tractParquetRes.ok) {
          const tractBuffer = new Uint8Array(await tractParquetRes.arrayBuffer());
          await db.registerFileBuffer('tract_data.parquet', tractBuffer);
          await conn.query(`CREATE TABLE IF NOT EXISTS tracts AS SELECT * FROM read_parquet('tract_data.parquet');`);
        }
      } catch (e) {
        console.warn('Could not register tract_data.parquet, falling back to JSON...', e);
      }

      // JSON Fallbacks if table wasn't populated from Parquet
      const tables = await conn.query(`SELECT table_name FROM information_schema.tables;`);
      const existingTables = tables.toArray().map(r => r.toJSON().table_name);

      if (!existingTables.includes('counties')) {
        const cRes = await fetch('/data/county_records.json');
        const cData = await cRes.text();
        await db.registerFileText('county_records.json', cData);
        await conn.query(`CREATE TABLE counties AS SELECT * FROM read_json_auto('county_records.json');`);
      }

      if (!existingTables.includes('tracts')) {
        const tRes = await fetch('/data/tract_records.json');
        const tData = await tRes.text();
        await db.registerFileText('tract_records.json', tData);
        await conn.query(`CREATE TABLE tracts AS SELECT * FROM read_json_auto('tract_records.json');`);
      }

      dbInstance = db;
      connInstance = conn;
      return { db, conn };
    } catch (err) {
      console.error('Failed to initialize DuckDB-Wasm:', err);
      throw err;
    }
  })();

  return initPromise;
}

export async function runQuery(sqlQuery: string): Promise<Record<string, any>[]> {
  try {
    const { conn } = await getDuckDB();
    const result = await conn.query(sqlQuery);
    return result.toArray().map((row) => row.toJSON());
  } catch (err) {
    console.error('DuckDB Query Error:', err, 'Query:', sqlQuery);
    return [];
  }
}
