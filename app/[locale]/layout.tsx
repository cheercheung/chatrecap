// 导入全局样式
import "../globals.css";

import { getTranslations } from "next-intl/server";
import { Inter as FontSans } from "next/font/google";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import IntlProvider from "@/components/providers/intl-provider";
import ClientComponents from "@/components/providers/client-components";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap", // 使用 swap 显示策略，提高感知性能
  preload: true,   // 预加载字体
  fallback: ["system-ui", "Arial", "sans-serif"], // 提供回退字体
  adjustFontFallback: true, // 自动调整回退字体以匹配 Web 字体
  weight: ["400", "500", "600", "700"], // 只加载必要的字重
});

export async function generateMetadata({
  params,
}: {
  params: { locale: string } | Promise<{ locale: string }>;
}): Promise<Metadata> {
  // 确保 params 已经被 await
  const { locale: rawLocale } = await Promise.resolve(params);

  // 验证语言区域是否有效
  const isValidLocale = /^[a-zA-Z-]+$/.test(rawLocale) && rawLocale.length <= 10;
  const supportedLocales = ['en', 'zh', 'es', 'it',"de","fr","ja","ko","tr"];
  const locale = isValidLocale && supportedLocales.includes(rawLocale) ? rawLocale : 'en';

  const t = await getTranslations({ locale });

  return {
    title: {
      template: `%s | ${t("metadata.title")}`,
      default: t("metadata.title") || "",
    },
    description: t("metadata.description") || "",
    keywords: t("metadata.keywords") || "",
    // 优化字体加载
    other: {
      "google-font-display": "swap",
    },
    // 预加载关键资源
    icons: {
      icon: [
        { url: "/favicon.ico" },
      ],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string } | Promise<{ locale: string }>;
}>) {
  // 确保 params 已经被 await
  const { locale } = await Promise.resolve(params);

  // 验证语言区域是否有效（只允许字母和短横线，且长度合理）
  const isValidLocale = /^[a-zA-Z-]+$/.test(locale) && locale.length <= 10;
  // 定义支持的语言列表
  const supportedLocales = ['en', 'zh', 'es', 'it',"de","fr","ja","ko","tr"];
  const safeLocale = isValidLocale && supportedLocales.includes(locale) ? locale : 'en';

  // 加载翻译数据 - 完整版本
  let messages: Record<string, any> = {};
  try {
    // 只尝试加载有效且支持的语言区域
    if (isValidLocale && supportedLocales.includes(locale)) {
      // 加载完整的翻译文件，不再过滤
      messages = (await import(`@/i18n/messages/${safeLocale}.json`)).default;
      console.log('Loaded full translations for locale:', safeLocale);
    } else {
      if (!isValidLocale) {
        console.warn(`Invalid locale format detected: "${locale}", falling back to en`);
      } else if (!supportedLocales.includes(locale)) {
        console.warn(`Unsupported locale: "${locale}", falling back to en`);
      }

      // 加载完整的英文翻译文件
      messages = (await import(`@/i18n/messages/en.json`)).default;
      console.log('Loaded full translations for fallback locale: en');
    }
  } catch (error) {
    console.error(`Failed to load messages for locale: ${safeLocale}`, error);
    // 如果加载失败，使用空对象
    messages = {};
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* 预加载关键字体 */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased overflow-x-hidden",
          fontSans.variable
        )}
        suppressHydrationWarning
      >
        {/* 优化脚本 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // 移除意外的属性
                if (document.body.hasAttribute('inmaintabuse')) {
                  document.body.removeAttribute('inmaintabuse');
                }

                // 字体加载优化
                if ('fonts' in document) {
                  // 预加载关键字体
                  Promise.all([
                    document.fonts.load('400 1em Inter'),
                    document.fonts.load('700 1em Inter')
                  ]).then(() => {
                    document.documentElement.classList.add('fonts-loaded');
                  });
                }
              })();
            `
          }}
        />
        <IntlProvider locale={locale} messages={messages}>
          {/* 添加骨架屏，减少感知加载时间 */}
          <div id="page-content">
            {children}
          </div>

          {/* 使用客户端组件包装器 */}
          <ClientComponents />
        </IntlProvider>
      </body>
    </html>
  );
}
