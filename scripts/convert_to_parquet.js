const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'public', 'data');
const countyJson = path.join(dataDir, 'county_records.json');
const tractJson = path.join(dataDir, 'tract_records.json');

const countyParquet = path.join(dataDir, 'county_data.parquet');
const tractParquet = path.join(dataDir, 'tract_data.parquet');

async function convert() {
  try {
    const duckdb = require('duckdb');
    const db = new duckdb.Database(':memory:');
    const con = db.connect();

    console.log("Converting JSON data to Parquet using DuckDB...");
    
    con.run(`COPY (SELECT * FROM read_json_auto('${countyJson}')) TO '${countyParquet}' (FORMAT PARQUET);`, (err) => {
      if (err) console.error("Error converting county_records.json:", err);
      else console.log("Successfully created public/data/county_data.parquet!");
    });

    con.run(`COPY (SELECT * FROM read_json_auto('${tractJson}')) TO '${tractParquet}' (FORMAT PARQUET);`, (err) => {
      if (err) console.error("Error converting tract_records.json:", err);
      else console.log("Successfully created public/data/tract_data.parquet!");
    });

  } catch (err) {
    console.log("Notice: Node duckdb native module not loaded; JSON fallback ready.", err.message);
  }
}

convert();
