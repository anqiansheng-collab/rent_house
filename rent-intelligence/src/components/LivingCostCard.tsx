import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChartIcon } from 'lucide-react';
import type { LivingCost } from '../types';

interface LivingCostCardProps {
  livingCost: LivingCost | null;
  loading: boolean;
}

const COLORS = ['#1a1a2e', '#4a4a6a', '#8a8aaa', '#c0c0d0'];

const LivingCostCard: React.FC<LivingCostCardProps> = ({ livingCost, loading }) => {
  if (loading) {
    return (
      <div className="card p-6">
        <div className="h-5 w-28 bg-slate-100 dark:bg-slate-800 rounded animate-pulse mb-5" />
        <div className="h-56 bg-slate-50 dark:bg-slate-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!livingCost) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <PieChartIcon className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-primary dark:text-white">生活成本</h2>
        </div>
        <div className="text-center py-14 text-slate-400 dark:text-slate-500">
          <p className="text-sm">生成推荐后查看生活成本</p>
        </div>
      </div>
    );
  }

  const data = [
    { name: '房租', value: livingCost.rent },
    { name: '餐饮', value: livingCost.food },
    { name: '交通', value: livingCost.transport },
    { name: '娱乐', value: livingCost.entertainment },
  ];

  const total = livingCost.total;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <PieChartIcon className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-primary dark:text-white">生活成本</h2>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">总月支出</p>
          <p className="text-lg font-bold text-primary dark:text-white">
            ¥{total.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-5">
        <div className="w-full md:w-1/2 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: unknown) => [`¥${value}`, '']}
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full md:w-1/2 space-y-2.5">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-primary dark:text-white">
                  ¥{item.value}
                </span>
                <span className="text-[10px] text-slate-400">
                  {((item.value / total) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LivingCostCard;
