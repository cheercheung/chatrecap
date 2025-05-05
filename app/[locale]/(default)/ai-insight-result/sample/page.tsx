import { getTranslations } from "next-intl/server";
import StaticAiInsightResultPage from "@/components/pages/ai-insight-result/static";
import { generateSampleAnalysisData } from "@/lib/analysis/sampleData";
import { sampleAiInsights } from "@/lib/analysis/sampleData";
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
  let t;
  try {
    t = await getTranslations();
  } catch (error) {
    // 如果找不到翻译，使用一个函数返回默认值
    t = (key: string) => {
      // 使用命名空间路径访问
      if (key === "chatrecapresult.title") return "AI Insight Result";
      if (key === "chatrecapresult.description") return "View your AI-powered chat analysis insights";
      return key;
    };
  }

  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/ai-insight-result/sample`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/ai-insight-result/sample`;
  }

  return {
    title: `${t("chatrecapresult.title")} - Sample`,
    description: t("chatrecapresult.description"),
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

  // 使用静态优化版本的组件显示示例结果
  return <StaticAiInsightResultPage analysisData={sampleData} mappedInsights={mappedInsights} />;
}
