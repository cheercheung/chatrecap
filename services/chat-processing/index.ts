import { ProcessResult, PlatformType } from '@/lib/chat-processing/types';


/**
 * 上传聊天文件
 * @param file 文件对象
 * @param platform 平台类型
 * @returns 上传结果
 */
export async function uploadChatFile(file: File, platform: PlatformType): Promise<{ fileId: string }> {
  // 创建表单数据
  const formData = new FormData();
  formData.append('file', file);
  formData.append('platform', platform);

  // 发送请求
  const response = await fetch('/api/chat-processing/upload', {
    method: 'POST',
    body: formData
  });

  // 检查响应
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`上传失败: ${error}`);
  }

  // 返回结果
  return response.json();
}

/**
 * 处理聊天文件
 * @param fileId 文件ID
 * @param platform 平台类型
 * @returns 处理结果
 */
export async function processChatFile(fileId: string, platform: PlatformType): Promise<{ success: boolean }> {
  // 发送请求
  const response = await fetch('/api/chat-processing/process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fileId, platform })
  });

  // 检查响应
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`处理失败: ${error}`);
  }

  // 返回结果
  return response.json();
}

/**
 * 获取处理状态
 * @param fileId 文件ID
 * @returns 处理状态
 */
export async function getChatProcessingStatus(fileId: string): Promise<{ status: string; progress: number }> {
  // 发送请求
  const response = await fetch(`/api/chat-processing/status/${fileId}`);

  // 检查响应
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`获取状态失败: ${error}`);
  }

  // 返回结果
  return response.json();
}

/**
 * 获取处理结果
 * @param fileId 文件ID
 * @returns 处理结果
 */
export async function getChatProcessingResult(fileId: string): Promise<ProcessResult> {
  // 发送请求
  const response = await fetch(`/api/chat-processing/result/${fileId}`);

  // 检查响应
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`获取结果失败: ${error}`);
  }

  // 返回结果
  return response.json();
}

// 导出平台处理函数
export { processWhatsAppChat } from './whatsapp';
export { processInstagramChat } from './instagram';
export { processSnapchatChat } from './snapchat';
export { processDiscordChat } from './discord';
export { processTelegramChat } from './telegram';

// 导出AI分析函数
export { generateAiAnalysis, checkAiAnalysisStatus } from './ai-analysis';

// 导出类型
export type { ProcessResult, PlatformType, RawMessage } from '@/lib/chat-processing/types';
