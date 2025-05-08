import { getTranslations } from "next-intl/server";
import Empty from "@/components/blocks/empty";
import ChatRecapResultPageComponent from "@/components/pages/chat-recap-result";
import { generateSampleAnalysisData } from "@/lib/analysis/sampleData";
import { getCachedAnalysisData } from "@/lib/storage/cache";
import { AnalysisData } from "@/types/analysis";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// 使用增量静态再生成 (ISR)
// 这样页面会在构建时预渲染，并在后台定期更新
export const dynamic = 'force-dynamic'; // 对于有fileId的请求使用动态渲染
export const revalidate = 3600; // 1小时重新验证一次

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ fileId?: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();
  const { fileId } = await searchParams;

  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/chatrecapresult`;
  if (fileId) {
    canonicalUrl += `?fileId=${fileId}`;
  }

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/chatrecapresult`;
    if (fileId) {
      canonicalUrl += `?fileId=${fileId}`;
    }
  }

  return {
    title: t("chatrecapresult.title"),
    description: t("chatrecapresult.description"),
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ChatRecapResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ fileId?: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("chatrecapresult");
  const { fileId } = await searchParams;

  // 如果没有提供文件ID，重定向到示例页面
  if (!fileId) {
    // 使用Next.js的redirect函数，它会处理URL格式化
    redirect(`/${locale}/chatrecapresult/sample`);
  }

  // 使用缓存函数获取分析数据
  const analysisData = await getCachedAnalysisData(fileId);

  // 如果没有找到分析数据，显示错误信息
  if (!analysisData) {
    return <Empty message={t("errors.result_not_found")} />;
  }

  // 使用 Suspense 包装组件，提供加载占位符
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">loading...</div>
      </div>
    }>
      <ChatRecapResultPageComponent analysisData={analysisData} />
    </Suspense>
  );
}
