import fs from 'fs';
import path from 'path';
import { PlatformType, ProcessResult } from '../chat-processing/types';
import { processChat } from '../chat-processing';
import { getUploadedFileContent, getUploadedFileMetadata } from './file-utils';
import { FileType, getFilePath } from '@/lib/storage/index';
import { analyzeChatData } from '@/lib/analysis';

// 上传目录和结果目录 - 使用与storage/index.ts相同的路径
const UPLOAD_DIR = path.join(process.cwd(), 'tmp', 'uploads');
const CLEANED_DIR = path.join(process.cwd(), 'tmp', 'cleaned');
const RESULTS_DIR = path.join(process.cwd(), 'tmp', 'results');

// 确保目录存在
[UPLOAD_DIR, CLEANED_DIR, RESULTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * 处理上传的文件
 * @param fileId 文件ID
 * @param platform 平台类型
 * @param statusCallback 状态回调函数
 * @returns 处理结果
 */
export async function processUploadedFile(
  fileId: string,
  platform: PlatformType,
  statusCallback?: (status: any) => Promise<void>
): Promise<ProcessResult> {
  try {
    // 更新状态为清洗中
    if (statusCallback) {
      await statusCallback({
        status: 'cleaning',
        cleaningProgress: 0,
        currentCleaningStep: `准备 ${platform} 数据`
      });
    }

    // 获取元数据文件路径
    const metadataPath = path.join(UPLOAD_DIR, `${fileId}.json`);
    console.log(`读取元数据文件: ${metadataPath}`);

    // 获取元数据
    const metadata = getUploadedFileMetadata(fileId);
    console.log('文件元数据:', metadata);

    // 获取文件内容
    const fileContent = getUploadedFileContent(metadataPath);

    console.log(`文件内容长度: ${fileContent.length}`);
    console.log(`文件内容预览: ${fileContent.substring(0, 100)}...`);

    // 尝试解析JSON
    let content: string | object = fileContent;
    try {
      content = JSON.parse(fileContent);
      console.log(`成功解析${platform} JSON，包含以下键: ${Object.keys(content).join(', ')}`);

      // 对于Instagram数据，验证是否包含必要的字段
      if (platform === 'instagram') {
        if (!content || typeof content !== 'object') {
          throw new Error('Instagram数据不是有效的对象');
        }

        if (!('messages' in content) || !Array.isArray((content as any).messages)) {
          console.error(`Instagram数据缺少messages字段:`, content);
          throw new Error('Instagram数据缺少必要的messages字段');
        }

        if (!('participants' in content) || !Array.isArray((content as any).participants)) {
          console.warn(`Instagram数据缺少participants字段，将使用默认值`);
        }
      }
    } catch (e) {
      console.error(`解析${platform} JSON失败:`, e);
      // 如果解析失败，使用原始内容
      content = fileContent;
    }

    // 更新状态为分析中
    if (statusCallback) {
      await statusCallback({
        status: 'analyzing',
        analysisProgress: 0,
        currentAnalysisStep: `处理 ${platform} 消息`
      });
    }

    // 根据平台类型处理内容
    console.log(`开始处理${platform}数据...`);

    // 使用通用处理函数
    const result = processChat(content, platform);

    console.log(`处理完成，消息数量: ${result.messages.length}`);

    // 检查处理结果
    if (result.messages.length === 0 || (result.messages.length === 1 && result.messages[0].sender === 'System')) {
      console.error(`${platform}数据处理失败，没有有效消息:`, result.warnings);
      throw new Error(`处理失败: ${result.warnings.join(', ')}`);
    }

    // 保存原始内容
    const originalPath = getFilePath(fileId, FileType.ORIGINAL);
    console.log(`保存原始内容到: ${originalPath}`);
    fs.writeFileSync(originalPath, typeof content === 'string' ? content : JSON.stringify(content, null, 2));

    // 保存清洗后的数据 - 这是最终的原始数据JSON文件
    const cleanedPath = getFilePath(fileId, FileType.CLEANED);
    console.log(`保存清洗后的数据到: ${cleanedPath}`);
    // 确保目录存在
    if (!fs.existsSync(path.dirname(cleanedPath))) {
      fs.mkdirSync(path.dirname(cleanedPath), { recursive: true });
    }
    fs.writeFileSync(cleanedPath, JSON.stringify(result.messages, null, 2));

    // 生成分析数据并保存到results目录
    const analysisData = analyzeChatData(result.messages);
    const resultPath = getFilePath(fileId, FileType.RESULT);
    console.log(`保存分析结果到: ${resultPath}`);
    // 确保目录存在
    if (!fs.existsSync(path.dirname(resultPath))) {
      fs.mkdirSync(path.dirname(resultPath), { recursive: true });
    }
    fs.writeFileSync(resultPath, JSON.stringify(analysisData, null, 2));

    // 更新状态为完成
    if (statusCallback) {
      await statusCallback({
        status: 'completed',
        cleaningProgress: 100,
        analysisProgress: 100
      });
    }

    return result;
  } catch (error) {
    console.error(`处理${platform}数据失败:`, error);

    // 更新状态为失败
    if (statusCallback) {
      await statusCallback({
        status: 'failed',
        error: error instanceof Error ? error.message : String(error)
      });
    }

    throw error;
  }
}

/**
 * 获取处理结果
 * @param fileId 文件ID
 * @returns 处理结果
 */
export function getProcessResult(fileId: string): ProcessResult | null {
  const resultPath = getFilePath(fileId, FileType.RESULT);

  if (!fs.existsSync(resultPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(resultPath, 'utf-8'));
  } catch (error) {
    console.error('读取处理结果失败:', error);
    return null;
  }
}
