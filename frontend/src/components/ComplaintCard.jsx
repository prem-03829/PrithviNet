import Badge from './Badge';

export default function ComplaintCard({ data }) {
  return (
    <div className="p-6 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-primary dark:border-opacity-5 rounded-xl flex justify-between items-center group cursor-pointer hover:border-primary hover:border-opacity-40 transition-all">
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase">{data.id}</p>
        <p className="text-slate-900 dark:text-slate-100 font-bold">{data.title}</p>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{data.status} • {data.date}</p>
      </div>
      <span className="material-symbols-outlined text-primary text-opacity-40 group-hover:text-primary transition-colors">chevron_right</span>
    </div>
  );
}
