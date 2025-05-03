import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales } from './locale';

export default getRequestConfig(async ({ locale }) => {
  // 确保 locale 是支持的语言之一
  const safeLocale = typeof locale === 'string' && locales.includes(locale) ? locale : defaultLocale;

  // 动态导入语言文件
  const messages = (await import(`@/i18n/messages/${safeLocale}.json`)).default;

  return {
    locale: safeLocale,
    messages,
    timeZone: 'Asia/Shanghai',
    now: new Date(),
  };
});
