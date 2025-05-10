import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

// Temporarily override locales to only support English
const supportedLocales = ['en'];
const defaultLocaleOverride = 'en';

// 需要认证的路由
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
  // 添加其他需要认证的路由
];

// 不需要认证的路由（即使用户已登录）
const PUBLIC_ONLY_ROUTES = [
  '/auth/signin',
  '/en/auth/signin',
  // 添加其他仅限未登录用户访问的路由
];

// 创建国际化中间件
const intlMiddleware = createIntlMiddleware({
  locales: supportedLocales,
  defaultLocale: defaultLocaleOverride,
  localeDetection: false,
  localePrefix: 'as-needed'
});

export async function middleware(req: NextRequest) {
  // 先处理国际化
  const intlResponse = intlMiddleware(req);

  // 创建 Supabase 中间件客户端
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // 获取当前会话
  const { data: { session } } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;

  // 检查是否是受保护的路由
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    path === route || path.startsWith(`${route}/`)
  );

  // 检查是否是仅限公共访问的路由
  const isPublicOnlyRoute = PUBLIC_ONLY_ROUTES.some(route =>
    path === route || path.startsWith(`${route}/`)
  );

  // 如果是受保护的路由但用户未登录，重定向到登录页面
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/signin', req.url);
    redirectUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(redirectUrl);
  }


  console.log('Middleware: Allowing access to signin page for testing');

  // 返回国际化中间件的响应
  return intlResponse;
}

export const config = {
  // 匹配所有路径，除了以下路径
  matcher: [
    // 匹配所有路径，除了以下路径
    '/((?!api|_next|_vercel|auth/callback|.*\\..*).*)'
  ]
};
