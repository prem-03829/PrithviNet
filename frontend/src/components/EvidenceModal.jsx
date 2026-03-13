import Modal from './Modal';
import Badge from './Badge';

export default function EvidenceModal({ isOpen, onClose, files = [] }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Evidence Details">
      <div className="space-y-6">
        {files.length === 0 ? (
          <div className="text-center py-10">
            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">draft</span>
            <p className="text-slate-500">No evidence files attached to this complaint.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {files.map((file, idx) => {
              const isImage = file.type?.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(file.name);
              const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);

              return (
                <div key={idx} className="group relative bg-slate-50 dark:bg-primary dark:bg-opacity-5 border border-slate-200 dark:border-primary dark:border-opacity-10 rounded-xl overflow-hidden hover:border-primary transition-all">
                  {isImage ? (
                    <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800">
                      {/* Using a placeholder if it's a real File object without a URL, or assuming it has a preview property */}
                      <img 
                        src={file.preview || `https://picsum.photos/seed/${idx + 50}/400/300`} 
                        alt={file.name} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                      <span className="material-symbols-outlined text-4xl text-primary">
                        {isPdf ? 'picture_as_pdf' : 'description'}
                      </span>
                    </div>
                  )}
                  <div className="p-3 border-t border-slate-200 dark:border-primary dark:border-opacity-10">
                    <p className="text-xs font-bold truncate mb-1">{file.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 uppercase font-medium">
                        {isImage ? 'Image' : isPdf ? 'PDF Document' : 'Document'}
                      </span>
                      <button className="text-primary text-[10px] font-bold hover:underline">Download</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
