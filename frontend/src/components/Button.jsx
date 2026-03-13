import { cn } from '../utils/cn';

export default function Button({ children, className, variant = 'primary', ...props }) {
  const baseStyle = "flex items-center justify-center gap-2 rounded-lg font-bold transition-all disabled:opacity-50";
  const variants = {
    primary: "bg-primary text-background-dark hover:bg-primary hover:bg-opacity-90 py-2.5 px-6 shadow-lg shadow-primary",
    secondary: "bg-panel text-text-primary hover:bg-slate-200 dark:hover:bg-primary dark:hover:bg-opacity-20 py-2.5 px-6",
    outline: "border-2 border-border text-text-secondary hover:border-primary py-2.5 px-6",
    ghost: "bg-transparent hover:bg-primary hover:bg-opacity-10 text-text-secondary hover:text-primary p-2"
  };

  return (
    <button className={cn(baseStyle, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
