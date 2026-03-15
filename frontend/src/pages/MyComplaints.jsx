import React, { useState } from 'react';
import { useSystemStore } from '../store/systemStore';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';

export default function MyComplaints() {
  // 1. Get reactive state and actions
  const { complaints, currentUser, resolveComplaint } = useSystemStore();
  const [processingId, setProcessingId] = useState(null);

  // 2. Role-based filtering (Citizen only sees their own)
  const myData = (complaints || []).filter(c => c.reported_by === currentUser?.id);

  const handleAction = async (id) => {
    setProcessingId(id);
    await resolveComplaint(id);
    setProcessingId(null);
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black text-text-primary uppercase tracking-tight italic">Incident History</h2>
          <p className="text-text-secondary mt-1">Track and manage your environmental reports.</p>
        </div>
      </div>
      
      <div className="grid gap-4">
        {myData.length > 0 ? myData.map(complaint => (
          <Card key={complaint.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-primary">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-primary font-mono">{complaint.id}</span>
                <Badge variant={complaint.status === 'Resolved' ? 'success' : 'warning'}>
                  {complaint.status}
                </Badge>
              </div>
              <h4 className="font-bold text-text-primary text-lg tracking-tight uppercase">{complaint.title}</h4>
              <p className="text-sm text-text-secondary leading-relaxed">{complaint.description}</p>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-2">Created: {new Date(complaint.created_at).toLocaleDateString()}</p>
            </div>
            
            {complaint.status !== 'Resolved' && (
              <Button 
                variant="outline" 
                onClick={() => handleAction(complaint.id)}
                disabled={processingId === complaint.id}
                className="!rounded-none uppercase font-black tracking-widest text-[10px] py-3 px-6"
              >
                {processingId === complaint.id ? 'Updating...' : 'Mark Resolved'}
              </Button>
            )}
          </Card>
        )) : (
          <div className="py-20 text-center bg-panel/30 border border-dashed border-border">
            <span className="material-symbols-outlined text-4xl text-text-muted mb-2">history</span>
            <p className="text-text-secondary font-medium uppercase tracking-widest text-xs">No incidents reported yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
