import { getTranslations, getMessages } from "next-intl/server";
import ClientWrapper from "@/components/pages/chat-recap-result/client-wrapper";
import { generateSampleAnalysisData } from "@/lib/analysis/sampleData";
import { locales } from "@/i18n/locale";

// 暂时使用动态渲染，避免构建错误
// 后续可以改回静态渲染
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // 尝试获取翻译，如果失败则使用默认值
  let t: any;
  try {
    t = await getTranslations({ locale });
  } catch (error) {
    // 如果找不到翻译，使用一个函数返回默认值
    t = (key: string): string => {
      // 使用命名空间路径访问
      if (key === "chatrecapresult.title") return "Chat Recap Result";
      if (key === "chatrecapresult.description") return "View your chat analysis results";
      return key;
    };
  }

  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/chatrecapresult/sample`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/chatrecapresult/sample`;
  }

  return {
    title: `${t("chatrecapresult.title")} - Sample`,
    description: t("chatrecapresult.description"),
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ChatRecapSamplePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 获取示例分析数据
  const sampleData = generateSampleAnalysisData("sample");

  // 获取翻译消息
  const messages = await getMessages({ locale });

  // 使用客户端包装组件，提供国际化上下文
  return (
    <ClientWrapper
      analysisData={sampleData}
      messages={messages}
      locale={locale}
    />
  );
}
