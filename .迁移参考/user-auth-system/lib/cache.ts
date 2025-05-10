/**
 * 缓存工具函数
 */

/**
 * 设置缓存
 * @param key 缓存键
 * @param value 缓存值
 * @param expiresAt 过期时间戳
 */
export function cacheSet(key: string, value: any, expiresAt?: number): void {
  try {
    const item = {
      value: value,
      expiresAt: expiresAt || 0,
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (e) {
    console.error("cache set failed:", e);
  }
}

/**
 * 获取缓存
 * @param key 缓存键
 * @returns 缓存值
 */
export function cacheGet(key: string): any {
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }
    
    const item = JSON.parse(itemStr);
    const now = Date.now();
    
    // 检查是否过期
    if (item.expiresAt && item.expiresAt > 0 && now > item.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value;
  } catch (e) {
    console.error("cache get failed:", e);
    return null;
  }
}

/**
 * 移除缓存
 * @param key 缓存键
 */
export function cacheRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error("cache remove failed:", e);
  }
}
