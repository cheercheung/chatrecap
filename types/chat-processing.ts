import { ProcessResult, PlatformType, RawMessage } from '@/lib/chat-processing/types';

// Re-export these types so they can be imported from this module
export type { ProcessResult, PlatformType, RawMessage };

/**
 * 文件上传响应
 */
export interface FileUploadResponse {
  success: boolean;
  fileId?: string;
  message: string;
}

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
 * 文件处理状态响应
 */
export interface FileStatusResponse {
  success: boolean;
  status?: FileStatus;
  message?: string;
}

/**
 * 处理结果响应
 */
export interface ProcessResultResponse {
  success: boolean;
  result?: ProcessResult;
  message?: string;
}

/**
 * 聊天分析页面组件属性
 */
export interface ChatRecapAnalysisPageProps {
  platform?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  uploadBoxData?: any;
}

/**
 * 聊天结果页面组件属性
 */
export interface ChatRecapResultPageProps {
  result: ProcessResult;
  className?: string;
}

/**
 * 文件上传组件属性
 */
export interface FileUploadBlockProps {
  platform: PlatformType;
  onUploadComplete: (fileId: string) => void;
  className?: string;
}

/**
 * 处理状态组件属性
 */
export interface ProcessingStatusBlockProps {
  fileId: string;
  onProcessComplete: (result: ProcessResult, fileId?: string) => void;
  className?: string;
  translations?: any; // 添加翻译文本属性
}

/**
 * 结果摘要组件属性
 */
export interface ResultSummaryBlockProps {
  result: ProcessResult;
  className?: string;
}

/**
 * 消息列表组件属性
 */
export interface MessageListBlockProps {
  messages: RawMessage[];
  className?: string;
}

/**
 * 统计信息组件属性
 */
export interface StatsBlockProps {
  stats: ProcessResult['stats'];
  className?: string;
}

/**
 * 警告信息组件属性
 */
export interface WarningsBlockProps {
  warnings: string[];
  className?: string;
}
