'use client';

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { useFilterStore } from '@/lib/store/useFilterStore';
import { CITIES } from '@/lib/cities/cityData';
import { BIVARIATE_PALETTE } from './BivariateLegend';
import { Eye } from 'lucide-react';

interface MapViewProps {
  filteredRecords: Record<string, any>[];
}

export function MapView({ filteredRecords }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const {
    resolution,
    setSelectedFeature,
    bivariateVarX,
    bivariateVarY,
    bivariateMode,
    selectedCityId,
    selectedNeighborhoodId,
  } = useFilterStore();
  const [geoData, setGeoData] = useState<any>(null);
  const [fillOpacity, setFillOpacity] = useState<number>(0.35); // Default 35% opacity to show map features clearly

  // Fetch GeoJSON template when resolution changes
  useEffect(() => {
    const file = resolution === 'county' ? '/data/counties.json' : '/data/tracts.json';
    fetch(file)
      .then((res) => res.json())
      .then((json) => setGeoData(json))
      .catch((err) => console.error('Failed to load spatial GeoJSON:', err));
  }, [resolution]);

  // Initialize MapLibre map instance
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'carto-dark': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap &copy; CARTO',
          },
        },
        layers: [
          {
            id: 'carto-dark-layer',
            type: 'raster',
            source: 'carto-dark',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [-98.5795, 39.8283],
      zoom: 3.8,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    mapRef.current = map;

    popupRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Fly to selected city or neighborhood when selection changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (selectedNeighborhoodId && selectedCityId) {
      const city = CITIES.find((c) => c.id === selectedCityId);
      const neigh = city?.neighborhoods.find((n) => n.id === selectedNeighborhoodId);
      if (neigh) {
        map.flyTo({
          center: neigh.center,
          zoom: 13.5,
          essential: true,
          duration: 2000,
        });
        return;
      }
    }

    if (selectedCityId) {
      const city = CITIES.find((c) => c.id === selectedCityId);
      if (city) {
        map.flyTo({
          center: city.center,
          zoom: city.zoom,
          essential: true,
          duration: 2000,
        });
        return;
      }
    }

    // Default nationwide view if reset
    if (!selectedCityId && !selectedNeighborhoodId) {
      map.flyTo({
        center: [-98.5795, 39.8283],
        zoom: 3.8,
        essential: true,
        duration: 1800,
      });
    }
  }, [selectedCityId, selectedNeighborhoodId]);

  // Dynamically update fill opacity when slider moves
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getLayer('equiscape-fill')) return;
    map.setPaintProperty('equiscape-fill', 'fill-opacity', [
      'case',
      ['boolean', ['get', 'isFilteredOut'], false],
      0.1,
      fillOpacity,
    ]);
  }, [fillOpacity]);

  // Update map source & layer whenever records or geoData update
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !geoData) return;

    // Build lookup map of filtered DuckDB records indexed by geoid
    const recordMap = new Map<string, Record<string, any>>();
    filteredRecords.forEach((r) => {
      if (r.geoid) recordMap.set(String(r.geoid), r);
    });

    // Merge DuckDB data into GeoJSON feature properties & compute color
    const mergedFeatures = geoData.features.map((feature: any) => {
      const geoid = String(feature.properties.geoid);
      const record = recordMap.get(geoid) || feature.properties;
      const isFilteredOut = !recordMap.has(geoid) && filteredRecords.length > 0;

      // Calculate Bivariate Color
      let fillColor = '#334155'; // default slate fallback
      if (!isFilteredOut) {
        const valX = Number(record[bivariateVarX] || 0);
        const valY = Number(record[bivariateVarY] || 0);

        // Simple quantile color mapping
        const xIdx = valX > 60 ? 2 : valX > 20 ? 1 : 0;
        const yIdx = valY > 2000 ? 2 : valY > 500 ? 1 : 0;
        fillColor = BIVARIATE_PALETTE[yIdx][xIdx];
      }

      return {
        ...feature,
        properties: {
          ...record,
          isFilteredOut,
          fillColor,
        },
      };
    });

    const updatedGeoJSON: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: mergedFeatures,
    };

    const sourceId = 'equiscape-source';
    const fillLayerId = 'equiscape-fill';
    const lineLayerId = 'equiscape-line';

    if (map.getSource(sourceId)) {
      (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(updatedGeoJSON);
    } else {
      map.addSource(sourceId, {
        type: 'geojson',
        data: updatedGeoJSON,
      });

      map.addLayer({
        id: fillLayerId,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': ['get', 'fillColor'],
          'fill-opacity': [
            'case',
            ['boolean', ['get', 'isFilteredOut'], false],
            0.1,
            fillOpacity,
          ],
        },
      });

      map.addLayer({
        id: lineLayerId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': '#475569',
          'line-width': 0.5,
          'line-opacity': 0.4,
        },
      });

      // Hover interactivity
      map.on('mousemove', fillLayerId, (e) => {
        if (!e.features || e.features.length === 0) return;
        map.getCanvas().style.cursor = 'pointer';
        const props = e.features[0].properties;
        if (!props) return;

        const html = `
          <div className="space-y-1">
            <h4 className="font-bold text-indigo-300">${props.name || 'Region'}</h4>
            <div className="text-xs space-y-0.5 text-slate-300">
              <p>📍 <strong>Pop:</strong> ${Number(props.total_pop || 0).toLocaleString()}</p>
              <p>💵 <strong>Median Inc:</strong> $${Number(props.median_income || 0).toLocaleString()}</p>
              <p>📉 <strong>Poverty Rate:</strong> ${props.poverty_ratio || 0}%</p>
              <p>🏛️ <strong>Fed Grant/Cap:</strong> $${Number(props.fed_per_capita || 0).toLocaleString()}</p>
              <p>⛪ <strong>Congregations:</strong> ${props.tot_congregations || 0}</p>
            </div>
          </div>
        `;

        popupRef.current?.setLngLat(e.lngLat).setHTML(html).addTo(map);
      });

      map.on('mouseleave', fillLayerId, () => {
        map.getCanvas().style.cursor = '';
        popupRef.current?.remove();
      });

      // Click interactivity
      map.on('click', fillLayerId, (e) => {
        if (e.features && e.features.length > 0) {
          setSelectedFeature(e.features[0].properties);
        }
      });
    }
  }, [geoData, filteredRecords, bivariateVarX, bivariateVarY, bivariateMode, setSelectedFeature]);

  return (
    <div className="relative w-full h-full min-h-[480px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Overlay Map Opacity Control */}
      <div className="absolute top-3 left-3 z-10 glass-panel px-3 py-1.5 rounded-xl flex items-center space-x-2 text-xs border border-white/10 shadow-lg">
        <Eye className="h-3.5 w-3.5 text-indigo-400" />
        <span className="font-medium text-slate-300 text-[11px]">Map Transparency:</span>
        <input
          type="range"
          min="0.1"
          max="0.8"
          step="0.05"
          value={fillOpacity}
          onChange={(e) => setFillOpacity(parseFloat(e.target.value))}
          className="w-20 accent-indigo-500 bg-slate-800 rounded cursor-pointer h-1"
          title="Adjust overlay opacity to see underlying map details"
        />
        <span className="font-mono text-[10px] text-indigo-300">{Math.round((1 - fillOpacity) * 100)}% map visible</span>
      </div>

      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
