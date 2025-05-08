import { getTranslations, getMessages } from "next-intl/server";
import ChatRecapAnalysisClientWrapper from "@/components/pages/chat-recap-analysis/client-wrapper-new";

// 强制使用服务器端渲染
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("chat_analysis");

  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/chatrecapanalysis`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/chatrecapanalysis`;
  }

  return {
    title: t("how_to_import"),
    description: t("description"),
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ChatRecapAnalysisPageRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("chat_analysis");

  // Prepare data for the page component
  const uploadBoxData = {
    primary_button: {
      title: t("analyze_button"),
      url: "/chatrecapresult",
      target: "_self",
      variant: "default"
    },
    secondary_button: {
      title: t("free_analysis"),
      url: "/chatrecapanalysis",
      target: "_self",
      variant: "secondary"
    }
  };

  // 获取翻译消息
  const messages = await getMessages({ locale });

  // 使用客户端包装组件，提供国际化上下文
  return (
    <ChatRecapAnalysisClientWrapper
      title={t("title")}
      subtitle={t("subtitle")}
      description={t("description")}
      uploadBoxData={uploadBoxData}
      messages={messages}
      locale={locale}
    />
  );
}
