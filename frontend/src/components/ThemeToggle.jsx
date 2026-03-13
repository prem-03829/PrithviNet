import { useAppStore } from '../store/useAppStore';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useAppStore();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden sm:block">
        {isDark ? 'Dark Mode' : 'Light Mode'}
      </span>
      <button
        onClick={toggleTheme}
        className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-4 border-slate-200 dark:border-slate-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isDark ? "bg-primary" : "bg-slate-300"}`}
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle theme"
        type="button"
        style={{ zIndex: 9999 }}
      >
        <span
          className={`pointer-events-none relative inline-block h-6 w-6 transform rounded-full bg-white shadow-xl ring-0 transition duration-300 ease-in-out flex items-center justify-center ${isDark ? "translate-x-6" : "translate-x-0"}`}
        >
          <span className={`material-symbols-outlined text-xs absolute transition-all duration-300 ${isDark ? "opacity-0 scale-50" : "opacity-100 scale-100 text-amber-500"}`}>
            light_mode
          </span>
          <span className={`material-symbols-outlined text-xs absolute transition-all duration-300 ${isDark ? "opacity-100 scale-100 text-primary" : "opacity-0 scale-50"}`}>
            dark_mode
          </span>
        </span>
      </button>
    </div>
  );
}
