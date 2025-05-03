import { ProcessResult } from '../../types';
import { processWhatsAppText } from './textProcessor';

/**
 * 处理 WhatsApp 数据
 * @param input 输入数据（文本或 JSON）
 * @returns 处理结果
 */
export function processWhatsApp(input: string | object): ProcessResult {
  // 检查输入类型
  if (typeof input === 'string') {
    // 文本格式
    return processWhatsAppText(input);
  } else {
    // 检查是否是元数据文件
    if (typeof input === 'object' &&
        'id' in input && 'originalName' in input && 'path' in input) {
      console.error('WhatsApp数据可能是元数据文件而不是实际的WhatsApp数据:', input);

      // 创建一个带有当前日期的虚拟消息，以防止分析时出错
      const now = new Date();
      return {
        messages: [{
          timestamp: now.toISOString(),
          date: now,
          sender: 'System',
          message: '这是元数据文件，不是WhatsApp数据文件。请使用实际的WhatsApp导出文本文件。'
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

    // JSON 格式（目前 WhatsApp 不支持 JSON 导出）
    return {
      messages: [],
      warnings: ['WhatsApp 不支持 JSON 格式导出，请提供文本格式'],
      stats: {
        totalMessages: 0,
        validDateMessages: 0,
        filteredSystemMessages: 0,
        filteredMediaMessages: 0
      }
    };
  }
}
