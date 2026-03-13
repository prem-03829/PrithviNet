export const investigationService = {
  getInvestigationDetail: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: id || "INV-001",
          title: "Apex Manufacturing Emission Breach",
          status: "In Progress",
          location: "Industrial Zone, South",
          officer: "Inspector Michael Chen",
          timeline: [
            { title: "Inspector Dispatched", description: "Inspector Michael Chen is en route to site for air quality sampling.", time: "Oct 28, 2024 — 10:30 AM", isLatest: true, icon: "local_shipping" },
            { title: "Reviewed & Validated", description: "Case officer verified GPS coordinates and photo metadata.", time: "Oct 27, 2024 — 02:15 PM", icon: "verified" },
            { title: "Received", description: "Complaint successfully logged into the system.", time: "Oct 26, 2024 — 09:00 AM", icon: "mark_email_read" },
          ]
        });
      }, 500);
    });
  }
};
