export const initialComplianceModules = [
  {
    id: "MOD-2024-001",
    name: "Standard Particulate Emission Limit",
    industry: "Manufacturing",
    category: "Air",
    severity: "High",
    threshold: 150,
    unit: "µg/m³",
    frequency: "Monthly",
    penalty: 4,
    requirements: [
      { title: "OCEMS Daily Log", type: "Sensor Data" },
      { title: "Filter Maintenance Certificate", type: "Certification" }
    ],
    effective_from: "2024-01-01",
    created_by: "Admin-HQ",
    created_at: "2023-12-15",
    status: "Active"
  },
  {
    id: "MOD-2024-002",
    name: "Industrial Effluent Toxicity Check",
    industry: "Chemicals",
    category: "Water",
    severity: "Critical",
    threshold: 6.5,
    unit: "pH",
    frequency: "Quarterly",
    penalty: 5,
    requirements: [
      { title: "Third-party Lab Report", type: "File Upload" },
      { title: "On-site Discharge Audit", type: "Manual Inspection" }
    ],
    effective_from: "2024-03-01",
    created_by: "Env-Bureau",
    created_at: "2024-01-10",
    status: "Active"
  }
];
