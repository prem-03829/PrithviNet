import { useNavigate } from "react-router-dom";
import KpiCard from "../components/KpiCard";
import Chart from "../components/Chart";
import AlertCard from "../components/AlertCard";
import Table from "../components/Table";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import { usePollutionStore } from "../store/usePollutionStore";
import { useComplaintStore } from "../store/useComplaintStore";
import { useAppStore } from "../store/useAppStore";
import { useUserStore } from "../store/useUserStore";
import { useBasePath } from "../hooks/useBasePath";

export default function Dashboard() {
  const navigate = useNavigate();
  const basePath = useBasePath();
  const { sensors } = usePollutionStore();
  const { complaints } = useComplaintStore();
  const { alerts } = useAppStore();
  const { user } = useUserStore();
  
  const isIndustry = user?.role === 'Industry';
  const isGovernment = user?.role === 'Government' || user?.role === 'Admin';

  const avgAqi =
    (sensors || []).length > 0
      ? Math.round(sensors.reduce((acc, s) => acc + (s?.aqi || 0), 0) / sensors.length)
      : 0;

  const activeAlertsCount = (alerts || []).filter((a) => a?.severity?.toLowerCase() === "critical").length;

  // Analytical Data for Government
  const cityRankingData = [
    { rank: 1, city: "Indore", aqi: 42, status: "Good", trend: "Stable" },
    { rank: 2, city: "Surat", aqi: 58, status: "Satisfactory", trend: "Improving" },
    { rank: 3, city: "Navi Mumbai", aqi: 64, status: "Satisfactory", trend: "Stable" },
    { rank: 4, city: "Pune", aqi: 112, status: "Moderate", trend: "Worsening" },
    { rank: 5, city: "Delhi", aqi: 385, status: "Severe", trend: "Worsening" },
  ];

  const industryData = [
    { id: "REP-991", type: "Emission Data", date: "2024-03-14", status: "Approved" },
    { id: "REP-992", type: "Safety Audit", date: "2024-03-10", status: "Pending" },
    { id: "REP-993", type: "Water Usage", date: "2024-02-28", status: "Rejected" },
  ];

  const tableHeaders = isIndustry 
    ? ["Report ID", "Submission Type", "Date", "Status", "Action"]
    : isGovernment 
      ? ["Rank", "City", "AQI", "Status", "Trend"]
      : ["Facility Name", "Risk Level", "Primary Pollutant", "Status", "Action"];

  const tableData = isIndustry ? industryData : isGovernment ? cityRankingData : [];

  const renderRow = (row, idx) => {
    if (isIndustry) {
      return (
        <tr key={idx} className="hover:bg-panel transition-colors group">
          <td className="px-6 py-4 font-bold text-primary">{row.id}</td>
          <td className="px-6 py-4 text-text-primary font-medium">{row.type}</td>
          <td className="px-6 py-4 text-text-secondary">{row.date}</td>
          <td className="px-6 py-4">
            <Badge variant={row.status === 'Approved' ? 'success' : row.status === 'Pending' ? 'warning' : 'danger'}>
              {row.status}
            </Badge>
          </td>
          <td className="px-6 py-4">
            <button className="p-1 text-text-secondary hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-xl">visibility</span>
            </button>
          </td>
        </tr>
      );
    }
    if (isGovernment) {
      return (
        <tr key={idx} className="hover:bg-panel transition-colors group border-b border-border last:border-0">
          <td className="px-6 py-4 font-black text-text-muted">#{row.rank}</td>
          <td className="px-6 py-4 font-bold text-text-primary">{row.city}</td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black">{row.aqi}</span>
              <div className={`size-2 rounded-full ${row.aqi < 50 ? 'bg-green-500' : row.aqi < 100 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
            </div>
          </td>
          <td className="px-6 py-4">
            <Badge variant={row.status === 'Good' ? 'success' : row.status === 'Satisfactory' ? 'primary' : row.status === 'Moderate' ? 'warning' : 'danger'}>
              {row.status}
            </Badge>
          </td>
          <td className="px-6 py-4 text-xs font-bold uppercase">
            <span className={row.trend === 'Improving' ? 'text-green-500' : row.trend === 'Worsening' ? 'text-red-500' : 'text-text-muted'}>
              {row.trend}
            </span>
          </td>
        </tr>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {user?.avatar && (
            <div className="size-12 md:size-14 rounded-xl border-2 border-primary border-opacity-20 overflow-hidden shadow-md shrink-0">
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-text-primary leading-tight">
              {isIndustry ? `Entity: ${user?.industryId?.toUpperCase()}` : isGovernment ? "Command Center: National Overview" : `Welcome back, ${user?.name?.split(' ')[0]}`}
            </h2>
            {user && (
              <div className="flex items-center gap-2 mt-0.5 text-text-secondary text-xs md:text-sm">
                <span className="material-symbols-outlined text-sm text-primary">
                  security
                </span>
                <span>
                  {isGovernment ? "Federated Surveillance Node" : user.city} {isIndustry && "• Plant Operations"}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-2 px-3 py-1.5 rounded-lg bg-panel border border-border cursor-pointer hover:bg-panel transition-colors w-full sm:w-auto text-text-secondary">
          <span className="text-xs md:text-sm font-black uppercase tracking-widest">{isGovernment ? "National View" : isIndustry ? "All Subsidaries" : "All Regions"}</span>
          <span className="material-symbols-outlined text-sm">expand_more</span>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <KpiCard
          title={isGovernment ? "National AQI Avg" : isIndustry ? "Internal Compliance Score" : "Regional AQI"}
          icon={isGovernment ? "public" : isIndustry ? "verified" : "air"}
          value={isGovernment ? "142" : isIndustry ? "94/100" : avgAqi}
          subtitle={isGovernment ? "Trend: Moderate" : isIndustry ? "Highly Compliant" : "Satisfactory"}
          trend={isGovernment ? "-2.4%" : "+2%"}
          trendIcon="trending_down"
          trendColor="text-green-500"
        />
        <KpiCard
          title={isGovernment ? "Compliance Rate" : isIndustry ? "Pending Submissions" : "Active Alerts"}
          icon="verified_user"
          value={isGovernment ? "78.5%" : isIndustry ? "02" : activeAlertsCount}
          subtitle={isGovernment ? "National Target: 85%" : "Due in 4 days"}
          trend={isGovernment ? "+1.2%" : ""}
          trendIcon="trending_up"
          trendColor="text-primary"
        />
        <KpiCard
          title={isGovernment ? "Active Incidents" : "Violation Alerts"}
          icon="warning"
          value={isGovernment ? activeAlertsCount : "00"}
          subtitle="Critical Response"
          trend="Live feed"
          trendIcon="sensors"
          trendColor="text-red-500"
        />
        <KpiCard
          title={isGovernment ? "Cities Under Watch" : "Pollution Hotspots"}
          icon="location_city"
          value={isGovernment ? "12" : "04"}
          subtitle="Across 8 States"
          trend="Analytical"
          trendIcon="analytics"
          trendColor="text-primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-2 flex flex-col gap-6 overflow-hidden !rounded-none border-l-4 border-l-primary">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col">
              <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-text-primary">
                {isGovernment ? "National Pollution & Compliance Trends" : isIndustry ? "Plant Emission Trend" : "Pollution Trends"}
              </h3>
              <p className="text-xs text-text-secondary">
                {isGovernment ? "Consolidated multi-state sensor telemetry" : "Real-time Stack Monitoring"}
              </p>
            </div>
          </div>
          <div className="h-[300px] md:h-[400px] w-full">
            <Chart />
          </div>
        </Card>

        <Card className="flex flex-col gap-6 h-full !rounded-none border-t-4 border-t-red-500">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-red-500">
              emergency_share
            </span>
            <h3 className="text-lg font-black uppercase tracking-tight text-text-primary">
              {isGovernment ? "Live Incident Stream" : "Action Required"}
            </h3>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-1 custom-scrollbar max-h-[400px]">
            {(alerts || []).slice(0, 5).map((alert) => (
              <div key={alert.id} className="border-b border-border pb-4 last:border-0">
                <div className="flex justify-between items-start mb-1">
                  <Badge variant={alert.severity === 'Critical' ? 'danger' : 'warning'} className="!text-[8px]">{alert.severity}</Badge>
                  <span className="text-[10px] text-text-muted font-bold">{alert.timestamp}</span>
                </div>
                <p className="text-sm font-bold text-text-primary leading-tight">{alert.title}</p>
                <p className="text-[10px] text-text-secondary mt-1 italic">{alert.location}</p>
              </div>
            ))}
          </div>
          <Button variant="primary" className="w-full !rounded-none font-black uppercase tracking-widest py-4">
            Open Command Assistant
          </Button>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden !rounded-none">
        <div className="p-4 md:p-6 border-b border-border flex items-center justify-between bg-panel/50">
          <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-text-primary">
            {isGovernment ? "National City AQI Rankings" : "Industry Submissions"}
          </h3>
          <button className="text-xs text-primary font-black uppercase tracking-widest hover:underline">
            Download Full Dataset
          </button>
        </div>
        <div className="overflow-x-auto w-full no-scrollbar">
          <Table
            headers={tableHeaders}
            data={tableData}
            renderRow={renderRow}
          />
        </div>
      </Card>
    </div>
  );
}
