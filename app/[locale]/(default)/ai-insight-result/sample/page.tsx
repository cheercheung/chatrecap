import { getTranslations, getMessages } from "next-intl/server";
import ClientWrapper from "@/components/pages/ai-insight-result/client-wrapper";
import { generateSampleAnalysisData } from "@/lib/analysis/sampleData";
import { sampleAiInsights } from "@/lib/analysis/sampleData";

// 使用增量静态再生成 (ISR)，提高页面加载性能
export const dynamic = 'force-static';
export const revalidate = 86400; // 24小时 = 86400秒
export const fetchCache = 'force-cache';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // 使用新的翻译系统，指定正确的命名空间
  const t = await getTranslations({ locale, namespace: 'results' });

  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/ai-insight-result/sample`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/ai-insight-result/sample`;
  }

  return {
    title: `${t("title")} - Sample`,
    description: t("description"),
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function AiInsightSamplePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 获取示例分析数据
  const sampleData = generateSampleAnalysisData("sample");

  // 确保示例数据包含AI分析结果
  sampleData.aiInsights = sampleAiInsights;

  // 准备关系洞察数据
  const { relationshipInsights } = sampleAiInsights;

  // 映射关系洞察到预期的格式
  const mappedInsights = (relationshipInsights?.points || []).map((item: { title: string; description: string }) => ({
    title: item.title,
    content: item.description,
  }));

  // 获取翻译消息
  const messages = await getMessages({ locale });

  // 使用客户端包装组件，提供国际化上下文
  return (
    <ClientWrapper
      analysisData={sampleData}
      mappedInsights={mappedInsights}
      messages={messages}
      locale={locale}
    />
  );
}
