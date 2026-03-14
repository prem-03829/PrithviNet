import { useState, useRef } from 'react';
import { useUserStore } from '../store/useUserStore';
import { cn } from '../utils/cn';

export default function AvatarUpload() {
  const { user, updateAvatar } = useUserStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Force 1:1 crop or resize
          const size = Math.min(width, height);
          canvas.width = 400; // Standardize avatar size
          canvas.height = 400;

          const ctx = canvas.getContext('2d');
          // Draw image centered and cropped
          ctx.drawImage(
            img,
            (width - size) / 2, (height - size) / 2, size, size,
            0, 0, 400, 400
          );

          // If file > 1MB, reduce quality
          const quality = file.size > 1024 * 1024 ? 0.7 : 0.9;
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
      };
    });
  };

  const processFile = async (file) => {
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large (> 5MB)');
      return;
    }

    setError('');
    setIsLoading(true);
    setIsSuccess(false);

    try {
      const base64 = await compressImage(file);
      updateAvatar(base64);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      setError('Failed to process image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  return (
    <div className="flex flex-col items-center gap-6 pb-6 border-b border-border">
      <div className="relative group">
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          className={cn(
            "size-28 md:size-32 rounded-2xl border-4 overflow-hidden shadow-xl transition-all cursor-pointer relative",
            isDragging 
              ? "border-primary scale-105" 
              : "border-primary border-opacity-20 hover:border-opacity-100",
            isLoading && "opacity-50 cursor-wait"
          )}
          aria-label="Upload Avatar"
        >
          <img 
            src={user?.avatar} 
            alt="Avatar Preview" 
            className="w-full h-full object-cover" 
          />
          
          <div className={cn(
            "absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity",
            isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}>
            <span className="material-symbols-outlined text-white text-3xl">add_a_photo</span>
          </div>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
              <div className="size-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {isSuccess && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary bg-opacity-40 animate-in fade-in zoom-in duration-300">
              <span className="material-symbols-outlined text-white text-4xl">check_circle</span>
            </div>
          )}
        </div>

        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileSelect}
          accept="image/*"
          capture="user"
        />
      </div>

      <div className="text-center space-y-1">
        <div className="flex items-center gap-2 justify-center">
          <button 
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="text-xs font-black text-primary uppercase tracking-widest hover:underline"
          >
            Change Photo
          </button>
          <span className="text-text-muted text-[10px]">•</span>
          <span className="text-[10px] font-bold text-text-muted uppercase">Drag & Drop supported</span>
        </div>
        
        {error && (
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight animate-shake">
            {error}
          </p>
        )}
        {!error && !isSuccess && (
          <p className="text-[10px] text-text-muted font-medium">
            PNG, JPG or WEBP. Max 5MB.
          </p>
        )}
        {isSuccess && (
          <p className="text-[10px] font-bold text-primary uppercase tracking-tight">
            Profile photo updated!
          </p>
        )}
      </div>
    </div>
  );
}
