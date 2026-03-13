import { useEffect, useRef, memo, useImperativeHandle, forwardRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Pane } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { cn } from '../utils/cn';
import { useUserStore } from '../store/useUserStore';
import { useAppStore } from '../store/useAppStore';
import Badge from './Badge';

// --- EXTENDED DUMMY POLLUTION DATA (AQI STYLE) ---
const pollutionData = [
  { city: "Delhi", lat: 28.6139, lng: 77.2090, pollution: 445 },
  { city: "Noida", lat: 28.5355, lng: 77.3910, pollution: 410 },
  { city: "Gurgaon", lat: 28.4595, lng: 77.0266, pollution: 395 },
  { city: "Kanpur", lat: 26.4499, lng: 80.3319, pollution: 340 },
  { city: "Lucknow", lat: 26.8467, lng: 80.9462, pollution: 305 },
  { city: "Kolkata", lat: 22.5726, lng: 88.3639, pollution: 285 },
  { city: "Asansol", lat: 23.6739, lng: 86.9524, pollution: 260 },
  { city: "Patna", lat: 25.5941, lng: 85.1376, pollution: 275 },
  { city: "Mumbai", lat: 19.0760, lng: 72.8777, pollution: 210 },
  { city: "Pune", lat: 18.5204, lng: 73.8567, pollution: 185 },
  { city: "Ahmedabad", lat: 23.0225, lng: 72.5714, pollution: 195 },
  { city: "Hyderabad", lat: 17.3850, lng: 78.4867, pollution: 170 },
  { city: "Nagpur", lat: 21.1458, lng: 79.0882, pollution: 155 },
  { city: "Bangalore", lat: 12.9716, lng: 77.5946, pollution: 160 },
  { city: "Chennai", lat: 13.0827, lng: 80.2707, pollution: 145 },
  { city: "Coimbatore", lat: 11.0168, lng: 76.9558, pollution: 120 },
  { city: "Visakhapatnam", lat: 17.6868, lng: 83.2185, pollution: 135 },
  { city: "Bhubaneswar", lat: 20.2961, lng: 85.8245, pollution: 95 },
  { city: "Raipur", lat: 21.2514, lng: 81.6296, pollution: 150 }
];

// --- Leaflet Default Icon Fix ---
// Using CDN URLs is the most reliable way to fix the 'black blob' issue in Vite/modern bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const userIcon = L.icon({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'user-location-marker'
});

// --- Helper: Linear Interpolation ---
const interpolate = (x, stops) => {
  if (x <= stops[0][0]) return stops[0][1];
  if (x >= stops[stops.length - 1][0]) return stops[stops.length - 1][1];
  for (let i = 0; i < stops.length - 1; i++) {
    const [x1, y1] = stops[i];
    const [x2, y2] = stops[i + 1];
    if (x >= x1 && x <= x2) {
      return y1 + (y2 - y1) * (x - x1) / (x2 - x1);
    }
  }
  return stops[0][1];
};

