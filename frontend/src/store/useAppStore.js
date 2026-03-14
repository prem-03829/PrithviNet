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

  // Preferences State
  preferences: [
    { id: 'push', label: 'Push Notifications', active: true },
    { id: 'email', label: 'Email Reports', active: true },
    { id: 'anon', label: 'Anonymous Reporting', active: false },
  ],
  togglePreference: (id) => set((state) => ({
    preferences: state.preferences.map(p => 
      p.id === id ? { ...p, active: !p.active } : p
    )
  })),

  // Data State
  sensors: [],
  alerts: [
    {
      id: 'AL-001',
      source: 'Sensor',
      icon: 'sensors',
      severity: 'Critical',
      timestamp: '2 mins ago',
      title: 'Unusual PM10 spike detected',
      location: 'Sector 12 Industrial Hub | Coordinates: 28.5355, 77.3910',
      category: 'PM10',
      value: '420 µg/m³'
    },
    {
      id: 'AL-002',
      source: 'Citizen',
      icon: 'person_alert',
      severity: 'Warning',
      timestamp: '15 mins ago',
      title: 'Waste burning reported in residential zone',
      location: 'Green Park Colony | Verified by 3 proximity users',
      category: 'Solid Waste',
      value: 'Medium'
    },
    {
      id: 'AL-003',
      source: 'AI Predict',
      icon: 'psychology',
      severity: 'Critical',
      timestamp: '45 mins ago',
      title: 'Predicted Air Quality Degradation',
      location: 'East-South Metropolitan Area | Prob: 94.2%',
      category: 'AQI Trend',
      value: '6 Hours'
    },
    {
      id: 'AL-004',
      source: 'Sensor',
      icon: 'water_drop',
      severity: 'Warning',
      timestamp: '1 hour ago',
      title: 'River pH Level Deviation',
      location: 'Yamuna Intake Point A-4 | Current pH: 8.9',
      category: 'Water',
      value: '+1.2 pH'
    },
    {
      id: 'AL-005',
      source: 'AI Satellite',
      icon: 'satellite_alt',
      severity: 'Critical',
      timestamp: '3 hours ago',
      title: 'Large-scale Agricultural Fire Detected',
      location: 'Peripheral Zone B | Satellite ID: PR-991',
      category: 'Haze/Smoke',
      hasMap: true,
      mapCoords: 'LAT: 28.7041 / LONG: 77.1025'
    }
  ],
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
