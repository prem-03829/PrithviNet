import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';

export default function DummyPage({ title }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAiClick = () => {
    const aiPath = location.pathname.startsWith('/admin') ? '/admin/ai' : '/citizen/ai-assistant';
    navigate(aiPath);
  };

  return (
    <div className="p-8 flex items-center justify-center h-full">
      <div className="text-center max-w-md">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-slate-500 mb-8">This module is currently under development. Our team is working hard to bring you the best experience.</p>
        
        <div className="p-6 rounded-xl bg-primary bg-opacity-5 border border-primary border-opacity-10 text-left space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <span className="material-symbols-outlined">auto_awesome</span>
            <h3 className="font-bold">Try Prithvi AI instead?</h3>
          </div>
          <p className="text-sm text-slate-400">While this page is being built, you can ask our AI assistant for environmental insights or geospatial analysis.</p>
          <Button variant="primary" className="w-full" onClick={handleAiClick}>
            Open AI Assistant
          </Button>
        </div>
      </div>
    </div>
  );
}
