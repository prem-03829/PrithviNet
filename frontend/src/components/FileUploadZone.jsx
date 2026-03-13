import { useState, useRef } from 'react';
import { cn } from '../utils/cn';

export default function FileUploadZone({ onFilesChange }) {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState({});
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const simulateUpload = (fileName) => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 30;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
      }
      setProgress(prev => ({ ...prev, [fileName]: current }));
    }, 200);
  };

  const processFiles = (newFiles) => {
    const fileList = Array.from(newFiles);
    const updatedFiles = [...files, ...fileList];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    
    fileList.forEach(file => {
      simulateUpload(file.name);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e) => {
    processFiles(e.target.files);
  };

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange(updated);
  };

  return (
    <div className="space-y-4">
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer",
          isDragging 
            ? "border-primary bg-primary bg-opacity-10" 
            : "border-slate-300 dark:border-primary dark:border-opacity-30 bg-slate-50 dark:bg-primary dark:bg-opacity-5 hover:bg-slate-100 dark:hover:bg-primary dark:hover:bg-opacity-10 hover:border-primary"
        )}
      >
        <input 
          type="file" 
          multiple 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx"
        />
        <span className={cn(
          "material-symbols-outlined text-4xl mb-3 transition-colors",
          isDragging ? "text-primary" : "text-slate-400 dark:text-primary dark:text-opacity-60"
        )}>cloud_upload</span>
        <p className="text-sm font-medium">Drag and drop images or click to browse</p>
        <p className="text-xs text-slate-400 mt-1">PNG, JPG, PDF up to 25MB</p>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {files.map((file, idx) => (
            <div key={idx} className="p-3 bg-white dark:bg-primary dark:bg-opacity-5 border border-slate-200 dark:border-primary dark:border-opacity-10 rounded-lg flex items-center gap-3">
              <div className="w-10 h-10 bg-primary bg-opacity-10 rounded flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-xl">
                  {file.type.startsWith('image/') ? 'image' : 'description'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">{file.name}</p>
                <div className="mt-1 h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300" 
                    style={{ width: `${progress[file.name] || 0}%` }}
                  />
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                className="p-1 hover:text-red-500 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