// --- Zoom Responsive Logic ---
const getCloudIcon = (pollution, zoom, theme = 'dark') => {
  // 1) Radius Scaling (zoom-based interpolation)
  const radiusMultiplierStops = [
    [3, 0.15], [5, 0.25], [7, 0.45], [9, 0.7], [11, 1.1], [13, 1.6], [15, 2.2]
  ];
  const radiusMultiplier = interpolate(zoom, radiusMultiplierStops);
  const radius = pollution * radiusMultiplier;
  const size = radius * 2;

  // 2) Blur Strength Scaling
  const blurStops = [[3, 0.25], [7, 0.45], [11, 0.65], [15, 0.85]];
  const blurFactor = interpolate(zoom, blurStops);
  const blurAmount = radius * blurFactor;

  // 3) Opacity Scaling
  const opacityStops = theme === 'dark' 
    ? [[3, 0.45], [6, 0.60], [10, 0.75], [14, 0.85]]
    : [[3, 0.25], [6, 0.35], [10, 0.45], [14, 0.55]]; // Lower opacity in light mode
  const opacity = interpolate(zoom, opacityStops);

  // 4) Color Logic
  let color, isCritical = false;
  if (pollution <= 100) color = '#3b82f6'; // Blue
  else if (pollution <= 200) color = '#eab308'; // Yellow
  else if (pollution <= 300) color = '#f97316'; // Orange
  else if (pollution <= 400) color = '#ef4444'; // Red
  else {
    color = '#7f1d1d'; // Deep Blood Red
    isCritical = true;
  }

  const animationClass = isCritical ? 'animate-critical-pulse' : '';
  const tint = isCritical ? `<div class="absolute -inset-1/2 rounded-full bg-red-900/10 blur-[60px]"></div>` : '';
  const centerDot = isCritical && zoom > 6 ? `<div class="absolute w-4 h-4 rounded-full bg-red-600 border border-white/40 shadow-[0_0_15px_rgba(255,0,0,1)] z-10"></div>` : '';
  const blendMode = theme === 'dark' ? 'screen' : 'multiply';

  return L.divIcon({
    className: 'pollution-cloud-marker',
    html: `
      <div class="relative flex items-center justify-center" style="width: ${size}px; height: ${size}px; mix-blend-mode: ${blendMode};">
        ${tint}
        <div class="absolute inset-0 rounded-full ${animationClass}" 
             style="background: radial-gradient(circle, ${color} 0%, ${color}e6 30%, ${color}66 70%, transparent 95%); 
                    filter: blur(${blurAmount}px); 
                    opacity: ${opacity};">
        </div>
        ${centerDot}
      </div>`,
    iconSize: [size, size],
    iconAnchor: [radius, radius],
    popupAnchor: [0, -20],
  });
};

// --- Map Controller & Zoom Listener ---
const MapController = forwardRef(({ onZoomChange }, ref) => {
  const map = useMap();
  const { detectLocation, userLocation } = useUserStore();
  const hasInitialized = useRef(false);

  useMapEvents({
    zoomend: () => onZoomChange(map.getZoom()),
  });

  useImperativeHandle(ref, () => ({
    zoomIn: () => map.setZoom(map.getZoom() + 1),
    zoomOut: () => map.setZoom(map.getZoom() - 1),
    flyTo: (lat, lng, zoom = 13) => {
      map.flyTo([lat, lng], zoom, { duration: 1.5 });
    }
  }));

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      if (userLocation) {
        map.flyTo([userLocation.lat, userLocation.lng], 10, { duration: 1 });
      } else {
        detectLocation((loc) => {
          map.flyTo([loc.lat, loc.lng], 10, { duration: 2 });
        });
      }
    }
  }, [detectLocation, map, userLocation]);

  return null;
});

const PollutionCloud = memo(({ data, zoom, theme }) => (
  <Marker 
    position={[data.lat, data.lng]}
    icon={getCloudIcon(data.pollution, zoom, theme)}
  >
    <Popup className="custom-popup" minWidth={220}>
      <div className="bg-surface dark:bg-[#0f172a] text-text-primary dark:text-slate-100 p-2">
        <div className="flex items-center justify-between mb-2 border-b border-border dark:border-white/10 pb-2">
          <div className="flex flex-col">
            <h4 className="text-sm font-black text-primary">{data.city}</h4>
            <span className="text-[10px] opacity-50 font-bold uppercase tracking-widest">Station Alert</span>
          </div>
          <span className={cn(
            "px-2 py-0.5 rounded text-[10px] font-black uppercase border",
            data.pollution > 400 ? 'bg-red-900 border-red-500 text-red-100' : 
            data.pollution > 300 ? 'bg-red-600/20 border-red-600/50 text-red-400' : 
            data.pollution > 200 ? 'bg-orange-600/20 border-orange-600/50 text-orange-400' :
            data.pollution > 100 ? 'bg-yellow-600/20 border-yellow-600/50 text-yellow-400' :
            'bg-blue-600/20 border-blue-600/50 text-blue-400'
          )}>
            {data.pollution > 400 ? 'Critical' : 
             data.pollution > 300 ? 'Severe' : 
             data.pollution > 200 ? 'Poor' : 
             data.pollution > 100 ? 'Moderate' : 'Good'}
          </span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-black text-text-primary dark:text-white">{data.pollution}</p>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">Pollution Index (AQI)</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-primary">LIVE STATUS</p>
            <p className="text-[10px] opacity-40 italic">Updated Just Now</p>
          </div>
        </div>
      </div>
    </Popup>
  </Marker>
));

