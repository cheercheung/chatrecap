import { ProcessResult, RawMessage } from '@/lib/chat-processing/types';
import { readFile, FileType } from '@/lib/storage/index';
import { AnalysisData } from '@/types/analysis';

/**
 * 获取处理结果
 * @param fileId 文件ID
 * @returns 处理结果
 */
export async function getProcessResult(fileId: string): Promise<ProcessResult | null> {
  try {
    // 首先尝试获取分析结果数据
    const analysisData = await readFile(fileId, FileType.RESULT) as AnalysisData;

    // 如果没有分析数据，则尝试获取清理后的消息数组
    if (!analysisData) {
      const messages = await readFile(fileId, FileType.CLEANED) as RawMessage[];

      if (!messages || !Array.isArray(messages)) {
        return null;
      }

      // 处理日期字段
      messages.forEach(msg => {
        if (msg.date && typeof msg.date === 'string') {
          const date = new Date(msg.date);
          if (!isNaN(date.getTime())) {
            msg.date = date;
          }
        }
      });

      // 构建一个简化的ProcessResult对象
      return {
        messages,
        warnings: [],
        stats: {
          totalMessages: messages.length,
          validDateMessages: messages.filter(m => m.date).length,
          filteredSystemMessages: 0,
          filteredMediaMessages: 0
        }
      };
    }

    // 如果有分析数据，则从中提取消息数组
    // 注意：这里假设我们可以从其他地方获取消息数组，因为AnalysisData中可能没有完整的消息
    const messages = await readFile(fileId, FileType.CLEANED) as RawMessage[];

    if (!messages || !Array.isArray(messages)) {
      return null;
    }

    // 处理日期字段
    messages.forEach(msg => {
      if (msg.date && typeof msg.date === 'string') {
        const date = new Date(msg.date);
        if (!isNaN(date.getTime())) {
          msg.date = date;
        }
      }
    });

    // 返回包含消息数组的ProcessResult对象
    return {
      messages,
      warnings: [],
      stats: {
        totalMessages: messages.length,
        validDateMessages: messages.filter(m => m.date).length,
        filteredSystemMessages: 0,
        filteredMediaMessages: 0
      }
    };
  } catch (error) {
    console.error('获取处理结果失败:', error);
    return null;
  }
}
