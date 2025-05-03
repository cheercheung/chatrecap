import { RawEntry } from './types';

/**
 * 过滤 WhatsApp 噪声消息
 * @param entries 消息条目数组
 * @returns 过滤后的消息条目数组和统计信息
 */
export function filterWhatsAppNoise(entries: RawEntry[]): {
  filtered: RawEntry[];
  stats: { system: number; media: number; }
} {
  // 暂时禁用所有过滤，让所有消息都通过
  console.log(`不进行过滤，保留所有 ${entries.length} 条消息`);

  return {
    filtered: entries,
    stats: {
      system: 0,
      media: 0
    }
  };
}
