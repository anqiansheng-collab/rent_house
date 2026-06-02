import React from 'react';

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let label = '';
  let colorClass = '';

  if (score >= 80) {
    label = '高';
    colorClass = 'bg-primary/10 text-primary';
  } else if (score >= 60) {
    label = '中';
    colorClass = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
  } else {
    label = '低';
    colorClass = 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${colorClass}`}
    >
      {label}
    </span>
  );
};

export default ScoreBadge;
