import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { useUserStore } from '../store/useUserStore';
import { cn } from '../utils/cn';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ role }) {
  const { setMobileMenuOpen } = useAppStore();
  const { user, logout } = useUserStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const normalizedRole = user?.role?.toLowerCase();
  const isCitizen = normalizedRole === 'citizen';
  const isIndustry = normalizedRole === 'industry';
  const isGovernment = normalizedRole === 'government' || normalizedRole === 'admin';

  const basePath = isCitizen ? '/citizen' : isIndustry ? '/industry' : '/official';
  const headerTitle = isIndustry ? "Industry Portal" : isGovernment ? "Government Command Center" : "Dashboard";

  const menuItems = isCitizen ? [
    { label: 'My Profile', to: `${basePath}/profile`, icon: 'account_circle' },
    { label: 'My Complaints', to: `${basePath}/my-complaints`, icon: 'fact_check' },
    { label: 'Notifications', to: `${basePath}/notifications`, icon: 'notifications' },
    { label: 'Settings', to: `${basePath}/settings`, icon: 'settings' },
  ] : [
    { label: 'View Profile', to: `${basePath}/profile`, icon: 'account_circle' },
    { label: 'Settings', to: `${basePath}/settings`, icon: 'settings' },
    { label: 'Notifications', to: `${basePath}/notifications`, icon: 'notifications' },
  ];

  return (
    <header className="h-16 flex-shrink-0 border-b border-border dark:border-border flex items-center justify-between px-3 md:px-6 lg:px-8 bg-surface/50 dark:bg-surface/50 backdrop-blur-md sticky top-0 z-[1000]">
      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-1.5 md:p-2 lg:hidden text-text-secondary hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-lg md:text-xl font-bold hidden sm:block text-text-primary">{headerTitle}</h2>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        {user?.role && (
          <div className="px-3 py-1 bg-primary bg-opacity-20 text-primary text-xs font-bold rounded-full uppercase tracking-wider border border-primary border-opacity-30 hidden sm:block">
            {user.role}
          </div>
        )}
        <button className="relative p-2 text-text-secondary hover:text-primary transition-colors" aria-label="Notifications">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full ring-2 ring-surface"></span>
        </button>
        
        {/* Profile Dropdown Parent */}
        <div className="relative flex items-center h-full" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="size-9 rounded-full border border-primary border-opacity-20 ring-2 ring-primary ring-opacity-5 bg-panel dark:bg-panel overflow-hidden focus:outline-none focus:ring-primary focus:ring-opacity-40 transition-all"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary text-background-dark font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
          </button>

          {/* Dropdown Menu - Floating Overlay */}
          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-[280px] bg-surface dark:bg-surface border border-border dark:border-border rounded-xl shadow-2xl overflow-hidden z-[9999] origin-top-right animate-in fade-in zoom-in-95 duration-200">
              {/* User Info Section */}
              <div className="p-4 border-b border-border dark:border-border flex items-center gap-3">
                <div className="size-10 rounded-full border border-primary border-opacity-20 overflow-hidden shrink-0">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-background-dark font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-bold truncate text-text-primary">{user?.name}</p>
                  <p className="text-[10px] text-text-muted dark:text-primary dark:text-opacity-60 font-medium truncate uppercase tracking-tight">{user?.role || role}</p>
                </div>
              </div>

              {/* Menu Items with Fixed Layout */}
              <div className="p-2 flex flex-col">
                {menuItems.map((item, idx) => (
                  <Link 
                    key={idx}
                    to={item.to} 
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-lg text-sm font-medium text-text-secondary dark:text-text-muted hover:bg-panel transition-colors no-wrap"
                  >
                    <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
                    <span className="flex-1 truncate">{item.label}</span>
                  </Link>
                ))}

                {/* Theme Toggle Item */}
                <div 
                  onClick={(e) => { e.stopPropagation(); useAppStore.getState().toggleTheme(); }}
                  className="flex items-center justify-between gap-3 px-4 py-3 min-h-[44px] rounded-lg text-sm font-medium text-text-secondary dark:text-text-muted hover:bg-panel transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="material-symbols-outlined text-[20px] shrink-0">
                      {useAppStore.getState().theme === 'dark' ? 'dark_mode' : 'light_mode'}
                    </span>
                    <span className="truncate">Dark Mode</span>
                  </div>
                  <div className={cn(
                    "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                    useAppStore.getState().theme === 'dark' ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
                  )}>
                    <span className={cn(
                      "pointer-events-none inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      useAppStore.getState().theme === 'dark' ? "translate-x-4" : "translate-x-0"
                    )} />
                  </div>
                </div>

                {/* Notifications Toggle Item */}
                <div 
                  onClick={(e) => { e.stopPropagation(); useAppStore.getState().togglePreference('push'); }}
                  className="flex items-center justify-between gap-3 px-4 py-3 min-h-[44px] rounded-lg text-sm font-medium text-text-secondary dark:text-text-muted hover:bg-panel transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="material-symbols-outlined text-[20px] shrink-0">notifications_active</span>
                    <span className="truncate">Notifications</span>
                  </div>
                  <div className={cn(
                    "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                    (useAppStore.getState().preferences.find(p => p.id === 'push')?.active) ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
                  )}>
                    <span className={cn(
                      "pointer-events-none inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      (useAppStore.getState().preferences.find(p => p.id === 'push')?.active) ? "translate-x-4" : "translate-x-0"
                    )} />
                  </div>
                </div>
              </div>

              {/* Logout Section */}
              <div className="p-2 border-t border-border dark:border-border">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px] shrink-0">logout</span>
                  <span className="flex-1 text-left">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
