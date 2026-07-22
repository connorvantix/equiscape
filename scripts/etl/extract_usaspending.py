"""
Socioeconomic & Cultural Geo-Visualization Engine (EquiScape)
ETL Pipeline Module: USAspending.gov Federal Outlays & Obligations Extraction

Target Endpoint:
  - POST https://api.usaspending.gov/api/v2/search/spending_by_geography/

Filters & DEFC Codes:
  - Disaster Emergency Fund Codes: L, M, N, O, P, U (COVID-19 & Natural Disaster outlays)
  - Scope: primary_place_of_performance vs recipient_location
"""

import json
import urllib.request
import sys

USASPENDING_API_URL = "https://api.usaspending.gov/api/v2/search/spending_by_geography/"

DEFC_DISASTER_CODES = ["L", "M", "N", "O", "P", "U"]

def fetch_spending_by_county(scope="place_of_performance", defc_filter=False):
    payload = {
        "scope": scope,
        "geo_layer": "county",
        "spending_type": "obligations",
        "filters": {
            "time_period": [
                {"start_date": "2020-10-01", "end_date": "2024-09-30"}
            ]
        }
    }
    
    if defc_filter:
        payload["filters"]["def_codes"] = DEFC_DISASTER_CODES

    req = urllib.request.Request(
        USASPENDING_API_URL,
        data=json.dumps(payload).encode('utf-8'),
        headers={
            'Content-Type': 'application/json',
            'User-Agent': 'EquiScape-ETL/1.0'
        }
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode('utf-8'))
            results = res.get("results", [])
            print(f"[ETL USAspending] Fetched {len(results)} county funding records (scope={scope}, defc={defc_filter}).")
            return results
    except Exception as e:
        print(f"[ETL USAspending] Error fetching spending: {e}", file=sys.stderr)
        return []

if __name__ == "__main__":
    records = fetch_spending_by_county()
