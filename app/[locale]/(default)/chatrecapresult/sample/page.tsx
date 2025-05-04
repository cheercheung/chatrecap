import { getTranslations } from "next-intl/server";
import StaticChatRecapResultPage from "@/components/pages/chat-recap-result/static";
import { generateSampleAnalysisData } from "@/lib/analysis/sampleData";
import { locales } from "@/i18n/locale";

// 使用静态渲染，因为示例数据是固定的
// 这将确保页面在构建时生成，并且不会在运行时重新生成
export const dynamic = 'force-static';
export const revalidate = false; // 永不重新验证，因为示例数据不会改变

// 为所有支持的语言生成静态页面
export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

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
  // 获取示例分析数据
  const sampleData = generateSampleAnalysisData("sample");

  // 使用静态优化版本的组件显示示例结果
  return <StaticChatRecapResultPage analysisData={sampleData} />;
}
