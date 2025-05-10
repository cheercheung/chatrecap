/**
 * 聊天文件类型定义
 */

export enum ChatFileStatus {
  UPLOADED = 'uploaded',
  PROCESSING = 'processing',
  COMPLETED_BASIC = 'completed_basic',
  COMPLETE_AI = 'complete_ai',
  FAILED = 'failed'
}

export type ChatFile = {
  // 文件唯一标识符
  uuid: string;
  
  // 用户UUID（可以为null，表示未登录用户）
  user_uuid?: string;
  
  // 会话标识符（用于后续关联未登录用户）
  session_id?: string;
  
  // 文件类型
  file_type: string;
  
  // 处理状态
  status: ChatFileStatus;
  
  // 创建时间
  created_at: string;
  
  // 文字数量
  words_count?: number;
  
  // 存储路径
  storage_path?: string;
  
  // 基础分析结果存储路径
  basic_result_path?: string;
  
  // AI分析结果存储路径
  ai_result_path?: string;
};
