import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { MapPin } from 'lucide-react';
import type { AreaProfile } from '../types';

interface AreaProfileCardProps {
  profile: AreaProfile | null;
  loading: boolean;
}

const AreaProfileCard: React.FC<AreaProfileCardProps> = ({ profile, loading }) => {
  if (loading) {
    return (
      <div className="card p-6">
        <div className="h-5 w-28 bg-slate-100 dark:bg-slate-800 rounded animate-pulse mb-5" />
        <div className="h-56 bg-slate-50 dark:bg-slate-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-primary dark:text-white">区域画像</h2>
        </div>
        <div className="text-center py-14 text-slate-400 dark:text-slate-500">
          <p className="text-sm">生成推荐后查看区域画像</p>
        </div>
      </div>
    );
  }

  const data = [
    { subject: '生活便利', value: profile.convenience, fullMark: 100 },
    { subject: '年轻人比例', value: profile.youngPeopleRatio, fullMark: 100 },
    { subject: '商业成熟', value: profile.businessMaturity, fullMark: 100 },
    { subject: '居住舒适', value: profile.comfort, fullMark: 100 },
    { subject: '通勤便利', value: profile.commuteScore, fullMark: 100 },
  ];

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-primary dark:text-white">区域画像</h2>
        </div>
        <span className="tag-primary">
          {profile.industry}
        </span>
      </div>

      <div className="flex flex-col items-center">
        <h3 className="text-base font-bold text-primary dark:text-white mb-4">
          {profile.name}
        </h3>
        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
              <PolarGrid stroke="#e2e8f0" strokeWidth={0.5} />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name={profile.name}
                dataKey="value"
                stroke="#1a1a2e"
                fill="#1a1a2e"
                fillOpacity={0.08}
                strokeWidth={1.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AreaProfileCard;
