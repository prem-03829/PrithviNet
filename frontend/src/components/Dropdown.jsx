import { useState, useRef, useEffect } from 'react';
import { cn } from '../utils/cn';

export default function Dropdown({ options, value, onChange, placeholder = "Select an option" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value || opt === value);
  const displayValue = typeof selectedOption === 'object' ? selectedOption.label : selectedOption;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-lg bg-white dark:bg-primary dark:bg-opacity-5 border border-slate-200 dark:border-primary dark:border-opacity-20 px-4 py-3 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
      >
        <span className={cn(!value && "text-slate-400")}>{displayValue || placeholder}</span>
        <span className={cn("material-symbols-outlined transition-transform duration-200", isOpen && "rotate-180")}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-[120] mt-2 w-full bg-white dark:bg-background-dark border border-slate-200 dark:border-primary dark:border-opacity-20 rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((opt, idx) => {
              const val = typeof opt === 'object' ? opt.value : opt;
              const label = typeof opt === 'object' ? opt.label : opt;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    onChange(val);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "px-4 py-3.5 text-sm cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-primary dark:hover:bg-opacity-10",
                    val === value ? "text-primary font-bold bg-primary bg-opacity-5" : "text-slate-600 dark:text-slate-300"
                  )}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
