import { useImperativeHandle, forwardRef, memo, useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import L from 'leaflet';
import Papa from 'papaparse';
import { useUserStore } from '../store/useUserStore';

// --- HEATMAP CONFIG ---
const heatOptions = {
  radius: 55,
  blur: 45,
  maxZoom: 10,
  gradient: {
    0.2: "#007BFF",
    0.4: "#FFFF00",
    0.6: "#FFA500",
    0.8: "#FF3C00",
    1.0: "#8B0000"
  }
};

// --- HEATMAP LAYER COMPONENT ---
const HeatmapLayer = memo(() => {
  const map = useMap();
  const [heatData, setHeatData] = useState([]);

  useEffect(() => {
    // STEP 1: LOAD CSV DATA
    fetch("/air_poll_data.csv")
      .then(res => res.text())
      .then(csv => {
        const parsed = Papa.parse(csv, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true
        });

        // STEP 2: EXTRACT LATEST VALUE PER CITY
        const latestByCity = new Map();
        parsed.data.forEach(row => {
          if (row.city && row.latitude && row.longitude && row.aqi) {
            latestByCity.set(row.city, row);
          }
        });

        const heatPoints = Array.from(latestByCity.values()).map(row => {
          let intensity = row.aqi >= 400 ? 1.0 : 
                         row.aqi >= 300 ? 0.85 : 
                         row.aqi >= 200 ? 0.65 : 
                         row.aqi >= 100 ? 0.45 : 0.25;
          return [row.latitude, row.longitude, intensity];
        });

        setHeatData(heatPoints);
      })
      .catch(err => console.error("Error loading CSV:", err));
  }, []);

  useEffect(() => {
    if (heatData.length === 0) return;

    // STEP 3: CREATE HEATMAP LAYER
    const layer = L.heatLayer(heatData, heatOptions).addTo(map);
    
    return () => {
      map.removeLayer(layer);
    };
  }, [map, heatData]);

  return null;
});

// --- MAP CONTROLLER ---
const MapController = forwardRef((p, ref) => {
  const map = useMap();
  const { detectLocation } = useUserStore();
  
  useImperativeHandle(ref, () => ({
    zoomIn: () => map.zoomIn(), 
    zoomOut: () => map.zoomOut(),
    flyTo: (lat, lng) => map.flyTo([lat, lng], 6, { duration: 0.8 })
  }));

  useEffect(() => {
    detectLocation(l => map.flyTo([l.lat, l.lng], 6, { duration: 0.8 }));
  }, [detectLocation, map]);

  return null;
});

// --- MAIN MAP COMPONENT ---
const MapUi = forwardRef(({ sensors }, ref) => (
  <div className="relative w-full h-full bg-black">
    <MapContainer 
      center={[22, 78]} 
      zoom={4} 
      className="w-full h-full" 
      zoomControl={false} 
      attributionControl={false} 
      preferCanvas={true}
    >
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
      <TileLayer url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}" zIndex={100} />
      <MapController ref={ref} />
      <HeatmapLayer />
    </MapContainer>
  </div>
));

export default MapUi;