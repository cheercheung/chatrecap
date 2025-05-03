import { ProcessResult } from '../../types';
import { processInstagramJson } from './jsonProcessor';

/**
 * 处理 Instagram 数据
 * @param input 输入数据（JSON）
 * @returns 处理结果
 */
export function processInstagram(input: string | object): ProcessResult {
  // 检查输入类型
  let jsonData: any;

  if (typeof input === 'string') {
    try {
      // 尝试将字符串解析为 JSON
      jsonData = JSON.parse(input);
      console.log('成功解析Instagram JSON字符串:', Object.keys(jsonData));
    } catch (error) {
      console.error('解析Instagram JSON字符串失败:', error);

      // 创建一个带有当前日期的虚拟消息，以防止分析时出错
      const now = new Date();
      return {
        messages: [{
          timestamp: now.toISOString(),
          date: now,
          sender: 'System',
          message: 'Instagram 数据格式无效：无法解析 JSON'
        }],
        warnings: ['invalid_json_format'],
        stats: {
          totalMessages: 0,
          validDateMessages: 1,
          filteredSystemMessages: 0,
          filteredMediaMessages: 0
        }
      };
    }
  } else {
    // 已经是对象
    jsonData = input;
    console.log('Instagram输入已经是对象:', Object.keys(jsonData));
  }

  // 检查是否为空对象
  if (!jsonData || typeof jsonData !== 'object' || Object.keys(jsonData).length === 0) {
    console.error('Instagram数据为空或无效:', jsonData);

    // 创建一个带有当前日期的虚拟消息，以防止分析时出错
    const now = new Date();
    return {
      messages: [{
        timestamp: now.toISOString(),
        date: now,
        sender: 'System',
        message: 'Instagram 数据格式无效：数据为空或无效'
      }],
      warnings: ['empty_or_invalid_data'],
      stats: {
        totalMessages: 0,
        validDateMessages: 1,
        filteredSystemMessages: 0,
        filteredMediaMessages: 0
      }
    };
  }

  // 检查是否是元数据文件而不是实际的Instagram数据
  if ('id' in jsonData && 'originalName' in jsonData && 'path' in jsonData && !('messages' in jsonData)) {
    console.error('Instagram数据缺少messages字段，这可能是元数据文件而不是实际的Instagram数据:', jsonData);

    // 创建一个带有当前日期的虚拟消息，以防止分析时出错
    const now = new Date();
    return {
      messages: [{
        timestamp: now.toISOString(),
        date: now,
        sender: 'System',
        message: '这是元数据文件，不是Instagram数据文件。请使用实际的Instagram导出JSON文件。'
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
  return processInstagramJson(jsonData);
}
