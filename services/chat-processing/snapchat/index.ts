/**
 * Snapchat 聊天处理服务
 */
import { ProcessResult } from '@/lib/chat-processing/types';

/**
 * 处理 Snapchat 聊天数据
 * @param fileId 文件ID
 * @returns 处理结果
 */
export async function processSnapchatChat(fileId: string): Promise<ProcessResult> {
  try {
    // 发送请求到API路由
    const response = await fetch('/api/chat-processing/snapchat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileId })
    });

    // 检查响应
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Snapchat 处理失败');
    }

    // 获取处理结果
    const resultResponse = await fetch(`/api/chat-processing/result/${fileId}`);

    if (!resultResponse.ok) {
      const errorData = await resultResponse.json();
      throw new Error(errorData.message || '获取处理结果失败');
    }

    const { result } = await resultResponse.json();
    return result;
  } catch (error) {
    console.error('Snapchat 处理失败:', error);
    throw error;
  }
}
