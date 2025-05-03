/**
 * AI分析服务
 * 提供前端调用的AI分析功能
 */
import { AIInsights } from '@/types/analysis';

/**
 * 生成AI分析
 * @param fileId 文件ID
 * @param locale 语言
 * @returns 分析结果
 */
export async function generateAiAnalysis(fileId: string, locale: string = 'en'): Promise<{
  success: boolean;
  aiInsights?: AIInsights;
  message?: string;
}> {
  try {
    // 调用AI分析API
    const response = await fetch('/api/chat-processing/ai-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileId, locale }),
    });

    // 检查响应
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'AI分析失败');
    }

    // 解析响应数据
    const data = await response.json();

    return {
      success: true,
      aiInsights: data.aiInsights,
    };
  } catch (error) {
    console.error('AI分析服务错误:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'AI分析失败',
    };
  }
}

/**
 * 检查AI分析状态
 * @param fileId 文件ID
 * @returns 是否已完成AI分析
 */
export async function checkAiAnalysisStatus(fileId: string): Promise<boolean> {
  try {
    // 检查是否存在AI分析结果
    const response = await fetch(`/api/storage?fileId=${fileId}&type=exists`);

    if (!response.ok) {
      return false;
    }

    const data = await response.json();

    // 检查是否包含AI分析结果
    return data.success && data.content && data.content.exists;
  } catch (error) {
    console.error('检查AI分析状态失败:', error);
    return false;
  }
}
