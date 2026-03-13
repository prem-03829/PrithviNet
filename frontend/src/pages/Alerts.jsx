import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import AlertCard from '../components/AlertCard';
import Button from '../components/Button';
import { alertService } from '../services/alertService';

export default function Alerts() {
  const navigate = useNavigate();
  const { alerts, updateAlertStatus } = useAppStore();

  const handleResolve = async (id) => {
    const res = await alertService.resolveAlert(id);
    if (res.success) {
      updateAlertStatus(id, 'STABLE');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">System Alerts</h2>
          <p className="text-slate-500 text-xs md:text-sm mt-1">Real-time environmental risk detection</p>
        </div>
        <Button variant="outline" className="text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2">
          <span className="material-symbols-outlined text-sm">filter_list</span>
          Filter
        </Button>
      </div>

      <div className="space-y-6">
        {alerts.length === 0 ? (
          <div className="text-center py-20 bg-primary bg-opacity-5 rounded-2xl border border-primary border-opacity-10">
            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">notifications_off</span>
            <p className="text-slate-500">No active alerts at this time.</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className="relative group">
              <div 
                onClick={() => navigate(`/admin/investigation/${alert.id}`)}
                className="cursor-pointer"
              >
                <AlertCard title={alert.title} type={alert.type} desc={alert.desc} />
              </div>
              
              {alert.type !== 'STABLE' && (
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button 
                    variant="primary" 
                    className="h-8 px-3 text-[10px] uppercase"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResolve(alert.id);
                    }}
                  >
                    Resolve
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="mt-8 md:mt-12 p-4 md:p-6 rounded-xl bg-primary bg-opacity-5 border border-primary border-opacity-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
        <div className="flex items-center gap-4">
          <div className="size-10 md:size-12 rounded-full bg-primary bg-opacity-20 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-xl md:text-2xl">auto_awesome</span>
          </div>
          <div>
            <h3 className="font-bold text-sm md:text-base">Need deeper analysis?</h3>
            <p className="text-xs md:text-sm text-slate-500">Ask Prithvi AI to analyze historical trends for these alert zones.</p>
          </div>
        </div>
        <Button variant="primary" className="text-xs md:text-sm px-6 w-full md:w-auto" onClick={() => navigate('/admin/ai')}>
          Consult AI
        </Button>
      </div>
    </div>
  );
}
