import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { cn } from '../utils/cn';

// --- DUMMY DATASET ---
const dummyPolicies = [
  {
    id: 'POL-001',
    title: 'National Clean Air Programme (NCAP)',
    sector: 'Air Quality',
    authority: 'Central Pollution Control Board (CPCB)',
    deadline: '2024-12-31',
    summary: 'Targeting 20-30% reduction in PM2.5 and PM10 concentration.',
    description: 'The NCAP is a long-term, time-bound, national level strategy to tackle the air pollution problem across the country in a comprehensive manner with targets to achieve 20% to 30% reduction in Particulate Matter concentration by 2024.',
    actions: [
      'Implementation of city-specific action plans',
      'Strengthening of monitoring network',
      'Increasing public awareness',
      'Installation of 1500 additional monitoring stations'
    ],
    penalties: [
      'Fines up to ₹1,00,000 for non-compliance',
      'Suspension of industrial operations',
      'Blacklisting from future government contracts'
    ],
    region: 'Pan-India',
    status: 'active',
    impact_score: 85
  },
  {
    id: 'POL-002',
    title: 'Industrial Effluent Discharge Norms 2024',
    sector: 'Water Management',
    authority: 'Ministry of Environment, Forest and Climate Change',
    deadline: '2024-06-15',
    summary: 'Strict zero-liquid discharge requirements for textile and leather clusters.',
    description: 'Revised standards for the discharge of environmental pollutants from various industries. Specifically focusing on heavy metal concentration and BOD levels in industrial clusters near river basins.',
    actions: [
      'Installation of online continuous effluent monitoring systems (OCEMS)',
      'Quarterly third-party audits',
      'Mandatory ZLD implementation for "Red Category" industries'
    ],
    penalties: [
      'Closure of industry until remediation',
      'Environmental compensation fines calculated per day of violation',
      'Legal action against company directors'
    ],
    region: 'Industrial Corridors',
    status: 'under_review',
    impact_score: 72
  },
  {
    id: 'POL-003',
    title: 'Plastic Waste Management (Amendment) Rules',
    sector: 'Waste Management',
    authority: 'State Pollution Control Boards',
    deadline: '2025-01-01',
    summary: 'Extended Producer Responsibility (EPR) targets for plastic packaging.',
    description: 'The rules mandate the phasing out of identified single-use plastic items and prescribe the EPR targets for plastic packaging waste. Manufacturers and importers must register on the centralized portal.',
    actions: [
      'Registration on EPR Centralized Portal',
      'Monthly reporting of waste collection and processing',
      'Implementation of buy-back schemes'
    ],
    penalties: [
      'Revocation of operating license',
      'Confiscation of single-use plastic inventory',
      'Heavy penalties based on unfulfilled EPR targets'
    ],
    region: 'State Level',
    status: 'active',
    impact_score: 64
  },
  {
    id: 'POL-004',
    title: 'Urban Noise Level Control Standards',
    sector: 'Urban Noise',
    authority: 'Municipal Corporations',
    deadline: '2024-09-30',
    summary: 'Strict decibel limits for residential and silent zones during night hours.',
    description: 'New regulatory framework to manage and control noise pollution in high-density urban areas. Includes deployment of automated sound monitoring sensors in sensitive locations.',
    actions: [
      'Installation of noise barriers in construction sites',
      'Restriction on heavy vehicle movement in residential areas',
      'Real-time sound level display boards'
    ],
    penalties: [
      'On-the-spot fines for vehicular honking in silent zones',
      'Seizure of noise-making equipment',
      'Daily fines for construction projects exceeding limits'
    ],
    region: 'Tier-1 Cities',
    status: 'high_risk',
    impact_score: 48
  }
];

