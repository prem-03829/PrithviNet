import { useState } from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { initialComplianceModules } from '../data/complianceModules';
import { cn } from '../utils/cn';

export default function GovernmentCompliance({ 
  activeTab, 
  globalComplianceData = [], 
  modules = [], 
  onIndustryClick, 
  onCreateModule 
}) {
  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('active') || s.includes('compliant')) return 'success';
    if (s.includes('high') || s.includes('danger') || s.includes('critical')) return 'danger';
    return 'warning';
  };

  const getTimeAgo = (isoString) => {
    if (!isoString) return 'N/A';
    const past = new Date(isoString);
    if (isNaN(past.getTime())) return isoString;
    const diff = Math.floor((new Date() - past) / (1000 * 60 * 60));
    return diff < 24 ? `${diff}h ago` : `${Math.floor(diff/24)}d ago`;
  };

  // 1️⃣ Defensive rendering for Modules tab
  if (activeTab === 'Modules') {
    return (
      <Card className="p-0 overflow-hidden !rounded-none border border-border shadow-2xl animate-in fade-in duration-500">
        {!Array.isArray(modules) || modules.length === 0 ? (
          <div className="py-20 text-center bg-panel/30 border border-dashed border-border m-4">
            <p className="text-[10px] font-black uppercase text-text-muted">No Compliance Modules Registered</p>
          </div>
        ) : (
          <Table 
            headers={["Module ID", "Name", "Scope", "Severity", "Audit Cycle", "Actions"]}
            data={modules}
            renderRow={(mod) => (
              <tr key={mod?.id || Math.random()} className="hover:bg-panel transition-colors border-b border-border last:border-0 group">
                <td className="px-6 py-4 font-mono text-[10px] font-black text-primary">{mod?.id}</td>
                <td className="px-6 py-4"><span className="font-black text-text-primary uppercase tracking-tight text-xs">{mod?.name}</span></td>
                <td className="px-6 py-4 text-[10px] font-black text-text-secondary uppercase">{mod?.industry} / {mod?.category}</td>
                <td className="px-6 py-4"><Badge variant={getStatusBadge(mod?.severity)} className="!text-[8px] font-black">{mod?.severity}</Badge></td>
                <td className="px-6 py-4 text-[10px] font-black text-text-secondary uppercase">{mod?.frequency}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-1.5 hover:text-primary transition-all"><span className="material-symbols-outlined text-lg">edit_note</span></button>
                  </div>
                </td>
              </tr>
            )}
          />
        )}
      </Card>
    );
  }

  // List View for other tabs
  const filteredData = Array.isArray(globalComplianceData) ? globalComplianceData.filter(ind => {
    if (activeTab === 'All') return true;
    if (activeTab === 'High Risk') return ind?.risk_level === 'high';
    if (activeTab === 'Pending Review') return ind?.lifecycle?.status === 'pending';
    return true;
  }) : [];

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      {filteredData.length === 0 ? (
        <div className="py-20 text-center bg-panel/30 border border-dashed border-border !rounded-none">
          <p className="text-[10px] font-black uppercase text-text-muted">No entity records found</p>
        </div>
      ) : (
        filteredData.map((ind) => (
          <div key={ind?.id || Math.random()} onClick={() => onIndustryClick?.(ind)} className="flex items-center justify-between p-5 bg-surface border border-border hover:border-primary/40 transition-all cursor-pointer !rounded-none border-l-4 border-l-primary group">
            <div className="flex items-center gap-6">
              <div className="p-3 bg-panel group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl">{ind?.icon || 'factory'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-black text-sm uppercase tracking-tight">{ind?.entity?.name}</h4>
                <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">{ind?.sector} • INSP: {getTimeAgo(ind?.compliance?.last_inspection)}</p>
              </div>
            </div>
            <div className="flex items-center gap-12">
              <div className="text-right">
                <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mb-1">Score</p>
                <p className="text-xl font-black text-primary">{ind?.metrics?.compliance_score}%</p>
              </div>
              <span className="material-symbols-outlined text-text-muted group-hover:text-primary transition-colors">arrow_forward</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
