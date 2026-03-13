import { useAppStore } from '../store/useAppStore';
import { cn } from '../utils/cn';

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useAppStore();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center justify-between py-2">
      <div className="space-y-0.5">
        <label className="text-sm font-medium text-slate-900 dark:text-slate-100 block">Appearance</label>
        <p className="text-xs text-slate-500">Switch between light and dark mode</p>
      </div>
      <button
        type="button"
        onClick={toggleTheme}
        className={cn(
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20",
          isDark ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
        )}
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle dark mode"
      >
        <span
          className={cn(
            "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            isDark ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}
