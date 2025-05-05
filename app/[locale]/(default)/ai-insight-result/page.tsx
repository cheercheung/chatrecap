import { sampleAiInsights } from "@/lib/analysis/sampleData";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import Empty from "@/components/blocks/empty";
import AiInsightResultPage from "@/components/pages/ai-insight-result";
import crypto from 'crypto';
import { getCompleteAnalysisData } from "@/lib/storage/index";
import { AIInsights, AnalysisData } from "@/types/analysis";
import logger from "@/lib/utils/logger";

// 使用动态渲染，但对于没有fileId的页面使用静态渲染
export const dynamic = 'auto';
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
    // Data fetching logic
    let aiInsights: AIInsights;
    let fullAnalysisData: AnalysisData | null;

    // If ID is provided, fetch the corresponding analysis data
    fullAnalysisData = await getCompleteAnalysisData(analysisId);

    if (!fullAnalysisData) {
      return <Empty message={t("errors.not_found")} />;
    }

    if (!fullAnalysisData.aiInsights) {
      return <Empty message={t("errors.ai_insights_not_found") || "AI insights not found"} />;
    }

    aiInsights = fullAnalysisData.aiInsights;

    const { relationshipInsights } = aiInsights;

    // Map relationship insights to the expected format
    const mappedInsights = (relationshipInsights?.points || []).map((item: { title: string; description: string }) => ({
      title: item.title,
      content: item.description,
    }));

    // Return the page component with data
    if (!fullAnalysisData) {
      return <Empty message={t("errors.not_found")} />;
    }

    // 如果正在分析中，显示loading页面
    if (analyzing) {
      // 使用内置的loading组件
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary mx-auto"></div>
            <h2 className="text-2xl font-semibold mt-6">AI 分析进行中...</h2>
            <p className="text-muted-foreground mt-2">
              我们正在对您的聊天记录进行深度分析，这可能需要几分钟时间。
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              页面将在分析完成后自动刷新，请勿关闭页面。
            </p>

            {/* 添加客户端脚本，定期检查分析状态 */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  // 每3秒检查一次分析状态
                  const interval = setInterval(() => {
                    fetch('/api/check-analysis-status?fileId=${analysisId}')
                      .then(response => response.json())
                      .then(data => {
                        if (data.success && data.data.completed) {
                          // 分析完成，刷新页面
                          window.location.href = '/ai-insight-result?fileId=${analysisId}';
                        }
                      })
                      .catch(error => console.error('Check analysis status failed:', error));
                  }, 3000);
                `
              }}
            />
          </div>
        </div>
      );
    }

    // 否则显示分析结果
    return (
      <AiInsightResultPage
        analysisData={fullAnalysisData}
        mappedInsights={mappedInsights}
      />
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