import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import Card from '../components/Card';
import Button from '../components/Button';
import AvatarUpload from '../components/AvatarUpload';

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useUserStore();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    city: user?.city || '',
    phone: user?.phone || '',
    department: user?.department || '',
    badgeNumber: user?.badgeNumber || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    navigate(-1); // Go back to profile
  };

  const isCitizen = user?.role?.toLowerCase() === 'citizen';
  const isAuthority = user?.role?.toLowerCase().includes('authority') || user?.role?.toLowerCase().includes('inspector');
  const isAdmin = user?.role?.toLowerCase().includes('admin');

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 lg:p-12 max-w-3xl mx-auto w-full animate-in fade-in duration-500">
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-4">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span className="text-sm font-bold uppercase tracking-wider">Back to Profile</span>
        </button>
        <h2 className="text-3xl font-black tracking-tight text-text-primary">Edit Profile</h2>
        <p className="text-text-secondary mt-1">Update your account information and preferences.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <AvatarUpload />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Full Name</label>
              <input 
                required
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-border bg-panel focus:bg-surface focus:ring-2 focus:ring-primary focus:ring-opacity-20 outline-none transition-all text-sm font-medium"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Email Address</label>
              <input 
                required
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-border bg-panel focus:bg-surface focus:ring-2 focus:ring-primary focus:ring-opacity-20 outline-none transition-all text-sm font-medium"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {(isAuthority || isAdmin) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Department</label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-panel focus:bg-surface focus:ring-2 focus:ring-primary focus:ring-opacity-20 outline-none transition-all text-sm font-medium"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Environmental Protection"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Official ID / Badge</label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-panel focus:bg-surface focus:ring-2 focus:ring-primary focus:ring-opacity-20 outline-none transition-all text-sm font-medium"
                  value={formData.badgeNumber}
                  onChange={(e) => setFormData({ ...formData, badgeNumber: e.target.value })}
                  placeholder="e.g. #4492"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">City / Region</label>
            <input 
              required
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-border bg-panel focus:bg-surface focus:ring-2 focus:ring-primary focus:ring-opacity-20 outline-none transition-all text-sm font-medium"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <Button variant="ghost" type="button" className="flex-1" onClick={() => navigate(-1)}>Cancel</Button>
            <Button variant="primary" type="submit" className="flex-1">Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
