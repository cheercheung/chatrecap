/**
 * 统一存储抽象层
 * 处理所有文件存储和获取操作
 */
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ProcessResult, RawMessage } from '@/lib/chat-processing/types';
import { AIInsights, AnalysisData } from '@/types/analysis';

// 定义存储目录
const STORAGE_BASE_DIR = path.join(process.cwd(), 'tmp');
const UPLOAD_DIR = path.join(STORAGE_BASE_DIR, 'uploads');
const CLEANED_DIR = path.join(STORAGE_BASE_DIR, 'cleaned');
const RESULTS_DIR = path.join(STORAGE_BASE_DIR, 'results');
const AI_RESULTS_DIR = path.join(STORAGE_BASE_DIR, 'ai-results');

// 确保所有目录存在
function ensureDirectoriesExist() {
  [STORAGE_BASE_DIR, UPLOAD_DIR, CLEANED_DIR, RESULTS_DIR, AI_RESULTS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// 初始化目录
ensureDirectoriesExist();

// 文件类型枚举
export enum FileType {
  ORIGINAL = 'original',
  CLEANED = 'cleaned',
  RESULT = 'result',
  AI_RESULT = 'ai-result',
  COMPLETE = 'complete'
}

/**
 * 获取文件路径
 * @param fileId 文件ID
 * @param type 文件类型
 * @returns 文件路径
 */
export function getFilePath(fileId: string, type: FileType): string {
  switch (type) {
    case FileType.ORIGINAL:
      return path.join(UPLOAD_DIR, `${fileId}.original`);
    case FileType.CLEANED:
      return path.join(CLEANED_DIR, `${fileId}.cleaned.json`);
    case FileType.RESULT:
      return path.join(RESULTS_DIR, `${fileId}.result.json`);
    case FileType.AI_RESULT:
      return path.join(AI_RESULTS_DIR, `${fileId}.ai-result.json`);
    default:
      throw new Error(`未知的文件类型: ${type}`);
  }
}

/**
 * 保存文件内容
 * @param fileId 文件ID
 * @param content 文件内容
 * @param type 文件类型
 * @returns 文件路径
 */
export async function saveFile(fileId: string, content: any, type: FileType): Promise<string> {
  const filePath = getFilePath(fileId, type);

  // 确保目录存在
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 保存文件
  if (typeof content === 'string') {
    fs.writeFileSync(filePath, content);
  } else {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  }

  return filePath;
}

/**
 * 读取文件内容
 * @param fileId 文件ID
 * @param type 文件类型
 * @returns 文件内容
 */
export async function readFile(fileId: string, type: FileType): Promise<any> {
  const filePath = getFilePath(fileId, type);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  // 如果是JSON文件，解析内容
  if (filePath.endsWith('.json')) {
    try {
      return JSON.parse(content);
    } catch (error) {
      console.error(`解析JSON文件失败: ${filePath}`, error);
      return null;
    }
  }

  return content;
}

/**
 * 删除文件
 * @param fileId 文件ID
 * @param type 文件类型
 * @returns 是否成功删除
 */
export async function deleteFile(fileId: string, type: FileType): Promise<boolean> {
  const filePath = getFilePath(fileId, type);

  if (!fs.existsSync(filePath)) {
    return false;
  }

  try {
    fs.unlinkSync(filePath);
    return true;
  } catch (error) {
    console.error(`删除文件失败: ${filePath}`, error);
    return false;
  }
}

/**
 * 保存上传的文件
 * @param fileContent 文件内容
 * @param fileExtension 文件扩展名
 * @param customFileId 自定义文件ID（可选）
 * @returns 文件ID
 */
export async function saveUploadedFile(fileContent: Buffer | string, fileExtension: string = '', customFileId?: string): Promise<string> {
  const fileId = customFileId || uuidv4();
  const filePath = path.join(UPLOAD_DIR, `${fileId}${fileExtension}`);

  // 确保目录存在
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  // 保存文件
  if (typeof fileContent === 'string') {
    fs.writeFileSync(filePath, fileContent);
  } else {
    fs.writeFileSync(filePath, fileContent);
  }

  // 保存元数据
  const metadataPath = path.join(UPLOAD_DIR, `${fileId}.json`);
  const metadata = {
    id: fileId,
    originalName: `${fileId}${fileExtension}`,
    extension: fileExtension,
    size: typeof fileContent === 'string' ? fileContent.length : fileContent.length,
    uploadedAt: new Date().toISOString(),
    path: filePath
  };

  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

  return fileId;
}

/**
 * 保存处理结果
 * @param fileId 文件ID
 * @param result 处理结果
 * @returns 文件路径
 */
export async function saveProcessResult(fileId: string, result: ProcessResult): Promise<string> {
  return saveFile(fileId, result, FileType.RESULT);
}

/**
 * 获取处理结果
 * @param fileId 文件ID
 * @returns 处理结果
 */
export async function getProcessResult(fileId: string): Promise<ProcessResult | null> {
  return readFile(fileId, FileType.RESULT);
}

/**
 * 保存AI分析结果
 * @param fileId 文件ID
 * @param aiInsights AI分析结果
 * @returns 文件路径
 */
export async function saveAiAnalysisResult(fileId: string, aiInsights: AIInsights): Promise<string> {
  return saveFile(fileId, aiInsights, FileType.AI_RESULT);
}

/**
 * 获取AI分析结果
 * @param fileId 文件ID
 * @returns AI分析结果
 */
export async function getAiAnalysisResult(fileId: string): Promise<AIInsights | null> {
  return readFile(fileId, FileType.AI_RESULT);
}

/**
 * 获取完整的分析数据（包含基础分析和AI分析）
 * @param fileId 文件ID
 * @returns 完整的分析数据
 */
export async function getCompleteAnalysisData(fileId: string): Promise<AnalysisData | null> {
  // 获取分析结果数据
  const analysisData = await readFile(fileId, FileType.RESULT) as AnalysisData;

  if (!analysisData) {
    return null;
  }

  // 获取AI分析结果
  const aiInsights = await getAiAnalysisResult(fileId);

  // 合并结果
  return {
    ...analysisData,
    ...(aiInsights ? { aiInsights } : {})
  };
}

/**
 * 保存完整的分析数据（包含基础分析和AI分析）
 * @param fileId 文件ID
 * @param data 完整的分析数据
 * @returns 文件路径
 */
export async function saveCompleteAnalysisData(fileId: string, data: ProcessResult & { aiInsights?: AIInsights }): Promise<string> {
  // 保存基础分析结果
  await saveProcessResult(fileId, data);

  // 如果有AI分析结果，也保存它
  if (data.aiInsights) {
    await saveAiAnalysisResult(fileId, data.aiInsights);
  }

  return getFilePath(fileId, FileType.RESULT);
}

/**
 * 检查文件是否存在
 * @param fileId 文件ID
 * @param type 文件类型
 * @returns 文件是否存在
 */
export async function fileExists(fileId: string, type: FileType): Promise<boolean> {
  const filePath = getFilePath(fileId, type);
  return fs.existsSync(filePath);
}

/**
 * 检查是否有AI分析结果
 * @param fileId 文件ID
 * @returns 是否有AI分析结果
 */
export async function hasAiAnalysisResult(fileId: string): Promise<boolean> {
  return fileExists(fileId, FileType.AI_RESULT);
}
