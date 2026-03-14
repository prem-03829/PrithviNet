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

  const basePath = isCitizen ? '/citizen' : isIndustry ? '/industry' : '/admin';
  const headerTitle = isIndustry ? "Industry Portal" : isGovernment ? "Admin Console" : "Dashboard";

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
    <header className="h-16 flex-shrink-0 border-b border-border dark:border-border flex items-center justify-between px-3 md:px-6 lg:px-8 bg-surface/50 dark:bg-surface/50 backdrop-blur-md sticky top-0 z-[100]">
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
        
        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
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

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-surface dark:bg-surface border border-border dark:border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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

              {/* Menu Items */}
              <div className="p-2">
                {menuItems.map((item, idx) => (
                  <Link 
                    key={idx}
                    to={item.to} 
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary dark:text-text-muted hover:bg-panel dark:hover:bg-panel hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Logout Section */}
              <div className="p-2 border-t border-border dark:border-border">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
