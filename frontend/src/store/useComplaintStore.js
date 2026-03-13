import { create } from 'zustand';

export const useComplaintStore = create((set, get) => ({
  complaints: [
    { id: "CN-2024-08", title: "Industrial air quality violation near Sector 4 Riverside.", status: "In Progress", date: "3 days ago", location: "Industrial Zone, South", severity: "High / Critical", type: "Air Pollution", authority: "Unit Delta", description: "Visible smog from the rubber factory stacks." },
    { id: "CN-2023-142", title: "Waste Dumping at Sector 10", status: "Resolved", date: "2 months ago", location: "Sector 10", severity: "Medium", type: "Waste", description: "Illegal dumping of plastics near water body." },
    { id: "CN-2023-098", title: "Noise Level Breach", status: "Resolved", date: "5 months ago", location: "Residency Road", severity: "Low", type: "Noise", description: "Loudspeakers active after 11 PM." }
  ],
  
  addComplaint: (complaint) => set((state) => ({
    complaints: [
      { ...complaint, id: `CN-${Date.now()}`, date: 'Just now', status: 'Pending' },
      ...state.complaints
    ]
  })),

  simulateStatusUpdates: () => {
    const { complaints } = get();
    const pendingIndex = complaints.findIndex(c => c.status === 'Pending' || c.status === 'In Progress');
    if (pendingIndex === -1) return;

    const updated = [...complaints];
    const current = updated[pendingIndex];
    
    if (current.status === 'Pending') current.status = 'In Progress';
    else if (current.status === 'In Progress') current.status = 'Resolved';

    set({ complaints: updated });
  }
}));
