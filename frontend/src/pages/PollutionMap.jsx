import { useRef } from 'react';
import MapUi from '../components/MapUi';
import { usePollutionStore } from '../store/usePollutionStore';
import { useUserStore } from '../store/useUserStore';
import { useAppStore } from '../store/useAppStore';
import { sensorService } from '../services/sensorService';
import { cn } from '../utils/cn';

export default function PollutionMap({ isAdmin }) {
  const { sensors, setSensors } = usePollutionStore();
  const { focusLocation, setFocusLocation, userLocation, detectLocation } = useUserStore();
  const { mapFilter, setMapFilter } = useAppStore();
  const mapRef = useRef(null);

  const handleRefresh = async () => {
    const data = await sensorService.getSensors();
    setSensors(data);
  };

  const handleRecenter = () => {
    if (userLocation) {
      const loc = { name: userLocation.city, lat: userLocation.lat, lng: userLocation.lng };
      setFocusLocation(loc);
      mapRef.current?.flyTo(loc.lat, loc.lng, 13);
    } else {
      detectLocation((loc) => {
        mapRef.current?.flyTo(loc.lat, loc.lng, 13);
      });
    }
  };

  return (
    <div className="relative flex-1 h-[calc(100vh-64px)] w-full flex flex-col bg-panel dark:bg-app overflow-hidden animate-in fade-in duration-700">
      {/* Top Filter Bar - Positioned relative on mobile to prevent overlaying, absolute on md+ */}
      <div className="w-full md:absolute md:top-6 md:left-1/2 md:-translate-x-1/2 md:max-w-4xl px-2 md:px-4 z-[40] pointer-events-none mt-2 md:mt-0">
        <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4 rounded-xl md:rounded-2xl bg-surface/80 dark:bg-app/40 p-1.5 md:p-2 shadow-2xl backdrop-blur-xl border border-border/50 dark:border-border/20 pointer-events-auto">
          <div className="flex items-center gap-1 bg-panel dark:bg-primary dark:bg-opacity-5 p-1 rounded-lg md:rounded-xl overflow-x-auto no-scrollbar">
            {['Air', 'Water', 'Noise'].map((label) => {
              const value = label.toLowerCase();
              const isActive = mapFilter === value;
              return (
                <button 
                  key={label}
                  onClick={() => setMapFilter(value)}
                  className={cn(
                    "flex items-center gap-1.5 md:gap-2 rounded-md md:rounded-lg px-2.5 md:px-4 py-1.5 md:py-2 text-[10px] md:text-sm font-semibold transition-all shrink-0",
                    isActive ? "bg-primary text-white shadow-lg" : "text-text-secondary hover:text-primary"
                  )}
                >
                  <span className="material-symbols-outlined text-xs md:text-sm">{value === 'air' ? 'air' : value === 'water' ? 'water_drop' : 'volume_up'}</span>
                  {label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 md:gap-3 px-1 md:px-2 ml-auto">
            <div className="flex flex-col items-start px-2 hidden lg:flex">
              <span className="text-[10px] uppercase font-bold text-text-muted">Current Focus</span>
              <span className="text-xs font-bold text-primary truncate max-w-[120px]">{focusLocation?.name || 'India'}</span>
            </div>
            <div className="h-6 md:h-8 w-px bg-border/50 dark:bg-primary dark:bg-opacity-20 hidden md:block"></div>
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-1.5 md:gap-2 rounded-md md:rounded-lg border border-border dark:border-primary dark:border-opacity-30 px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-sm font-medium hover:bg-panel dark:hover:bg-primary dark:hover:bg-opacity-10 transition-all text-text-secondary"
            >
              <span className="material-symbols-outlined text-xs md:text-sm">refresh</span>
              Reload
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 relative z-0">
        {sensors.length > 0 ? (
          <MapUi ref={mapRef} sensors={sensors} filter={mapFilter} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-app/50 backdrop-blur-sm z-[45]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-primary font-bold">Initializing Sensor Network...</p>
            </div>
          </div>
        )}
        
        {/* Map Control Buttons - Anchored to bottom right */}
        <div className="absolute right-4 bottom-4 md:right-6 md:bottom-6 flex flex-col gap-2 z-[40]">
          <button 
            onClick={() => mapRef.current?.zoomIn()}
            className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg md:rounded-xl bg-surface/80 dark:bg-app/60 shadow-xl border border-border dark:border-border/20 backdrop-blur-md hover:bg-primary hover:text-white transition-all text-text-secondary"
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-lg md:text-xl">add</span>
          </button>
          <button 
            onClick={() => mapRef.current?.zoomOut()}
            className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg md:rounded-xl bg-surface/80 dark:bg-app/60 shadow-xl border border-border dark:border-border/20 backdrop-blur-md hover:bg-primary hover:text-white transition-all text-text-secondary"
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-lg md:text-xl">remove</span>
          </button>
          <button 
            onClick={handleRecenter}
            className="mt-1 md:mt-2 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg md:rounded-xl bg-primary text-white shadow-xl hover:scale-105 active:scale-95 transition-all"
            title="Recenter to My Location"
          >
            <span className="material-symbols-outlined text-lg md:text-xl">near_me</span>
          </button>
        </div>

        {/* Legend - Hidden on mobile to save space */}
        <div className="absolute left-4 bottom-4 z-[40] hidden md:block">
          <div className="rounded-2xl bg-surface/80 dark:bg-app/60 p-4 shadow-xl border border-border dark:border-border/20 backdrop-blur-md">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary text-opacity-60">Pollution Levels</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3"><div className="h-3 w-3 rounded-full bg-primary"></div><span className="text-xs font-medium text-text-secondary">Safe (0-50)</span></div>
              <div className="flex items-center gap-3"><div className="h-3 w-3 rounded-full bg-yellow-500"></div><span className="text-xs font-medium text-text-secondary">Moderate (51-100)</span></div>
              <div className="flex items-center gap-3"><div className="h-3 w-3 rounded-full bg-orange-500"></div><span className="text-xs font-medium text-text-secondary">Unhealthy (101-200)</span></div>
              <div className="flex items-center gap-3"><div className="h-3 w-3 rounded-full bg-red-600"></div><span className="text-xs font-medium text-text-secondary">Critical (200+)</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
