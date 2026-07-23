export interface Neighborhood {
  id: string;
  name: string;
  countyFips: string;
  tractGeoid?: string;
  center: [number, number]; // [lon, lat]
}

export interface City {
  id: string;
  name: string;
  state: string;
  countyFips: string[];
  center: [number, number]; // [lon, lat]
  zoom: number;
  neighborhoods: Neighborhood[];
}

export const CITIES: City[] = [
  {
    id: 'nyc',
    name: 'New York City',
    state: 'NY',
    countyFips: ['36061', '36047', '36081', '36005', '36085'],
    center: [-73.9851, 40.7488],
    zoom: 11.5,
    neighborhoods: [
      { id: 'nyc-man-1', name: 'Upper East Side / Yorkville', countyFips: '36061', center: [-73.9566, 40.7736] },
      { id: 'nyc-man-2', name: 'Harlem / Morningside Heights', countyFips: '36061', center: [-73.9500, 40.8115] },
      { id: 'nyc-man-3', name: 'Financial District / SoHo', countyFips: '36061', center: [-74.0090, 40.7128] },
      { id: 'nyc-bk-1', name: 'Williamsburg / Greenpoint', countyFips: '36047', center: [-73.9571, 40.7178] },
      { id: 'nyc-bk-2', name: 'Bushwick / Bedford-Stuyvesant', countyFips: '36047', center: [-73.9298, 40.6944] },
      { id: 'nyc-bk-3', name: 'Brooklyn Heights / DUMBO', countyFips: '36047', center: [-73.9930, 40.6960] },
      { id: 'nyc-[#q-1]', name: 'Astoria / Long Island City', countyFips: '36081', center: [-73.9220, 40.7644] },
    ],
  },
  {
    id: 'la',
    name: 'Los Angeles',
    state: 'CA',
    countyFips: ['06037'],
    center: [-118.2437, 34.0522],
    zoom: 11,
    neighborhoods: [
      { id: 'la-1', name: 'Downtown LA / Arts District', countyFips: '06037', center: [-118.2437, 34.0407] },
      { id: 'la-2', name: 'Hollywood / East Hollywood', countyFips: '06037', center: [-118.3287, 34.1016] },
      { id: 'la-3', name: 'Santa Monica / Venice', countyFips: '06037', center: [-118.4912, 34.0195] },
      { id: 'la-4', name: 'Koreatown / Westlake', countyFips: '06037', center: [-118.3000, 34.0600] },
      { id: 'la-5', name: 'Silver Lake / Echo Park', countyFips: '06037', center: [-118.2700, 34.0867] },
    ],
  },
  {
    id: 'chi',
    name: 'Chicago',
    state: 'IL',
    countyFips: ['17031'],
    center: [-87.6298, 41.8781],
    zoom: 11.5,
    neighborhoods: [
      { id: 'chi-1', name: 'The Loop / River North', countyFips: '17031', center: [-87.6298, 41.8837] },
      { id: 'chi-2', name: 'Lincoln Park / Lakeview', countyFips: '17031', center: [-87.6475, 41.9214] },
      { id: 'chi-3', name: 'Logan Square / Wicker Park', countyFips: '17031', center: [-87.7081, 41.9231] },
      { id: 'chi-4', name: 'Hyde Park / Kenwood', countyFips: '17031', center: [-87.5917, 41.7948] },
      { id: 'chi-5', name: 'Pilsen / Little Village', countyFips: '17031', center: [-87.6667, 41.8561] },
    ],
  },
  {
    id: 'hou',
    name: 'Houston',
    state: 'TX',
    countyFips: ['48201'],
    center: [-95.3698, 29.7604],
    zoom: 11,
    neighborhoods: [
      { id: 'hou-1', name: 'Downtown Houston / Midtown', countyFips: '48201', center: [-95.3698, 29.7520] },
      { id: 'hou-2', name: 'Montrose / Museum District', countyFips: '48201', center: [-95.3900, 29.7420] },
      { id: 'hou-3', name: 'The Heights / Greater Heights', countyFips: '48201', center: [-95.3981, 29.7950] },
      { id: 'hou-4', name: 'East End / Second Ward', countyFips: '48201', center: [-95.3400, 29.7450] },
    ],
  },
  {
    id: 'sf',
    name: 'San Francisco',
    state: 'CA',
    countyFips: ['06075'],
    center: [-122.4194, 37.7749],
    zoom: 12,
    neighborhoods: [
      { id: 'sf-1', name: 'Financial District / SOMA', countyFips: '06075', center: [-122.4000, 37.7880] },
      { id: 'sf-2', name: 'Mission District / Castro', countyFips: '06075', center: [-122.4194, 37.7599] },
      { id: 'sf-3', name: 'Pacific Heights / Marina', countyFips: '06075', center: [-122.4350, 37.7925] },
      { id: 'sf-4', name: 'Richmond / Sunset District', countyFips: '06075', center: [-122.4800, 37.7700] },
    ],
  },
  {
    id: 'aus',
    name: 'Austin',
    state: 'TX',
    countyFips: ['48453'],
    center: [-97.7431, 30.2672],
    zoom: 11.5,
    neighborhoods: [
      { id: 'aus-1', name: 'Downtown Austin / Rainey Street', countyFips: '48453', center: [-97.7431, 30.2672] },
      { id: 'aus-2', name: 'East Austin / Holly', countyFips: '48453', center: [-97.7200, 30.2600] },
      { id: 'aus-3', name: 'South Congress (SoCo) / Bouldin', countyFips: '48453', center: [-97.7500, 30.2450] },
      { id: 'aus-4', name: 'Hyde Park / Mueller', countyFips: '48453', center: [-97.7150, 30.3000] },
    ],
  },
  {
    id: 'sea',
    name: 'Seattle',
    state: 'WA',
    countyFips: ['53033'],
    center: [-122.3321, 47.6062],
    zoom: 11.5,
    neighborhoods: [
      { id: 'sea-1', name: 'Downtown Seattle / Belltown', countyFips: '53033', center: [-122.3350, 47.6100] },
      { id: 'sea-2', name: 'Capitol Hill / First Hill', countyFips: '53033', center: [-122.3200, 47.6150] },
      { id: 'sea-3', name: 'South Lake Union / Queen Anne', countyFips: '53033', center: [-122.3380, 47.6250] },
      { id: 'sea-4', name: 'Ballard / Fremont', countyFips: '53033', center: [-122.3800, 47.6680] },
    ],
  },
  {
    id: 'mia',
    name: 'Miami',
    state: 'FL',
    countyFips: ['12086'],
    center: [-80.1918, 25.7617],
    zoom: 12,
    neighborhoods: [
      { id: 'mia-1', name: 'Brickell / Downtown Miami', countyFips: '12086', center: [-80.1918, 25.7617] },
      { id: 'mia-2', name: 'Wynwood / Edgewater', countyFips: '12086', center: [-80.1980, 25.8000] },
      { id: 'mia-3', name: 'Little Havana / Shenandoah', countyFips: '12086', center: [-80.2200, 25.7700] },
      { id: 'mia-4', name: 'Coconut Grove / Coral Gables', countyFips: '12086', center: [-80.2400, 25.7300] },
    ],
  },
  {
    id: 'atl',
    name: 'Atlanta',
    state: 'GA',
    countyFips: ['13121'],
    center: [-84.3880, 33.7490],
    zoom: 11.5,
    neighborhoods: [
      { id: 'atl-1', name: 'Downtown Atlanta / Old Fourth Ward', countyFips: '13121', center: [-84.3880, 33.7550] },
      { id: 'atl-2', name: 'Midtown / Virginia-Highland', countyFips: '13121', center: [-84.3800, 33.7800] },
      { id: 'atl-3', name: 'Buckhead / Chastain Park', countyFips: '13121', center: [-84.3800, 33.8400] },
      { id: 'atl-4', name: 'Inman Park / Cabbagetown', countyFips: '13121', center: [-84.3600, 33.7580] },
    ],
  },
  {
    id: 'bos',
    name: 'Boston',
    state: 'MA',
    countyFips: ['25025'],
    center: [-71.0589, 42.3601],
    zoom: 12,
    neighborhoods: [
      { id: 'bos-1', name: 'Back Bay / Beacon Hill', countyFips: '25025', center: [-71.0750, 42.3520] },
      { id: 'bos-2', name: 'South End / Seaport', countyFips: '25025', center: [-71.0450, 42.3480] },
      { id: 'bos-3', name: 'Fenway / Kenmore', countyFips: '25025', center: [-71.0950, 42.3430] },
      { id: 'bos-4', name: 'Dorchester / Roxbury', countyFips: '25025', center: [-71.0700, 42.3000] },
    ],
  },
  {
    id: 'den',
    name: 'Denver',
    state: 'CO',
    countyFips: ['08031'],
    center: [-104.9903, 39.7392],
    zoom: 12,
    neighborhoods: [
      { id: 'den-1', name: 'LoDo / Downtown Denver', countyFips: '08031', center: [-104.9980, 39.7530] },
      { id: 'den-2', name: 'RiNo (River North Art District)', countyFips: '08031', center: [-104.9800, 39.7680] },
      { id: 'den-3', name: 'Capitol Hill / Cheesman Park', countyFips: '08031', center: [-104.9750, 39.7350] },
      { id: 'den-4', name: 'Highlands / Sunnyside', countyFips: '08031', center: [-105.0100, 39.7600] },
    ],
  },
];
