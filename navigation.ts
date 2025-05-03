import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

// 导入 i18n/locale.ts 中的配置
import { locales, defaultLocale } from './i18n/locale';

// 定义路由配置
export const routing = defineRouting({
  locales,
  defaultLocale,
  // 使用简单配置，详细配置可以参考 i18n/routing.ts
  localePrefix: 'as-needed'
});

// 创建导航工具
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
