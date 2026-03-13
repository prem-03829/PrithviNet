import { cn } from '../utils/cn';

export default function AiChatUi({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-8 space-y-8 w-full">
      {messages.map((msg, idx) => (
        <div key={idx} className={cn("flex items-start gap-4 animate-in fade-in duration-500", msg.role === 'user' ? "flex-row-reverse" : "")}>
          <div className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center shrink-0 border overflow-hidden",
            msg.role === 'user' 
              ? "bg-slate-200 dark:bg-primary dark:bg-opacity-20 border-slate-300 dark:border-primary dark:border-opacity-10" 
              : "bg-primary bg-opacity-20 text-primary border-primary border-opacity-30"
          )}>
            {msg.role === 'ai' ? <span className="material-symbols-outlined text-sm">robot_2</span> : <span className="material-symbols-outlined text-sm">person</span>}
          </div>
          <div className={cn("space-y-2 flex flex-col", msg.role === 'user' ? "items-end" : "")}>
            <p className={cn("text-xs font-medium text-slate-500 dark:text-primary dark:text-opacity-60 uppercase tracking-wider", msg.role === 'user' ? "mr-1" : "ml-1")}>
              {msg.role === 'user' ? 'Operator' : 'Prithvi AI'}
            </p>
            <div className={cn(
              "p-4 rounded-xl shadow-sm max-w-xl",
              msg.role === 'user' 
                ? "bg-primary text-background-dark rounded-tr-none" 
                : "bg-white dark:bg-primary dark:bg-opacity-5 border border-slate-200 dark:border-primary dark:border-opacity-20 rounded-tl-none"
            )}>
              <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
              {msg.widget && <div className="mt-4">{msg.widget}</div>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
