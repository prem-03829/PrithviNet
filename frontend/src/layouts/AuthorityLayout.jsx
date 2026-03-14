import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAppStore } from "../store/useAppStore";
import { cn } from "../utils/cn";

export default function AuthorityLayout() {
  const { sidebarOpen } = useAppStore();
  const navLinks = [
    { label: "Overview", icon: "dashboard", to: "/authority/dashboard" },
    { label: "Pollution Map", icon: "map", to: "/authority/map" },
    { label: "Compliance", icon: "verified_user", to: "/authority/compliance" },
    { label: "Policy Insights", icon: "lightbulb", to: "/authority/policy" },
    { label: "Alerts", icon: "notifications", to: "/authority/alerts" },
    { label: "AI Assistant", icon: "robot_2", to: "/authority/ai" },
    { label: "Reports", icon: "bar_chart", to: "/authority/reports" },
  ];

  return (
    <div className="flex h-screen bg-app text-text-primary font-display overflow-hidden">
      <Sidebar title="Authority Console" links={navLinks} logo="security" role="Authority" fixed />
      <main
        className={cn(
          "flex-1 flex flex-col min-w-0 relative transition-all duration-300 overflow-hidden",
          sidebarOpen ? "lg:ml-64" : "lg:ml-20",
        )}
      >
        <Navbar role="Authority / Inspector" />
        <div className="flex-1 w-full max-w-full overflow-hidden flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
