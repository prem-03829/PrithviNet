import { useState } from "react";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Modal from "../components/Modal";
import FileUploadZone from "../components/FileUploadZone";
import { cn } from "../utils/cn";

// --- Detail Modal Component ---
function SubmissionDetailModal({ submission, isOpen, onClose }) {
  if (!isOpen || !submission) return null;

  const getStatusVariant = (status) => {
    const s = status.toLowerCase();
    if (s.includes('approved') || s.includes('success')) return 'success';
    if (s.includes('pending') || s.includes('review') || s.includes('processing')) return 'warning';
    if (s.includes('rejected') || s.includes('danger')) return 'danger';
    return 'primary';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Submission Detail: ${submission.id}`}>
      <div className="space-y-8 py-2">
        {/* Header Info */}
        <div className="flex justify-between items-start border-b border-border pb-6">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-text-primary">{submission.title}</h3>
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
              Submitted on {new Date(submission.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
            </p>
          </div>
          <Badge variant={getStatusVariant(submission.status)}>{submission.status}</Badge>
        </div>

        {/* Emission Metrics Section */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em]">Emission Data Summary</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-panel rounded-2xl border border-border text-center">
              <p className="text-[10px] font-bold text-text-muted uppercase mb-1">CO2</p>
              <p className="text-lg font-black">{submission.emissions?.co2 || 'N/A'}<span className="text-[10px] ml-0.5 font-medium">ppm</span></p>
            </div>
            <div className="p-4 bg-panel rounded-2xl border border-border text-center">
              <p className="text-[10px] font-bold text-text-muted uppercase mb-1">PM2.5</p>
              <p className="text-lg font-black">{submission.emissions?.pm25 || 'N/A'}<span className="text-[10px] ml-0.5 font-medium">µg/m³</span></p>
            </div>
            <div className="p-4 bg-panel rounded-2xl border border-border text-center">
              <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Water</p>
              <p className="text-lg font-black">{submission.emissions?.water || 'N/A'}<span className="text-[10px] ml-0.5 font-medium">mg/L</span></p>
            </div>
          </div>
        </div>

        {/* Files Section */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-text-muted uppercase tracking-[0.2em]">Uploaded Documentation</h4>
          <div className="space-y-2">
            {(submission.files || ["submission_backup.pdf"]).map((file, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-surface border border-border rounded-xl group hover:border-primary/30 transition-all">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-text-muted group-hover:text-primary transition-colors">description</span>
                  <span className="text-sm font-medium text-text-secondary">{file}</span>
                </div>
                <button className="text-primary text-[10px] font-black uppercase hover:underline">Download</button>
              </div>
            ))}
          </div>
        </div>

        {/* Notes Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-text-muted uppercase tracking-[0.2em]">Industry Notes</h4>
          <div className="p-4 bg-panel rounded-2xl border border-border text-sm text-text-secondary leading-relaxed italic">
            "{submission.notes || 'No additional notes provided with this submission.'}"
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>Close View</Button>
          <Button variant="primary" className="flex-1">Download Archive</Button>
        </div>
      </div>
    </Modal>
  );
}

// --- Main Page Component ---
export default function SubmitReport() {
  const [isSubmitModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [reports, setReports] = useState([
    {
      id: "SUB-102",
      title: "Q1 Emission Report",
      date: "2026-02-14T10:00:00Z",
      type: "Audit",
      status: "Under Review",
      files: ["emission_q1.pdf", "sensor_log.csv"],
      emissions: {
        co2: 410,
        pm25: 62,
        water: 33
      },
      notes: "Filter replacement completed on primary stack A1.",
      metrics: { score: 92, status: "Compliant" }
    },
    {
      id: "REP-2024-002",
      title: "Monthly Effluent Analysis",
      date: "2024-03-12T14:30:00Z",
      type: "Data Submission",
      status: "Approved",
      files: ["water_analysis_march.pdf"],
      emissions: {
        co2: 395,
        pm25: 45,
        water: 28
      },
      notes: "All parameters within safety thresholds.",
      metrics: { score: 88, status: "Safe" }
    }
  ]);

  const [formData, setFormData] = useState({
    title: "",
    type: "Environmental Audit",
    category: "Air",
  });

  const handleViewOriginal = (report) => {
    setSelectedSubmission(report);
    setIsDetailModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsCreateModalOpen(false);

    setTimeout(() => {
      const newReport = {
        id: `IND-${Date.now()}`,
        title: formData.title,
        date: new Date().toISOString(),
        type: formData.type,
        status: "Processing",
        files: ["uploaded_document.pdf"],
        emissions: { co2: "N/A", pm25: "N/A", water: "N/A" },
        notes: "Submission initiated from portal.",
        metrics: {
          score: "Pending",
          status: "Under Review",
        },
      };

      setReports((prev) => [newReport, ...prev]);
      setIsSubmitting(false);
      setFormData({ title: "", type: "Environmental Audit", category: "Air" });
    }, 2000);
  };

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto custom-scrollbar p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-text-primary uppercase tracking-tight italic">Compliance Submissions</h2>
          <p className="text-text-secondary mt-1">Manage and audit your industry's environmental reporting history.</p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)} disabled={isSubmitting}>
          {isSubmitting ? "Uploading..." : "Submit New Report"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(reports || []).map((report) => (
          <Card key={report?.id} className="p-5 flex flex-col justify-between border-l-4 border-l-primary hover:shadow-xl transition-all group">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <Badge variant={report?.status === 'Approved' ? 'success' : 'warning'}>
                  {report?.type}
                </Badge>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{report?.status}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary leading-tight group-hover:text-primary transition-colors">{report?.title}</h3>
                <p className="text-xs text-text-muted mt-1">{report?.date ? new Date(report.date).toLocaleDateString() : 'N/A'} • {report?.id}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 py-3 border-y border-border">
                {report?.metrics && Object.entries(report.metrics).map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[10px] uppercase font-bold text-text-muted">{k}</p>
                    <p className="text-sm font-bold text-text-primary">{v}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button 
                variant="ghost" 
                className="flex-1 text-xs font-bold" 
                onClick={() => handleViewOriginal(report)}
              >
                View Original
              </Button>
              <Button variant="outline" className="flex-1 text-xs font-bold">Certificate</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Detail Modal */}
      <SubmissionDetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        submission={selectedSubmission}
      />

      {/* Create Modal */}
      <Modal isOpen={isSubmitModalOpen} onClose={() => setIsCreateModalOpen(false)} title="New Compliance Submission">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-secondary uppercase ml-1">Report Title</label>
              <input 
                required
                className="w-full bg-panel border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                placeholder="e.g. Annual Hazardous Waste Audit"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary uppercase ml-1">Type</label>
                <select className="w-full bg-panel border border-border rounded-xl px-4 py-3 outline-none text-sm" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                  <option>Environmental Audit</option>
                  <option>Emission Data</option>
                  <option>Waste Management</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary uppercase ml-1">Category</label>
                <select className="w-full bg-panel border border-border rounded-xl px-4 py-3 outline-none text-sm" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option>Air</option>
                  <option>Water</option>
                  <option>Chemicals</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-secondary uppercase ml-1">Documentation</label>
              <FileUploadZone onFilesChange={() => {}} />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Button type="submit" variant="primary" className="w-full py-4 uppercase font-black tracking-widest">Submit for Review</Button>
            <Button type="button" variant="ghost" className="w-full text-xs font-bold" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
