import { getTranslations, getMessages } from "next-intl/server";
import ClientWrapper from "@/components/pages/chat-recap-result/client-wrapper";
import { generateSampleAnalysisData } from "@/lib/analysis/sampleData";

// 暂时使用动态渲染，避免构建错误
// 后续可以改回静态渲染
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // 使用新的翻译系统，指定正确的命名空间
  const t = await getTranslations({ locale, namespace: 'results' });

  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/chatrecapresult/sample`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/chatrecapresult/sample`;
  }

  return {
    title: `${t("title")} - Sample`,
    description: t("description"),
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
