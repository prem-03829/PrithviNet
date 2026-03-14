import { useState } from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../utils/cn';

export default function PolicyInsights() {
  const { policyData } = useAppStore();
  const [activeTab, setActiveTab] = useState('All');

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

  const filteredPolicies = (policyData || []).filter(policy => {
    if (!policy) return false;
    if (activeTab === 'All') return true;
    if (activeTab === 'High Impact') return (policy.impact_score || 0) > 70;
    if (activeTab === 'Under Review') return policy.status === 'under_review';
    if (activeTab === 'Risky') return policy.status === 'high_risk';
    return true;
  });

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto custom-scrollbar p-4 md:p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-text-primary">Policy Insights</h2>
        <p className="text-text-secondary mt-1">Regulatory analysis and environmental policy impact tracking.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
        {(tabs || []).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-4 text-sm font-bold transition-all relative",
              activeTab === tab 
                ? "text-primary" 
                : "text-text-muted hover:text-text-primary"
            )}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Policy List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPolicies.map((policy) => (
          <Card key={policy?.id} className="flex flex-col h-full hover:border-primary/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <Badge variant={getStatusColor(policy?.status)}>
                {(policy?.status || '').replace('_', ' ')}
              </Badge>
              <div className="text-right">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Impact Score</p>
                <p className={cn("text-xl font-black", getImpactColor(policy?.impact_score))}>
                  {policy?.impact_score || 0}
                </p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
              {policy?.title || 'Untitled Policy'}
            </h3>
            <p className="text-sm text-text-secondary line-clamp-2 mb-6 flex-1">
              {policy?.description || 'No description available.'}
            </p>

            <div className="pt-4 border-t border-border flex items-center justify-between mt-auto">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Category</span>
                <span className="text-xs font-bold text-text-primary">{policy?.category || 'General'}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Region</span>
                <span className="text-xs font-bold text-text-primary">{policy?.region || 'Universal'}</span>
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
    </div>
  );
}
