/**
 * 文件验证模块
 * 用于验证文件大小、类型等
 */

// 支持的文件类型
export enum SupportedFileType {
  JSON = 'application/json',
  TEXT = 'text/plain',
  ZIP = 'application/zip',
  CSV = 'text/csv'
}

// 文件大小限制（字节）
export const FILE_SIZE_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MIN_FILE_SIZE: 10, // 10字节
  MAX_JSON_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_TEXT_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_ZIP_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_CSV_SIZE: 5 * 1024 * 1024 // 5MB
};

// 文件内容限制
export const CONTENT_LIMITS = {
  MAX_MESSAGES: 100000, // 最大消息数
  MAX_MESSAGE_LENGTH: 10000, // 最大消息长度
  MAX_SENDER_LENGTH: 100 // 最大发送者名称长度
};

/**
 * 验证文件大小
 * @param size 文件大小（字节）
 * @param type 文件类型
 * @returns 验证结果
 */
export function validateFileSize(size: number, type?: string): { valid: boolean; message?: string } {
  // 检查最小文件大小
  if (size < FILE_SIZE_LIMITS.MIN_FILE_SIZE) {
    return {
      valid: false,
      message: `文件太小，最小文件大小为 ${FILE_SIZE_LIMITS.MIN_FILE_SIZE} 字节`
    };
  }

  // 检查最大文件大小（根据类型）
  if (type) {
    switch (type) {
      case SupportedFileType.JSON:
        if (size > FILE_SIZE_LIMITS.MAX_JSON_SIZE) {
          return {
            valid: false,
            message: `JSON文件太大，最大允许 ${FILE_SIZE_LIMITS.MAX_JSON_SIZE / (1024 * 1024)} MB`
          };
        }
        break;
      case SupportedFileType.TEXT:
        if (size > FILE_SIZE_LIMITS.MAX_TEXT_SIZE) {
          return {
            valid: false,
            message: `文本文件太大，最大允许 ${FILE_SIZE_LIMITS.MAX_TEXT_SIZE / (1024 * 1024)} MB`
          };
        }
        break;
      case SupportedFileType.ZIP:
        if (size > FILE_SIZE_LIMITS.MAX_ZIP_SIZE) {
          return {
            valid: false,
            message: `ZIP文件太大，最大允许 ${FILE_SIZE_LIMITS.MAX_ZIP_SIZE / (1024 * 1024)} MB`
          };
        }
        break;
      case SupportedFileType.CSV:
        if (size > FILE_SIZE_LIMITS.MAX_CSV_SIZE) {
          return {
            valid: false,
            message: `CSV文件太大，最大允许 ${FILE_SIZE_LIMITS.MAX_CSV_SIZE / (1024 * 1024)} MB`
          };
        }
        break;
    }
  } else {
    // 如果没有指定类型，使用通用限制
    if (size > FILE_SIZE_LIMITS.MAX_FILE_SIZE) {
      return {
        valid: false,
        message: `文件太大，最大允许 ${FILE_SIZE_LIMITS.MAX_FILE_SIZE / (1024 * 1024)} MB`
      };
    }
  }

  return { valid: true };
}

/**
 * 验证文件类型
 * @param type 文件MIME类型
 * @param filename 文件名
 * @returns 验证结果
 */
export function validateFileType(type: string, filename?: string): { valid: boolean; message?: string } {
  // 检查是否是支持的MIME类型
  const supportedTypes = Object.values(SupportedFileType);
  if (!supportedTypes.includes(type as SupportedFileType)) {
    // 如果MIME类型不支持，尝试从文件扩展名判断
    if (filename) {
      const extension = filename.split('.').pop()?.toLowerCase();
      if (extension === 'json') {
        return { valid: true };
      } else if (extension === 'txt') {
        return { valid: true };
      } else if (extension === 'zip') {
        return { valid: true };
      } else if (extension === 'csv') {
        return { valid: true };
      }
    }

    return {
      valid: false,
      message: `不支持的文件类型: ${type}，支持的类型: JSON, TXT, ZIP, CSV`
    };
  }

  return { valid: true };
}

/**
 * 验证消息数组
 * @param messages 消息数组
 * @returns 验证结果
 */
export function validateMessages(messages: any[]): { valid: boolean; message?: string } {
  // 检查消息数量
  if (messages.length > CONTENT_LIMITS.MAX_MESSAGES) {
    return {
      valid: false,
      message: `消息数量超过限制，最大允许 ${CONTENT_LIMITS.MAX_MESSAGES} 条消息`
    };
  }

  // 检查每条消息
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    
    // 检查消息格式
    if (!message.sender || !message.content) {
      return {
        valid: false,
        message: `消息格式无效，缺少必要字段: sender, content`
      };
    }
    
    // 检查消息长度
    if (message.content.length > CONTENT_LIMITS.MAX_MESSAGE_LENGTH) {
      return {
        valid: false,
        message: `消息内容过长，最大允许 ${CONTENT_LIMITS.MAX_MESSAGE_LENGTH} 个字符`
      };
    }
    
    // 检查发送者名称长度
    if (message.sender.length > CONTENT_LIMITS.MAX_SENDER_LENGTH) {
      return {
        valid: false,
        message: `发送者名称过长，最大允许 ${CONTENT_LIMITS.MAX_SENDER_LENGTH} 个字符`
      };
    }
  }

  return { valid: true };
}
