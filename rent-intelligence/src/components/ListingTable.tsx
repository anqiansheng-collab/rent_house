import React, { useMemo } from 'react';
import { Table, Clock, Shield, Image, User, Repeat, AlertTriangle, ExternalLink } from 'lucide-react';
import type { Listing } from '../types';
import ScoreBadge from './ScoreBadge';

interface ListingTableProps {
  listings: Listing[];
  loading: boolean;
}

const ListingTable: React.FC<ListingTableProps> = ({ listings, loading }) => {
  const sortedListings = useMemo(() => {
    return [...listings].sort((a, b) => b.credibilityScore - a.credibilityScore);
  }, [listings]);

  if (loading) {
    return (
      <div className="card p-6">
        <div className="h-5 w-28 bg-slate-100 dark:bg-slate-800 rounded animate-pulse mb-5" />
        <div className="space-y-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-slate-50 dark:bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (sortedListings.length === 0) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Table className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-primary dark:text-white">房源列表</h2>
        </div>
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <p className="text-sm">生成推荐后查看房源信息</p>
        </div>
      </div>
    );
  }

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      '链家': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      '贝壳': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      '豆瓣': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      '闲鱼': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      '58同城': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    };
    return colors[source] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Table className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-primary dark:text-white">房源列表</h2>
        </div>
        <span className="text-[11px] text-slate-400">
          共 {sortedListings.length} 套 · 按可信度排序
        </span>
      </div>

      <div className="overflow-x-auto -mx-2">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="text-left py-2.5 px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">房源</th>
              <th className="text-left py-2.5 px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">价格</th>
              <th className="text-left py-2.5 px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">户型</th>
              <th className="text-left py-2.5 px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">类型</th>
              <th className="text-left py-2.5 px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">来源</th>
              <th className="text-left py-2.5 px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">发布</th>
              <th className="text-left py-2.5 px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">标签</th>
              <th className="text-left py-2.5 px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">可信度</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {sortedListings.map((listing) => (
              <tr
                key={listing.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="py-2.5 px-2">
                  <a
                    href={listing.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1 text-xs font-medium text-primary dark:text-white truncate max-w-[180px] hover:text-primary/80 dark:hover:text-primary/80 transition-colors"
                    title={listing.title}
                  >
                    <span className="truncate">{listing.title}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </a>
                </td>
                <td className="py-2.5 px-2">
                  <span className="text-xs font-bold text-primary">
                    ¥{listing.price}
                  </span>
                </td>
                <td className="py-2.5 px-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {listing.layout}
                  </span>
                </td>
                <td className="py-2.5 px-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    listing.rentType === '整租'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {listing.rentType}
                  </span>
                </td>
                <td className="py-2.5 px-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getSourceColor(listing.source)}`}>
                    {listing.source}
                  </span>
                </td>
                <td className="py-2.5 px-2">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    {listing.publishDays}天前
                  </div>
                </td>
                <td className="py-2.5 px-2">
                  <div className="flex gap-1">
                    {listing.isDirectLandlord && (
                      <span title="房东直租">
                        <User className="w-3 h-3 text-emerald-500" />
                      </span>
                    )}
                    {listing.hasRealPhotos && (
                      <span title="真实照片">
                        <Image className="w-3 h-3 text-blue-500" />
                      </span>
                    )}
                    {listing.isRepeated && (
                      <span title="重复房源">
                        <Repeat className="w-3 h-3 text-amber-500" />
                      </span>
                    )}
                    {listing.isSublease && (
                      <span title="转租">
                        <AlertTriangle className="w-3 h-3 text-rose-500" />
                      </span>
                    )}
                    {listing.hasAgentKeywords && (
                      <span title="中介关键词">
                        <Shield className="w-3 h-3 text-slate-400" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2.5 px-2">
                  <ScoreBadge score={listing.credibilityScore} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListingTable;
