import type { Recommendation, UserPreference } from '../types';
import { mockAreaData } from '../data/mockData';

export function calculateCredibility(
  isDirectLandlord: boolean,
  isSublease: boolean,
  hasRealPhotos: boolean,
  publishDays: number,
  isRepeated: boolean,
  hasAgentKeywords: boolean
): number {
  let score = 0;
  if (isDirectLandlord) score += 40;
  if (isSublease) score += 30;
  if (hasRealPhotos) score += 20;
  if (publishDays <= 7) score += 10;
  if (isRepeated) score -= 20;
  if (hasAgentKeywords) score -= 30;
  return Math.max(0, Math.min(100, score));
}

// 从区域名称提取城市名
function extractCity(areaName: string): string {
  if (areaName.startsWith('南京')) return '南京';
  if (areaName.startsWith('苏州')) return '苏州';
  if (areaName.startsWith('杭州')) return '杭州';
  if (areaName.startsWith('上海')) return '上海';
  return areaName;
}

// #region debug-point recommendation-scoring
export interface ScoreBreakdown {
  area: string;
  totalScore: number;
  cityMatchScore: number;
  workLocationScore: number;
  budgetScore: number;
  rentTypeScore: number;
  preferenceScores: number;
  reasons: string[];
}

export function generateRecommendationsWithDebug(preference: UserPreference): {
  recommendations: Recommendation[];
  breakdown: ScoreBreakdown[];
} {
  const { workLocation, budget, rentType, preferences } = preference;
  const scores: Record<string, number> = {};
  const reasons: Record<string, string[]> = {};
  const breakdown: ScoreBreakdown[] = [];

  const workCity = extractCity(workLocation);

  Object.keys(mockAreaData).forEach((area) => {
    scores[area] = 0;
    reasons[area] = [];

    const data = mockAreaData[area];
    const areaCity = extractCity(area);
    let cityMatchScore = 0;
    let workLocationScore = 0;
    let budgetScore = 0;
    let rentTypeScore = 0;
    let preferenceScores = 0;

    // 1. 城市匹配（核心逻辑）
    // 同一城市得基础分，不同城市大幅扣分
    if (areaCity === workCity) {
      if (area === workLocation) {
        // 工作地点所在区域：最高优先级
        scores[area] += 40;
        cityMatchScore = 40;
        workLocationScore = 40;
        reasons[area].push('工作地点所在区域');
      } else {
        // 同城市其他区域
        scores[area] += 25;
        cityMatchScore = 25;
        reasons[area].push(`同城市区域（${workCity}）`);
      }
    } else {
      // 不同城市：直接排除或大幅扣分
      scores[area] -= 50;
      cityMatchScore = -50;
      reasons[area].push(`不同城市（${areaCity}≠${workCity}）`);
    }

    // 2. 预算匹配（同城市内比较）
    const avgRent = rentType === '整租' ? data.rentStats.wholeRentAvg : data.rentStats.sharedRentAvg;
    const budgetRatio = budget / avgRent;

    if (budgetRatio >= 1.0) {
      scores[area] += 25;
      budgetScore = 25;
      reasons[area].push('预算充足');
    } else if (budgetRatio >= 0.9) {
      scores[area] += 20;
      budgetScore = 20;
      reasons[area].push('预算基本覆盖');
    } else if (budgetRatio >= 0.8) {
      scores[area] += 15;
      budgetScore = 15;
      reasons[area].push('预算略有紧张');
    } else if (budgetRatio >= 0.7) {
      scores[area] += 8;
      budgetScore = 8;
      reasons[area].push('预算较紧张');
    } else {
      // 预算严重不足
      const penalty = Math.min(15, Math.round((1 - budgetRatio) * 20));
      scores[area] -= penalty;
      budgetScore = -penalty;
      reasons[area].push(`预算不足(需¥${avgRent})`);
    }

    // 3. 租房类型加分
    if (rentType === '整租') {
      const wholeRentRatio = data.rentStats.wholeRentAvg / data.rentStats.sharedRentAvg;
      if (wholeRentRatio < 2.0) {
        scores[area] += 5;
        rentTypeScore += 5;
        reasons[area].push('整租性价比高');
      } else if (wholeRentRatio < 2.5) {
        scores[area] += 2;
        rentTypeScore += 2;
        reasons[area].push('整租性价比较好');
      }
    }

    if (rentType === '合租') {
      if (data.rentStats.sharedRentAvg < 1200) {
        scores[area] += 5;
        rentTypeScore += 5;
        reasons[area].push('合租价格极低');
      } else if (data.rentStats.sharedRentAvg < 1500) {
        scores[area] += 2;
        rentTypeScore += 2;
        reasons[area].push('合租价格较低');
      }
    }

    // 4. 居住偏好加分
    if (preferences.includes('安静')) {
      if (data.profile.comfort >= 85) {
        scores[area] += 10;
        preferenceScores += 10;
        reasons[area].push('居住环境非常安静舒适');
      } else if (data.profile.comfort >= 75) {
        scores[area] += 5;
        preferenceScores += 5;
        reasons[area].push('居住环境较舒适');
      }
    }

    if (preferences.includes('通勤短')) {
      if (area === workLocation) {
        scores[area] += 15;
        preferenceScores += 15;
        reasons[area].push('通勤极短（同区域）');
      } else if (data.profile.commuteScore >= 90) {
        scores[area] += 8;
        preferenceScores += 8;
        reasons[area].push('通勤非常便利');
      } else if (data.profile.commuteScore >= 80) {
        scores[area] += 4;
        preferenceScores += 4;
        reasons[area].push('通勤较便利');
      }
    }

    if (preferences.includes('商业繁华')) {
      if (data.profile.businessMaturity >= 90) {
        scores[area] += 10;
        preferenceScores += 10;
        reasons[area].push('商业配套非常成熟');
      } else if (data.profile.businessMaturity >= 80) {
        scores[area] += 5;
        preferenceScores += 5;
        reasons[area].push('商业配套较成熟');
      }
    }

    if (preferences.includes('性价比高')) {
      const costPerf = (data.livingCost.total / data.profile.convenience) * 100;
      if (costPerf <= 60) {
        scores[area] += 10;
        preferenceScores += 10;
        reasons[area].push('性价比非常高');
      } else if (costPerf <= 75) {
        scores[area] += 5;
        preferenceScores += 5;
        reasons[area].push('性价比较高');
      }
    }

    if (preferences.includes('年轻人多')) {
      if (data.profile.youngPeopleRatio >= 90) {
        scores[area] += 10;
        preferenceScores += 10;
        reasons[area].push('年轻人非常多');
      } else if (data.profile.youngPeopleRatio >= 80) {
        scores[area] += 6;
        preferenceScores += 6;
        reasons[area].push('年轻人较多');
      } else if (data.profile.youngPeopleRatio >= 70) {
        scores[area] += 3;
        preferenceScores += 3;
        reasons[area].push('年轻人群体活跃');
      }
    }

    if (preferences.includes('靠近地铁')) {
      if (data.profile.commuteScore >= 90) {
        scores[area] += 8;
        preferenceScores += 8;
        reasons[area].push('交通非常便利，靠近地铁');
      } else if (data.profile.commuteScore >= 80) {
        scores[area] += 4;
        preferenceScores += 4;
        reasons[area].push('交通便利，靠近地铁');
      }
    }

    if (reasons[area].length === 0) {
      reasons[area].push('综合条件一般');
    }

    breakdown.push({
      area,
      totalScore: scores[area],
      cityMatchScore,
      workLocationScore,
      budgetScore,
      rentTypeScore,
      preferenceScores,
      reasons: [...reasons[area]],
    });
  });

  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const maxScore = sorted[0]?.[1] || 100;
  const minScore = sorted[sorted.length - 1]?.[1] || 0;

  // 标准化分数到 60-100 区间
  const recommendations = sorted.map(([area, score]) => ({
    areaName: area,
    matchScore: maxScore === minScore
      ? 80
      : Math.min(100, Math.max(60, Math.round(60 + ((score - minScore) / (maxScore - minScore)) * 40))),
    reasons: reasons[area],
  }));

  return { recommendations, breakdown };
}
// #endregion debug-point recommendation-scoring

