import { useState } from 'react';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import { useAppStore } from '../store/useAppStore';
import { complianceService } from '../services/complianceService';
import { cn } from '../utils/cn';

export default function Compliance() {
  const { complianceData } = useAppStore();
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [violationHistory, setViolationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'High Risk', 'Pending Review', 'Archived'];

  const handleIndustryClick = async (industry) => {
    setSelectedIndustry(industry);
    setLoading(true);
    // Simulating API call for history
    const history = await complianceService.getViolationHistory(industry.sector);
    setViolationHistory(history);
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'compliant': return 'bg-primary';
      case 'warning': return 'bg-amber-500';
      case 'critical': return 'bg-rose-500';
      default: return 'bg-slate-400';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-primary';
    if (score >= 40) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getBarColor = (score) => {
    if (score >= 80) return 'bg-primary';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getTimeAgo = (isoString) => {
    const now = new Date();
    const past = new Date(isoString);
    const diffInMs = now - past;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  // Logic-based filtering
  const filteredData = complianceData.filter(ind => {
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
        <h3 className="text-2xl font-bold mb-1">Industry Compliance Overview</h3>
        <p className="text-text-secondary text-sm">Real-time monitoring of regulatory status across sectors.</p>
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
            {tab === 'All' ? 'All Industries' : tab}
          </button>
        ))}
      </div>

      {/* Industry List */}
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
                    <h4 className="font-semibold text-sm truncate">{ind.sector}</h4>
                    <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", getStatusColor(ind.compliance.status))} title={`Status: ${ind.compliance.status}`}></div>
                  </div>
                  <p className="text-xs text-text-muted">Last Inspection: {getTimeAgo(ind.compliance.last_inspection)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-8 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-border sm:border-transparent">
                <div className="flex flex-col items-end gap-1 flex-1 sm:flex-none">
                  <div className="flex justify-between w-full sm:w-32 items-center mb-1">
                    <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Compliance Score</span>
                    <span className={cn("text-[10px] font-bold", getScoreColor(ind.metrics.compliance_score))}>
                      {ind.metrics.compliance_score}%
                    </span>
                  </div>
                  <div className="w-full sm:w-32 h-1.5 bg-panel rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-1000", getBarColor(ind.metrics.compliance_score))} 
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
            <p className="text-text-secondary font-medium">No industries found in this category.</p>
          </div>
        )}
      </div>

      <Modal 
        isOpen={!!selectedIndustry} 
        onClose={() => setSelectedIndustry(null)}
        title={`${selectedIndustry?.sector} Detailed Status`}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-panel rounded-xl border border-border">
              <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Entity Name</p>
              <p className="text-sm font-bold truncate">{selectedIndustry?.entity.name}</p>
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
                  <Badge variant={v.status === 'Resolved' ? 'success' : 'warning'}>{v.status}</Badge>
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
