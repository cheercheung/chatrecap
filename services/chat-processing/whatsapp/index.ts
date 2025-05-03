/**
 * WhatsApp 聊天处理服务
 */
import { processWhatsApp } from '@/lib/chat-processing/platforms/whatsapp';
import { ProcessResult } from '@/lib/chat-processing/types';

/**
 * 处理 WhatsApp 聊天数据
 * @param input 输入数据（文本）
 * @returns 处理结果
 */
export async function processWhatsAppChat(input: string | object): Promise<ProcessResult> {
  return processWhatsApp(input);
}
