import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import Timeline from '../components/Timeline';
import ComplaintCard from '../components/ComplaintCard';
import Button from '../components/Button';
import EvidenceModal from '../components/EvidenceModal';

export default function MyComplaints() {
  const navigate = useNavigate();
  const { complaints } = useAppStore();
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const latestComplaint = complaints[0] || {};
  
  const timelineEvents = [
    { title: "Inspector Dispatched", description: "Inspector Michael Chen is en route to site for air quality sampling.", time: "Oct 28, 2024 — 10:30 AM", isLatest: true, icon: "local_shipping" },
    { title: "Reviewed & Validated", description: "Case officer verified GPS coordinates and photo metadata.", time: "Oct 27, 2024 — 02:15 PM", icon: "verified" },
    { title: "Received", description: "Complaint successfully logged into the system.", time: "Oct 26, 2024 — 09:00 AM", icon: "mark_email_read" },
  ];

  const handleViewEvidence = (complaint) => {
    setSelectedComplaint(complaint);
    setIsEvidenceModalOpen(true);
  };

  const handlePastReportClick = (id) => {
    navigate(`/citizen/complaint/${id}`);
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 lg:p-12 animate-in fade-in duration-500 max-w-[1600px] mx-auto w-full">
      <header className="mb-6 md:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-text-primary">My Complaints</h2>
          <p className="text-text-secondary dark:text-text-muted mt-1 md:mt-2 text-sm md:text-lg">Track and manage your filed environmental reports in real-time.</p>
        </div>
        <Button 
          variant="primary" 
          className="flex items-center gap-2 whitespace-nowrap w-full sm:w-auto"
          onClick={() => navigate('/citizen/file-complaint')}
        >
          <span className="material-symbols-outlined">add</span>
          New Complaint
        </Button>
      </header>

      {complaints.length === 0 ? (
        <div className="text-center py-20 bg-primary bg-opacity-5 rounded-2xl border border-primary border-opacity-10 border-dashed">
          <span className="material-symbols-outlined text-4xl text-text-muted mb-2">assignment_late</span>
          <p className="text-text-secondary text-sm md:text-base">You haven't filed any complaints yet.</p>
          <Button 
            variant="outline" 
            className="mt-4 mx-auto"
            onClick={() => navigate('/citizen/file-complaint')}
          >
            File your first report
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          <div className="xl:col-span-2 space-y-4 md:space-y-6">
            <div className="bg-surface dark:bg-panel border border-border dark:border-border rounded-xl overflow-hidden shadow-sm">
              <div className="relative h-48 md:h-64 bg-panel dark:bg-surface">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 flex items-center gap-2 md:gap-3">
                  <span className="bg-primary bg-opacity-20 backdrop-blur-md text-primary px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider border border-primary border-opacity-30">
                    {latestComplaint.status}
                  </span>
                  <span className="text-white/80 text-[10px] md:text-sm font-medium">Filed {latestComplaint.date}</span>
                </div>
              </div>
              <div className="p-4 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 md:mb-8 gap-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-text-primary">Complaint #{latestComplaint.id}</h3>
                    <p className="text-xs md:text-sm text-text-secondary dark:text-text-muted mt-1">{latestComplaint.title}</p>
                  </div>
                  <div className="text-left md:text-right w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-border dark:border-border">
                    <p className="text-[10px] font-bold text-text-muted dark:text-primary dark:text-opacity-40 uppercase tracking-widest">Assigned Authority</p>
                    <p className="text-base md:text-lg font-bold text-primary">{latestComplaint.authority || "Unit Delta"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                  <div className="p-3 md:p-4 bg-panel dark:bg-app/50 rounded-lg border border-border dark:border-border">
                    <span className="material-symbols-outlined text-primary mb-1 md:mb-2 text-lg md:text-xl">location_on</span>
                    <p className="text-[10px] text-text-muted font-bold uppercase">Location</p>
                    <p className="text-xs md:text-sm font-medium text-text-primary dark:text-text-secondary truncate">{latestComplaint.location}</p>
                  </div>
                  <div className="p-3 md:p-4 bg-panel dark:bg-app/50 rounded-lg border border-border dark:border-border">
                    <span className="material-symbols-outlined text-primary mb-1 md:mb-2 text-lg md:text-xl">warning</span>
                    <p className="text-[10px] text-text-muted font-bold uppercase">Severity</p>
                    <p className="text-xs md:text-sm font-medium text-text-primary dark:text-text-secondary">{latestComplaint.severity}</p>
                  </div>
                  <div className="p-3 md:p-4 bg-panel dark:bg-app/50 rounded-lg border border-border dark:border-border">
                    <span className="material-symbols-outlined text-primary mb-1 md:mb-2 text-lg md:text-xl">category</span>
                    <p className="text-[10px] text-text-muted font-bold uppercase">Type</p>
                    <p className="text-xs md:text-sm font-medium text-text-primary dark:text-text-secondary">{latestComplaint.type}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <Button 
                    variant="secondary" 
                    className="flex-1 text-xs md:text-sm py-2 md:py-3"
                    onClick={() => handleViewEvidence(latestComplaint)}
                  >
                    View Evidence
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 text-xs md:text-sm py-2 md:py-3"
                    onClick={() => alert("Message feature coming soon!")}
                  >
                    Contact Officer
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="xl:col-span-1">
            <div className="bg-surface dark:bg-panel border border-border dark:border-border rounded-xl p-6 md:p-8 xl:sticky xl:top-24">
              <h3 className="text-lg md:text-xl font-bold mb-6 md:mb-8 flex items-center gap-2 text-text-primary">
                <span className="material-symbols-outlined text-primary">analytics</span>
                Live Timeline
              </h3>
              <Timeline events={timelineEvents} />
              <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-border dark:border-border">
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-panel dark:bg-panel rounded-lg border border-border dark:border-border">
                  <div className="size-9 md:size-10 rounded-full bg-primary bg-opacity-20 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-xl">support_agent</span>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-bold text-text-primary">Need Help?</p>
                    <p className="text-[10px] md:text-xs text-text-secondary dark:text-text-muted">Our support team is online.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="mt-8 md:mt-12">
        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-text-primary">Past Reports</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {complaints.slice(1).map((c, idx) => (
            <div key={idx} onClick={() => handlePastReportClick(c.id)} className="cursor-pointer">
              <ComplaintCard data={c} />
            </div>
          ))}
          <div className="p-4 md:p-6 bg-surface dark:bg-panel border border-border dark:border-border rounded-xl flex flex-col justify-center items-center group cursor-pointer hover:border-primary hover:border-opacity-40 transition-all border-dashed min-h-[160px]">
            <span className="material-symbols-outlined text-text-muted mb-1">history</span>
            <p className="text-text-muted text-[10px] md:text-xs font-bold uppercase tracking-widest">View Archives</p>
          </div>
        </div>
      </section>

      <EvidenceModal 
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        files={selectedComplaint?.files}
      />
    </div>
  );
}
