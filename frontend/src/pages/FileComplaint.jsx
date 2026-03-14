import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { useUserStore } from '../store/useUserStore';
import Button from '../components/Button';
import { complaintService } from '../services/complaintService';
import LocationPickerModal from '../components/LocationPickerModal';
import FileUploadZone from '../components/FileUploadZone';
import Dropdown from '../components/Dropdown';

export default function FileComplaint() {
  const navigate = useNavigate();
  const { addComplaint } = useAppStore();
  const { userLocation } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'Air Pollution (Smog/Smoke)',
    severity: 'Medium',
    title: '',
    location: 'Select location on map',
    coordinates: null,
    files: [],
    anonymous: false
  });

  const pollutionTypes = [
    'Air Pollution (Smog/Smoke)',
    'Water Pollution (Sewage/Chemicals)',
    'Noise Pollution (Construction/Loudspeakers)',
    'Waste Mismanagement (Illegal Dumping)',
    'Light Pollution'
  ];

  // Auto-fill user location only once if not already set
  useEffect(() => {
    if (userLocation && !formData.coordinates) {
      setFormData(prev => ({
        ...prev,
        location: userLocation.city,
        coordinates: { lat: userLocation.lat, lng: userLocation.lng }
      }));
    }
  }, [userLocation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert("Please provide a description.");
    if (!formData.coordinates) return alert("Please select a location.");
    
    setLoading(true);
    try {
      const res = await complaintService.submitComplaint(formData);
      addComplaint(res);
      navigate('/citizen/my-complaints');
    } catch (err) {
      alert("Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationConfirm = (loc) => {
    setFormData({
      ...formData,
      location: loc.address,
      coordinates: { lat: loc.lat, lng: loc.lng }
    });
  };

  const handleFilesChange = (files) => {
    setFormData({ ...formData, files });
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 md:mb-8">
        <h3 className="text-xl md:text-2xl font-bold mb-2">New Pollution Complaint</h3>
        <p className="text-xs md:text-sm text-slate-500 dark:text-primary dark:text-opacity-60">Report environmental violations in your neighborhood to help us take immediate action.</p>
      </div>
      
      <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <label className="text-[10px] md:text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-primary dark:text-opacity-70">Pollution Type</label>
            <Dropdown 
              options={pollutionTypes}
              value={formData.type}
              onChange={(val) => setFormData({...formData, type: val})}
              placeholder="Select category"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] md:text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-primary dark:text-opacity-70">Severity</label>
            <div className="flex gap-2">
              {['Low', 'Medium', 'High'].map(s => (
                <button 
                  key={s}
                  type="button"
                  onClick={() => setFormData({...formData, severity: s})}
                  className={`flex-1 py-2.5 md:py-3 rounded-lg border transition-all text-xs md:text-sm font-bold ${
                    formData.severity === s 
                      ? "border-primary bg-primary bg-opacity-20 text-primary border-2 shadow-sm" 
                      : "border-slate-200 dark:border-primary dark:border-opacity-20 text-slate-500 hover:bg-slate-100 dark:hover:bg-primary dark:hover:bg-opacity-10"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] md:text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-primary dark:text-opacity-70">Description</label>
          <textarea 
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="w-full rounded-lg bg-white dark:bg-primary dark:bg-opacity-5 border border-slate-200 dark:border-primary dark:border-opacity-20 focus:ring-primary focus:border-primary text-slate-900 dark:text-slate-100 py-3 outline-none p-3 md:p-4 text-sm" 
            placeholder="Incident details, source, and time..." 
            rows="4"
            required
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] md:text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-primary dark:text-opacity-70 block">Location</label>
          <div 
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border border-slate-200 dark:border-primary dark:border-opacity-20 bg-white dark:bg-primary dark:bg-opacity-5 hover:border-primary transition-all cursor-pointer group"
          >
            <div className="size-10 md:size-12 rounded-lg bg-primary bg-opacity-10 flex items-center justify-center group-hover:bg-primary group-hover:bg-opacity-20 transition-colors shrink-0">
              <span className="material-symbols-outlined text-primary">add_location_alt</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{formData.location}</p>
              <p className="text-[10px] md:text-xs text-slate-500">Tap to {formData.coordinates ? 'change' : 'select'} on map</p>
            </div>
            {formData.coordinates && (
              <span className="material-symbols-outlined text-primary animate-in zoom-in duration-300 shrink-0">check_circle</span>
            )}
          </div>
          
          {formData.coordinates && (
            <div className="h-32 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-primary dark:border-opacity-10 relative">
               <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9ugucbQ-2W9dTbDz1EY7X3nmMSiJi3hxFVfXqEjEyesBTbLvlCkkBs7ffgJGxc-TRUUTR3UiHMSgmD1ZNBdLgdvO0VjUszqRTcxvzhe89k3OzEwhHT_bXrN0kAxFjkXvYGieETaHu_N1shRquTTv8LNa_litSJnf6jPN93t97t66ZcVExEOnoYq2U5BgrHUhJzIQU44H0BcWGBCVRVS564OlcXunMNLGIVf4S_sRZrKEo3EA5ADJSWPITN2WwKWL5zU4rl-Z291Q" className="w-full h-full object-cover opacity-40 grayscale" alt="Map Preview" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-500">location_on</span>
               </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-primary dark:text-opacity-70">Evidence Photos/Videos</label>
          <FileUploadZone onFilesChange={handleFilesChange} />
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-primary dark:border-opacity-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <input 
              id="anon" 
              type="checkbox" 
              checked={formData.anonymous}
              onChange={e => setFormData({...formData, anonymous: e.target.checked})}
              className="rounded border-slate-300 dark:border-primary dark:border-opacity-30 text-primary focus:ring-primary bg-transparent" 
            />
            <label className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer" htmlFor="anon">Submit as anonymous report</label>
          </div>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 text-sm min-w-[180px]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-background-dark border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Submit Complaint</span>
                <span className="material-symbols-outlined">send</span>
              </>
            )}
          </Button>
        </div>
      </form>

      <LocationPickerModal 
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onConfirm={handleLocationConfirm}
      />
    </div>
  );
}