export function generateRecommendations(preference: UserPreference): Recommendation[] {
  const result = generateRecommendationsWithDebug(preference);
  return result.recommendations;
}

// 混合推荐：本地算法 + AI 增强
export async function generateHybridRecommendations(
  preference: UserPreference,
  useAI: boolean = false
): Promise<Recommendation[]> {
  const localResult = generateRecommendationsWithDebug(preference);

  if (!useAI) {
    return localResult.recommendations;
  }

  try {
    // 动态导入避免循环依赖
    const { getAIRecommendations } = await import('../services/deepseek');
    const aiRecommendations = await getAIRecommendations(
      preference,
      localResult.recommendations
    );

    // 合并本地和AI推荐，取交集并重新排序
    const merged = localResult.recommendations.map((local) => {
      const aiMatch = aiRecommendations.find(
        (ai) => ai.areaName === local.areaName
      );
      if (aiMatch) {
        return {
          ...local,
          matchScore: Math.round(local.matchScore * 0.6 + aiMatch.matchScore * 0.4),
          reasons: [...local.reasons, ...(aiMatch.reasons || [])],
        };
      }
      return local;
    });

    // 如果AI推荐了新的区域，添加进去
    aiRecommendations.forEach((ai) => {
      if (!merged.find((m) => m.areaName === ai.areaName)) {
        merged.push({
          areaName: ai.areaName,
          matchScore: Math.round(ai.matchScore * 0.8),
          reasons: ai.reasons || ['AI推荐'],
        });
      }
    });

    return merged
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  } catch {
    return localResult.recommendations;
  }
}
