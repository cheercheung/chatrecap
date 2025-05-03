/**
 * 错误处理工具
 */

/**
 * 标准化错误对象
 * @param error 原始错误
 * @returns 标准化的错误对象
 */
export function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(String(error));
}

/**
 * 记录错误
 * @param context 错误上下文
 * @param error 错误对象
 */
export function logError(context: string, error: unknown): void {
  const normalizedError = normalizeError(error);
  console.error(`[${context}] 错误:`, normalizedError.message);
  
  if (normalizedError.stack) {
    console.error(`[${context}] 堆栈:`, normalizedError.stack);
  }
}

/**
 * 创建用户友好的错误消息
 * @param error 错误对象
 * @param defaultMessage 默认消息
 * @returns 用户友好的错误消息
 */
export function createUserFriendlyErrorMessage(error: unknown, defaultMessage: string): string {
  const normalizedError = normalizeError(error);
  
  // 如果是已知错误类型，返回原始消息
  if (normalizedError.name !== 'Error') {
    return normalizedError.message;
  }
  
  // 否则返回默认消息
  return defaultMessage;
}

/**
 * 安全执行函数
 * @param fn 要执行的函数
 * @param errorHandler 错误处理函数
 * @returns 函数执行结果
 */
export async function safeExecute<T>(
  fn: () => Promise<T>,
  errorHandler: (error: unknown) => T
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    return errorHandler(error);
  }
}
