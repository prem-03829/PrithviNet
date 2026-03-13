import { cn } from '../utils/cn';

export default function Card({ children, className, ...props }) {
  return (
    <div className={cn("p-6 rounded-xl border border-border bg-surface", className)} {...props}>
      {children}
    </div>
  );
}
