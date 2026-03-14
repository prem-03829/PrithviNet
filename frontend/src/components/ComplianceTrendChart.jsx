import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

/**
 * ComplianceTrendChart
 * Renders a visual trend of compliance scores over time.
 * @param {number[]} trend - Raw array of score numbers
 */
export default function ComplianceTrendChart({ trend = [] }) {
  // 1. Ensure trend data exists and transform into chart-compatible structure
  const chartData = useMemo(() => {
    if (!trend || trend.length === 0) return [];
    
    const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
    return trend.map((score, index) => ({
      month: months[index] || `M${index + 1}`,
      score: Number(score) || 0
    }));
  }, [trend]);

  // 6. Fallback UI if no data
  if (chartData.length === 0) {
    return (
      <div className="h-48 w-full flex items-center justify-center bg-panel/30 border border-dashed border-border rounded-xl">
        <p className="text-xs text-text-muted font-bold uppercase tracking-widest">No trend data available</p>
      </div>
    );
  }

  return (
    // 3. Ensure chart container has fixed height
    <div className="h-48 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="complianceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a3d31" opacity={0.5} />
          {/* 4. Ensure correct dataKey binding */}
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} 
            dy={10} 
          />
          <YAxis 
            domain={[0, 100]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#64748b' }} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#122018', 
              borderColor: '#22c55e', 
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
            itemStyle={{ color: '#fff' }}
            cursor={{ stroke: '#22c55e', strokeWidth: 1 }}
          />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke="#22c55e" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#complianceGradient)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
