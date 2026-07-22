"""
Socioeconomic & Cultural Geo-Visualization Engine (EquiScape)
ETL Pipeline Module: U.S. Religion Census 2020 (ARDA RCMSCY20) Parser

Data Source:
  - ARDA / ASARB Religious Congregations & Membership Study (2020 County File)
  - 3,143 counties, 372 religious bodies, 21 RELTRAD categorizations

Variables:
  - TOTCNG_2020: Total Congregations
  - RELTRAD categorizations: Evangelical, Mainline, Catholic, Black Protestant, Muslim, Hindu, Buddhist, Jewish, Orthodox, etc.
"""

import json
import csv
import sys

RELTRAD_GROUPS = [
    "Evangelical Protestant",
    "Mainline Protestant",
    "Catholic",
    "Black Protestant",
    "Orthodox",
    "Muslim",
    "Hindu",
    "Buddhist",
    "Jewish",
    "Other Religion",
    "Unclaimed / Non-religious"
]

def parse_religion_census_file(csv_filepath):
    """
    Parses the ARDA county-level flat file mapping county FIPS code to religious metrics.
    """
    records = []
    try:
        with open(csv_filepath, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                fips = row.get("FIPS", "").zfill(5)
                tot_cng = int(row.get("TOTCNG_2020") or 0)
                records.append({
                    "fips": fips,
                    "tot_congregations": tot_cng,
                    "evangelical_pct": float(row.get("EVANGELICAL_PCT") or 0.0),
                    "mainline_pct": float(row.get("MAINLINE_PCT") or 0.0),
                    "catholic_pct": float(row.get("CATHOLIC_PCT") or 0.0),
                    "black_prot_pct": float(row.get("BLACK_PROT_PCT") or 0.0),
                    "muslim_pct": float(row.get("MUSLIM_PCT") or 0.0),
                    "jewish_pct": float(row.get("JEWISH_PCT") or 0.0),
                    "unclaimed_pct": float(row.get("UNCLAIMED_PCT") or 0.0),
                })
        print(f"[ETL Religion] Successfully parsed {len(records)} county records.")
        return records
    except Exception as e:
        print(f"[ETL Religion] Notice: Live CSV parse fallback ({e}).", file=sys.stderr)
        return []

if __name__ == "__main__":
    if len(sys.argv) > 1:
        parse_religion_census_file(sys.argv[1])
    else:
        print("Usage: python extract_religion.py <path_to_RCMSCY20.csv>")
