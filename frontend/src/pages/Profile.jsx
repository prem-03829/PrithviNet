import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { useComplaintStore } from '../store/useComplaintStore';
import { usePollutionStore } from '../store/usePollutionStore';
import { useAppStore } from '../store/useAppStore';
import { useBasePath } from '../hooks/useBasePath';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ThemeSwitch from '../components/ThemeSwitch';
import { cn } from '../utils/cn';

export default function Profile() {
  const navigate = useNavigate();
  const basePath = useBasePath();
  const { user, logout } = useUserStore();
  const { complaints } = useComplaintStore();
  const { sensors } = usePollutionStore();
  const { preferences, togglePreference } = useAppStore();

  // Debugging impact score
  console.log("Profile Store State - User:", user);
  console.log("Profile Store State - Impact Score:", user?.impactScore);

  const impactScore = Number(user?.impactScore ?? 0);
  console.log("Parsed Impact Score for rendering:", impactScore);

  const handleAiClick = () => {
    const aiPath = `${basePath}/ai`;
    navigate(aiPath);
  };

  const userStats = {
    total: (complaints || []).length,
    active: (complaints || []).filter(c => c.status !== 'Resolved').length,
    resolved: (complaints || []).filter(c => c.status === 'Resolved').length,
  };

  const localPollution = sensors.find(s => s.name === user?.city) || sensors[0] || { aqi: 0, status: 'good' };

  const getEcoSuggestion = (aqi) => {
    if (aqi > 200) return "Wear an N95 mask today. Avoid outdoor activities.";
    if (aqi > 100) return "Sensitive groups should limit prolonged outdoor exertion.";
    return "Air quality is good. Great day for outdoor movement!";
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 lg:p-12 max-w-6xl mx-auto w-full space-y-6 md:space-y-8 animate-in fade-in duration-500 text-text-primary">
      {/* Identity Section */}
      <Card className="flex flex-col md:flex-row items-center gap-6 md:gap-8 p-6 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary bg-opacity-5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        
        <div className="relative">
          <div className="size-24 md:size-32 rounded-2xl border-4 border-primary border-opacity-20 overflow-hidden shadow-2xl">
            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-2 -right-2 size-7 md:size-8 bg-primary rounded-lg flex items-center justify-center text-background-dark shadow-lg">
            <span className="material-symbols-outlined text-xs md:text-sm font-bold">verified</span>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">{user.name}</h2>
            <Badge variant="primary" className="w-fit mx-auto md:mx-0 scale-90 md:scale-100">{user.role}</Badge>
          </div>
          <p className="text-sm md:text-base text-text-secondary font-medium flex items-center justify-center md:justify-start gap-2">
            <span className="material-symbols-outlined text-sm">location_on</span>
            {user.city}
          </p>
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Member Since {user.joined}</p>
        </div>

        <div className="flex gap-2 md:gap-3 shrink-0">
          <Button variant="secondary" className="text-xs md:text-sm px-3 md:px-4" onClick={() => navigate(`${basePath}/profile/edit`)}>Edit</Button>
          <Button variant="outline" onClick={() => { logout(); navigate('/login'); }} className="text-xs md:text-sm px-3 md:px-4 text-red-500 border-red-500/20 hover:bg-red-500/10">Logout</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Activity & Eco Score */}
        <div className="space-y-6 md:space-y-8">
          <Card className="space-y-6">
            <h3 className="text-lg font-bold">Activity Stats</h3>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="text-center p-3 md:p-4 bg-primary bg-opacity-5 rounded-xl border border-primary border-opacity-10">
                <p className="text-xl md:text-2xl font-black text-primary">{userStats.total}</p>
                <p className="text-[8px] md:text-[10px] font-bold text-text-secondary uppercase">Total</p>
              </div>
              <div className="text-center p-3 md:p-4 bg-orange-500/5 rounded-xl border border-orange-500/10">
                <p className="text-xl md:text-2xl font-black text-orange-500">{userStats.active}</p>
                <p className="text-[8px] md:text-[10px] font-bold text-text-secondary uppercase">Active</p>
              </div>
              <div className="text-center p-3 md:p-4 bg-green-500/5 rounded-xl border border-green-500/10">
                <p className="text-xl md:text-2xl font-black text-green-500">{userStats.resolved}</p>
                <p className="text-[8px] md:text-[10px] font-bold text-text-secondary uppercase">Resolved</p>
              </div>
            </div>
            
            <div className="pt-6 border-t border-border dark:border-border text-center">
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Eco Impact Score</p>
              <div className="relative size-32 mx-auto">
                <svg className="size-full" viewBox="0 0 36 36">
                  <path className="stroke-border dark:stroke-border" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="stroke-primary" strokeWidth="3" strokeDasharray={`${Math.min(100, (impactScore / 1000) * 100)}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-black">{impactScore}</span>
                  <span className="text-[8px] font-bold text-primary uppercase">Points</span>
                </div>
              </div>
              <p className="text-[10px] text-text-secondary mt-4 px-4 leading-relaxed">Top 5% of reporters in {user.city}. Keep protecting your city!</p>
            </div>
          </Card>

          <Card className="space-y-6">
            <h3 className="text-lg font-bold">Preferences</h3>
            <div className="space-y-4">
              <ThemeSwitch />
              <div className="pt-2 border-t border-border dark:border-border"></div>
              {(preferences || []).map((pref) => (
                <div key={pref.id} className="flex items-center justify-between py-1">
                  <span className="text-sm font-medium text-text-secondary dark:text-text-muted">{pref.label}</span>
                  <button 
                    type="button"
                    role="switch"
                    aria-checked={pref.active}
                    onClick={() => togglePreference(pref.id)}
                    className={cn(
                      "relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 z-10",
                      pref.active ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
                    )}
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
          </Card>
        </div>

        {/* Report History & Local Data */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="space-y-4">
              <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest">Local Snapshot</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-black">{localPollution.aqi}</p>
                  <p className="text-xs font-bold text-primary uppercase tracking-tighter">AQI • {user.city}</p>
                </div>
                <Badge variant={localPollution.status === 'critical' ? 'danger' : localPollution.status === 'unhealthy' ? 'warning' : 'primary'}>
                  {localPollution.status}
                </Badge>
              </div>
              <div className="p-4 bg-primary bg-opacity-5 rounded-xl border border-primary border-opacity-10">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-primary">lightbulb</span>
                  <p className="text-sm text-text-secondary dark:text-text-muted leading-snug">
                    {getEcoSuggestion(localPollution.aqi)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-900 border-none relative overflow-hidden group cursor-pointer" onClick={handleAiClick}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-transparent"></div>
              <div className="relative z-10 space-y-2">
                <h3 className="text-lg font-bold text-white">Awareness Center</h3>
                <p className="text-sm text-slate-400 leading-relaxed">Learn about the pollutants in {user.city} and how they affect your health.</p>
                <div className="pt-4 flex items-center gap-2 text-primary text-sm font-bold group-hover:gap-4 transition-all">
                  Browse Knowledge Base <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b border-border dark:border-border flex items-center justify-between">
              <h3 className="text-lg font-bold">Recent Activity</h3>
              <Button variant="ghost" className="text-primary text-xs" onClick={() => navigate(`${basePath}/my-complaints`)}>View All</Button>
            </div>
            <div className="divide-y divide-border dark:divide-border">
              {(complaints || []).map((c, i) => (
                <div 
                  key={i} 
                  onClick={() => navigate(`${basePath}/complaint/${c.id}`)}
                  className="p-6 hover:bg-panel dark:hover:bg-panel transition-colors cursor-pointer group flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-text-muted tracking-widest">{c.id}</span>
                      <Badge variant={c.status === 'Resolved' ? 'success' : 'warning'} className="scale-75 origin-left">{c.status}</Badge>
                    </div>
                    <p className="text-sm font-bold group-hover:text-primary transition-colors">{c.title}</p>
                    <p className="text-xs text-text-secondary">{c.date} • {c.location}</p>
                  </div>
                  <span className="material-symbols-outlined text-text-muted group-hover:text-primary transition-colors">chevron_right</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
