const fs = require('fs');
const path = require('path');

// Output directories
const dataDir = path.join(__dirname, '..', 'public', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Major States & Sample Counties with realistic baseline stats
const US_COUNTIES = [
  { fips: "36061", name: "New York County (Manhattan)", state: "NY", lat: 40.7831, lon: -73.9712, pop: 1628706, inc: 93946, pov: 16.3, white: 46.8, black: 11.8, asian: 11.9, hisp: 25.5, fed: 1420000000, disaster: 450000000, cng: 382, cath: 32.5, evan: 4.1, main: 11.2, mus: 4.5, jew: 18.2, unc: 25.0 },
  { fips: "36047", name: "Kings County (Brooklyn)", state: "NY", lat: 40.6782, lon: -73.9442, pop: 2736074, inc: 67753, pov: 18.8, white: 36.4, black: 29.8, asian: 12.7, hisp: 18.9, fed: 980000000, disaster: 320000000, cng: 890, cath: 28.0, evan: 8.5, main: 7.4, mus: 6.2, jew: 16.5, unc: 26.0 },
  { fips: "06037", name: "Los Angeles County", state: "CA", lat: 34.0522, lon: -118.2437, pop: 9861224, inc: 76357, pov: 14.1, white: 25.6, black: 7.9, asian: 14.7, hisp: 49.1, fed: 3400000000, disaster: 1100000000, cng: 2450, cath: 37.0, evan: 14.2, main: 5.1, mus: 3.1, jew: 6.4, unc: 28.0 },
  { fips: "06075", name: "San Francisco County", state: "CA", lat: 37.7749, lon: -122.4194, pop: 873965, inc: 126187, pov: 10.2, white: 39.8, black: 5.1, asian: 34.3, hisp: 15.2, fed: 1200000000, disaster: 280000000, cng: 285, cath: 21.0, evan: 5.0, main: 8.2, mus: 2.1, jew: 4.5, unc: 52.0 },
  { fips: "17031", name: "Cook County (Chicago)", state: "IL", lat: 41.8781, lon: -87.6298, pop: 5173146, inc: 72121, pov: 13.5, white: 41.9, black: 23.3, asian: 7.8, hisp: 25.8, fed: 2100000000, disaster: 650000000, cng: 1640, cath: 34.2, evan: 11.5, main: 9.1, mus: 4.0, jew: 4.8, unc: 30.0 },
  { fips: "48201", name: "Harris County (Houston)", state: "TX", lat: 29.7604, lon: -95.3698, pop: 4731145, inc: 65707, pov: 15.8, white: 28.7, black: 19.5, asian: 7.3, hisp: 43.7, fed: 1850000000, disaster: 780000000, cng: 1420, cath: 26.5, evan: 32.1, main: 6.4, mus: 3.5, jew: 1.8, unc: 24.0 },
  { fips: "48453", name: "Travis County (Austin)", state: "TX", lat: 30.2672, lon: -97.7431, pop: 1290188, inc: 89504, pov: 11.1, white: 48.2, black: 8.0, asian: 7.5, hisp: 33.6, fed: 740000000, disaster: 190000000, cng: 410, cath: 21.0, evan: 28.5, main: 8.9, mus: 2.1, jew: 1.5, unc: 34.0 },
  { fips: "04013", name: "Maricopa County (Phoenix)", state: "AZ", lat: 33.4484, lon: -112.0740, pop: 4420568, inc: 72944, pov: 11.6, white: 53.1, black: 5.6, asian: 4.4, hisp: 31.4, fed: 1540000000, disaster: 390000000, cng: 1120, cath: 23.4, evan: 29.8, main: 7.1, mus: 1.5, jew: 2.1, unc: 31.0 },
  { fips: "12086", name: "Miami-Dade County", state: "FL", lat: 25.7617, lon: -80.1918, pop: 2701767, inc: 57815, pov: 15.7, white: 12.9, black: 15.2, asian: 1.6, hisp: 68.7, fed: 1350000000, disaster: 610000000, cng: 780, cath: 39.1, evan: 22.4, main: 3.8, mus: 1.2, jew: 4.2, unc: 24.0 },
  { fips: "53033", name: "King County (Seattle)", state: "WA", lat: 47.6062, lon: -122.3321, pop: 2269675, inc: 106326, pov: 8.1, white: 57.2, black: 6.8, asian: 20.1, hisp: 10.0, fed: 1450000000, disaster: 310000000, cng: 620, cath: 14.5, evan: 12.0, main: 11.1, mus: 2.8, jew: 2.0, unc: 53.0 },
  { fips: "13121", name: "Fulton County (Atlanta)", state: "GA", lat: 33.7490, lon: -84.3880, pop: 1066710, inc: 82510, pov: 13.2, white: 38.1, black: 43.6, asian: 7.6, hisp: 7.5, fed: 1100000000, disaster: 290000000, cng: 510, cath: 12.1, evan: 24.5, main: 10.2, black_prot: 28.4, mus: 2.0, unc: 20.0 },
  { fips: "25025", name: "Suffolk County (Boston)", state: "MA", lat: 42.3601, lon: -71.0589, pop: 797936, inc: 79283, pov: 17.1, white: 44.2, black: 20.1, asian: 9.8, hisp: 22.5, fed: 1650000000, disaster: 240000000, cng: 310, cath: 42.0, evan: 4.5, main: 12.0, mus: 3.1, jew: 6.5, unc: 28.0 },
  { fips: "08031", name: "Denver County", state: "CO", lat: 39.7392, lon: -104.9903, pop: 715522, inc: 78177, pov: 11.4, white: 54.3, black: 8.8, asian: 3.7, hisp: 29.3, fed: 820000000, disaster: 210000000, cng: 290, cath: 22.1, evan: 16.0, main: 9.5, mus: 1.5, jew: 3.8, unc: 42.0 },
  { fips: "42101", name: "Philadelphia County", state: "PA", lat: 39.9526, lon: -75.1652, pop: 1603797, inc: 52899, pov: 22.3, white: 34.3, black: 40.1, asian: 7.4, hisp: 15.1, fed: 1280000000, disaster: 410000000, cng: 740, cath: 31.0, evan: 8.2, main: 9.0, black_prot: 22.1, mus: 4.2, jew: 4.0, unc: 18.0 },
  { fips: "47157", name: "Shelby County (Memphis)", state: "TN", lat: 35.1495, lon: -90.0490, pop: 929744, inc: 55437, pov: 19.8, white: 35.8, black: 53.4, asian: 2.8, hisp: 6.7, fed: 620000000, disaster: 170000000, cng: 610, cath: 7.2, evan: 38.5, main: 8.1, black_prot: 34.0, mus: 1.0, unc: 10.0 },
  { fips: "29510", name: "St. Louis City", state: "MO", lat: 38.6270, lon: -90.1994, pop: 301578, inc: 48764, pov: 20.4, white: 43.6, black: 44.8, asian: 3.4, hisp: 5.1, fed: 490000000, disaster: 130000000, cng: 280, cath: 28.0, evan: 18.2, main: 11.0, black_prot: 26.0, mus: 1.8, unc: 12.0 }
];

// Additional synthetic state & county generator to cover all 50 states
const STATES = [
  { fips: "01", code: "AL", name: "Alabama" }, { fips: "02", code: "AK", name: "Alaska" },
  { fips: "04", code: "AZ", name: "Arizona" }, { fips: "05", code: "AR", name: "Arkansas" },
  { fips: "06", code: "CA", name: "California" }, { fips: "08", code: "CO", name: "Colorado" },
  { fips: "09", code: "CT", name: "Connecticut" }, { fips: "10", code: "DE", name: "Delaware" },
  { fips: "11", code: "DC", name: "District of Columbia" }, { fips: "12", code: "FL", name: "Florida" },
  { fips: "13", code: "GA", name: "Georgia" }, { fips: "15", code: "HI", name: "Hawaii" },
  { fips: "16", code: "ID", name: "Idaho" }, { fips: "17", code: "IL", name: "Illinois" },
  { fips: "18", code: "IN", name: "Indiana" }, { fips: "19", code: "IA", name: "Iowa" },
  { fips: "20", code: "KS", name: "Kansas" }, { fips: "21", code: "KY", name: "Kentucky" },
  { fips: "22", code: "LA", name: "Louisiana" }, { fips: "23", code: "ME", name: "Maine" },
  { fips: "24", code: "MD", name: "Maryland" }, { fips: "25", code: "MA", name: "Massachusetts" },
  { fips: "26", code: "MI", name: "Michigan" }, { fips: "27", code: "MN", name: "Minnesota" },
  { fips: "28", code: "MS", name: "Mississippi" }, { fips: "29", code: "MO", name: "Missouri" },
  { fips: "30", code: "MT", name: "Montana" }, { fips: "31", code: "NE", name: "Nebraska" },
  { fips: "32", code: "NV", name: "Nevada" }, { fips: "33", code: "NH", name: "New Hampshire" },
  { fips: "34", code: "NJ", name: "New Jersey" }, { fips: "35", code: "NM", name: "New Mexico" },
  { fips: "36", code: "NY", name: "New York" }, { fips: "37", code: "NC", name: "North Carolina" },
  { fips: "38", code: "ND", name: "North Dakota" }, { fips: "39", code: "OH", name: "Ohio" },
  { fips: "40", code: "OK", name: "Oklahoma" }, { fips: "41", code: "OR", name: "Oregon" },
  { fips: "42", code: "PA", name: "Pennsylvania" }, { fips: "44", code: "RI", name: "Rhode Island" },
  { fips: "45", code: "SC", name: "South Carolina" }, { fips: "46", code: "SD", name: "South Dakota" },
  { fips: "47", code: "TN", name: "Tennessee" }, { fips: "48", code: "TX", name: "Texas" },
  { fips: "49", code: "UT", name: "Utah" }, { fips: "50", code: "VT", name: "Vermont" },
  { fips: "51", code: "VA", name: "Virginia" }, { fips: "53", code: "WA", name: "Washington" },
  { fips: "54", code: "WV", name: "West Virginia" }, { fips: "55", code: "WI", name: "Wisconsin" },
  { fips: "56", code: "WY", name: "Wyoming" }
];

function generateGeoJSONPolygon(lat, lon, size = 0.15) {
  return {
    type: "Polygon",
    coordinates: [[
      [lon - size, lat - size],
      [lon + size, lat - size],
      [lon + size, lat + size],
      [lon - size, lat + size],
      [lon - size, lat - size]
    ]]
  };
}

// Generate complete county dataset
const countyFeatures = [];
const countyRecords = [];

US_COUNTIES.forEach((c) => {
  const perCapita = Math.round(c.fed / c.pop);
  const polygon = generateGeoJSONPolygon(c.lat, c.lon, 0.2);
  
  const properties = {
    geoid: c.fips,
    name: c.name,
    state: c.state,
    total_pop: c.pop,
    median_income: c.inc,
    poverty_ratio: c.pov,
    white_pct: c.white,
    black_pct: c.black,
    asian_pct: c.asian,
    hispanic_pct: c.hisp,
    minority_pct: Number((100 - c.white).toFixed(1)),
    fed_obligations: c.fed,
    fed_per_capita: perCapita,
    disaster_funding: c.disaster,
    tot_congregations: c.cng,
    catholic_pct: c.cath,
    evangelical_pct: c.evan,
    mainline_pct: c.main,
    black_prot_pct: c.black_prot || 2.0,
    muslim_pct: c.mus,
    jewish_pct: c.jew,
    unclaimed_pct: c.unc,
    latitude: c.lat,
    longitude: c.lon
  };

  countyRecords.push(properties);
  countyFeatures.push({
    type: "Feature",
    geometry: polygon,
    properties
  });
});

// Also fill in remaining counties for state-level coverage
STATES.forEach((st) => {
  const countInSt = US_COUNTIES.filter(c => c.state === st.code).length;
  if (countInSt === 0) {
    // Generate representative capital county
    const fips = st.fips + "001";
    const lat = 35.0 + (parseInt(st.fips) % 12);
    const lon = -110.0 + (parseInt(st.fips) * 1.5) % 45;
    const pop = 250000 + (parseInt(st.fips) * 12345) % 500000;
    const inc = 55000 + (parseInt(st.fips) * 987) % 35000;
    const pov = Number((8.0 + (parseInt(st.fips) * 3) % 14).toFixed(1));
    const fed = pop * (400 + (parseInt(st.fips) * 87) % 600);

    const props = {
      geoid: fips,
      name: `${st.name} Central Region`,
      state: st.code,
      total_pop: pop,
      median_income: inc,
      poverty_ratio: pov,
      white_pct: 65.0,
      black_pct: 12.0,
      asian_pct: 4.0,
      hispanic_pct: 15.0,
      minority_pct: 35.0,
      fed_obligations: fed,
      fed_per_capita: Math.round(fed / pop),
      disaster_funding: Math.round(fed * 0.2),
      tot_congregations: Math.round(pop / 1200),
      catholic_pct: 20.0,
      evangelical_pct: 28.0,
      mainline_pct: 15.0,
      black_prot_pct: 8.0,
      muslim_pct: 1.5,
      jewish_pct: 1.2,
      unclaimed_pct: 26.3,
      latitude: lat,
      longitude: lon
    };

    countyRecords.push(props);
    countyFeatures.push({
      type: "Feature",
      geometry: generateGeoJSONPolygon(lat, lon, 0.3),
      properties: props
    });
  }
});

// Generate tract-level data for deep zoom
const tractFeatures = [];
const tractRecords = [];

US_COUNTIES.forEach((c) => {
  // Generate 8-12 census tracts per major county
  for (let i = 1; i <= 10; i++) {
    const tractId = `${c.fips}${String(i).padStart(6, '0')}`;
    const offsetLat = (Math.random() - 0.5) * 0.18;
    const offsetLon = (Math.random() - 0.5) * 0.18;
    const tLat = c.lat + offsetLat;
    const tLon = c.lon + offsetLon;
    const tPop = 2500 + Math.floor(Math.random() * 4000);
    // Add micro-variations
    const incMult = 0.5 + Math.random() * 1.1;
    const tInc = Math.round(c.inc * incMult);
    const tPov = Number(Math.max(3.2, Math.min(45.0, c.pov * (2.0 - incMult))).toFixed(1));
    const tFed = Math.round((tPop * (c.fed / c.pop)) * (0.6 + Math.random() * 0.8));
    const tDisaster = Math.round(tFed * (0.1 + Math.random() * 0.4));

    const props = {
      geoid: tractId,
      name: `Census Tract ${i * 100}, ${c.name}`,
      county_geoid: c.fips,
      state: c.state,
      total_pop: tPop,
      median_income: tInc,
      poverty_ratio: tPov,
      white_pct: Number(Math.max(2.0, Math.min(95.0, c.white + (Math.random() - 0.5) * 20)).toFixed(1)),
      black_pct: Number(Math.max(1.0, Math.min(90.0, c.black + (Math.random() - 0.5) * 20)).toFixed(1)),
      asian_pct: Number(Math.max(1.0, Math.min(80.0, c.asian + (Math.random() - 0.5) * 15)).toFixed(1)),
      hispanic_pct: Number(Math.max(2.0, Math.min(92.0, c.hisp + (Math.random() - 0.5) * 25)).toFixed(1)),
      minority_pct: 0, // computed below
      fed_obligations: tFed,
      fed_per_capita: Math.round(tFed / tPop),
      disaster_funding: tDisaster,
      tot_congregations: Math.max(1, Math.floor(c.cng / 40 + Math.random() * 4)),
      catholic_pct: c.cath,
      evangelical_pct: c.evan,
      mainline_pct: c.main,
      black_prot_pct: c.black_prot || 2.0,
      muslim_pct: c.mus,
      jewish_pct: c.jew,
      unclaimed_pct: c.unc,
      latitude: tLat,
      longitude: tLon
    };
    props.minority_pct = Number((100 - props.white_pct).toFixed(1));

    tractRecords.push(props);
    tractFeatures.push({
      type: "Feature",
      geometry: generateGeoJSONPolygon(tLat, tLon, 0.025),
      properties: props
    });
  }
});

// Output GeoJSON files for high-speed client spatial rendering
const countyGeoJSON = { type: "FeatureCollection", features: countyFeatures };
const tractGeoJSON = { type: "FeatureCollection", features: tractFeatures };

fs.writeFileSync(path.join(dataDir, 'counties.json'), JSON.stringify(countyGeoJSON));
fs.writeFileSync(path.join(dataDir, 'tracts.json'), JSON.stringify(tractGeoJSON));

// Write CSV & JSON files for DuckDB table ingestion
fs.writeFileSync(path.join(dataDir, 'county_records.json'), JSON.stringify(countyRecords));
fs.writeFileSync(path.join(dataDir, 'tract_records.json'), JSON.stringify(tractRecords));

console.log(`Generated ${countyRecords.length} county records and ${tractRecords.length} tract records in public/data/`);
