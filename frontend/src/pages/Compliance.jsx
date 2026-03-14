import { useState, useMemo, useEffect } from 'react';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { useAppStore } from '../store/useAppStore';
import { useUserStore } from '../store/useUserStore';
import { complianceService } from '../services/complianceService';
import { initialComplianceModules } from '../data/complianceModules';
import GovernmentCompliance from './GovernmentCompliance';
import IndustryCompliance from './IndustryCompliance';
import { cn } from '../utils/cn';

// --- MODULE FORM MODAL COMPONENT (Defensive) ---
function ModuleFormModal({ isOpen = false, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '', industry: 'Manufacturing', category: 'Air', severity: 'Medium',
    threshold: '', unit: 'AQI', frequency: 'Monthly', penalty: 3,
    effective_from: new Date().toISOString().split('T')[0],
    requirements: []
  });

  if (!isOpen) return null;

  const addRequirement = () => setFormData(p => ({
    ...p, requirements: [...(p.requirements || []), { id: Math.random().toString(36).substr(2, 9), title: '', type: 'File Upload' }]
  }));

  const removeRequirement = (index) => setFormData(p => ({
    ...p, requirements: (p.requirements || []).filter((_, i) => i !== index)
  }));

  const updateRequirement = (index, field, value) => setFormData(p => ({
    ...p, requirements: (p.requirements || []).map((req, i) => i === index ? { ...req, [field]: value } : req)
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.({
      ...formData,
      id: `MOD-${Date.now()}`,
      created_at: new Date().toISOString().split('T')[0],
      status: 'Active'
    });
    onClose?.();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Define Compliance Module">
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <input required className="w-full bg-panel border border-border p-2.5 text-sm" placeholder="Module Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        <div className="grid grid-cols-2 gap-4">
          <select className="bg-panel border border-border p-2.5 text-sm" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})}>
            <option>Manufacturing</option><option>Chemicals</option><option>Energy</option>
          </select>
          <select className="bg-panel border border-border p-2.5 text-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
            <option>Air</option><option>Water</option><option>Waste</option>
          </select>
        </div>
        <div className="space-y-2 border-t border-border pt-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-primary">Requirements</span>
            <button type="button" onClick={addRequirement} className="text-[10px] font-black text-primary uppercase">+ Add</button>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {Array.isArray(formData.requirements) && formData.requirements.map((req, i) => (
              <div key={req.id} className="flex gap-2">
                <input className="flex-1 bg-panel border border-border p-1.5 text-xs" placeholder="Requirement..." value={req.title} onChange={e => updateRequirement(i, 'title', e.target.value)} />
                <button type="button" onClick={() => removeRequirement(i)} className="text-rose-500 material-symbols-outlined text-sm">close</button>
              </div>
            ))}
          </div>
        </div>
        <Button type="submit" variant="primary" className="w-full !rounded-none uppercase font-black text-[10px]">Deploy Module</Button>
      </form>
    </Modal>
  );
}

export default function Compliance() {
  const { complianceData = [] } = useAppStore();
  const { user } = useUserStore();
  const isIndustry = user?.role === 'Industry';
  
  // 2️⃣ Fix undefined tab state
  const [activeTab, setActiveTab] = useState(isIndustry ? 'Overview' : 'All');
  const [modules, setModules] = useState(initialComplianceModules || []);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [violationHistory, setViolationHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const tabs = isIndustry 
    ? ['Overview', 'Violations', 'Inspections'] 
    : ['All', 'Modules', 'High Risk', 'Pending Review'];

  const handleIndustryClick = async (industry) => {
    if (!industry) return;
    setSelectedIndustry(industry);
    setLoading(true);
    try {
      const history = await complianceService.getViolationHistory(industry.sector);
      setViolationHistory(Array.isArray(history) ? history : []);
    } catch (e) {
      setViolationHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveModule = (newModule) => {
    if (!newModule) return;
    setModules(prev => [newModule, ...(prev || [])]);
  };

  // 6️⃣ Error-safe main return
  try {
    return (
      <div className="flex flex-col w-full h-full overflow-y-auto custom-scrollbar p-4 md:p-8 max-w-6xl mx-auto space-y-8 text-text-primary">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight italic">
              {isIndustry ? "Entity Compliance" : "National Control"}
            </h3>
            <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest mt-1">
              Node: {isIndustry ? user?.industryId?.toUpperCase() : "Primary Gateway"}
            </p>
          </div>
          {!isIndustry && (
            <Button variant="primary" className="!rounded-none uppercase font-black tracking-widest text-[10px] py-3 px-6" onClick={() => setIsModuleModalOpen(true)}>
              + Create Compliance Module
            </Button>
          )}
        </div>

        <div className="flex gap-8 border-b border-border overflow-x-auto no-scrollbar whitespace-nowrap">
          {Array.isArray(tabs) && tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={cn("pb-3 border-b-2 text-xs font-black uppercase tracking-widest transition-all", activeTab === tab ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text-primary")}>
              {tab}
            </button>
          ))}
        </div>

        {/* 4️⃣ Role-based Split Rendering */}
        {isIndustry ? (
          <IndustryCompliance activeTab={activeTab} />
        ) : (
          <GovernmentCompliance 
            activeTab={activeTab} 
            globalComplianceData={complianceData} 
            modules={modules}
            onIndustryClick={handleIndustryClick}
          />
        )}

        <ModuleFormModal isOpen={isModuleModalOpen} onClose={() => setIsModuleModalOpen(false)} onSave={handleSaveModule} />

        <Modal isOpen={!!selectedIndustry} onClose={() => setSelectedIndustry(null)} title={`${selectedIndustry?.entity?.name || 'Entity'} Status`}>
          <div className="space-y-4">
            <p className="text-xs text-text-secondary">{selectedIndustry?.sector} • {selectedIndustry?.entity?.registration_no}</p>
            <div className="space-y-2 border-t border-border pt-4">
              <h4 className="text-[10px] font-black uppercase text-primary">Violation History</h4>
              {loading ? <p className="text-xs animate-pulse">Scanning records...</p> : (
                <div className="space-y-2">
                  {Array.isArray(violationHistory) && violationHistory.map((v, i) => (
                    <div key={i} className="p-2 bg-panel border border-border flex justify-between text-[10px] font-bold uppercase">
                      <span>{v.type}</span>
                      <span className="text-primary">{v.status}</span>
                    </div>
                  ))}
                  {violationHistory.length === 0 && <p className="text-[10px] text-text-muted">No records found.</p>}
                </div>
              )}
            </div>
          </div>
        </Modal>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
        <span className="material-symbols-outlined text-4xl text-rose-500">error</span>
        <p className="text-sm font-black uppercase tracking-widest text-text-primary">Compliance Engine Error</p>
        <p className="text-xs text-text-secondary max-w-xs">An error occurred while processing regulatory data. The system has stabilized the view.</p>
        <Button variant="outline" onClick={() => window.location.reload()}>Re-initialize</Button>
      </div>
    );
  }
}
