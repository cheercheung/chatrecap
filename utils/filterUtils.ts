import { RawEntry } from '@/utils/chat-processing/types';

/**
 * 过滤 WhatsApp 噪声消息
 * @param entries 消息条目数组
 * @returns 过滤后的消息条目数组和统计信息
 */
export function filterWhatsAppNoise(entries: RawEntry[]): {
  filtered: RawEntry[];
  stats: { system: number; media: number; }
} {
  let systemCount = 0;
  let mediaCount = 0;

  // 只过滤明确的媒体消息 - 使用正则表达式以支持部分匹配
  const mediaPatterns = [
    /^<Media omitted>$/i,
    /^<媒体文件已省略>$/i,
    /^<附件已省略>$/i,
    /^(image|video|audio|document|sticker|GIF) omitted$/i
  ];

  // 系统消息模式 - 包括群组操作和系统通知
  const systemPatterns = [
    /^(You created group|您创建了群组)/i,
    /^(You added|您添加了)/i,
    /^(You removed|您移除了)/i,
    /^(You changed the subject|您更改了主题)/i,
    /^(You changed this group's icon|您更改了此群组的图标)/i,
    /^(Messages and calls are end-to-end encrypted|消息和通话已获得端对端加密)/i,
    /^(Your messages are end-to-end encrypted|您的消息已获得端对端加密)/i,
    /^(.*joined using this group's invite link|.*使用此群组的邀请链接加入)/i,
    /^(.*left|.*离开了)/i,
    /^(.*changed their phone number|.*更改了他们的电话号码)/i
  ];

  // 记录过滤前的消息数量
  console.log(`过滤前消息数量: ${entries.length}`);

  const filtered = entries.filter(entry => {
    const { message } = entry;

    // 检查是否是媒体消息
    const isMediaMessage = mediaPatterns.some(pattern => pattern.test(message));
    if (isMediaMessage) {
      console.log(`过滤媒体消息: "${message}"`);
      mediaCount++;
      return false;
    }

    // 检查是否是系统消息 - 只过滤特定的系统消息
    const isSystemMessage = systemPatterns.some(pattern => pattern.test(message));
    if (isSystemMessage) {
      console.log(`过滤系统消息: "${message}"`);
      systemCount++;
      return false;
    }

    // 保留所有其他消息
    return true;
  });

  // 记录过滤后的消息数量
  console.log(`过滤后消息数量: ${filtered.length}`);
  console.log(`过滤的媒体消息: ${mediaCount}, 系统消息: ${systemCount}`);

  // 如果过滤后没有消息，记录警告但不回退到原始消息
  if (filtered.length === 0 && entries.length > 0) {
    console.warn('警告: 过滤后没有剩余消息，可能过滤条件过于严格');
  }

  return {
    filtered,
    stats: {
      system: systemCount,
      media: mediaCount
    }
  };
}
