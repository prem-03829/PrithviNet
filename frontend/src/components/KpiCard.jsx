import Card from './Card';

export default function KpiCard({ title, icon, value, subtitle, trend, trendIcon, trendColor }) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</span>
        <span className="material-symbols-outlined text-primary">{icon}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold">{value}</h3>
        <span className="text-xs font-semibold text-slate-400">{subtitle}</span>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
          <span className="material-symbols-outlined text-sm">{trendIcon}</span>
          <span>{trend}</span>
        </div>
      )}
    </Card>
  );
}
