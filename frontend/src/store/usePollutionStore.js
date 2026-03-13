import { create } from 'zustand';

export const usePollutionStore = create((set, get) => ({
  sensors: [
    { id: "MUM-01", name: "Mumbai", lat: 19.0760, lng: 72.8777, aqi: 156, status: "unhealthy", trend: 5, updated: "Just now" },
    { id: "DEL-01", name: "Delhi", lat: 28.6139, lng: 77.2090, aqi: 312, status: "critical", trend: 12, updated: "Just now" },
    { id: "BLR-01", name: "Bangalore", lat: 12.9716, lng: 77.5946, aqi: 82, status: "moderate", trend: -2, updated: "Just now" },
    { id: "CHN-01", name: "Chennai", lat: 13.0827, lng: 80.2707, aqi: 94, status: "moderate", trend: 1, updated: "Just now" },
    { id: "KOL-01", name: "Kolkata", lat: 22.5726, lng: 88.3639, aqi: 184, status: "unhealthy", trend: 8, updated: "Just now" },
    { id: "HYD-01", name: "Hyderabad", lat: 17.3850, lng: 78.4867, aqi: 124, status: "unhealthy", trend: -4, updated: "Just now" },
  ],
  setSensors: (sensors) => set({ sensors }),
  
  simulatePollution: () => {
    const { sensors } = get();
    const updated = sensors.map(s => {
      const change = Math.floor(Math.random() * 9) - 4;
      const newAqi = Math.max(10, s.aqi + change);
      const status = newAqi > 300 ? 'critical' : newAqi > 150 ? 'unhealthy' : newAqi > 50 ? 'moderate' : 'good';
      return { ...s, aqi: newAqi, status, trend: change, updated: "Just now" };
    });
    set({ sensors: updated });
  }
}));
