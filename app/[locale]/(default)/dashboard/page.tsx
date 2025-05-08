import { getTranslations, getMessages } from "next-intl/server";
import DashboardClientWrapperNew from "@/components/pages/dashboard/client-wrapper-new";
import { getDashboardData } from "@/services/dashboard";

// 强制使用服务器端渲染
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });

  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/dashboard`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/dashboard`;
  }

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function DashboardPageRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 从服务获取仪表盘数据
  const dashboardData = await getDashboardData();

  // 获取翻译消息
  const messages = await getMessages({ locale, namespace: "dashboard" });

  // 使用新的客户端包装组件，提供国际化上下文
  return (
    <DashboardClientWrapperNew
      data={dashboardData}
      messages={messages}
      locale={locale}
    />
  );
}
