export const complaintService = {
  getComplaints: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: "CN-2024-08", title: "Industrial air quality violation near Sector 4 Riverside.", status: "In Progress", date: "3 days ago", location: "Industrial Zone, South", severity: "High / Critical", type: "Air Pollution", authority: "Unit Delta" },
          { id: "CN-2023-142", title: "Waste Dumping", status: "Resolved", date: "2 months ago", location: "Sector 10", severity: "Medium", type: "Waste" },
          { id: "CN-2023-098", title: "Noise Level Breach", status: "Resolved", date: "5 months ago", location: "Residency Road", severity: "Low", type: "Noise" }
        ]);
      }, 500);
    });
  },
  submitComplaint: async (data) => {
    return new Promise((resolve) => setTimeout(() => resolve({ ...data, status: "Pending" }), 800));
  }
};
