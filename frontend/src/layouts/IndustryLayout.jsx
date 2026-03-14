import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAppStore } from "../store/useAppStore";
import { cn } from "../utils/cn";

export default function IndustryLayout() {
  const { sidebarOpen } = useAppStore();
  const navLinks = [
    { label: "Overview", icon: "dashboard", to: "/industry/dashboard" },
    { label: "Plant Map", icon: "map", to: "/industry/map" },
    { label: "Compliance", icon: "verified_user", to: "/industry/compliance" },
    { label: "Submit Report", icon: "upload_file", to: "/industry/submit-report" },
    { label: "Policy Insights", icon: "lightbulb", to: "/industry/policy" },
    { label: "Alerts", icon: "notifications", to: "/industry/alerts" },
    { label: "AI Advisor", icon: "robot_2", to: "/industry/ai" },
  ];

  return (
    <div className="flex h-screen bg-app text-text-primary font-display overflow-hidden">
      <Sidebar title="Industry Portal" links={navLinks} logo="factory" role="Industry" fixed />
      <main
        className={cn(
          "flex-1 flex flex-col min-w-0 relative transition-all duration-300 overflow-hidden",
          sidebarOpen ? "lg:ml-64" : "lg:ml-20",
        )}
      >
        <Navbar role="Industry Partner" />
        <div className="flex-1 w-full max-w-full overflow-hidden flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
