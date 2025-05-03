/**
 * 错误适配器
 * 用于标准化错误格式
 */

/**
 * 将错误对象转换为标准格式
 * @param error 错误对象
 * @returns 标准化的错误对象
 */
export function adaptError(error: any): { message: string; code?: string; details?: any } {
  if (!error) {
    return { message: '未知错误' };
  }

  // 如果已经是标准格式，直接返回
  if (typeof error === 'object' && error.message) {
    return {
      message: error.message,
      code: error.code,
      details: error.details
    };
  }

  // 如果是字符串，转换为标准格式
  if (typeof error === 'string') {
    return { message: error };
  }

  // 其他情况，尝试提取有用信息
  return {
    message: error.toString?.() || '未知错误',
    details: error
  };
}
