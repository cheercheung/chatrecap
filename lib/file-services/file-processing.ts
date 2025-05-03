import { processChat, PlatformType, ProcessResult } from '@/lib/chat-processing';
import { getProcessResult as getResult } from './result-service';
import { getUploadedFileContent } from './file-utils';
import { saveFile, readFile, FileType, getFilePath } from '@/lib/storage/index';
import path from 'path';
import { analyzeChatData } from '@/lib/analysis';

// 重新导出 getProcessResult 函数，以保持向后兼容性
export const getProcessResult = getResult;

/**
 * 文件处理状态
 */
export interface FileStatus {
  status: 'uploading' | 'cleaning' | 'analyzing' | 'completed' | 'failed';
  cleaningProgress: number;
  analysisProgress: number;
  currentCleaningStep?: string;
  currentAnalysisStep?: string;
  error?: string;
}

/**
 * 获取文件处理状态
 * @param fileId 文件ID
 * @returns 处理状态
 */
export async function getFileStatus(fileId: string): Promise<FileStatus | null> {
  try {
    // 使用自定义文件类型来存储状态
    const statusFileType = FileType.RESULT;
    const statusFileName = `${fileId}-status`;

    // 读取状态文件
    const status = await readFile(statusFileName, statusFileType);
    return status as FileStatus;
  } catch (error) {
    console.error('获取文件处理状态失败:', error);
    return null;
  }
}

/**
 * 更新文件处理状态
 * @param fileId 文件ID
 * @param status 处理状态
 */
export async function updateFileStatus(fileId: string, status: Partial<FileStatus>): Promise<void> {
  try {
    // 使用自定义文件类型来存储状态
    const statusFileType = FileType.RESULT;
    const statusFileName = `${fileId}-status`;

    // 读取当前状态
    let currentStatus: FileStatus;
    const existingStatus = await readFile(statusFileName, statusFileType);

    if (existingStatus) {
      currentStatus = { ...existingStatus, ...status };
    } else {
      currentStatus = {
        status: 'uploading',
        cleaningProgress: 0,
        analysisProgress: 0,
        ...status
      };
    }

    // 保存更新后的状态
    await saveFile(statusFileName, currentStatus, statusFileType);
  } catch (error) {
    console.error('更新文件处理状态失败:', error);
  }
}

/**
 * 处理文件
 * @param fileId 文件ID
 * @param platform 平台类型
 * @param options 处理选项
 * @returns 处理结果
 */
export async function processFile(
  fileId: string,
  platform: PlatformType,
  options: { skipAiAnalysis?: boolean } = { skipAiAnalysis: true }
): Promise<ProcessResult | null> {
  let content: string;

  try {
    // 获取元数据文件路径
    const metadataPath = path.join(process.cwd(), 'tmp', 'uploads', `${fileId}.json`);

    // 获取文件内容
    content = getUploadedFileContent(metadataPath);

    if (!content) {
      await updateFileStatus(fileId, {
        status: 'failed',
        error: '无法读取文件内容'
      });
      return null;
    }
  } catch (error) {
    console.error('读取文件内容失败:', error);
    await updateFileStatus(fileId, {
      status: 'failed',
      error: error instanceof Error ? error.message : '无法读取文件内容'
    });
    return null;
  }

  try {
    // 更新状态为清洗中
    await updateFileStatus(fileId, {
      status: 'cleaning',
      cleaningProgress: 0,
      currentCleaningStep: '准备数据'
    });

    // 模拟清洗进度
    await simulateProgress(fileId, 'cleaning', 'cleaningProgress');

    // 更新状态为分析中
    await updateFileStatus(fileId, {
      status: 'analyzing',
      analysisProgress: 0,
      currentAnalysisStep: '处理消息'
    });

    // 处理聊天数据
    const result = processChat(content, platform);

    // 模拟分析进度
    await simulateProgress(fileId, 'analyzing', 'analysisProgress');

    // 保存清理后的数据（消息数组）- 这是最终的原始数据JSON文件
    await saveFile(fileId, result.messages, FileType.CLEANED);
    console.log(`保存清理后的数据到: ${getFilePath(fileId, FileType.CLEANED)}`);

    // 生成分析数据并保存到results目录
    const analysisData = analyzeChatData(result.messages);
    await saveFile(fileId, analysisData, FileType.RESULT);
    console.log(`保存分析结果到: ${getFilePath(fileId, FileType.RESULT)}`);

    // 更新状态为完成
    await updateFileStatus(fileId, {
      status: 'completed',
      cleaningProgress: 100,
      analysisProgress: 100
    });

    return result;
  } catch (error) {
    console.error('处理文件失败:', error);

    // 更新状态为失败
    await updateFileStatus(fileId, {
      status: 'failed',
      error: error instanceof Error ? error.message : String(error)
    });

    return null;
  }
}

// getProcessResult 函数已移动到 result-service.ts 文件中

/**
 * 模拟进度更新
 * @param fileId 文件ID
 * @param statusKey 状态键
 * @param progressKey 进度键
 */
async function simulateProgress(
  fileId: string,
  statusKey: 'cleaning' | 'analyzing',
  progressKey: 'cleaningProgress' | 'analysisProgress'
): Promise<void> {
  // 模拟进度步骤
  const steps = (
    statusKey === 'cleaning'
      ? ['准备数据', '移除控制字符', '标准化行', '合并多行消息', '提取结构化数据', '过滤系统消息和噪声']
      : ['检测日期格式', '解析日期', '构建消息对象', '排序和去重', '验证结果']
  );

  // 每个步骤的进度增量
  const increment = Math.floor(100 / steps.length);

  for (let i = 0; i < steps.length; i++) {
    const progress = Math.min(100, (i + 1) * increment);
    const step = steps[i];

    // 更新状态
    const update: Partial<FileStatus> = {
      [progressKey]: progress
    };

    if (statusKey === 'cleaning') {
      update.currentCleaningStep = step;
    } else {
      update.currentAnalysisStep = step;
    }

    await updateFileStatus(fileId, update);

    // 模拟处理时间 - 减少延迟以提高性能
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
