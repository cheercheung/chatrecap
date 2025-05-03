import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './i18n/locale';

export default createMiddleware({
  // 支持的语言列表
  locales,
  // 默认语言
  defaultLocale,
  // 本地化检测
  localeDetection: true,
  // 本地化前缀
  localePrefix: 'as-needed'
});

export const config = {
  // 匹配所有路径，除了以下路径
  matcher: [
    // 匹配所有路径，除了以下路径
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
