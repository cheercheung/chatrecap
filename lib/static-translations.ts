/**
 * 静态翻译加载器
 * 用于在构建时加载所有需要的翻译文件，提高页面性能
 */

// 导入所有需要的翻译文件
import enCommon from '@/i18n/en/common.json';
import enUI from '@/i18n/en/ui.json';
import enLanding from '@/i18n/en/landing.json';
import enUpload from '@/i18n/en/upload.json';
import enPlatforms from '@/i18n/en/platforms.json';
import enSEO from '@/i18n/en/seo.json';
import enErrors from '@/i18n/en/errors.json';

// 合并所有Landing Page需要的翻译
export const landingTranslations = {
  common: enCommon,
  ui: enUI,
  landing: enLanding,
  upload: enUpload,
  platforms: enPlatforms,
  seo: enSEO,
  errors: enErrors
};

/**
 * 获取静态翻译
 * @param namespace 命名空间
 * @param key 翻译键
 * @param defaultValue 默认值
 * @returns 翻译文本
 */
export function getStaticTranslation(namespace: string, key: string, defaultValue: string = '') {
  const parts = key.split('.');
  let current: any = landingTranslations[namespace];
  
  if (!current) {
    return defaultValue || key;
  }
  
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return defaultValue || key;
    }
  }
  
  return current || defaultValue || key;
}

/**
 * 创建一个静态翻译函数
 * @param namespace 命名空间
 * @returns 翻译函数
 */
export function createStaticTranslator(namespace: string) {
  return (key: string, defaultValue: string = '') => getStaticTranslation(namespace, key, defaultValue);
}

/**
 * 验证翻译键是否存在
 * @param namespace 命名空间
 * @param key 翻译键
 * @returns 是否存在
 */
export function hasTranslation(namespace: string, key: string): boolean {
  const parts = key.split('.');
  let current: any = landingTranslations[namespace];
  
  if (!current) {
    return false;
  }
  
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return false;
    }
  }
  
  return current !== undefined && current !== null;
}
