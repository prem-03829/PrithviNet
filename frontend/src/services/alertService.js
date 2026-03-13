export const alertService = {
  getAlerts: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, title: "NORTH INDUSTRIAL HUB", type: "CRITICAL", desc: "Particulate matter exceeds safety levels by 45%. Strong correlation with evening shift start times." },
          { id: 2, title: "DOWNTOWN CORRIDOR", type: "WARNING", desc: "Nitrogen dioxide spikes detected during peak traffic hours (08:00 - 10:00). High complaint volume from residents." },
          { id: 3, title: "EASTERN RIVER-FRONT", type: "STABLE", desc: "Air quality metrics have stabilized. New filtration policy implementation showing positive results." }
        ]);
      }, 500);
    });
  },
  resolveAlert: async (id) => {
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 300));
  }
};
