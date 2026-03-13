export const complianceService = {
  getComplianceData: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { name: 'Manufacturing', icon: 'factory', status: 'bg-primary', lastInsp: '2 hours ago', risk: 85, riskColor: 'bg-primary', textRisk: 'text-primary' },
          { name: 'Healthcare', icon: 'health_and_safety', status: 'bg-amber-500', lastInsp: '14 hours ago', risk: 42, riskColor: 'bg-amber-500', textRisk: 'text-amber-500' },
          { name: 'Financial Services', icon: 'account_balance', status: 'bg-primary', lastInsp: '1 day ago', risk: 96, riskColor: 'bg-primary', textRisk: 'text-primary' },
          { name: 'Energy & Utilities', icon: 'bolt', status: 'bg-rose-500', lastInsp: '3 days ago', risk: 12, riskColor: 'bg-rose-500', textRisk: 'text-rose-500' },
          { name: 'Logistics', icon: 'local_shipping', status: 'bg-primary', lastInsp: '5 hours ago', risk: 78, riskColor: 'bg-primary', textRisk: 'text-primary' },
        ]);
      }, 500);
    });
  },
  getViolationHistory: async (industryName) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { date: '2024-02-15', type: 'AQI Breach', status: 'Resolved' },
          { date: '2023-11-10', type: 'Waste Dumping', status: 'Resolved' },
          { date: '2023-08-05', type: 'Noise Violation', status: 'Pending' },
        ]);
      }, 300);
    });
  }
};
