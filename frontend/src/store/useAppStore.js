import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  // Theme State
  theme: localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    set({ theme: newTheme });
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  },
  initTheme: () => {
    const currentTheme = get().theme;
    document.documentElement.classList.toggle('dark', currentTheme === 'dark');
  },

  // UI State
  sidebarOpen: true,
  mobileMenuOpen: false,
  showLocationPermission: true,
  locationLoading: false,
  locationError: null,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setShowLocationPermission: (show) => set({ showLocationPermission: show }),

  // User State
  user: {
    name: 'Sahil Kapoor',
    email: 'sahil.kapoor@gov.in',
    role: 'Admin Official',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp3fcDeYLg208bCk0ztIFblaK2xJzNeUZTKZaoF4Rhzs9-3IcYa8eeuAMq7cW26OCsYm5AZ2GmyrJPsb5Pu8T1m43GQA1XirbTDgvQnxGZUnc22i2cXFsQACOdcN0-vmGqAifS_N6JBjyf6SkeMsjrdoDSecHnIWbZTegcrTg9yxIbBcpHyNxZCAwlJpZOndgqi0McYgUc4x428LxOJjjbeRqAiXIk6_C3_70J8k1pRJ6e6hD0kMVTxWkVI3az7KqoQndy2tUkv1c'
  },
  userLocation: null,
  setUser: (user) => set({ user }),
  setUserLocation: (loc) => set({ userLocation: loc, showLocationPermission: false }),
  setLocationLoading: (loading) => set({ locationLoading: loading }),
  setLocationError: (error) => set({ locationError: error, showLocationPermission: false }),
  logout: () => set({ user: null }),

  // Data State
  sensors: [],
  alerts: [],
  complaints: [],
  investigations: [],
  complianceData: [],
  
  // Filters
  mapFilter: 'air',
  setMapFilter: (filter) => set({ mapFilter: filter }),

  // Actions
  setSensors: (sensors) => set({ sensors }),
  setAlerts: (alerts) => set({ alerts }),
  setComplaints: (complaints) => set({ complaints }),
  setInvestigations: (investigations) => set({ investigations }),
  setComplianceData: (complianceData) => set({ complianceData }),

  addComplaint: (complaint) => set((state) => ({ 
    complaints: [{ ...complaint, id: `CN-${Date.now()}`, date: 'Just now' }, ...state.complaints] 
  })),

  updateAlertStatus: (alertId, status) => set((state) => ({
    alerts: state.alerts.map(a => a.id === alertId ? { ...a, type: status } : a)
  })),

  updateInvestigationStatus: (id, status) => set((state) => ({
    investigations: state.investigations.map(inv => inv.id === id ? { ...inv, status } : inv)
  })),

  // Real-time updates simulation
  simulateRealtime: () => {
    const { sensors } = get();
    if (sensors.length === 0) return;

    const updatedSensors = sensors.map(s => {
      const change = Math.floor(Math.random() * 5) - 2;
      const newAqi = Math.max(0, s.aqi + change);
      return {
        ...s,
        aqi: newAqi,
        status: newAqi > 300 ? 'critical' : newAqi > 150 ? 'unhealthy' : newAqi > 50 ? 'moderate' : 'good',
        trend: change
      };
    });
    set({ sensors: updatedSensors });
  }
}));
