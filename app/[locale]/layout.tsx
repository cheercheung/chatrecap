import "@/app/globals.css";

import { getTranslations } from "next-intl/server";

import { Inter as FontSans } from "next/font/google";
import { Metadata } from "next";
// Auth is disabled, so we're not using NextAuthSessionProvider
// import { NextAuthSessionProvider } from "@/auth/session";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import IntlProvider from "@/components/providers/intl-provider";
import Analytics from "@/components/analytics";

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
  const supportedLocales = ['en', 'zh', 'zh-CN', 'zh-TW'];
  const locale = isValidLocale && supportedLocales.includes(rawLocale) ? rawLocale : 'en';

  const t = await getTranslations({ locale });

  return {
    title: {
      template: `%s | ${t("metadata.title")}`,
      default: t("metadata.title") || "",
    },
    description: t("metadata.description") || "",
    keywords: t("metadata.keywords") || "",
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
  const supportedLocales = ['en', 'zh', 'zh-CN', 'zh-TW'];
  const safeLocale = isValidLocale && supportedLocales.includes(locale) ? locale : 'en';

  // 加载翻译数据
  let messages: Record<string, any> = {};
  try {
    // 只尝试加载有效且支持的语言区域
    if (isValidLocale && supportedLocales.includes(locale)) {
      messages = (await import(`@/i18n/messages/${safeLocale}.json`)).default;
    } else {
      if (!isValidLocale) {
        console.warn(`Invalid locale format detected: "${locale}", falling back to en`);
      } else if (!supportedLocales.includes(locale)) {
        console.warn(`Unsupported locale: "${locale}", falling back to en`);
      }
      messages = (await import(`@/i18n/messages/en.json`)).default;
    }
  } catch (error) {
    console.error(`Failed to load messages for locale: ${safeLocale}`, error);
    // 如果加载失败，尝试加载默认语言的翻译
    try {
      messages = (await import(`@/i18n/messages/en.json`)).default;
    } catch (fallbackError) {
      console.error('Failed to load fallback messages:', fallbackError);
      // 如果连默认语言也加载失败，使用空对象
      messages = {};
    }
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
          {children}
          <Toaster />
          <Analytics />
        </IntlProvider>
      </body>
    </html>
  );
}
