import React from 'react';
import { Home, Wallet, Users, Sparkles, Brain, History } from 'lucide-react';
import type { UserPreference, PreferenceOption } from '../types';
import { WORK_LOCATIONS, PREFERENCE_OPTIONS } from '../data/mockData';

interface SidebarProps {
  preference: UserPreference;
  onPreferenceChange: (pref: UserPreference) => void;
  onGenerate: () => void;
  loading: boolean;
  useAI?: boolean;
  onToggleAI?: () => void;
  onShowHistory?: () => void;
  historyCount?: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  preference,
  onPreferenceChange,
  onGenerate,
  loading,
  useAI = false,
  onToggleAI,
  onShowHistory,
  historyCount = 0,
}) => {
  const handleWorkLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPreferenceChange({ ...preference, workLocation: e.target.value });
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPreferenceChange({ ...preference, budget: Number(e.target.value) });
  };

  const handleRentTypeChange = (type: '整租' | '合租') => {
    onPreferenceChange({ ...preference, rentType: type });
  };

  const handlePreferenceToggle = (pref: PreferenceOption) => {
    const newPreferences = preference.preferences.includes(pref)
      ? preference.preferences.filter((p) => p !== pref)
      : [...preference.preferences, pref];
    onPreferenceChange({ ...preference, preferences: newPreferences });
  };

  return (
    <aside className="w-full lg:w-[320px] bg-white dark:bg-[#1e1e2f] border-r border-slate-100 dark:border-slate-800 flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary dark:text-white tracking-tight">
              AI租房决策助手
            </h1>
          </div>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 ml-12">
          帮你找到更适合居住的区域
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 space-y-7">
        {/* 工作地点 */}
        <div className="space-y-2.5">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            工作地点
          </label>
          <select
            value={preference.workLocation}
            onChange={handleWorkLocationChange}
            disabled={loading}
            className="input"
          >
            {WORK_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* 预算 */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <Wallet className="w-3.5 h-3.5" />
              预算
            </label>
            <span className="text-sm font-bold text-primary dark:text-white">
              ¥{preference.budget.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={1000}
            max={8000}
            step={100}
            value={preference.budget}
            onChange={handleBudgetChange}
            disabled={loading}
            className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-primary disabled:opacity-50"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>¥1,000</span>
            <span>¥8,000</span>
          </div>
        </div>

        {/* 租房方式 */}
        <div className="space-y-2.5">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            租房方式
          </label>
          <div className="flex gap-2">
            {(['整租', '合租'] as const).map((type) => (
              <button
                key={type}
                onClick={() => handleRentTypeChange(type)}
                disabled={loading}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 ${
                  preference.rentType === type
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 居住偏好 */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            居住偏好
          </label>
          <div className="flex flex-wrap gap-2">
            {PREFERENCE_OPTIONS.map((pref) => (
              <button
                key={pref}
                onClick={() => handlePreferenceToggle(pref as PreferenceOption)}
                disabled={loading}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 disabled:opacity-50 ${
                  preference.preferences.includes(pref as PreferenceOption)
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700'
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-6 space-y-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={onToggleAI}
          disabled={loading}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 ${
            useAI
              ? 'bg-accent/10 text-accent border border-accent/20'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          {useAI ? 'AI 增强已开启' : '开启 AI 增强'}
        </button>

        <button
          onClick={onGenerate}
          disabled={loading}
          className="w-full py-3 px-4 bg-primary hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-primary/20 active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              生成中...
            </span>
          ) : (
            useAI ? 'AI 智能推荐' : '生成推荐'
          )}
        </button>

        {onShowHistory && (
          <button
            onClick={onShowHistory}
            className="w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 border border-slate-100 dark:border-slate-700"
          >
            <History className="w-3.5 h-3.5" />
            历史记录
            {historyCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">
                {historyCount}
              </span>
            )}
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
