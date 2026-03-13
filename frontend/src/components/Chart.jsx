import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppStore } from '../store/useAppStore';
import { useMemo } from 'react';

export default function Chart() {
  const { sensors } = useAppStore();

  const data = useMemo(() => {
    const base = [
      { name: 'Oct 01', pollution: 80, complaints: 110 },
      { name: 'Oct 10', pollution: 60, complaints: 120 },
      { name: 'Oct 20', pollution: 100, complaints: 80 },
      { name: 'Oct 30', pollution: 20, complaints: 100 },
    ];

    if (sensors.length === 0) return base;

    // Shift data slightly based on current AQI to simulate "dynamic" charts
    const avgAqi = sensors.reduce((acc, s) => acc + s.aqi, 0) / sensors.length;
    return base.map(d => ({
      ...d,
      pollution: Math.max(10, d.pollution + (avgAqi > 150 ? 20 : -10))
    }));
  }, [sensors]);

  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPollution" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#21c468" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#21c468" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a3d31" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#122018', borderColor: '#21c468', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Area type="monotone" dataKey="pollution" stroke="#21c468" strokeWidth={3} fillOpacity={1} fill="url(#colorPollution)" />
          <Area type="monotone" dataKey="complaints" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" fillOpacity={0} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
