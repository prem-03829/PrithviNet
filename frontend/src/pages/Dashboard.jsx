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

  const avgAqi =
    (sensors || []).length > 0
      ? Math.round(sensors.reduce((acc, s) => acc + (s?.aqi || 0), 0) / sensors.length)
      : 0;

  const activeAlerts = (alerts || []).filter((a) => a?.severity?.toLowerCase() === "critical").length;

  const tableHeaders = isIndustry 
    ? ["Report ID", "Submission Type", "Date", "Status", "Action"]
    : ["Facility Name", "Risk Level", "Primary Pollutant", "Status", "Action"];

  const industryData = [
    { id: "REP-991", type: "Emission Data", date: "2024-03-14", status: "Approved" },
    { id: "REP-992", type: "Safety Audit", date: "2024-03-10", status: "Pending" },
    { id: "REP-993", type: "Water Usage", date: "2024-02-28", status: "Rejected" },
  ];

  const govData = [
    { id: "inv-1", name: "Apex Manufacturing Co.", risk: "High", pollutant: "Sulfur Dioxide", status: "Investigation" },
    { id: "inv-2", name: "Green Energy Refinery", risk: "Moderate", pollutant: "Carbon Monoxide", status: "Monitored" },
    { id: "inv-3", name: "City Waste Management", risk: "Low", pollutant: "Methane", status: "Closed" },
  ];

  const tableData = isIndustry ? industryData : govData;

  const renderRow = (row, idx) => {
    if (isIndustry) {
      return (
        <tr key={idx} className="hover:bg-panel dark:hover:bg-panel transition-colors group">
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
    return (
      <tr
        key={idx}
        className="hover:bg-panel dark:hover:bg-panel transition-colors group"
      >
        <td className="px-6 py-4 font-medium text-text-primary">{row.name}</td>
        <td className="px-6 py-4 text-text-secondary">
          <span
            className={`inline-block size-2 rounded-full mr-2 ${row.risk === "High" ? "bg-red-500" : row.risk === "Moderate" ? "bg-yellow-500" : "bg-primary"}`}
          ></span>
          {row.risk}
        </td>
        <td className="px-6 py-4 text-text-secondary">{row.pollutant}</td>
        <td className="px-6 py-4">
          <Badge
            variant={
              row.risk === "High"
                ? "danger"
                : row.risk === "Moderate"
                  ? "warning"
                  : "success"
            }
          >
            {row.status}
          </Badge>
        </td>
        <td className="px-6 py-4">
          <button
            onClick={() => navigate(`${basePath}/investigation/${row.id}`)}
            className="p-1 text-text-secondary hover:text-primary transition-colors"
            title="View Investigation Details"
          >
            <span className="material-symbols-outlined text-xl">open_in_new</span>
          </button>
        </td>
      </tr>
    );
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
              {isIndustry ? `Entity: ${user?.industryId?.toUpperCase()}` : `Welcome back, ${user?.name?.split(' ')[0]}`}
            </h2>
            {user && (
              <div className="flex items-center gap-2 mt-0.5 text-text-secondary text-xs md:text-sm">
                <span className="material-symbols-outlined text-sm text-primary">
                  location_on
                </span>
                <span>
                  {user.city} {isIndustry && "• Plant Operations"}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-2 px-3 py-1.5 rounded-full bg-panel dark:bg-panel border border-border dark:border-border cursor-pointer hover:bg-panel transition-colors w-full sm:w-auto text-text-secondary">
          <span className="text-xs md:text-sm font-medium">{isIndustry ? "All Subsidaries" : "All Regions"}</span>
          <span className="material-symbols-outlined text-sm">expand_more</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div onClick={() => navigate(`${basePath}/map`)} className="cursor-pointer">
          <KpiCard
            title={isIndustry ? "Internal Compliance Score" : "Regional Pollution Summary"}
            icon={isIndustry ? "verified" : "air"}
            value={isIndustry ? "94/100" : `AQI ${avgAqi}`}
            subtitle={isIndustry ? "Highly Compliant" : (avgAqi < 100 ? "Satisfactory" : "Unhealthy")}
            trend={isIndustry ? "+2% vs last month" : "-5% vs last week"}
            trendIcon={isIndustry ? "trending_up" : "trending_down"}
            trendColor="text-green-500"
          />
        </div>
        <div
          onClick={() => navigate(isIndustry ? `${basePath}/submit-report` : "/citizen/my-complaints")}
          className="cursor-pointer"
        >
          <KpiCard
            title={isIndustry ? "Pending Submissions" : "Complaint Volume"}
            icon={isIndustry ? "upload_file" : "forum"}
            value={isIndustry ? "02" : `+${complaints.length}`}
            subtitle={isIndustry ? "Due in 4 days" : "Total Reports"}
            trend="Recent updates"
            trendIcon="trending_up"
            trendColor={isIndustry ? "text-primary" : "text-red-500"}
          />
        </div>
        <div
          onClick={() => navigate(`${basePath}/alerts`)}
          className="cursor-pointer sm:col-span-2 lg:col-span-1"
        >
          <KpiCard
            title={isIndustry ? "Violation Alerts" : "Active Investigations"}
            icon="warning"
            value={isIndustry ? "00" : `${activeAlerts}`}
            subtitle={isIndustry ? "No critical breaches" : "Alerts Pending"}
            trend="Live monitoring"
            trendIcon="sensors"
            trendColor="text-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col">
              <h3 className="text-base md:text-lg font-bold text-text-primary">
                {isIndustry ? "Plant Emission Trend (Real-time)" : "Pollution Trends vs Complaint Volume"}
              </h3>
              <p className="text-xs md:text-sm text-text-secondary">
                {isIndustry ? "Monitoring stacks A1 to D4" : "30-day comparative analysis"}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary"></span>
                <span className="text-[10px] md:text-xs font-medium uppercase text-text-secondary">
                  {isIndustry ? "Emissions" : "Pollution"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-text-muted"></span>
                <span className="text-[10px] md:text-xs font-medium uppercase text-text-secondary">
                  {isIndustry ? "Threshold" : "Complaints"}
                </span>
              </div>
            </div>
          </div>
          <div className="h-[300px] md:h-[400px] w-full">
            <Chart />
          </div>
        </Card>

        <Card className="flex flex-col gap-6 h-full">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              auto_awesome
            </span>
            <h3 className="text-lg font-bold text-text-primary">
              {isIndustry ? "Compliance Advisor" : "Nearby Alerts"}
            </h3>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-1 custom-scrollbar max-h-[400px]">
            {isIndustry ? (
              <div className="p-4 bg-panel rounded-xl border border-border space-y-3">
                <p className="text-xs font-bold text-primary uppercase">Risk Analysis</p>
                <p className="text-sm text-text-primary leading-relaxed">
                  Based on current emission trends, stack B2 might exceed SO2 thresholds in 48 hours. Suggest preemptive filter cleaning.
                </p>
                <Button variant="outline" className="w-full text-xs" onClick={() => navigate(`${basePath}/ai`)}>Get Detailed Plan</Button>
              </div>
            ) : (
              (!alerts || alerts.length === 0) ? (
                <p className="text-sm text-text-secondary text-center py-4">
                  No active alerts
                </p>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert?.id}
                    onClick={() => navigate(`${basePath}/alerts`)}
                    className="cursor-pointer"
                  >
                    <AlertCard
                      alert={alert}
                    />
                  </div>
                ))
              )
            )}
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
            <Button
              variant="outline"
              className="text-xs md:text-sm flex-1"
              onClick={() => navigate(`${basePath}/ai`)}
            >
              <span className="material-symbols-outlined text-sm">robot_2</span>
              {isIndustry ? "AI Compliance Advisor" : "AI Assistant"}
            </Button>
            <Button
              variant="primary"
              className="w-full text-xs md:text-sm flex-1"
            >
              {isIndustry ? "Export Audit PDF" : "Generate Strategy Report"}
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-border dark:border-border flex items-center justify-between">
          <h3 className="text-base md:text-lg font-bold text-text-primary">
            {isIndustry ? "Recent Compliance Submissions" : "Recent Compliance Incidents"}
          </h3>
          <button
            onClick={() => navigate(isIndustry ? `${basePath}/submit-report` : `${basePath}/compliance`)}
            className="text-xs md:text-sm text-primary font-medium hover:underline"
          >
            View all
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
