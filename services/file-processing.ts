/**
 * 文件处理服务
 * 提供前端调用的文件处理功能
 */
import { getFileStatus, FileStatus } from '@/lib/file-services/file-processing';

/**
 * 获取聊天文件处理状态
 * @param fileId 文件ID
 * @returns 处理状态
 */
export async function getChatFileStatus(fileId: string): Promise<FileStatus | null> {
  return getFileStatus(fileId);
}
