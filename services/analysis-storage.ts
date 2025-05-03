/**
 * 分析存储服务
 * 提供前端调用的分析数据存储功能
 */
import { ProcessResult } from '@/lib/chat-processing/types';
import { AIInsights } from '@/types/analysis';

/**
 * 保存原始文件
 * @param fileId 文件ID
 * @param content 文件内容
 */
export async function saveOriginalContent(fileId: string, content: string | Buffer): Promise<boolean> {
  try {
    const response = await fetch('/api/storage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileId,
        type: 'original',
        content: typeof content === 'string' ? content : content.toString(),
      }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('保存原始文件失败:', error);
    return false;
  }
}

/**
 * 保存清洗后的数据
 * @param fileId 文件ID
 * @param cleanedData 清洗后的数据
 */
export async function saveCleanedContent(fileId: string, cleanedData: any): Promise<boolean> {
  try {
    const response = await fetch('/api/storage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileId,
        type: 'cleaned',
        content: cleanedData,
      }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('保存清洗后的数据失败:', error);
    return false;
  }
}

/**
 * 保存分析结果
 * @param fileId 文件ID
 * @param analysisResult 分析结果
 */
export async function saveAnalysisData(fileId: string, analysisResult: ProcessResult): Promise<boolean> {
  try {
    const response = await fetch('/api/storage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileId,
        type: 'result',
        content: analysisResult,
      }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('保存分析结果失败:', error);
    return false;
  }
}

/**
 * 保存AI分析结果
 * @param fileId 文件ID
 * @param aiInsights AI分析结果
 */
export async function saveAiAnalysisData(fileId: string, aiInsights: AIInsights): Promise<boolean> {
  try {
    const response = await fetch('/api/storage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileId,
        type: 'ai-result',
        content: aiInsights,
      }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('保存AI分析结果失败:', error);
    return false;
  }
}

/**
 * 保存完整的分析数据
 * @param fileId 文件ID
 * @param completeData 完整的分析数据
 */
export async function saveCompleteData(fileId: string, completeData: ProcessResult & { aiInsights?: AIInsights }): Promise<boolean> {
  try {
    const response = await fetch('/api/storage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileId,
        type: 'result',
        content: completeData,
      }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('保存完整的分析数据失败:', error);
    return false;
  }
}

/**
 * 获取原始文件内容
 * @param fileId 文件ID
 * @returns 文件内容
 */
export async function getOriginalContent(fileId: string): Promise<string | null> {
  try {
    const response = await fetch(`/api/storage?fileId=${fileId}&type=original`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.content : null;
  } catch (error) {
    console.error('获取原始文件内容失败:', error);
    return null;
  }
}

/**
 * 获取清洗后的数据
 * @param fileId 文件ID
 * @returns 清洗后的数据
 */
export async function getCleanedContent(fileId: string): Promise<any | null> {
  try {
    const response = await fetch(`/api/storage?fileId=${fileId}&type=cleaned`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.content : null;
  } catch (error) {
    console.error('获取清洗后的数据失败:', error);
    return null;
  }
}

/**
 * 获取分析结果
 * @param fileId 文件ID
 * @returns 分析结果
 */
export async function getAnalysisData(fileId: string): Promise<ProcessResult | null> {
  try {
    const response = await fetch(`/api/storage?fileId=${fileId}&type=result`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.content : null;
  } catch (error) {
    console.error('获取分析结果失败:', error);
    return null;
  }
}

/**
 * 获取AI分析结果
 * @param fileId 文件ID
 * @returns AI分析结果
 */
export async function getAiAnalysisData(fileId: string): Promise<AIInsights | null> {
  try {
    const response = await fetch(`/api/storage?fileId=${fileId}&type=ai-result`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.content : null;
  } catch (error) {
    console.error('获取AI分析结果失败:', error);
    return null;
  }
}

/**
 * 获取完整的分析数据
 * @param fileId 文件ID
 * @returns 完整的分析数据
 */
export async function getCompleteData(fileId: string): Promise<(ProcessResult & { aiInsights?: AIInsights }) | null> {
  try {
    const response = await fetch(`/api/storage?fileId=${fileId}&type=complete`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.content : null;
  } catch (error) {
    console.error('获取完整的分析数据失败:', error);
    return null;
  }
}

/**
 * 检查是否存在AI分析结果
 * @param fileId 文件ID
 * @returns 是否存在AI分析结果
 */
export async function hasAiAnalysis(fileId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/storage?fileId=${fileId}&type=exists`);

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.success && data.content.exists;
  } catch (error) {
    console.error('检查是否存在AI分析结果失败:', error);
    return false;
  }
}

/**
 * 删除所有数据
 * @param fileId 文件ID
 */
export async function removeAllData(fileId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/storage?fileId=${fileId}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('删除所有数据失败:', error);
    return false;
  }
}
