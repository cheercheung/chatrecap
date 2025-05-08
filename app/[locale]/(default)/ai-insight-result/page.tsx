import { sampleAiInsights } from "@/lib/analysis/sampleData";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import Empty from "@/components/blocks/empty";
import AiInsightResultPage from "@/components/pages/ai-insight-result";
import crypto from 'crypto';
import { getCachedCompleteAnalysisData } from "@/lib/storage/cache";
import { AIInsights, AnalysisData } from "@/types/analysis";
import logger from "@/lib/utils/logger";
import { Suspense } from "react";

// 使用增量静态再生成 (ISR)
// 这样页面会在构建时预渲染，并在后台定期更新
export const dynamic = 'force-dynamic'; // 对于有fileId的请求使用动态渲染
export const revalidate = 3600; // 1小时重新验证一次

/**
 * Generate metadata for the AI Insight Result page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("chatrecapresult");

  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/ai-insight-result`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/ai-insight-result`;
  }

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

/**
 * AI Insight Result Page
 *
 * This page displays AI-generated insights about communication patterns
 * between two people based on their chat history.
 */
export default async function AiInsightResult({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string; fileId?: string; request_id?: string; checkout_id?: string; order_id?: string; customer_id?: string; subscription_id?: string; product_id?: string; signature?: string; analyzing?: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("chatrecapresult");

  // 获取URL参数
  const searchParamsData = await searchParams;

  // 支持 id 或 fileId 参数
  const analysisId = searchParamsData.id || searchParamsData.fileId;
  const analyzing = searchParamsData.analyzing === 'true';

  // 如果没有提供文件ID，重定向到示例页面
  if (!analysisId && !analyzing) {
    // 使用Next.js的redirect函数，它会处理URL格式化
    return redirect(`/${locale}/ai-insight-result/sample`);
  }

  try {
    // 使用缓存函数获取分析数据
    let aiInsights: AIInsights;
    let fullAnalysisData: AnalysisData | null;

    // 使用缓存函数获取完整分析数据
    fullAnalysisData = await getCachedCompleteAnalysisData(analysisId);

    if (!fullAnalysisData) {
      return <Empty message={t("errors.not_found")} />;
    }

    if (!fullAnalysisData.aiInsights) {
      return <Empty message={t("errors.ai_insights_not_found") || "AI insights not found"} />;
    }

    aiInsights = fullAnalysisData.aiInsights;

    const { relationshipInsights } = aiInsights;

    // 映射关系洞察到预期的格式
    const mappedInsights = (relationshipInsights?.points || []).map((item: { title: string; description: string }) => ({
      title: item.title,
      content: item.description,
    }));

    // 如果正在分析中，显示loading页面
    if (analyzing) {
      // 使用内置的loading组件
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary mx-auto"></div>
            <h2 className="text-2xl font-semibold mt-6">AI analysis....</h2>
            <p className="text-muted-foreground mt-2">
            we are analyzing your chat,which may spend several times
            </p>
            <p className="text-sm text-muted-foreground mt-4">
          Don't close the window!
            </p>

            {/* 使用 WebSocket 客户端组件检查分析状态 */}
            <div id="analysis-status-checker" data-file-id={analysisId} data-redirect-url={`/ai-insight-result?fileId=${analysisId}`}></div>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  // 动态加载分析状态检查器组件
                  (function() {
                    const script = document.createElement('script');
                    script.src = '/js/analysis-status-checker.js';
                    script.async = true;
                    document.body.appendChild(script);
                  })();
                `
              }}
            />
          </div>
        </div>
      );
    }

    // 使用 Suspense 包装组件，提供加载占位符
    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-xl">loading...</div>
        </div>
      }>
        <AiInsightResultPage
          analysisData={fullAnalysisData}
          mappedInsights={mappedInsights}
        />
      </Suspense>
    );
  } catch (error) {
    // 检查错误是否是重定向错误
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      // 这是正常的重定向，让它继续执行
      throw error;
    }

    console.error("Error in AI Insight Result page:", error);
    // 提供更详细的错误信息
    const errorMessage = error instanceof Error
      ? `${t("errors.loading_failed")}: ${error.message}`
      : t("errors.loading_failed");
    return <Empty message={errorMessage} />;
  }
}