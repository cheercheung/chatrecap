import { ProcessResult, PlatformType } from './types';
import { processWhatsApp } from './platforms/whatsapp';
import { processInstagram } from './platforms/instagram';
import { processSnapchat } from './platforms/snapchat';
import { processDiscord } from './platforms/discord';
import { processTelegram } from './platforms/telegram';

/**
 * 处理聊天数据
 * @param input 输入数据（文本或 JSON）
 * @param platform 平台类型
 * @returns 处理结果
 */
export function processChat(input: string | object, platform: PlatformType): ProcessResult {
  // 如果是 'auto'，尝试自动检测平台类型
  if (platform === 'auto') {
    // 尝试各种平台的处理方式，选择结果最好的一个
    try {
      // 首先尝试 WhatsApp，因为它是最常见的
      const whatsappResult = processWhatsApp(input);
      if (whatsappResult.messages.length > 0) {
        return {
          ...whatsappResult,
          warnings: [...whatsappResult.warnings, '自动检测为 WhatsApp 格式']
        };
      }

      // 然后尝试其他平台
      const instagramResult = processInstagram(input);
      if (instagramResult.messages.length > 0) {
        return {
          ...instagramResult,
          warnings: [...instagramResult.warnings, '自动检测为 Instagram 格式']
        };
      }

      const discordResult = processDiscord(input);
      if (discordResult.messages.length > 0) {
        return {
          ...discordResult,
          warnings: [...discordResult.warnings, '自动检测为 Discord 格式']
        };
      }

      const telegramResult = processTelegram(input);
      if (telegramResult.messages.length > 0) {
        return {
          ...telegramResult,
          warnings: [...telegramResult.warnings, '自动检测为 Telegram 格式']
        };
      }

      const snapchatResult = processSnapchat(input);
      if (snapchatResult.messages.length > 0) {
        return {
          ...snapchatResult,
          warnings: [...snapchatResult.warnings, '自动检测为 Snapchat 格式']
        };
      }

      // 如果所有平台都无法处理，返回空结果
      return {
        messages: [],
        warnings: ['无法自动检测平台类型，请手动选择平台'],
        stats: {
          totalMessages: 0,
          validDateMessages: 0,
          filteredSystemMessages: 0,
          filteredMediaMessages: 0
        }
      };
    } catch (error) {
      return {
        messages: [],
        warnings: [`自动检测平台类型失败: ${error instanceof Error ? error.message : String(error)}`],
        stats: {
          totalMessages: 0,
          validDateMessages: 0,
          filteredSystemMessages: 0,
          filteredMediaMessages: 0
        }
      };
    }
  }

  // 如果指定了平台类型，使用对应的处理函数
  switch (platform) {
    case 'whatsapp':
      return processWhatsApp(input);
    case 'instagram':
      return processInstagram(input);
    case 'discord':
      return processDiscord(input);
    case 'telegram':
      return processTelegram(input);
    case 'snapchat':
      return processSnapchat(input);
    default:
      return {
        messages: [],
        warnings: [`不支持的平台类型: ${platform}`],
        stats: {
          totalMessages: 0,
          validDateMessages: 0,
          filteredSystemMessages: 0,
          filteredMediaMessages: 0
        }
      };
  }
}

// 导出类型
export * from './types';

// 导出平台处理函数
export { processWhatsApp } from './platforms/whatsapp';
export { processInstagram } from './platforms/instagram';
export { processSnapchat } from './platforms/snapchat';
export { processDiscord } from './platforms/discord';
export { processTelegram } from './platforms/telegram';

// 导出工具函数
export * from '@/lib/common/textUtils';
export * from './validationUtils';
