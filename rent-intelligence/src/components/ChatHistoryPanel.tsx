import React from 'react';
import { X, Trash2, Download, Clock, MapPin, Wallet, History, RotateCcw } from 'lucide-react';
import type { ChatHistory } from '../types';

interface ChatHistoryPanelProps {
  history: ChatHistory[];
  onClose: () => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onExport: () => void;
  onLoad: (history: ChatHistory) => void;
}

const ChatHistoryPanel: React.FC<ChatHistoryPanelProps> = ({
  history,
  onClose,
  onDelete,
  onClear,
  onExport,
  onLoad,
}) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <History className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-primary dark:text-white">历史记录</h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full">
              {history.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Actions */}
        {history.length > 0 && (
          <div className="flex gap-2 p-3 border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
            >
              <Download className="w-3 h-3" />
              导出 JSON
            </button>
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors ml-auto"
            >
              <Trash2 className="w-3 h-3" />
              清空
            </button>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {history.length === 0 ? (
            <div className="text-center py-14 text-slate-400 dark:text-slate-500">
              <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">暂无历史记录</p>
              <p className="text-[10px] mt-1">生成推荐后会自动保存</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="group rounded-xl border border-slate-100 dark:border-slate-800 p-3 hover:border-primary/20 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(item.timestamp)}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-full">
                        {formatDuration(item.duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.preference.workLocation}
                      </span>
                      <span className="flex items-center gap-1">
                        <Wallet className="w-3 h-3" />
                        ¥{item.preference.budget}
                      </span>
                      <span>{item.preference.rentType}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {item.recommendations.slice(0, 3).map((rec, i) => (
                        <span
                          key={rec.areaName}
                          className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                            i === 0
                              ? 'bg-primary/10 text-primary'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {rec.areaName}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 ml-2">
                    <button
                      onClick={() => onLoad(item)}
                      className="p-1.5 text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      title="加载此记录"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistoryPanel;
