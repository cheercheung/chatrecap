import { getAnalysisData } from "@/lib/analysis/sampleData";
import { getTranslations } from "next-intl/server";
import Empty from "@/components/blocks/empty";
import ChatRecapResultPage from "@/components/pages/chat-recap-result";

// 强制使用服务器端渲染
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/chatrecapresult/${id}`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/chatrecapresult/${id}`;
  }

  // 使用新的翻译系统，指定正确的命名空间
  const t = await getTranslations({ locale, namespace: 'results' });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ChatRecapResultDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  // 使用新的翻译系统，指定正确的命名空间
  const t = await getTranslations({ locale, namespace: 'results' });

  try {
    const analysisData = await getAnalysisData(id);

    if (!analysisData) {
      return <Empty message={t("no_data.no_messages_to_analyze")} />;
    }

    return <ChatRecapResultPage analysisData={analysisData} />;
  } catch (error) {
    console.error("Error fetching analysis data:", error);
    return <Empty message={t("no_data.no_messages_to_analyze")} />;
  }
}
