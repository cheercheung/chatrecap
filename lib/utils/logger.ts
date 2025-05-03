/**
 * 日志工具函数
 * 
 * 在开发环境中输出日志，在生产环境中不输出
 */

// 是否启用调试日志
const DEBUG_ENABLED = process.env.NODE_ENV === 'development' && process.env.DEBUG_LOGS === 'true';

/**
 * 调试日志函数
 * 只在开发环境且DEBUG_LOGS=true时输出
 */
export function debug(...args: any[]) {
  if (DEBUG_ENABLED) {
    console.log(...args);
  }
}

/**
 * 信息日志函数
 * 只在开发环境输出
 */
export function info(...args: any[]) {
  if (process.env.NODE_ENV === 'development') {
    console.info(...args);
  }
}

/**
 * 警告日志函数
 * 在所有环境中输出
 */
export function warn(...args: any[]) {
  console.warn(...args);
}

/**
 * 错误日志函数
 * 在所有环境中输出
 */
export function error(...args: any[]) {
  console.error(...args);
}

// 默认导出所有日志函数
export default {
  debug,
  info,
  warn,
  error
};
