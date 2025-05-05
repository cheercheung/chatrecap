/**
 * 缓存数据获取函数
 * 用于优化数据获取策略，减少不必要的 API 调用
 */
import { LRUCache } from 'lru-cache';
import { AnalysisData, AIInsights } from '@/types/analysis';
import { readFile, getCompleteAnalysisData, FileType } from './index';

// 缓存配置
const CACHE_MAX_SIZE = 100; // 最大缓存项数
const CACHE_TTL = 1000 * 60 * 5; // 缓存有效期（5分钟）

// 创建 LRU 缓存实例
const analysisDataCache = new LRUCache<string, AnalysisData>({
  max: CACHE_MAX_SIZE,
  ttl: CACHE_TTL,
});

const aiInsightsCache = new LRUCache<string, AIInsights>({
  max: CACHE_MAX_SIZE,
  ttl: CACHE_TTL,
});

/**
 * 获取分析数据（带缓存）
 * @param fileId 文件ID
 * @returns 分析数据
 */
export async function getCachedAnalysisData(fileId: string): Promise<AnalysisData | null> {
  // 检查缓存
  const cachedData = analysisDataCache.get(fileId);
  if (cachedData) {
    return cachedData;
  }

  // 缓存未命中，从存储中获取
  const analysisData = await readFile(fileId, FileType.RESULT) as AnalysisData;
  
  // 如果找到数据，更新缓存
  if (analysisData) {
    analysisDataCache.set(fileId, analysisData);
  }
  
  return analysisData;
}

/**
 * 获取AI分析结果（带缓存）
 * @param fileId 文件ID
 * @returns AI分析结果
 */
export async function getCachedAiInsights(fileId: string): Promise<AIInsights | null> {
  // 检查缓存
  const cachedData = aiInsightsCache.get(fileId);
  if (cachedData) {
    return cachedData;
  }

  // 缓存未命中，从存储中获取
  const aiInsights = await readFile(fileId, FileType.AI_RESULT) as AIInsights;
  
  // 如果找到数据，更新缓存
  if (aiInsights) {
    aiInsightsCache.set(fileId, aiInsights);
  }
  
  return aiInsights;
}

/**
 * 获取完整的分析数据（带缓存）
 * @param fileId 文件ID
 * @returns 完整的分析数据
 */
export async function getCachedCompleteAnalysisData(fileId: string): Promise<AnalysisData | null> {
  // 尝试从缓存获取完整数据
  const cachedAnalysisData = analysisDataCache.get(fileId);
  const cachedAiInsights = aiInsightsCache.get(fileId);
  
  // 如果两者都在缓存中，合并并返回
  if (cachedAnalysisData && cachedAiInsights) {
    return {
      ...cachedAnalysisData,
      aiInsights: cachedAiInsights
    };
  }
  
  // 否则从存储中获取完整数据
  const completeData = await getCompleteAnalysisData(fileId);
  
  // 如果找到数据，更新缓存
  if (completeData) {
    analysisDataCache.set(fileId, completeData);
    if (completeData.aiInsights) {
      aiInsightsCache.set(fileId, completeData.aiInsights);
    }
  }
  
  return completeData;
}

/**
 * 清除缓存
 * @param fileId 文件ID（可选，如果不提供则清除所有缓存）
 */
export function clearCache(fileId?: string): void {
  if (fileId) {
    analysisDataCache.delete(fileId);
    aiInsightsCache.delete(fileId);
  } else {
    analysisDataCache.clear();
    aiInsightsCache.clear();
  }
}

/**
 * 更新缓存
 * @param fileId 文件ID
 * @param data 分析数据
 */
export function updateCache(fileId: string, data: AnalysisData): void {
  analysisDataCache.set(fileId, data);
  if (data.aiInsights) {
    aiInsightsCache.set(fileId, data.aiInsights);
  }
}
