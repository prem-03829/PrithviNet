import { NavLink, Link } from 'react-router-dom';
import { cn } from '../utils/cn';
import { useAppStore } from '../store/useAppStore';

export default function Sidebar({ title, links, logo, fixed, role }) {
  const { sidebarOpen, setSidebarOpen, mobileMenuOpen, setMobileMenuOpen } = useAppStore();
  const settingsPath = role === 'Citizen' ? '/citizen/settings' : '/admin/settings';

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[140] lg:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside className={cn(
        "flex-shrink-0 border-r border-border bg-surface flex flex-col h-full z-[150] transition-all duration-300",
        fixed ? "fixed" : "relative",
        sidebarOpen ? "w-64" : "w-20",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 flex items-center gap-3 overflow-hidden">
          <div 
            className="size-10 bg-primary rounded-lg flex items-center justify-center text-background-dark cursor-pointer shrink-0"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="material-symbols-outlined font-bold">{logo}</span>
          </div>
          {sidebarOpen && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-2">
              <h1 className="text-lg font-bold leading-none">PrithviNet</h1>
              <span className="text-xs text-text-muted font-medium">{title}</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
          {links.map((link, idx) => (
            <NavLink 
              key={idx} 
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary bg-opacity-15 text-primary border-l-4 border-primary" 
                  : "text-text-secondary hover:bg-panel",
                !sidebarOpen && "justify-center px-0"
              )}
              title={!sidebarOpen ? link.label : ""}
            >
              <span className="material-symbols-outlined shrink-0">{link.icon}</span>
              {sidebarOpen && <span className="truncate">{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <Link 
            to={settingsPath}
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-panel transition-colors text-sm font-medium",
              !sidebarOpen && "justify-center px-0"
            )}
          >
            <span className="material-symbols-outlined shrink-0">settings</span>
            {sidebarOpen && <span>Settings</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
