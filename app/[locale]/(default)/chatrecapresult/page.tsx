import { getTranslations } from "next-intl/server";
import Empty from "@/components/blocks/empty";
import ChatRecapResultPageComponent from "@/components/pages/chat-recap-result";
import { generateSampleAnalysisData } from "@/lib/analysis/sampleData";
import { readFile, FileType } from "@/lib/storage/index";
import { AnalysisData } from "@/types/analysis";

// 使用动态渲染，但对于没有fileId的页面使用静态渲染
export const dynamic = 'auto';
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
    // 使用相对路径重定向，更简单高效
    return Response.redirect(`/${locale}/chatrecapresult/sample`);
  }

  // 直接从results目录获取分析数据
  const analysisData = await readFile(fileId, FileType.RESULT) as AnalysisData;

  // 如果没有找到分析数据，显示错误信息
  if (!analysisData) {
    return <Empty message={t("errors.result_not_found")} />;
  }

  // 显示处理结果 - pass data only, no UI elements
  return <ChatRecapResultPageComponent analysisData={analysisData} />;
}
