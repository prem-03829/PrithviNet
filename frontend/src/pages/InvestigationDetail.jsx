import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { investigationService } from '../services/investigationService';
import Timeline from '../components/Timeline';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';

export default function InvestigationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    investigationService.getInvestigationDetail(id).then(res => {
      setData(res);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6 md:mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-primary hover:bg-opacity-10 rounded-lg text-slate-500 transition-colors shrink-0">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="min-w-0">
          <h2 className="text-xl md:text-2xl font-bold truncate">Investigation #{data.id}</h2>
          <p className="text-slate-500 text-xs md:text-sm truncate">{data.title}</p>
        </div>
        <div className="ml-auto flex gap-2 shrink-0">
          <Badge variant={data.status === 'In Progress' ? 'warning' : 'success'}>{data.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-6">
            <h3 className="text-lg font-bold border-b border-slate-200 dark:border-primary dark:border-opacity-10 pb-4">Incident Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                <p className="text-sm font-medium">{data.location}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Assigned Officer</p>
                <p className="text-sm font-medium">{data.officer}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Evidence Summary</p>
              <div className="p-4 bg-slate-50 dark:bg-primary dark:bg-opacity-5 rounded-lg border border-slate-100 dark:border-primary dark:border-opacity-10 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Satellite telemetry detected particulate matter spikes at 45% above safety threshold. High-resolution imagery confirms active stacks during unauthorized hours.
              </div>
            </div>
            <div className="flex flex-wrap gap-3 md:gap-4">
              <Button variant="primary" className="text-xs md:text-sm flex-1 sm:flex-none" onClick={() => alert("Closing case...")}>Close Case</Button>
              <Button variant="secondary" className="text-xs md:text-sm flex-1 sm:flex-none" onClick={() => alert("Generating citation...")}>Issue Citation</Button>
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-lg font-bold">Evidence Photos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-300 dark:border-primary dark:border-opacity-20">
                  <img src={`https://picsum.photos/seed/${i + 10}/400/300`} alt="Evidence" className="w-full h-full object-cover opacity-80" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">analytics</span>
              Activity Log
            </h3>
            <Timeline events={data.timeline} />
            <Button variant="outline" className="w-full mt-4 text-xs" onClick={() => alert("Log update logic here")}>Add Activity Note</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