const MapUi = forwardRef(({ sensors, filter = 'air' }, ref) => {
  const { userLocation } = useUserStore();
  const { theme } = useAppStore();
  const [currentZoom, setCurrentZoom] = useState(5);
  
  // Simulation: Vary pollution data based on focus
  const filteredData = pollutionData.map(d => {
    let multiplier = 1;
    if (filter === 'water') multiplier = 0.7; // Water levels usually lower numbers
    if (filter === 'noise') multiplier = 0.4; // Noise in dB is lower
    return { ...d, pollution: Math.floor(d.pollution * multiplier) };
  });

  const tileUrl = theme === 'dark' 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  return (
    <div className="relative w-full h-full z-0 overflow-hidden bg-app dark:bg-[#0f172a]">
      <MapContainer 
        center={userLocation ? [userLocation.lat, userLocation.lng] : [22.5937, 78.9629]} 
        zoom={currentZoom} 
        minZoom={3}
        maxBounds={[[5, 65], [38, 100]]}
        maxBoundsViscosity={1.0}
        className="w-full h-full" 
        zoomControl={false}
      >
        <TileLayer
          url={tileUrl}
          attribution='&copy; <a href="https://carto.com/">Carto</a>'
        />
        
        <MapController ref={ref} onZoomChange={setCurrentZoom} />
        
        {/* Lower pane for heatmap clouds */}
        <Pane name="heatmap-pane" style={{ zIndex: 450 }}>
          {filteredData.map((data, index) => (
            <PollutionCloud key={`${data.city}-${index}`} data={data} zoom={currentZoom} theme={theme} />
          ))}
        </Pane>

        {/* Higher pane for actual markers */}
        <Pane name="marker-pane-custom" style={{ zIndex: 650 }}>
          {/* User Location Marker */}
          {userLocation && (
            <Marker 
              key={`user-loc-${userLocation.lat}-${userLocation.lng}`}
              position={[userLocation.lat, userLocation.lng]} 
              icon={userIcon} 
              zIndexOffset={2000}
            >
              <Popup>
                <div className="p-1">
                  <p className="text-xs font-bold text-primary">Your Location</p>
                  <p className="text-[10px] text-text-muted">{userLocation.city}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Sensor Markers from Props */}
          {sensors?.map((sensor) => (
            <Marker 
              key={sensor.id} 
              position={[sensor.lat, sensor.lng]}
              zIndexOffset={500}
            >
              <Popup className="custom-popup">
                <div className="bg-surface dark:bg-[#0f172a] text-text-primary dark:text-slate-100 p-2 min-w-[150px]">
                  <h4 className="text-sm font-bold text-primary mb-1">{sensor.name}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">AQI: {sensor.aqi}</span>
                    <Badge variant={sensor.status === 'critical' ? 'danger' : sensor.status === 'unhealthy' ? 'warning' : 'success'}>
                      {sensor.status}
                    </Badge>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </Pane>
      </MapContainer>
      
      <style>{`
        .leaflet-container { background: var(--bg-app); }
        .custom-popup .leaflet-popup-content-wrapper { 
          background: var(--bg-surface); 
          border: 1px solid var(--border); 
          border-radius: 0.5rem; 
          color: var(--text-primary);
          padding: 0;
          overflow: hidden;
        }
        .dark .custom-popup .leaflet-popup-content-wrapper {
          background: #0f172a;
          border-color: rgba(255, 255, 255, 0.1);
          color: white;
        }
        .custom-popup .leaflet-popup-content { margin: 0; }
        .custom-popup .leaflet-popup-tip { background: var(--bg-surface); }
        .dark .custom-popup .leaflet-popup-tip { background: #0f172a; }
        .leaflet-div-icon { background: transparent; border: none; }
        
        @keyframes critical-pulse {
          0% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.1); opacity: 0.65; }
          100% { transform: scale(1); opacity: 0.85; }
        }
        .animate-critical-pulse {
          animation: critical-pulse 4s ease-in-out infinite;
        }

        .pollution-cloud-marker {
          transition: width 0.3s ease, height 0.3s ease, margin 0.3s ease;
        }
      `}</style>
    </div>
  );
});

export default MapUi;
