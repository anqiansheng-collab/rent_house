import React from 'react';
import { Banknote, TrendingUp, TrendingDown } from 'lucide-react';
import type { RentStats } from '../types';

interface RentStatsCardProps {
  rentStats: RentStats | null;
  rentType: '整租' | '合租';
  loading: boolean;
}

const RentStatsCard: React.FC<RentStatsCardProps> = ({ rentStats, rentType, loading }) => {
  if (loading) {
    return (
      <div className="card p-6">
        <div className="h-5 w-28 bg-slate-100 dark:bg-slate-800 rounded animate-pulse mb-5" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-50 dark:bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!rentStats) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Banknote className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-primary dark:text-white">租金分析</h2>
        </div>
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <p className="text-sm">生成推荐后查看租金分析</p>
        </div>
      </div>
    );
  }

  const stats = rentType === '整租'
    ? [
        { label: '整租均价', value: rentStats.wholeRentAvg, icon: Banknote, color: 'text-primary', bg: 'bg-primary/5 dark:bg-primary/10' },
        { label: '最低价', value: rentStats.wholeRentMin, icon: TrendingDown, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800/50' },
        { label: '最高价', value: rentStats.wholeRentMax, icon: TrendingUp, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800/50' },
      ]
    : [
        { label: '合租均价', value: rentStats.sharedRentAvg, icon: Banknote, color: 'text-primary', bg: 'bg-primary/5 dark:bg-primary/10' },
        { label: '最低价', value: rentStats.sharedRentMin, icon: TrendingDown, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800/50' },
        { label: '最高价', value: rentStats.sharedRentMax, icon: TrendingUp, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800/50' },
      ];

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Banknote className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-primary dark:text-white">租金分析</h2>
        </div>
        <span className="tag-primary">
          {rentType}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} rounded-xl p-4 transition-transform duration-200 hover:scale-[1.02]`}
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{stat.label}</span>
            </div>
            <p className={`text-xl font-bold ${stat.color}`}>
              ¥{stat.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RentStatsCard;
