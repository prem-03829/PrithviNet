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

export default function Dashboard() {
  const navigate = useNavigate();
  const { sensors } = usePollutionStore();
  const { complaints } = useComplaintStore();
  const { alerts } = useAppStore();
  const { user } = useUserStore();

  const avgAqi =
    (sensors || []).length > 0
      ? Math.round(sensors.reduce((acc, s) => acc + (s?.aqi || 0), 0) / sensors.length)
      : 0;

  const activeAlerts = (alerts || []).filter((a) => a?.severity?.toLowerCase() === "critical").length;

  const tableHeaders = [
    "Facility Name",
    "Risk Level",
    "Primary Pollutant",
    "Status",
    "Action",
  ];
  const tableData = [
    {
      id: "inv-1",
      name: "Apex Manufacturing Co.",
      risk: "High",
      pollutant: "Sulfur Dioxide",
      status: "Investigation",
    },
    {
      id: "inv-2",
      name: "Green Energy Refinery",
      risk: "Moderate",
      pollutant: "Carbon Monoxide",
      status: "Monitored",
    },
    {
      id: "inv-3",
      name: "City Waste Management",
      risk: "Low",
      pollutant: "Methane",
      status: "Closed",
    },
  ];

  const renderRow = (row, idx) => (
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
          onClick={() => navigate(`/admin/investigation/${row.id}`)}
          className="p-1 text-text-secondary hover:text-primary transition-colors"
          title="View Investigation Details"
        >
          <span className="material-symbols-outlined text-xl">open_in_new</span>
        </button>
      </td>
    </tr>
  );

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-text-primary">
            Overview
          </h2>
          {user && (
            <div className="flex items-center gap-2 mt-1 text-text-secondary text-xs md:text-sm">
              <span className="material-symbols-outlined text-sm text-primary">
                location_on
              </span>
              <span>
                Showing data for{" "}
                <strong className="text-text-primary">{user.city}</strong>
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-2 px-3 py-1.5 rounded-full bg-panel dark:bg-panel border border-border dark:border-border cursor-pointer hover:bg-panel transition-colors w-full sm:w-auto text-text-secondary">
          <span className="text-xs md:text-sm font-medium">All Regions</span>
          <span className="material-symbols-outlined text-sm">expand_more</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div onClick={() => navigate("/admin/map")} className="cursor-pointer">
          <KpiCard
            title="Regional Pollution Summary"
            icon="air"
            value={`AQI ${avgAqi}`}
            subtitle={avgAqi < 100 ? "Satisfactory" : "Unhealthy"}
            trend="-5% vs last week"
            trendIcon="trending_down"
            trendColor="text-green-500"
          />
        </div>
        <div
          onClick={() => navigate("/citizen/my-complaints")}
          className="cursor-pointer"
        >
          <KpiCard
            title="Complaint Volume"
            icon="forum"
            value={`+${complaints.length}`}
            subtitle="Total Reports"
            trend="Recent updates"
            trendIcon="trending_up"
            trendColor="text-red-500"
          />
        </div>
        <div
          onClick={() => navigate("/admin/alerts")}
          className="cursor-pointer sm:col-span-2 lg:col-span-1"
        >
          <KpiCard
            title="Active Investigations"
            icon="search_check"
            value={`${activeAlerts}`}
            subtitle="Alerts Pending"
            trend="Requires attention"
            trendIcon="warning"
            trendColor="text-orange-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col">
              <h3 className="text-base md:text-lg font-bold text-text-primary">
                Pollution Trends vs Complaint Volume
              </h3>
              <p className="text-xs md:text-sm text-text-secondary">
                30-day comparative analysis
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary"></span>
                <span className="text-[10px] md:text-xs font-medium uppercase text-text-secondary">
                  Pollution
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-text-muted"></span>
                <span className="text-[10px] md:text-xs font-medium uppercase text-text-secondary">
                  Complaints
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
              Nearby Alerts
            </h3>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-1 custom-scrollbar max-h-[400px]">
            {(!alerts || alerts.length === 0) ? (
              <p className="text-sm text-text-secondary text-center py-4">
                No active alerts
              </p>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert?.id}
                  onClick={() => navigate("/admin/alerts")}
                  className="cursor-pointer"
                >
                  <AlertCard
                    alert={alert}
                  />
                </div>
              ))
            )}
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
            <Button
              variant="outline"
              className="text-xs md:text-sm flex-1"
              onClick={() => navigate("/admin/ai")}
            >
              <span className="material-symbols-outlined text-sm">robot_2</span>
              AI Assistant
            </Button>
            <Button
              variant="primary"
              className="w-full text-xs md:text-sm flex-1"
            >
              Generate Strategy Report
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-border dark:border-border flex items-center justify-between">
          <h3 className="text-base md:text-lg font-bold text-text-primary">
            Recent Compliance Incidents
          </h3>
          <button
            onClick={() => navigate("/admin/compliance")}
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
