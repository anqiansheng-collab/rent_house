import React from 'react';
import { Trophy, Check, MapPin } from 'lucide-react';
import type { Recommendation } from '../types';

interface RecommendationPanelProps {
  recommendations: Recommendation[];
  loading: boolean;
}

const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  recommendations,
  loading,
}) => {
  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Trophy className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-primary dark:text-white">区域推荐</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-slate-50 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Trophy className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-primary dark:text-white">区域推荐</h2>
        </div>
        <div className="text-center py-16 text-slate-400 dark:text-slate-500">
          <MapPin className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">点击左侧「生成推荐」获取区域建议</p>
        </div>
      </div>
    );
  }

  const getRankStyle = (index: number) => {
    if (index === 0)
      return 'bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30';
    if (index === 1)
      return 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700';
    if (index === 2)
      return 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700';
    return 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700';
  };

  const getRankNumber = (index: number) => {
    return (
      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
        index === 0
          ? 'bg-primary text-white'
          : index === 1
          ? 'bg-slate-300 dark:bg-slate-600 text-white'
          : index === 2
          ? 'bg-slate-300 dark:bg-slate-600 text-white'
          : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
      }`}>
        {index + 1}
      </span>
    );
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Trophy className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-primary dark:text-white">区域推荐</h2>
      </div>

      <div className="space-y-2.5">
        {recommendations.map((rec, index) => (
          <div
            key={rec.areaName}
            className={`rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${getRankStyle(index)}`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-3">
                {getRankNumber(index)}
                <h3 className="text-base font-bold text-primary dark:text-white">
                  {rec.areaName}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-1000"
                    style={{ width: `${rec.matchScore}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-primary dark:text-white min-w-[36px] text-right">
                  {rec.matchScore}%
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 ml-9">
              {rec.reasons.map((reason) => (
                <span
                  key={reason}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-900/40 px-2 py-0.5 rounded-md"
                >
                  <Check className="w-3 h-3 text-emerald-500" />
                  {reason}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationPanel;
