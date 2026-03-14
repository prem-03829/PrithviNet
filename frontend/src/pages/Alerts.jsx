import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import AlertCard from '../components/AlertCard';

export default function Alerts() {
  const navigate = useNavigate();
  const { alerts } = useAppStore();

  const handleAlertClick = (alert) => {
    navigate(`/admin/investigation/${alert.id}`);
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Quick Stats/Filter */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-primary text-background-dark font-bold rounded-lg text-sm transition-all hover:brightness-110 shadow-lg shadow-primary/20">
              All Alerts
            </button>
            <button className="px-4 py-2 bg-surface border border-border text-text-secondary rounded-lg text-sm hover:bg-panel transition-all font-medium">
              Critical
            </button>
            <button className="px-4 py-2 bg-surface border border-border text-text-secondary rounded-lg text-sm hover:bg-panel transition-all font-medium">
              Warning
            </button>
          </div>
          <div className="text-sm text-text-secondary">
            Showing <span className="text-primary font-bold">{alerts.length}</span> active incidents
          </div>
        </div>

        {/* Alert Feed List */}
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-20 bg-surface border border-border rounded-2xl border-dashed">
              <span className="material-symbols-outlined text-4xl text-text-muted mb-2">notifications_off</span>
              <p className="text-text-secondary">No active alerts at this time.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <AlertCard 
                key={alert.id} 
                alert={alert} 
                onClick={() => handleAlertClick(alert)}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {alerts.length > 0 && (
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <p className="text-sm text-text-secondary">Showing {alerts.length} of 142 alerts from last 24 hours</p>
            <div className="flex gap-2">
              <button className="size-8 flex items-center justify-center rounded border border-border hover:bg-panel transition-colors">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="size-8 flex items-center justify-center rounded bg-primary/20 text-primary font-bold text-sm">1</button>
              <button className="size-8 flex items-center justify-center rounded border border-border hover:bg-panel transition-colors text-sm">2</button>
              <button className="size-8 flex items-center justify-center rounded border border-border hover:bg-panel transition-colors text-sm">3</button>
              <button className="size-8 flex items-center justify-center rounded border border-border hover:bg-panel transition-colors">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
