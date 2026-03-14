export const systemHealthData = [
  {
    id: "api",
    name: "Backend API Status",
    status: "Online",
    uptime: "99.98%",
    lastUpdate: "Just now",
    load: "12%",
  },
  {
    id: "sensors",
    name: "Sensor Network Status",
    status: "Warning",
    uptime: "94.50%",
    lastUpdate: "2 mins ago",
    load: "88%",
  },
  {
    id: "ai",
    name: "AI Prediction Engine",
    status: "Online",
    uptime: "99.90%",
    lastUpdate: "5 mins ago",
    load: "45%",
  },
  {
    id: "db",
    name: "Primary Database",
    status: "Online",
    uptime: "100%",
    lastUpdate: "Just now",
    load: "8%",
  },
  {
    id: "satellite",
    name: "Satellite Data Feed",
    status: "Online",
    uptime: "98.20%",
    lastUpdate: "12 mins ago",
    load: "22%",
  },
];

export const liveMetrics = {
  requestsPerSecond: 1240,
  activeNodes: 8432,
  alertsProcessed: 156,
  predictionJobs: 12,
  avgResponseTime: "45ms",
};

export const infraCoverage = [
  { region: "North India", status: "Healthy", coverage: "92%" },
  { region: "South India", status: "Healthy", coverage: "95%" },
  { region: "East India", status: "Degraded", coverage: "64%" },
  { region: "West India", status: "Partial", coverage: "78%" },
  { region: "Central India", status: "Healthy", coverage: "88%" },
];

export const aiEngineStatus = {
  modelVersion: "Phi-3-v2.4",
  lastTraining: "2024-03-10",
  accuracy: "94.2%",
  nextRetrain: "2024-03-20",
};

export const initialLogs = [
  "System: Boot sequence complete.",
  "Network: All gateway nodes reporting active.",
  "AI: Prediction model Phi-3 loaded into memory.",
  "DB: Connection to Supabase cluster established.",
  "Sensor: Node 183 (Mumbai-South) disconnected.",
  "AI: Training job #442 finished successfully.",
  "Monitor: High traffic detected from Govt Node Delhi.",
  "Security: Firewall rules updated for external API.",
];
