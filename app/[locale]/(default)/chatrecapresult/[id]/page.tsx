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

  const t = await getTranslations("chatrecapresult");

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
  const { id } = await params;
  const t = await getTranslations("chatrecapresult");

  try {
    const analysisData = await getAnalysisData(id);

    if (!analysisData) {
      return <Empty message={t("errors.not_found")} />;
    }

    return <ChatRecapResultPage analysisData={analysisData} />;
  } catch (error) {
    console.error("Error fetching analysis data:", error);
    return <Empty message={t("errors.loading_failed")} />;
  }
}
