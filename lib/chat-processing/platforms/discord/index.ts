import { ProcessResult } from '../../types';
import { processDiscordJson } from './jsonProcessor';

/**
 * 处理 Discord 数据
 * @param input 输入数据（JSON）
 * @returns 处理结果
 */
export function processDiscord(input: string | object): ProcessResult {
  // 检查输入类型
  let jsonData: any;

  if (typeof input === 'string') {
    try {
      // 尝试将字符串解析为 JSON
      jsonData = JSON.parse(input);
    } catch (error) {
      return {
        messages: [],
        warnings: ['Discord 数据格式无效：无法解析 JSON'],
        stats: {
          totalMessages: 0,
          validDateMessages: 0,
          filteredSystemMessages: 0,
          filteredMediaMessages: 0
        }
      };
    }
  } else {
    // 已经是对象
    jsonData = input;
  }

  // 检查是否是元数据文件而不是实际的Discord数据
  if (jsonData && typeof jsonData === 'object' &&
      'id' in jsonData && 'originalName' in jsonData && 'path' in jsonData &&
      !('messages' in jsonData) && !('channel' in jsonData)) {
    console.error('Discord数据可能是元数据文件而不是实际的Discord数据:', jsonData);

    // 创建一个带有当前日期的虚拟消息，以防止分析时出错
    const now = new Date();
    return {
      messages: [{
        timestamp: now.toISOString(),
        date: now,
        sender: 'System',
        message: '这是元数据文件，不是Discord数据文件。请使用实际的Discord导出JSON文件。'
      }],
      warnings: ['metadata_file_not_data_file'],
      stats: {
        totalMessages: 0,
        validDateMessages: 1,
        filteredSystemMessages: 0,
        filteredMediaMessages: 0
      }
    };
  }

  // 处理 JSON 数据
  return processDiscordJson(jsonData);
}
