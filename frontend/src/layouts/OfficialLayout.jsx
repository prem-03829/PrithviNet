import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAppStore } from "../store/useAppStore";
import { cn } from "../utils/cn";

export default function OfficialLayout() {
  const { sidebarOpen } = useAppStore();
  const navLinks = [
    { label: "Overview", icon: "dashboard", to: "/official/dashboard" },
    { label: "Pollution Map", icon: "map", to: "/official/map" },
    { label: "Compliance", icon: "verified_user", to: "/official/compliance" },
    { label: "Policy Insights", icon: "lightbulb", to: "/official/policy" },
    { label: "Alerts", icon: "notifications", to: "/official/alerts" },
    { label: "AI Assistant", icon: "robot_2", to: "/official/ai" },
    { label: "Reports", icon: "bar_chart", to: "/official/reports" },
  ];

  return (
    <div className="flex h-screen bg-app text-text-primary font-display overflow-hidden">
      <Sidebar title="Official Portal" links={navLinks} logo="account_balance" role="Official" fixed />
      <main
        className={cn(
          "flex-1 flex flex-col min-w-0 relative transition-all duration-300 overflow-hidden",
          sidebarOpen ? "lg:ml-64" : "lg:ml-20",
        )}
      >
        <Navbar role="Government Official" />
        <div className="flex-1 w-full max-w-full overflow-hidden flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
