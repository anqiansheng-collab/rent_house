import React, { useState, useCallback } from 'react';
import { FlaskConical, ChevronDown, ChevronUp, Check, X, Shield } from 'lucide-react';
import type { UserPreference, Recommendation } from '../types';
import { budgetTestScenarios, boundaryTestScenarios } from '../data/mockData';
import { generateRecommendationsWithDebug, type ScoreBreakdown } from '../utils/recommendationEngine';

interface TestResult {
  scenario: string;
  preference: UserPreference;
  recommendations: Recommendation[];
  breakdown: ScoreBreakdown[];
  passed: boolean;
  details: string;
  analysis: string;
  cityCheckPassed: boolean;
}

interface BoundaryTestResult {
  scenario: string;
  preference: UserPreference;
  recommendations: Recommendation[];
  description: string;
  expectedCity: string;
  shouldNotInclude: string[];
  cityCheckPassed: boolean;
  crossCityBlocked: boolean;
  violatedAreas: string[];
}

type TestMode = 'budget' | 'boundary';

const TestPanel: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [boundaryResults, setBoundaryResults] = useState<BoundaryTestResult[]>([]);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [running, setRunning] = useState(false);
  const [testMode, setTestMode] = useState<TestMode>('budget');

  const analyzeFailure = (
    expectedTop: string,
    actualTop: string,
    breakdown: ScoreBreakdown[]
  ): string => {
    const expectedData = breakdown.find((b) => b.area === expectedTop);
    const actualData = breakdown.find((b) => b.area === actualTop);

    if (!expectedData || !actualData) return '数据缺失，无法分析';

    const issues: string[] = [];

    if (actualData.cityMatchScore > expectedData.cityMatchScore) {
      issues.push(`实际首位"${actualTop}"城市匹配得分(${actualData.cityMatchScore})高于预期(${expectedData.cityMatchScore})`);
    }

    if (actualData.budgetScore > expectedData.budgetScore) {
      issues.push(`实际首位预算匹配得分(${actualData.budgetScore})高于预期(${expectedData.budgetScore})`);
    } else if (expectedData.budgetScore < 20) {
      issues.push(`预期区域预算得分仅${expectedData.budgetScore}分，预算匹配度不足`);
    }

    const scoreDiff = actualData.totalScore - expectedData.totalScore;
    if (scoreDiff > 0) {
      issues.push(`总分差距: ${actualTop}(${actualData.totalScore}) > ${expectedTop}(${expectedData.totalScore})，差${scoreDiff}分`);
    }

    return issues.join('；') || '原因不明，请查看详细评分';
  };

  const runBudgetTests = useCallback(() => {
    setRunning(true);
    setResults([]);

    setTimeout(() => {
      const testResults: TestResult[] = budgetTestScenarios.map((scenario) => {
        const preference: UserPreference = {
          workLocation: scenario.workLocation,
          budget: scenario.budget,
          rentType: scenario.rentType,
          preferences: [],
        };

        const { recommendations, breakdown } = generateRecommendationsWithDebug(preference);
        const topRec = recommendations[0];
        const expectedTop = scenario.expectedAreas[0];
        const passed = topRec?.areaName === expectedTop;

        const analysis = passed
          ? ''
          : analyzeFailure(expectedTop, topRec?.areaName || '', breakdown);

        return {
          scenario: scenario.name,
          preference,
          recommendations,
          breakdown,
          passed,
          details: `预期: ${expectedTop} | 实际: ${topRec?.areaName || '无'}`,
          analysis,
          cityCheckPassed: recommendations.every((rec) =>
            rec.areaName.startsWith(scenario.workLocation.substring(0, 2))
          ),
        };
      });

      setResults(testResults);
      setRunning(false);
    }, 100);
  }, []);

  const runBoundaryTests = useCallback(() => {
    setRunning(true);
    setBoundaryResults([]);

    setTimeout(() => {
      const testResults: BoundaryTestResult[] = boundaryTestScenarios.map((scenario) => {
        const preference: UserPreference = {
          workLocation: scenario.workLocation,
          budget: scenario.budget,
          rentType: scenario.rentType,
          preferences: [],
        };

        const { recommendations } = generateRecommendationsWithDebug(preference);
        const workCity = scenario.workLocation.substring(0, 2);

        const cityCheckPassed = recommendations.every((rec) =>
          rec.areaName.startsWith(workCity)
        );

        const violatedAreas = recommendations
          .filter((rec) => scenario.shouldNotInclude.includes(rec.areaName))
          .map((rec) => rec.areaName);

        const crossCityBlocked = violatedAreas.length === 0;

        return {
          scenario: scenario.name,
          preference,
          recommendations,
          description: scenario.description,
          expectedCity: scenario.expectedCity,
          shouldNotInclude: scenario.shouldNotInclude,
          cityCheckPassed,
          crossCityBlocked,
          violatedAreas,
        };
      });

      setBoundaryResults(testResults);
      setRunning(false);
    }, 100);
  }, []);

  const toggleExpand = (index: number) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpanded(newExpanded);
  };

  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <FlaskConical className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary dark:text-white">推荐引擎测试</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {totalCount > 0 && (
            <span className="text-xs text-slate-400">
              {passedCount}/{totalCount} 通过
            </span>
          )}
          <div className="flex gap-1.5">
            <button
              onClick={() => setTestMode('budget')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                testMode === 'budget'
                  ? 'bg-primary text-white'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              预算测试
            </button>
            <button
              onClick={() => setTestMode('boundary')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 ${
                testMode === 'boundary'
                  ? 'bg-primary text-white'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              <Shield className="w-3 h-3" />
              边界测试
            </button>
          </div>
          <button
            onClick={testMode === 'budget' ? runBudgetTests : runBoundaryTests}
            disabled={running}
            className="px-4 py-1.5 bg-primary text-white rounded-lg text-[11px] font-semibold hover:bg-primary-light disabled:opacity-50 transition-all"
          >
            {running ? '测试中...' : '运行测试'}
          </button>
        </div>
      </div>

      {testMode === 'budget' && (
        <div className="space-y-2">
          {results.map((result, index) => (
            <div
              key={index}
              className={`rounded-xl border p-3.5 transition-all ${
                result.passed
                  ? 'bg-primary/[0.02] border-primary/10'
                  : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800'
              }`}
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(index)}
              >
                <div className="flex items-center gap-2.5">
                  {result.passed ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <X className="w-4 h-4 text-slate-400" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-primary dark:text-white">
                      {result.scenario}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{result.details}</p>
                  </div>
                </div>
                {expanded.has(index) ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>

              {expanded.has(index) && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {!result.passed && result.analysis && (
                    <div className="mb-3 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-[11px] text-slate-500">
                      <span className="font-semibold">分析: </span>
                      {result.analysis}
                    </div>
                  )}
                  <div className="space-y-1.5">
                    {result.breakdown.map((b) => (
                      <div
                        key={b.area}
                        className="flex items-center justify-between text-xs py-1"
                      >
                        <span className="text-slate-600 dark:text-slate-400">{b.area}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-400">
                            城市{b.cityMatchScore} 预算{b.budgetScore} 偏好{b.preferenceScores}
                          </span>
                          <span className="font-semibold text-primary min-w-[28px] text-right">
                            {b.totalScore}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {testMode === 'boundary' && (
        <div className="space-y-2">
          {boundaryResults.map((result, index) => (
            <div
              key={index}
              className={`rounded-xl border p-3.5 transition-all ${
                result.cityCheckPassed && result.crossCityBlocked
                  ? 'bg-primary/[0.02] border-primary/10'
                  : result.cityCheckPassed
                  ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800'
                  : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {result.cityCheckPassed && result.crossCityBlocked ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <X className="w-4 h-4 text-slate-400" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-primary dark:text-white">
                      {result.scenario}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{result.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2 ml-6.5">
                {result.recommendations.map((rec, i) => (
                  <span
                    key={rec.areaName}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      i === 0
                        ? 'bg-primary/10 text-primary'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {rec.areaName} ({rec.matchScore}%)
                  </span>
                ))}
              </div>

              <div className="flex gap-3 mt-2 ml-6.5">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  result.cityCheckPassed
                    ? 'bg-primary/10 text-primary'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  城市一致: {result.cityCheckPassed ? '通过' : '失败'}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  result.crossCityBlocked
                    ? 'bg-primary/10 text-primary'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  跨城拦截: {result.crossCityBlocked ? '通过' : '失败'}
                </span>
              </div>

              {!result.crossCityBlocked && result.violatedAreas.length > 0 && (
                <div className="mt-2 ml-6.5 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-[10px] text-slate-400">
                    违规区域: {result.violatedAreas.join(', ')}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestPanel;
