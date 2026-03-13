export default function SensorCard({ sensor }) {
  return (
    <div className="w-56 rounded-2xl bg-background-light dark:bg-background-dark p-4 shadow-2xl border border-primary border-opacity-20 ring-1 ring-primary ring-opacity-10">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider opacity-60">Station {sensor.id}</h4>
        <span className={`flex h-2 w-2 rounded-full ${sensor.status === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-primary'}`}></span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold">{sensor.aqi}</p>
          <p className="text-[10px] font-medium opacity-60">AQI Index</p>
        </div>
        <div className="text-right">
          <div className={`flex items-center justify-end font-bold text-sm ${sensor.trend > 0 ? 'text-red-500' : 'text-primary'}`}>
            <span className="material-symbols-outlined text-sm">{sensor.trend > 0 ? 'trending_up' : 'trending_down'}</span>
            {Math.abs(sensor.trend)}%
          </div>
          <p className="text-[10px] opacity-40">Since 1h ago</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-primary border-opacity-10 pt-3">
        <span className="material-symbols-outlined text-xs opacity-40">schedule</span>
        <p className="text-[10px] opacity-60 uppercase font-medium">Updated {sensor.updated}</p>
      </div>
    </div>
  );
}
