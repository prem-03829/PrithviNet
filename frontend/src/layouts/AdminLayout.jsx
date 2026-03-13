import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../utils/cn';

export default function AdminLayout() {
  const { sidebarOpen } = useAppStore();
  const navLinks = [
    { label: 'Overview', icon: 'dashboard', to: '/admin/dashboard' },
    { label: 'Pollution Map', icon: 'map', to: '/admin/map' },
    { label: 'Compliance', icon: 'verified_user', to: '/admin/compliance' },
    { label: 'Policy Insights', icon: 'lightbulb', to: '#' },
    { label: 'Alerts', icon: 'notifications', to: '/admin/alerts' },
    { label: 'AI Assistant', icon: 'robot_2', to: '/admin/ai' },
    { label: 'Reports', icon: 'bar_chart', to: '#' },
  ];

  return (
    <div className="flex h-screen bg-app text-text-primary font-display overflow-hidden">
      <Sidebar 
        title="Admin Console" 
        links={navLinks} 
        logo="eco" 
        fixed
      />
      <main className={cn(
        "flex-1 flex flex-col min-w-0 relative transition-all duration-300 overflow-hidden",
        sidebarOpen ? "lg:ml-64" : "lg:ml-20"
      )}>
        <Navbar role="Official" />
        <div className="flex-1 w-full max-w-full overflow-hidden flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
