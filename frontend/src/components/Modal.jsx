import { cn } from '../utils/cn';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 md:p-4">
      <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-border flex items-center justify-between bg-panel bg-opacity-50">
          <h3 className="text-base md:text-lg font-bold text-text-primary">{title}</h3>
          <button onClick={onClose} className="p-1.5 text-text-secondary hover:text-primary transition-colors rounded-lg hover:bg-panel">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-4 md:p-6 overflow-y-auto max-h-[85vh] custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
