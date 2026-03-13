import { cn } from '../utils/cn';

export default function Timeline({ events }) {
  return (
    <div className="relative space-y-0">
      {events.map((event, idx) => (
        <div key={idx} className={cn("relative pl-10", idx !== events.length - 1 ? "pb-10" : "pb-4")}>
          {idx !== events.length - 1 && (
            <div className="absolute left-[11px] top-0 bottom-0 w-[2px] bg-slate-200 dark:bg-primary dark:bg-opacity-10"></div>
          )}
          
          <div className={cn(
            "absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center",
            event.isLatest 
              ? "bg-primary text-background-dark ring-4 ring-primary ring-opacity-20" 
              : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-primary"
          )}>
            <span className="material-symbols-outlined text-sm font-bold">{event.icon}</span>
          </div>
          
          <div className="flex flex-col">
            {event.isLatest && <span className="text-primary text-xs font-bold uppercase tracking-wider">Latest Update</span>}
            <p className="text-slate-900 dark:text-slate-100 font-bold text-base mt-1">{event.title}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{event.description}</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">{event.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
