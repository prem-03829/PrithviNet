import { useState, useMemo } from 'react';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import Card from '../components/Card';
import Button from '../components/Button';
import ComplianceTrendChart from '../components/ComplianceTrendChart';
import { useAppStore } from '../store/useAppStore';
import { useUserStore } from '../store/useUserStore';
import { complianceService } from '../services/complianceService';
import { cn } from '../utils/cn';

export default function Compliance() {
  const { complianceData: globalComplianceData } = useAppStore();
  const { user } = useUserStore();
  const isIndustry = user?.role === 'Industry';
  
  // Realistic Industry Compliance Data (Mock for API)
  const industryComplianceData = useMemo(() => ({
    score: 82,
    risk: "Medium",
    emissions: [
      { type: "CO2", value: 420, unit: "ppm", status: "warning", label: "Air Emission" },
      { type: "PM2.5", value: 65, unit: "µg/m³", status: "critical", label: "Particulate Matter" },
      { type: "Water Discharge", value: 38, unit: "mg/L", status: "success", label: "Effluent Level" },
      { type: "Noise", value: 78, unit: "dB", status: "warning", label: "Ambient Noise" }
    ],
    violations: [
      {
        id: "V102",
        type: "Air Emission Limit Exceeded",
        severity: "High",
        date: "2026-02-10",
        status: "Under Review"
      },
      {
        id: "V098",
        type: "Improper Waste Disposal",
        severity: "Medium",
        date: "2026-01-22",
        status: "Resolved"
      }
    ],
    inspections: [
      {
        authority: "Maharashtra Pollution Control Board",
        date: "2026-01-15",
        result: "Conditional Approval",
        officer: "Inspector K. Deshmukh"
      },
      {
        authority: "CPCB Regional Office",
        date: "2025-11-05",
        result: "Compliant",
        officer: "Officer S. Rao"
      }
    ],
    actions: [
      {
        task: "Install new particulate filters",
        deadline: "2026-04-01",
        priority: "High"
      },
      {
        task: "Calibrate Water Monitoring Sensors",
        deadline: "2026-03-25",
        priority: "Medium"
      }
    ],
    // 1. Ensure trend data exists as a raw array for the component
    trend: [72, 75, 70, 74, 80, 82]
  }), []);

  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [violationHistory, setViolationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(isIndustry ? 'Overview' : 'All');

  const tabs = isIndustry 
    ? ['Overview', 'Violations', 'Inspections'] 
    : ['All', 'High Risk', 'Pending Review', 'Archived'];

  const handleIndustryClick = async (industry) => {
    setSelectedIndustry(industry);
    setLoading(true);
    const history = await complianceService.getViolationHistory(industry.sector);
    setViolationHistory(history);
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    const s = status.toLowerCase();
    if (s.includes('review') || s.includes('warning')) return 'warning';
    if (s.includes('resolved') || s.includes('success') || s.includes('safe') || s.includes('compliant')) return 'success';
    if (s.includes('critical') || s.includes('high')) return 'danger';
    return 'primary';
  };

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-primary';
      case 'medium': return 'text-amber-500';
      case 'high': return 'text-orange-500';
      case 'critical': return 'text-rose-500';
      default: return 'text-slate-400';
    }
  };

  const getTimeAgo = (isoString) => {
    const now = new Date();
    const past = new Date(isoString);
    const diffInMs = now - past;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (isNaN(diffInHours)) return isoString;
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const filteredData = globalComplianceData.filter(ind => {
    if (activeTab === 'All') return true;
    if (activeTab === 'High Risk') return ind.risk_level === 'high';
    if (activeTab === 'Pending Review') return ind.lifecycle.status === 'pending';
    if (activeTab === 'Archived') return ind.lifecycle.status === 'archived';
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 max-w-4xl mx-auto w-full animate-in fade-in duration-500 text-text-primary">
      {/* Title Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-1">
          {isIndustry ? "My Entity Compliance" : "Industry Compliance Overview"}
        </h3>
        <p className="text-text-secondary text-sm">
          {isIndustry ? `Real-time regulatory dashboard for ${user?.industryId?.toUpperCase()}` : "Oversight and monitoring of regulatory status across sectors."}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-8 border-b border-border mb-6 overflow-x-auto no-scrollbar whitespace-nowrap">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-3 border-b-2 text-sm transition-colors",
              activeTab === tab 
                ? "border-primary text-primary font-semibold" 
                : "border-transparent text-text-secondary hover:text-text-primary font-medium"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* INDUSTRY ROLE VIEW */}
      {isIndustry && (
        <div className="space-y-6">
          {/* OVERVIEW TAB */}
          {activeTab === 'Overview' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="flex flex-col justify-center p-6 space-y-2">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Overall Compliance Score</p>
                  <div className="flex items-end gap-3">
                    <span className={cn("text-5xl font-black", industryComplianceData.score > 80 ? "text-primary" : "text-amber-500")}>
                      {industryComplianceData.score}
                    </span>
                    <span className="text-xl font-bold text-text-muted mb-1">/ 100</span>
                  </div>
                  <div className="w-full h-2 bg-panel rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-primary" style={{ width: `${industryComplianceData.score}%` }}></div>
                  </div>
                </Card>
                <Card className="flex flex-col justify-center p-6 space-y-2">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Risk Level</p>
                  <div className="flex items-center gap-3">
                    <span className={cn("text-4xl font-black", getRiskColor(industryComplianceData.risk))}>
                      {industryComplianceData.risk}
                    </span>
                    <Badge variant={getStatusBadge(industryComplianceData.risk)}>Live Status</Badge>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">Based on last 30 days of sensor data.</p>
                </Card>
              </div>

              {/* Emission Metrics */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-text-muted">Live Emission Metrics</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {industryComplianceData.emissions.map((m, i) => (
                    <Card key={i} className="p-4 space-y-2 border-t-4" style={{ borderColor: m.status === 'success' ? '#22c55e' : m.status === 'warning' ? '#f59e0b' : '#ef4444' }}>
                      <p className="text-[10px] font-bold text-text-muted uppercase truncate">{m.label}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black">{m.value}</span>
                        <span className="text-[10px] font-medium text-text-muted">{m.unit}</span>
                      </div>
                      <Badge variant={getStatusBadge(m.status)} className="scale-75 origin-left">{m.status}</Badge>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pending Actions */}
                <Card className="space-y-4">
                  <h4 className="text-sm font-bold">Pending Compliance Actions</h4>
                  <div className="space-y-3">
                    {industryComplianceData.actions.map((a, i) => (
                      <div key={i} className="p-3 bg-panel rounded-xl border border-border flex justify-between items-center">
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate">{a.task}</p>
                          <p className="text-[10px] text-rose-500 font-bold uppercase mt-0.5">Due: {a.deadline}</p>
                        </div>
                        <Badge variant={a.priority === 'High' ? 'danger' : 'warning'}>{a.priority}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Trend Section */}
                <Card className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-tight">Compliance Trend (6 Months)</h4>
                  {/* 2. Using chart-compatible structure via ComplianceTrendChart */}
                  <ComplianceTrendChart trend={industryComplianceData.trend} />
                </Card>
              </div>
            </>
          )}

          {/* VIOLATIONS TAB */}
          {activeTab === 'Violations' && (
            <div className="space-y-4">
              {industryComplianceData.violations.map((v) => (
                <Card key={v.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-primary">{v.id}</span>
                      <Badge variant={v.severity === 'High' ? 'danger' : 'warning'}>{v.severity} Severity</Badge>
                    </div>
                    <h4 className="text-base font-bold">{v.type}</h4>
                    <p className="text-xs text-text-secondary">{v.date} • Registered Incident</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-bold text-text-muted uppercase">Status</p>
                      <p className="text-sm font-bold">{v.status}</p>
                    </div>
                    <Button variant="outline" className="text-xs">View Details</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* INSPECTIONS TAB */}
          {activeTab === 'Inspections' && (
            <div className="space-y-4">
              {industryComplianceData.inspections.map((ins, i) => (
                <Card key={i} className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-text-primary">{ins.authority}</h4>
                      <p className="text-xs text-text-muted">{ins.officer}</p>
                    </div>
                    <Badge variant={getStatusBadge(ins.result)}>{ins.result}</Badge>
                  </div>
                  <div className="pt-4 border-t border-border flex justify-between items-center">
                    <span className="text-xs font-medium text-text-secondary">Date: {ins.date}</span>
                    <Button variant="ghost" className="text-xs text-primary">Download Report</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* GOVERNMENT ROLE VIEW */}
      {!isIndustry && (
        <div className="flex flex-col gap-3 min-h-[400px]">
          {filteredData.length > 0 ? (
            filteredData.map((ind) => (
              <div 
                key={ind.id} 
                onClick={() => handleIndustryClick(ind)}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-surface border border-border hover:border-primary/30 transition-all cursor-pointer group gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-panel text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                    <span className="material-symbols-outlined text-2xl">{ind.icon}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm truncate">{ind.entity.name}</h4>
                      <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", ind.compliance.status === 'compliant' ? 'bg-primary' : 'bg-rose-500')} title={`Status: ${ind.compliance.status}`}></div>
                    </div>
                    <p className="text-xs text-text-muted">{ind.sector} • Last Inspection: {getTimeAgo(ind.compliance.last_inspection)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-8 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-border sm:border-transparent">
                  <div className="flex flex-col items-end gap-1 flex-1 sm:flex-none">
                    <div className="flex justify-between w-full sm:w-32 items-center mb-1">
                      <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Compliance Score</span>
                      <span className={cn("text-[10px] font-bold", ind.metrics.compliance_score >= 80 ? "text-primary" : "text-amber-500")}>
                        {ind.metrics.compliance_score}%
                      </span>
                    </div>
                    <div className="w-full sm:w-32 h-1.5 bg-panel rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full transition-all duration-1000", ind.metrics.compliance_score >= 80 ? "bg-primary" : "bg-amber-500")} 
                        style={{ width: `${ind.metrics.compliance_score}%` }}
                      ></div>
                    </div>
                  </div>
                  <button className="p-1 rounded text-text-muted hover:text-primary transition-colors shrink-0">
                    <span className="material-symbols-outlined text-xl">chevron_right</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-panel/30 border border-dashed border-border rounded-2xl">
              <span className="material-symbols-outlined text-4xl text-text-muted mb-2">inventory_2</span>
              <p className="text-text-secondary font-medium">No records found.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal for Government View Details */}
      <Modal 
        isOpen={!!selectedIndustry} 
        onClose={() => setSelectedIndustry(null)}
        title={`${selectedIndustry?.entity.name} Detailed Status`}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-panel rounded-xl border border-border">
              <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Sector</p>
              <p className="text-sm font-bold truncate">{selectedIndustry?.sector}</p>
            </div>
            <div className="p-4 bg-panel rounded-xl border border-border">
              <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Registration</p>
              <p className="text-sm font-bold truncate">{selectedIndustry?.entity.registration_no}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Authority & Oversight</h4>
            <div className="p-4 bg-surface border border-border rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Oversight Body</span>
                <span className="text-sm font-bold">{selectedIndustry?.authority.body}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Assigned Officer</span>
                <span className="text-sm font-bold">{selectedIndustry?.authority.officer_in_charge}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted">Violation History</h4>
            {loading ? (
              <div className="py-6 text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : violationHistory.length > 0 ? (
              violationHistory.map((v, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-panel rounded-xl border border-border">
                  <div>
                    <p className="text-xs font-bold text-text-muted">{v.date}</p>
                    <p className="text-sm font-semibold">{v.type}</p>
                  </div>
                  <Badge variant={getStatusBadge(v.status)}>{v.status}</Badge>
                </div>
              ))
            ) : (
              <div className="py-6 text-center bg-panel rounded-xl border border-dashed border-border">
                <p className="text-sm text-text-muted">No historical violations on record.</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
