import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm z-40 flex items-center justify-center animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 shadow-xl flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-primary dark:text-white">
            正在分析最佳居住区域
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            综合考虑城市匹配、预算、通勤等因素
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
