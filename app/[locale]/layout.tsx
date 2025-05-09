// 导入全局样式
import "../globals.css";

import { getTranslations } from "next-intl/server";
// 移除 Google 字体导入，改用系统字体
// import { Inter as FontSans } from "next/font/google";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import IntlProvider from "@/components/providers/intl-provider";
import ClientComponents from "@/components/providers/client-components";

// 定义一个变量来模拟字体配置，但不实际加载 Google 字体
const fontSans = {
  variable: "--font-sans"
};

export async function generateMetadata(): Promise<Metadata> {
  // 使用英语和正确的命名空间路径
  const t = await getTranslations({ locale: 'en', namespace: 'seo.metadata' });

  return {
    title: {
      template: `%s | ${t("title")}`,
      default: t("title"),
    },
    description: t("description"),
    keywords: t("keywords"),
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

type LayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function RootLayout({
  children,
  params,
}: LayoutProps) {
  // 直接使用英语
  const locale = 'en';

  // 加载翻译数据 - 只使用英语
  let messages: Record<string, any> = {};
  try {
    // 直接加载英文翻译文件
    const commonMessages = (await import(`@/i18n/en/common.json`)).default;
    const componentsMessages = (await import(`@/i18n/en/components.json`)).default;
    const platformsMessages = (await import(`@/i18n/en/platforms.json`)).default;
    const seoMessages = (await import(`@/i18n/en/seo.json`)).default;
    const errorsMessages = (await import(`@/i18n/en/errors.json`)).default;
    const uploadMessages = (await import(`@/i18n/en/upload.json`)).default;
    const resultsMessages = (await import(`@/i18n/en/results.json`)).default;

    // 合并所有翻译
    messages = {
      common: commonMessages,
      components: componentsMessages,
      platforms: platformsMessages,
      seo: seoMessages,
      errors: errorsMessages,
      upload: uploadMessages,
      results: resultsMessages,
    };

    console.log('Loaded English translations');
  } catch (error) {
    console.error(`Failed to load English messages`, error);
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
        className="min-h-screen bg-background font-sans antialiased overflow-x-hidden"
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
