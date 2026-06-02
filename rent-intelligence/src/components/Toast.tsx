import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'error' | 'success';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border ${
          type === 'error'
            ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
        }`}
      >
        {type === 'error' ? (
          <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
        ) : (
          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
        )}
        <span className="text-xs font-medium text-primary dark:text-white">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
