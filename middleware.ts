import createMiddleware from 'next-intl/middleware';
// import {locales, defaultLocale} from './i18n/locale';

// Temporarily override locales to only support English
const supportedLocales = ['en'];
const defaultLocaleOverride = 'en';

export default createMiddleware({
  // 支持的语言列表
  locales: supportedLocales,
  // 默认语言
  defaultLocale: defaultLocaleOverride,
  // 本地化检测
  localeDetection: false,
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
