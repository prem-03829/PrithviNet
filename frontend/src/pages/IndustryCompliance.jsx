import { useMemo } from 'react';
import Badge from '../components/Badge';
import Card from '../components/Card';
import ComplianceTrendChart from '../components/ComplianceTrendChart';
import { useUserStore } from '../store/useUserStore';
import { cn } from '../utils/cn';

export default function IndustryCompliance({ activeTab }) {
  const { user } = useUserStore();
  
  const industryComplianceData = useMemo(() => ({
    score: 82, risk: "Medium", trend: [72, 75, 70, 74, 80, 82],
    emissions: [
      { type: "CO2", value: 420, unit: "ppm", status: "warning", label: "Air Emission" },
      { type: "PM2.5", value: 65, unit: "µg/m³", status: "critical", label: "Particulate Matter" },
      { type: "Water Discharge", value: 38, unit: "mg/L", status: "success", label: "Effluent Level" },
      { type: "Noise", value: 78, unit: "dB", status: "warning", label: "Ambient Noise" }
    ],
    actions: [
      { task: "Install new particulate filters", deadline: "2026-04-01", priority: "High" },
      { task: "Calibrate Water Sensors", deadline: "2026-03-25", priority: "Medium" }
    ],
    violations: [
      { id: "V102", type: "Air Emission Breach", severity: "High", date: "2026-02-10", status: "Under Review" },
      { id: "V098", type: "Waste Disposal Error", severity: "Medium", date: "2026-01-22", status: "Resolved" }
    ],
    inspections: [
      { authority: "Maharashtra Pollution Control Board", date: "2026-01-15", result: "Conditional Approval", officer: "Inspector K. Deshmukh" }
    ]
  }), []);

  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('review') || s.includes('warning')) return 'warning';
    if (s.includes('resolved') || s.includes('success') || s.includes('active')) return 'success';
    if (s.includes('critical') || s.includes('high')) return 'danger';
    return 'primary';
  };

  if (activeTab === 'Overview') {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="flex flex-col justify-center p-6 space-y-2 border-l-4 border-l-primary">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Aggregate Compliance</p>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black text-primary">{industryComplianceData.score}</span>
              <span className="text-xl font-bold text-text-muted mb-1">/ 100</span>
            </div>
          </Card>
          <Card className="flex flex-col justify-center p-6 space-y-2 border-l-4 border-l-amber-500">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Entity Risk</p>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-amber-500 uppercase">{industryComplianceData.risk}</span>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Live Emission Metrics</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.isArray(industryComplianceData.emissions) && industryComplianceData.emissions.map((m, i) => (
              <Card key={i} className="p-4 space-y-2 border-t-4" style={{ borderColor: m.status === 'success' ? '#22c55e' : m.status === 'warning' ? '#f59e0b' : '#ef4444' }}>
                <p className="text-[10px] font-bold text-text-muted uppercase truncate">{m.label}</p>
                <p className="text-xl font-black">{m.value} <span className="text-[10px] font-medium text-text-muted">{m.unit}</span></p>
                <Badge variant={getStatusBadge(m.status)} className="scale-75 origin-left">{m.status}</Badge>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="space-y-4 !rounded-none">
            <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">Pending Actions</h4>
            <div className="space-y-3">
              {Array.isArray(industryComplianceData.actions) && industryComplianceData.actions.map((a, i) => (
                <div key={i} className="p-3 bg-panel border border-border flex justify-between items-center">
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{a.task}</p>
                    <p className="text-[10px] text-rose-500 font-bold uppercase mt-0.5 tracking-tighter">Due: {a.deadline}</p>
                  </div>
                  <Badge variant={a.priority === 'High' ? 'danger' : 'warning'} className="!text-[8px]">{a.priority}</Badge>
                </div>
              ))}
            </div>
          </Card>
          <Card className="space-y-4 !rounded-none">
            <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">6-Month Trend</h4>
            {industryComplianceData.trend && <ComplianceTrendChart trend={industryComplianceData.trend} />}
          </Card>
        </div>
      </div>
    );
  }

  if (activeTab === 'Violations') {
    return (
      <div className="space-y-4 animate-in fade-in duration-500">
        {Array.isArray(industryComplianceData.violations) && industryComplianceData.violations.map((v) => (
          <Card key={v.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 !rounded-none border-l-4 border-l-red-500">
            <div className="space-y-1">
              <span className="text-xs font-black text-primary font-mono">{v.id}</span>
              <h4 className="text-base font-black uppercase tracking-tight">{v.type}</h4>
              <p className="text-xs text-text-secondary">{v.date}</p>
            </div>
            <Badge variant={getStatusBadge(v.status)}>{v.status}</Badge>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="py-20 text-center bg-panel/30 border border-dashed border-border rounded-2xl">
      <p className="text-text-muted font-bold uppercase tracking-widest text-[10px]">No data for selected view</p>
    </div>
  );
}
