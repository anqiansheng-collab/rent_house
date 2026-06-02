import { useState, useCallback, useMemo, useEffect } from 'react';
import type { UserPreference, Recommendation, AreaData, ChatHistory } from './types';
import { mockAreaData } from './data/mockData';
import { generateRecommendations, generateHybridRecommendations } from './utils/recommendationEngine';
import Sidebar from './components/Sidebar';
import RecommendationPanel from './components/RecommendationPanel';
import AreaProfileCard from './components/AreaProfileCard';
import RentStatsCard from './components/RentStatsCard';
import LivingCostCard from './components/LivingCostCard';
import ListingTable from './components/ListingTable';
import TestPanel from './components/TestPanel';
import Toast from './components/Toast';
import ChatHistoryPanel from './components/ChatHistoryPanel';
import LoadingOverlay from './components/LoadingOverlay';

const STORAGE_KEY = 'rent-intelligence-chat-history';

function App() {
  const [preference, setPreference] = useState<UserPreference>({
    workLocation: '南京河西',
    budget: 3500,
    rentType: '整租',
    preferences: [],
  });

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // 加载历史对话
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setChatHistory(parsed);
      } catch {
        console.error('加载历史对话失败');
      }
    }
  }, []);

  // 保存历史对话
  const saveChatHistory = useCallback((history: ChatHistory[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    setChatHistory(history);
  }, []);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setHasGenerated(true);
    
    const startTime = Date.now();
    let success = false;
    let recs: Recommendation[] = [];
    
    try {
      if (useAI) {
        recs = await generateHybridRecommendations(preference, true);
      } else {
        recs = generateRecommendations(preference);
      }
      setRecommendations(recs);
      success = true;
    } catch (error) {
      console.error('生成推荐失败:', error);
      setToast({ message: '生成失败，请稍后重试', type: 'error' });
      // 使用本地算法作为 fallback
      try {
        recs = generateRecommendations(preference);
        setRecommendations(recs);
        success = true;
      } catch (fallbackError) {
        console.error('Fallback 也失败了:', fallbackError);
      }
    } finally {
      setLoading(false);
      
      // 保存对话记录
      if (success && recs.length > 0) {
        const newChat: ChatHistory = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          preference: { ...preference },
          recommendations: recs,
          duration: Date.now() - startTime,
        };
        const updatedHistory = [newChat, ...chatHistory].slice(0, 50); // 最多保存50条
        saveChatHistory(updatedHistory);
      }
    }
  }, [preference, useAI, chatHistory, saveChatHistory]);

  const handleDeleteHistory = useCallback((id: string) => {
    const updated = chatHistory.filter((h) => h.id !== id);
    saveChatHistory(updated);
  }, [chatHistory, saveChatHistory]);

  const handleClearHistory = useCallback(() => {
    saveChatHistory([]);
  }, [saveChatHistory]);

  const handleExportHistory = useCallback(() => {
    const dataStr = JSON.stringify(chatHistory, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rent-intelligence-history-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setToast({ message: '历史记录已导出', type: 'success' });
  }, [chatHistory]);

  const handleLoadHistory = useCallback((history: ChatHistory) => {
    setPreference(history.preference);
    setRecommendations(history.recommendations);
    setHasGenerated(true);
    setShowHistory(false);
  }, []);

  const selectedAreaData: AreaData | null = useMemo(() => {
    if (!hasGenerated || recommendations.length === 0) return null;
    const topArea = recommendations[0].areaName;
    return mockAreaData[topArea] || null;
  }, [hasGenerated, recommendations]);

  const allListings = useMemo(() => {
    if (!hasGenerated) return [];
    return recommendations.flatMap((rec) => mockAreaData[rec.areaName]?.listings || []);
  }, [hasGenerated, recommendations]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      <Sidebar
        preference={preference}
        onPreferenceChange={setPreference}
        onGenerate={handleGenerate}
        loading={loading}
        useAI={useAI}
        onToggleAI={() => setUseAI(!useAI)}
        onShowHistory={() => setShowHistory(true)}
        historyCount={chatHistory.length}
      />

      <main className="flex-1 lg:w-[70%] p-4 lg:p-8 overflow-y-auto relative">
        <div className="max-w-6xl mx-auto space-y-6">
          <RecommendationPanel recommendations={recommendations} loading={loading} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AreaProfileCard
              profile={selectedAreaData?.profile || null}
              loading={loading}
            />
            <LivingCostCard
              livingCost={selectedAreaData?.livingCost || null}
              loading={loading}
            />
          </div>

          <RentStatsCard
            rentStats={selectedAreaData?.rentStats || null}
            rentType={preference.rentType}
            loading={loading}
          />

          <ListingTable listings={allListings} loading={loading} />

          <TestPanel />
        </div>

        {loading && <LoadingOverlay />}
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {showHistory && (
        <ChatHistoryPanel
          history={chatHistory}
          onClose={() => setShowHistory(false)}
          onDelete={handleDeleteHistory}
          onClear={handleClearHistory}
          onExport={handleExportHistory}
          onLoad={handleLoadHistory}
        />
      )}
    </div>
  );
}

export default App;
