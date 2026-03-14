import { useState, useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { cn } from "../utils/cn";

export default function Reports() {
  const { reportsData } = useAppStore();

  const tabs = ["All", "Air", "Water", "Noise"];

  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [previewingReport, setPreviewingReport] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Air",
    region: "National",
    severity: "Medium",
  });

  useEffect(() => {
    if (Array.isArray(reportsData)) {
      setReports(reportsData);
    }
  }, [reportsData]);

  const getSeverityColor = (sev) => {
    switch (sev?.toLowerCase()) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "primary";
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend?.toLowerCase()) {
      case "improving":
        return "trending_up";
      case "degrading":
        return "trending_down";
      default:
        return "trending_flat";
    }
  };

  const getTrendColor = (trend) => {
    switch (trend?.toLowerCase()) {
      case "improving":
        return "text-success";
      case "degrading":
        return "text-danger";
      default:
        return "text-text-muted";
    }
  };

  const handleDownload = (id) => {
    setDownloadingId(id);
    setTimeout(() => setDownloadingId(null), 1500);
  };

  const handleCreateReport = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setIsCreateModalOpen(false);

    setTimeout(() => {
      const newReport = {
        id: `REP-${Date.now()}`,
        title: formData.title,
        date: new Date().toISOString(),
        type: "Environmental Audit",
        category: formData.category,
        region: formData.region,
        metrics: {
          score: Math.floor(Math.random() * 40) + 60,
          variance: Math.random().toFixed(2),
          confidence: "High",
        },
        severity: formData.severity,
        trend: "Stable",
        file_size: "Pending",
        status: "Processing",
      };

      setReports((prev) => [newReport, ...(prev || [])]);
      setIsGenerating(false);

      setFormData({
        title: "",
        category: "Air",
        region: "National",
        severity: "Medium",
      });
    }, 1500);
  };

  const filteredReports = (reports || []).filter((r) =>
    activeTab === "All" ? true : r.category === activeTab,
  );

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto custom-scrollbar p-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-text-primary">
            Data Reports
          </h2>
          <p className="text-text-secondary">
            Environmental analytics & compliance intelligence
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate New Report"}
        </Button>
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b border-border mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-3 text-sm font-bold transition",
              activeTab === tab
                ? "text-primary border-b-2 border-primary"
                : "text-text-secondary",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <Card key={report.id} className="p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Badge variant={getSeverityColor(report.severity)}>
                  {report.type}
                </Badge>
                <span className="text-xs font-bold">{report.status}</span>
              </div>

              <h3 className="text-lg font-bold">{report.title}</h3>

              <p className="text-xs text-text-muted">
                {new Date(report.date).toLocaleDateString()}
              </p>

              <div className="grid grid-cols-2 gap-3 border-y border-border py-3">
                {Object.entries(report.metrics || {}).map(([k, v]) => (
                  <div key={k}>
                    <p className="text-xs text-text-muted">{k}</p>
                    <p className="font-bold">{v}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "material-symbols-outlined",
                      getTrendColor(report.trend),
                    )}
                  >
                    {getTrendIcon(report.trend)}
                  </span>
                  <span className={getTrendColor(report.trend)}>
                    {report.trend}
                  </span>
                </div>

                <span className="text-xs">{report.file_size}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="ghost"
                onClick={() => setPreviewingReport(report)}
              >
                Preview
              </Button>
              <Button
                variant="primary"
                onClick={() => handleDownload(report.id)}
                disabled={downloadingId === report.id}
              >
                {downloadingId === report.id ? "Downloading..." : "Download"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* CREATE MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Generate New Environmental Report"
      >
        <form onSubmit={handleCreateReport} className="flex flex-col gap-6">
          {/* Section 1: Identity */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em] ml-1">
              General Information
            </label>
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-text-secondary ml-1">Report Title</span>
              <input 
                required
                type="text"
                placeholder="e.g. Annual Emission Review 2024"
                className="w-full px-4 py-3 rounded-xl border border-border bg-panel focus:bg-surface focus:ring-2 focus:ring-primary focus:ring-opacity-20 outline-none transition-all text-sm font-medium"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
          </div>

          {/* Section 2: Classification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-text-secondary ml-1 uppercase">Primary Category</span>
              <div className="relative">
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-border bg-panel appearance-none outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 text-sm font-medium cursor-pointer"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Air">Air Quality</option>
                  <option value="Water">Water Analysis</option>
                  <option value="Noise">Urban Noise</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none text-lg">unfold_more</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-text-secondary ml-1 uppercase">Risk Severity</span>
              <div className="relative">
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-border bg-panel appearance-none outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 text-sm font-medium cursor-pointer"
                  value={formData.severity}
                  onChange={(e) => setFormData({...formData, severity: e.target.value})}
                >
                  <option value="Low">Low Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="High">High Risk</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none text-lg">unfold_more</span>
              </div>
            </div>
          </div>

          {/* Section 3: Localization */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-text-secondary ml-1 uppercase">Target Region / Jurisdiction</span>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg">location_on</span>
              <input 
                required
                type="text"
                placeholder="e.g. North Delhi Corridor"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-panel focus:bg-surface focus:ring-2 focus:ring-primary focus:ring-opacity-20 outline-none transition-all text-sm font-medium"
                value={formData.region}
                onChange={(e) => setFormData({...formData, region: e.target.value})}
              />
            </div>
          </div>

          {/* Footer Notice */}
          <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl flex gap-3 items-start text-text-secondary">
            <span className="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5">info</span>
            <p className="text-[11px] leading-relaxed font-medium">
              Report generation utilizes high-resolution satellite imagery and historical sensor data. 
              A PDF will be finalized and added to the secure repository.
            </p>
          </div>

          {/* Action Area */}
          <div className="flex flex-col gap-3 pt-2">
            <Button type="submit" variant="primary" className="w-full py-4 text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20">
              Start Generation
            </Button>
            <Button type="button" variant="ghost" className="w-full text-xs font-bold text-text-muted hover:text-text-primary" onClick={() => setIsCreateModalOpen(false)}>
              Discard and Close
            </Button>
          </div>
        </form>
      </Modal>

      {/* PREVIEW MODAL */}
      <Modal
        isOpen={!!previewingReport}
        onClose={() => setPreviewingReport(null)}
        title="Report Preview"
      >
        {previewingReport && (
          <div className="space-y-4">
            <h3 className="font-bold">{previewingReport.title}</h3>
            <p>ID: {previewingReport.id}</p>
            <Button onClick={() => handleDownload(previewingReport.id)}>
              Download PDF
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
