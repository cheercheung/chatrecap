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
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png" },
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
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased overflow-x-hidden",
          fontSans.variable
        )}
      >
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
