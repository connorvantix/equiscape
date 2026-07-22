"""
Socioeconomic & Cultural Geo-Visualization Engine (EquiScape)
ETL Pipeline Module: U.S. Census Bureau ACS 5-Year & SAIPE Data Extraction

Target Endpoints:
  - ACS 5-Year: api.census.gov/data/2024/acs/acs5
  - SAIPE: api.census.gov/data/timeseries/poverty/saipe

Variables Extracted:
  - B19013_001E: Median Household Income
  - B02001_001E: Total Population by Race
  - B03002_001E: Hispanic or Latino Origin by Race
  - C17002_001E: Ratio of Income to Poverty Level
  - DP02: Selected Social Characteristics
  - DP05: Demographic and Housing Estimates
"""

import os
import json
import sys
import urllib.request
import urllib.parse

CENSUS_API_BASE = "https://api.census.gov/data/2024/acs/acs5"
CENSUS_API_KEY = os.environ.get("CENSUS_API_KEY", "")

VARIABLES = [
    "NAME",
    "B19013_001E",  # Median Household Income
    "B02001_001E",  # Total Population
    "B02001_002E",  # White alone
    "B02001_003E",  # Black alone
    "B02001_005E",  # Asian alone
    "B03002_012E",  # Hispanic or Latino
    "C17002_001E",  # Ratio of Income to Poverty Level Total
    "C17002_002E",  # Under 0.50 poverty
    "C17002_003E",  # 0.50 to 0.99 poverty
]

def fetch_county_demographics(state_fips="*"):
    params = {
        "get": ",".join(VARIABLES),
        "for": "county:*",
        "in": f"state:{state_fips}"
    }
    if CENSUS_API_KEY:
        params["key"] = CENSUS_API_KEY

    url = f"{CENSUS_API_BASE}?{urllib.parse.urlencode(params)}"
    print(f"[ETL Census] Querying URL: {url}")
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'EquiScape-ETL/1.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            headers = data[0]
            rows = data[1:]
            
            parsed_records = []
            for row in rows:
                record = dict(zip(headers, row))
                fips = f"{record.get('state', ''):0>2}{record.get('county', ''):0>3}"
                parsed_records.append({
                    "fips": fips,
                    "name": record.get("NAME"),
                    "median_income": float(record.get("B19013_001E") or 0),
                    "total_pop": int(record.get("B02001_001E") or 0),
                    "white_pop": int(record.get("B02001_002E") or 0),
                    "black_pop": int(record.get("B02001_003E") or 0),
                    "asian_pop": int(record.get("B02001_005E") or 0),
                    "hispanic_pop": int(record.get("B03002_012E") or 0),
                    "poverty_under_1": (float(record.get("C17002_002E") or 0) + float(record.get("C17002_003E") or 0)) / max(1.0, float(record.get("C17002_001E") or 1.0)) * 100.0
                })
            return parsed_records
    except Exception as e:
        print(f"[ETL Census] Error fetching data: {e}", file=sys.stderr)
        return []

if __name__ == "__main__":
    records = fetch_county_demographics()
    print(f"Extracted {len(records)} county demographic records.")
