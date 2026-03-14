import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import AlertCard from '../components/AlertCard';
import { useBasePath } from '../hooks/useBasePath';
import { cn } from '../utils/cn';

export default function Alerts() {
  const navigate = useNavigate();
  const basePath = useBasePath();
  const { alerts } = useAppStore();
  const [filter, setFilter] = useState('all');

  const filteredAlerts = useMemo(() => {
    if (filter === 'all') return alerts;
    return alerts.filter(alert => alert.severity?.toLowerCase() === filter.toLowerCase());
  }, [alerts, filter]);

  const handleAlertClick = (alert) => {
    navigate(`${basePath}/investigation/${alert.id}`);
  };

  const filters = [
    { label: 'All Alerts', value: 'all' },
    { label: 'Critical', value: 'critical' },
    { label: 'Warning', value: 'warning' },
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Quick Stats/Filter */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm transition-all font-medium",
                  filter === f.value
                    ? "bg-primary text-background-dark font-bold shadow-lg shadow-primary/20"
                    : "bg-surface border border-border text-text-secondary hover:bg-panel"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="text-sm text-text-secondary">
            Showing <span className="text-primary font-bold">{filteredAlerts.length}</span> {filter !== 'all' ? filter : ''} active incidents
          </div>
        </div>

        {/* Alert Feed List */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-20 bg-surface border border-border rounded-2xl border-dashed">
              <span className="material-symbols-outlined text-4xl text-text-muted mb-2">notifications_off</span>
              <p className="text-text-secondary">No {filter !== 'all' ? filter : ''} alerts at this time.</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <AlertCard 
                key={alert.id} 
                alert={alert} 
                onClick={() => handleAlertClick(alert)}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredAlerts.length > 0 && (
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <p className="text-sm text-text-secondary">Showing {filteredAlerts.length} of {alerts.length} alerts from last 24 hours</p>
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
