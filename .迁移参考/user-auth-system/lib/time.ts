/**
 * 获取ISO格式的时间字符串
 * @returns ISO格式的时间字符串
 */
export function getIsoTimestr(): string {
  return new Date().toISOString();
}

/**
 * 获取当前时间戳（秒）
 * @returns 当前时间戳（秒）
 */
export function getTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}