// --- POLICY DETAIL MODAL / SHEET COMPONENT ---
function PolicyDetailModal({ policy, isOpen, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !policy) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-md p-0 md:p-4 transition-all animate-in fade-in duration-300">
      {/* Overlay click */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Content Container: Sheet on Mobile, Modal on Desktop */}
      <div className={cn(
        "bg-surface border-t md:border border-border rounded-t-[2rem] md:rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden transition-all duration-500 transform relative z-10",
        "h-[92vh] md:h-auto md:max-h-[85vh]",
        "animate-in slide-in-from-bottom md:zoom-in-95"
      )}>
        {/* Mobile Drag Indicator */}
        <div className="md:hidden flex justify-center py-3">
          <div className="w-12 h-1.5 bg-border rounded-full" onClick={onClose}></div>
        </div>

        {/* Header */}
        <div className="px-6 py-4 md:py-6 border-b border-border flex items-center justify-between bg-panel/50 sticky top-0 z-20 backdrop-blur-sm">
          <div className="flex flex-col gap-1">
            <Badge variant={policy.status === 'active' ? 'success' : policy.status === 'under_review' ? 'warning' : 'danger'}>
              {policy.status.replace('_', ' ')}
            </Badge>
            <h2 className="text-xl md:text-2xl font-black text-text-primary leading-tight">{policy.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-text-secondary hover:text-primary transition-colors rounded-xl hover:bg-panel shrink-0">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-8 pb-20 md:pb-8">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-panel rounded-xl border border-border">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Sector</p>
              <p className="text-sm font-bold text-text-primary">{policy.sector}</p>
            </div>
            <div className="p-4 bg-panel rounded-xl border border-border">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Impact Score</p>
              <p className="text-sm font-bold text-primary">{policy.impact_score}/100</p>
            </div>
            <div className="p-4 bg-panel rounded-xl border border-border col-span-2 md:col-span-1">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Deadline</p>
              <p className="text-sm font-bold text-rose-500">{new Date(policy.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-text-muted uppercase tracking-[0.2em]">Policy Overview</h4>
            <p className="text-text-secondary text-sm leading-relaxed">{policy.description}</p>
          </div>

          {/* Authority & Region */}
          <div className="flex flex-col md:flex-row gap-6 border-y border-border py-6">
            <div className="flex-1 space-y-2">
              <h4 className="text-xs font-black text-text-muted uppercase tracking-widest">Regulatory Body</h4>
              <p className="text-sm font-bold text-text-primary">{policy.authority}</p>
            </div>
            <div className="flex-1 space-y-2">
              <h4 className="text-xs font-black text-text-muted uppercase tracking-widest">Region Applicability</h4>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                <p className="text-sm font-bold text-text-primary">{policy.region}</p>
              </div>
            </div>
          </div>

          {/* Actions & Penalties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="material-symbols-outlined text-base">task_alt</span>
                Required Actions
              </h4>
              <ul className="space-y-3">
                {policy.actions.map((action, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                    <p className="text-xs text-text-secondary leading-normal font-medium">{action}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-black text-rose-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="material-symbols-outlined text-base">warning</span>
                Penalty Structure
              </h4>
              <ul className="space-y-3">
                {policy.penalties.map((penalty, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="size-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                    <p className="text-xs text-text-secondary leading-normal font-medium">{penalty}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function PolicyInsights() {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const tabs = ['All', 'High Impact', 'Under Review', 'Risky'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'under_review': return 'warning';
      case 'high_risk': return 'danger';
      default: return 'primary';
    }
  };

  const getImpactColor = (score) => {
    if (score > 80) return 'text-rose-500';
    if (score > 60) return 'text-amber-500';
    return 'text-primary';
  };

  const filteredPolicies = dummyPolicies.filter(policy => {
    if (activeTab === 'All') return true;
    if (activeTab === 'High Impact') return policy.impact_score > 75;
    if (activeTab === 'Under Review') return policy.status === 'under_review';
    if (activeTab === 'Risky') return policy.status === 'high_risk';
    return true;
  });

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto custom-scrollbar p-4 md:p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-text-primary uppercase italic">Policy Intelligence</h2>
        <p className="text-text-secondary mt-1">Interactive regulatory analysis and compliance monitoring for industrial clusters.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-4 text-sm font-bold transition-all relative uppercase tracking-widest",
              activeTab === tab 
                ? "text-primary" 
                : "text-text-muted hover:text-text-primary"
            )}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_8px_#22c55e]"></div>
            )}
          </button>
        ))}
      </div>

      {/* Policy List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPolicies.map((policy) => (
          <Card 
            key={policy.id} 
            onClick={() => setSelectedPolicy(policy)}
            className={cn(
              "flex flex-col h-full cursor-pointer transition-all duration-300 group relative overflow-hidden",
              "hover:border-primary/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:-translate-y-1",
              selectedPolicy?.id === policy.id && "border-primary shadow-lg ring-1 ring-primary/20"
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <Badge variant={getStatusColor(policy.status)}>
                {policy.status.replace('_', ' ')}
              </Badge>
              <div className="text-right">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Impact Score</p>
                <p className={cn("text-xl font-black", getImpactColor(policy.impact_score))}>
                  {policy.impact_score}
                </p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-primary transition-colors pr-6">
              {policy.title}
            </h3>
            <p className="text-sm text-text-secondary line-clamp-2 mb-6 flex-1">
              {policy.summary}
            </p>

            <div className="pt-4 border-t border-border flex items-center justify-between mt-auto group-hover:border-primary/20 transition-colors">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Sector</span>
                <span className="text-xs font-bold text-text-primary">{policy.sector}</span>
              </div>
              <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                View Intelligence
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredPolicies.length === 0 && (
        <div className="py-20 text-center bg-panel/30 border border-dashed border-border rounded-2xl">
          <span className="material-symbols-outlined text-4xl text-text-muted mb-2">policy</span>
          <p className="text-text-secondary font-medium">No policies found matching this filter.</p>
        </div>
      )}

      {/* Modal / Detail View */}
      <PolicyDetailModal 
        policy={selectedPolicy} 
        isOpen={!!selectedPolicy} 
        onClose={() => setSelectedPolicy(null)} 
      />
    </div>
  );
}
