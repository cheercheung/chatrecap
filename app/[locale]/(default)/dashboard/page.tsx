import { getTranslations } from "next-intl/server";
import DashboardClientWrapper from "@/components/pages/dashboard/client-wrapper";
import { getDashboardData } from "@/services/dashboard";

// 强制使用服务器端渲染
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("dashboard");

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
  const t = await getTranslations("dashboard");

  // 从服务获取仪表盘数据
  const dashboardData = await getDashboardData();

  return (
    <DashboardClientWrapper
      data={dashboardData}
    />
  );
}
