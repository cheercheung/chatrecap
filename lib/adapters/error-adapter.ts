/**
 * 错误适配器
 * 将错误键转换为国际化错误消息
 */

import { ProcessResult } from '@/lib/chat-processing/types';
import { getErrorMessage } from '@/lib/i18n-utils';

/**
 * 将处理结果中的错误键转换为国际化错误消息
 * @param result 处理结果
 * @param locale 语言
 * @returns 处理结果（带有国际化错误消息）
 */
export async function adaptProcessResultErrors(
  result: ProcessResult,
  locale: string = 'en'
): Promise<ProcessResult> {
  if (!result.warnings || result.warnings.length === 0) {
    return result;
  }

  // 转换警告消息
  const translatedWarnings = await Promise.all(
    result.warnings.map(async (warning) => {
      try {
        // 检查是否是错误键
        if (warning.indexOf(' ') === -1 && warning.length < 30) {
          return await getErrorMessage(locale, warning);
        }
        return warning;
      } catch (error) {
        console.error(`Failed to translate warning: ${warning}`, error);
        return warning;
      }
    })
  );

  return {
    ...result,
    warnings: translatedWarnings
  };
}
