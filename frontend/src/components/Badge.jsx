import { cn } from '../utils/cn';

export default function Badge({ children, variant = 'primary', className }) {
  const variants = {
    primary: "bg-primary bg-opacity-20 text-primary border border-primary border-opacity-30",
    danger: "bg-red-500/20 text-red-500 border border-red-500/30",
    warning: "bg-orange-500/20 text-orange-500 border border-orange-500/30",
    success: "bg-green-500/20 text-green-500 border border-green-500/30",
    neutral: "bg-slate-500/20 text-slate-500 dark:text-slate-300 border border-slate-500/30",
  };
  return (
    <span className={cn("px-2 py-1 rounded text-xs font-bold uppercase tracking-wider", variants[variant], className)}>
      {children}
    </span>
  );
}
