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
  complianceData: [
    {
      id: "CMP-Manufacturing-001",
      sector: "Manufacturing",
      icon: "factory",
      entity: {
        name: "Eco-Friendly Plastics Corp",
        registration_no: "REG-MAN-2024-88",
        permit_type: "Standard Operating Permit"
      },
      location: {
        address: "Plot 12, Industrial Area Phase 1",
        city: "Mumbai",
        coordinates: { lat: 19.0760, lng: 72.8777 }
      },
      authority: {
        body: "Central Pollution Control Board",
        officer_in_charge: "Arjun Sharma",
        last_notified: "2024-03-12T08:00:00Z"
      },
      metrics: {
        compliance_score: 85,
        parameter: "Air Emissions",
        unit: "AQI Index",
        target: 100,
        actual: 45
      },
      risk_level: "medium",
      compliance: {
        status: "Compliant",
        severity: "Low",
        last_inspection: "2024-03-14T10:00:00Z"
      },
      lifecycle: {
        stage: "Monitoring",
        status: "active",
        created_at: "2024-01-15T09:00:00Z",
        updated_at: "2024-03-14T12:00:00Z"
      }
    },
    {
      id: "CMP-Healthcare-002",
      sector: "Healthcare",
      icon: "health_and_safety",
      entity: {
        name: "City General Hospital",
        registration_no: "REG-HEA-2023-45",
        permit_type: "Medical Waste Disposal"
      },
      location: {
        address: "Sector 4, Central District",
        city: "Delhi",
        coordinates: { lat: 28.6139, lng: 77.2090 }
      },
      authority: {
        body: "Municipal Health Department",
        officer_in_charge: "Dr. Sunita Rao",
        last_notified: "2024-03-13T14:30:00Z"
      },
      metrics: {
        compliance_score: 42,
        parameter: "Waste Management",
        unit: "Incineration Efficiency",
        target: 95,
        actual: 62
      },
      risk_level: "high",
      compliance: {
        status: "Warning",
        severity: "Medium",
        last_inspection: "2024-03-13T18:00:00Z"
      },
      lifecycle: {
        stage: "Review",
        status: "pending",
        created_at: "2023-11-20T11:00:00Z",
        updated_at: "2024-03-13T18:30:00Z"
      }
    },
    {
      id: "CMP-Financial-003",
      sector: "Financial Services",
      icon: "account_balance",
      entity: {
        name: "Global Bank HQ",
        registration_no: "REG-FIN-2022-12",
        permit_type: "Energy Efficiency Cert"
      },
      location: {
        address: "BKC Financial Hub",
        city: "Mumbai",
        coordinates: { lat: 19.0607, lng: 72.8636 }
      },
      authority: {
        body: "Sustainable Finance Bureau",
        officer_in_charge: "Vikram Mehta",
        last_notified: "2024-03-10T09:00:00Z"
      },
      metrics: {
        compliance_score: 96,
        parameter: "Carbon Footprint",
        unit: "CO2e Tonnes/Year",
        target: 500,
        actual: 420
      },
      risk_level: "low",
      compliance: {
        status: "Compliant",
        severity: "None",
        last_inspection: "2024-03-13T11:00:00Z"
      },
      lifecycle: {
        stage: "Certification",
        status: "archived",
        created_at: "2022-05-10T10:00:00Z",
        updated_at: "2024-03-13T11:30:00Z"
      }
    },
    {
      id: "CMP-Energy-004",
      sector: "Energy & Utilities",
      icon: "bolt",
      entity: {
        name: "North Grid Power Station",
        registration_no: "REG-ENE-2024-01",
        permit_type: "Effluent Discharge"
      },
      location: {
        address: "East River Bank",
        city: "Patna",
        coordinates: { lat: 25.5941, lng: 85.1376 }
      },
      authority: {
        body: "National Energy Council",
        officer_in_charge: "Kunal Jha",
        last_notified: "2024-03-11T16:45:00Z"
      },
      metrics: {
        compliance_score: 12,
        parameter: "Water Temperature",
        unit: "Delta Celsius",
        target: 2,
        actual: 8
      },
      risk_level: "high",
      compliance: {
        status: "Critical",
        severity: "High",
        last_inspection: "2024-03-11T12:00:00Z"
      },
      lifecycle: {
        stage: "Enforcement",
        status: "violating",
        created_at: "2024-02-01T08:00:00Z",
        updated_at: "2024-03-11T17:00:00Z"
      }
    },
    {
      id: "CMP-Logistics-005",
      sector: "Logistics",
      icon: "local_shipping",
      entity: {
        name: "Prime Logistics Hub",
        registration_no: "REG-LOG-2023-99",
        permit_type: "Vehicle Emission Standards"
      },
      location: {
        address: "Port Road Terminal",
        city: "Chennai",
        coordinates: { lat: 13.0827, lng: 80.2707 }
      },
      authority: {
        body: "Regional Transport Authority",
        officer_in_charge: "Meena Swaminathan",
        last_notified: "2024-03-14T07:30:00Z"
      },
      metrics: {
        compliance_score: 78,
        parameter: "Fleet Emissions",
        unit: "BS-VI Compliance %",
        target: 100,
        actual: 78
      },
      risk_level: "medium",
      compliance: {
        status: "Compliant",
        severity: "Low",
        last_inspection: "2024-03-14T09:00:00Z"
      },
      lifecycle: {
        stage: "Monitoring",
        status: "pending",
        created_at: "2023-08-15T12:00:00Z",
        updated_at: "2024-03-14T09:30:00Z"
      }
    }
  ],
  
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
