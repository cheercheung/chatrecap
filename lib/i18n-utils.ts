/**
 * 国际化工具函数
 */

import { getTranslations } from 'next-intl/server';

/**
 * 获取错误消息的国际化文本
 * @param locale 语言
 * @param key 错误消息键
 * @param params 替换参数
 * @returns 国际化错误消息
 */
export async function getErrorMessage(
  locale: string,
  key: string,
  params?: Record<string, string>
): Promise<string> {
  try {
    const t = await getTranslations({
      locale,
      namespace: 'chatrecapresult.processing_errors'
    });

    return t(key, params);
  } catch (error) {
    console.error(`Failed to get translation for ${key}:`, error);
    return key; // 如果获取翻译失败，返回键名
  }
}

/**
 * 创建国际化错误消息
 * @param error 错误对象
 * @param locale 语言
 * @returns 国际化错误消息
 */
export async function createI18nErrorMessage(
  error: unknown,
  locale: string = 'en'
): Promise<string> {
  const errorMessage = error instanceof Error ? error.message : String(error);

  try {
    return await getErrorMessage(locale, 'processing_failed', { message: errorMessage });
  } catch (error) {
    try {
      // 尝试从组件命名空间获取错误消息
      const t = await getTranslations({
        locale,
        namespace: 'components.error_messages'
      });
      return t('processing_failed', { message: errorMessage });
    } catch (innerError) {
      // 如果都失败了，返回默认错误消息
      return `Processing failed: ${errorMessage}`;
    }
  }
}
