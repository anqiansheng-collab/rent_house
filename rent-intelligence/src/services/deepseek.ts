import type { UserPreference, Recommendation } from '../types';
import { mockAreaData } from '../data/mockData';

const API_KEY = 'sk-e2115e1a3d334b9a9d6dd6ea1e2fe1ae';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface AIRecommendation {
  areaName: string;
  matchScore: number;
  reasons: string[];
  aiAnalysis: string;
}

export async function getAIRecommendations(
  preference: UserPreference,
  localRecommendations: Recommendation[]
): Promise<AIRecommendation[]> {
  try {
    const areasData = Object.entries(mockAreaData).map(([name, data]) => ({
      name,
      rentStats: data.rentStats,
      profile: data.profile,
      livingCost: data.livingCost,
    }));

    const prompt = `作为租房决策专家，请基于以下用户需求和区域数据，提供精准的租房推荐。

用户需求：
- 工作地点：${preference.workLocation}
- 预算：¥${preference.budget}
- 租房类型：${preference.rentType}
- 居住偏好：${preference.preferences.join('、') || '无特殊偏好'}

区域数据：
${JSON.stringify(areasData, null, 2)}

本地算法推荐结果：
${JSON.stringify(localRecommendations, null, 2)}

请分析并返回JSON格式结果（只返回JSON，不要其他文字）：
{
  "recommendations": [
    {
      "areaName": "区域名称",
      "matchScore": 85,
      "reasons": ["理由1", "理由2"],
      "aiAnalysis": "AI详细分析说明"
    }
  ]
}

要求：
1. 基于预算匹配度、通勤便利性、生活成本、用户偏好综合评估
2. matchScore范围0-100，分数越高越推荐
3. 必须返回3个推荐区域，按匹配度排序
4. 分析要具体、实用，帮助用户做决策`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a professional rental housing recommendation expert. Always respond with valid JSON only.' },
          { role: 'user', content: prompt },
        ],
        stream: false,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data: DeepSeekResponse = await response.json();
    const content = data.choices[0]?.message?.content || '';

    // 提取JSON部分
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('无法解析AI响应');
    }

    const result = JSON.parse(jsonMatch[0]);
    return result.recommendations || [];
  } catch (error) {
    console.error('AI推荐失败:', error);
    // 返回本地推荐作为fallback
    return localRecommendations.map((rec) => ({
      ...rec,
      aiAnalysis: '基于本地算法推荐',
    }));
  }
}

export async function getRentingAdvice(
  preference: UserPreference,
  selectedArea: string
): Promise<string> {
  try {
    const areaData = mockAreaData[selectedArea];
    if (!areaData) return '';

    const prompt = `作为租房顾问，请为以下用户提供具体的租房建议。

用户需求：
- 工作地点：${preference.workLocation}
- 预算：¥${preference.budget}
- 租房类型：${preference.rentType}
- 居住偏好：${preference.preferences.join('、') || '无特殊偏好'}

选定区域：${selectedArea}
区域数据：
- 整租均价：¥${areaData.rentStats.wholeRentAvg}
- 合租均价：¥${areaData.rentStats.sharedRentAvg}
- 生活成本：¥${areaData.livingCost.total}
- 交通便利度：${areaData.profile.commuteScore}/100
- 商业成熟度：${areaData.profile.businessMaturity}/100

请提供：
1. 该区域租房的优劣势分析
2. 预算是否充足，如何优化租房方案
3. 具体的租房建议（房型选择、地段建议等）
4. 注意事项和避坑指南

请用中文回答，简洁实用。`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a professional rental housing advisor.' },
          { role: 'user', content: prompt },
        ],
        stream: false,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data: DeepSeekResponse = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('获取租房建议失败:', error);
    return '暂时无法获取AI建议，请查看本地推荐数据。';
  }
}
