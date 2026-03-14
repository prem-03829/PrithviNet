import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAppStore } from "../store/useAppStore";
import { cn } from "../utils/cn";

export default function InspectorLayout() {
  const { sidebarOpen } = useAppStore();
  const navLinks = [
    { label: "Overview", icon: "dashboard", to: "/inspector/dashboard" },
    { label: "Pollution Map", icon: "map", to: "/inspector/map" },
    { label: "Compliance", icon: "verified_user", to: "/inspector/compliance" },
    { label: "Policy Insights", icon: "lightbulb", to: "/inspector/policy" },
    { label: "Alerts", icon: "notifications", to: "/inspector/alerts" },
    { label: "AI Assistant", icon: "robot_2", to: "/inspector/ai" },
    { label: "Reports", icon: "bar_chart", to: "/inspector/reports" },
  ];

  return (
    <div className="flex h-screen bg-app text-text-primary font-display overflow-hidden">
      <Sidebar title="Inspector Panel" links={navLinks} logo="search_check" role="Inspector" fixed />
      <main
        className={cn(
          "flex-1 flex flex-col min-w-0 relative transition-all duration-300 overflow-hidden",
          sidebarOpen ? "lg:ml-64" : "lg:ml-20",
        )}
      >
        <Navbar role="Field Inspector" />
        <div className="flex-1 w-full max-w-full overflow-hidden flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
