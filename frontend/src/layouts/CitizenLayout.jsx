import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../utils/cn';

export default function CitizenLayout() {
  const { sidebarOpen } = useAppStore();
  const navLinks = [
    { label: 'Public Pollution Map', icon: 'map', to: '/citizen/map' },
    { label: 'File Complaint', icon: 'chat_bubble', to: '/citizen/file-complaint' },
    { label: 'My Complaints', icon: 'fact_check', to: '/citizen/my-complaints' },
    { label: 'AI Assistant', icon: 'robot_2', to: '/citizen/ai-assistant' },
    { label: 'Awareness & Data', icon: 'auto_stories', to: '/citizen/awareness' },
    { label: 'Profile', icon: 'account_circle', to: '/citizen/profile' },
  ];

  return (
    <div className="flex h-screen bg-app text-text-primary font-display overflow-hidden">
      <Sidebar 
        title="Citizen Portal" 
        links={navLinks} 
        logo="eco" 
        role="Citizen"
        fixed
      />
      <main className={cn(
        "flex-1 flex flex-col min-w-0 relative transition-all duration-300 overflow-hidden",
        sidebarOpen ? "lg:ml-64" : "lg:ml-20"
      )}>
        <Navbar role="Citizen" />
        <div className="flex-1 w-full max-w-full overflow-hidden flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
