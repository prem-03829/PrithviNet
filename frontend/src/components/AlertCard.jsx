import { cn } from '../utils/cn';

export default function AlertCard({ alert, onClick }) {
  const { 
    source, 
    icon, 
    severity, 
    timestamp, 
    title, 
    location, 
    category, 
    value, 
    hasMap, 
    mapCoords 
  } = alert;

  const isCritical = severity?.toLowerCase() === 'critical';

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group flex flex-col gap-4 p-5 bg-surface border border-border rounded-xl hover:border-primary/40 transition-all cursor-pointer",
        isCritical && "dark:bg-primary/5"
      )}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        <div className="flex flex-col items-center justify-center w-12 shrink-0">
          <span className={cn(
            "material-symbols-outlined text-3xl font-light",
            isCritical ? "text-red-500" : "text-amber-500",
            source?.includes('AI') && "text-primary"
          )}>
            {icon}
          </span>
          <span className="text-[10px] mt-1 font-bold text-text-muted uppercase truncate w-full text-center">
            {source}
          </span>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded",
              isCritical ? "text-red-500 bg-red-500/10" : "text-amber-500 bg-amber-500/10"
            )}>
              {severity}
            </span>
            <span className="text-xs text-text-muted">{timestamp}</span>
          </div>
          <h3 className="font-bold text-lg text-text-primary">{title}</h3>
          <p className="text-sm text-text-secondary">{location}</p>
        </div>

        <div className="flex items-center gap-8 px-6 border-l border-border md:min-w-[180px] justify-between">
          <div className="text-center">
            <p className="text-xs text-text-muted uppercase font-semibold">Category</p>
            <p className="font-bold text-primary">{category}</p>
          </div>
          {value && (
            <div className="text-center">
              <p className="text-xs text-text-muted uppercase font-semibold">
                {source === 'AI Predict' ? 'Forecasting' : 'Level'}
              </p>
              <p className="font-bold text-text-primary">{value}</p>
            </div>
          )}
        </div>

        <div className="bg-primary/10 text-primary hover:bg-primary hover:text-slate-900 dark:hover:text-background-dark p-3 rounded-lg transition-all self-end md:self-center border border-transparent">
          <span className="material-symbols-outlined">
            {hasMap ? 'expand_more' : 'chevron_right'}
          </span>
        </div>
      </div>

      {hasMap && (
        <div className="h-48 w-full rounded-lg overflow-hidden relative border border-border/50">
          <img 
            alt="Satellite detection view" 
            className="w-full h-full object-cover opacity-40" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhD3i0lNkGYV0SfGKbLjD5mWAJ-97BxSHi5ltsZPiLisDzbgBgPNOBo_Jx-XQUCZmY9bmfoKFfUPrc0CiL7oRpC64WkA9r2rAjYxiKGpivF5nMUNJLIRRGiezIlQnXKsnyWt3yePYe1d4UGaMKApmpvs8WbJsDP7ZgoKk4gddSUMVJexCTFALB4krta3LJrgwkjRLUYTelL0ScDlysN0Qm-_fNxs0ANqk1DbzBp6gDHoK5tB61hwa0-59qGtclbdEPh_yYfegFuJ4"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="size-20 rounded-full border-2 border-red-500 bg-red-500/20 animate-pulse flex items-center justify-center">
              <span className="material-symbols-outlined text-red-500 text-3xl">local_fire_department</span>
            </div>
          </div>
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-background-dark/80 backdrop-blur rounded text-[10px] font-mono text-primary">
            {mapCoords}
          </div>
        </div>
      )}
    </div>
  );
}
