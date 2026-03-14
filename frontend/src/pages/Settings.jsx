import Card from '../components/Card';
import ThemeSwitch from '../components/ThemeSwitch';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../utils/cn';

export default function Settings() {
  const { preferences, togglePreference } = useAppStore();

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 lg:p-12 max-w-4xl mx-auto w-full space-y-8 animate-in fade-in duration-500 text-text-primary">
      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tight">Account Settings</h2>
        <p className="text-text-secondary">Manage your profile, preferences, and account security.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest">Preferences</h3>
          <Card className="space-y-6">
            <div className="space-y-6">
              <ThemeSwitch />
              
              <div className="pt-6 border-t border-border dark:border-border space-y-4">
                {preferences.map((pref) => (
                  <div key={pref.id} className="flex items-center justify-between py-1">
                    <span className="text-sm font-medium text-text-secondary dark:text-text-muted">{pref.label}</span>
                    <button 
                      type="button"
                      role="switch"
                      aria-checked={pref.active}
                      onClick={() => togglePreference(pref.id)}
                      className={cn(
                        "relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20",
                        pref.active ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
                      )}
                      style={{ zIndex: 100 }}
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block size-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                          pref.active ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest">Account Security</h3>
          <Card className="divide-y divide-border dark:divide-border p-0 overflow-hidden">
            <div className="p-4 md:p-6 flex items-center justify-between hover:bg-panel dark:hover:bg-panel transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <div>
                  <p className="text-sm font-bold">Change Password</p>
                  <p className="text-xs text-text-secondary">Update your account password</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-text-muted group-hover:text-primary transition-all">chevron_right</span>
            </div>
            <div className="p-4 md:p-6 flex items-center justify-between hover:bg-panel dark:hover:bg-panel transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <span className="material-symbols-outlined">shield</span>
                </div>
                <div>
                  <p className="text-sm font-bold">Two-Factor Authentication</p>
                  <p className="text-xs text-text-secondary">Add an extra layer of security</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-text-muted group-hover:text-primary transition-all">chevron_right</span>
            </div>
          </Card>
        </section>

        <section className="space-y-4">
          <Card className="bg-red-500/5 border-red-500/10 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-red-500">Danger Zone</p>
              <p className="text-xs text-text-secondary">Permanently delete your account and all data.</p>
            </div>
            <button className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors">
              Delete Account
            </button>
          </Card>
        </section>
      </div>
    </div>
  );
}
