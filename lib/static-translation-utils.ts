/**
 * 静态翻译工具函数
 * 
 * 提供从静态翻译文件中获取翻译的工具函数
 */

/**
 * 创建一个静态翻译函数
 * 
 * @param translations 翻译对象
 * @returns 翻译函数
 */
export function createStaticTranslator(translations: Record<string, any>) {
  /**
   * 静态翻译函数
   * 
   * @param key 翻译键，使用点号分隔的路径
   * @param defaultValue 默认值，如果找不到翻译则返回此值
   * @returns 翻译文本
   */
  return function translate(key: string, defaultValue?: string): string {
    const keys = key.split('.');
    let result: any = translations;
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return defaultValue || key; // 如果找不到翻译，返回默认值或原始键
      }
    }
    
    return typeof result === 'string' ? result : (defaultValue || key);
  };
}

/**
 * 检查翻译键是否存在
 * 
 * @param translations 翻译对象
 * @param key 翻译键，使用点号分隔的路径
 * @returns 是否存在翻译
 */
export function hasTranslation(translations: Record<string, any>, key: string): boolean {
  const keys = key.split('.');
  let current: any = translations;
  
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return false;
    }
  }
  
  return current !== undefined && current !== null;
}
