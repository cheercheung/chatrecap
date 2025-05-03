import { sampleAiInsights } from "@/lib/analysis/sampleData";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import Empty from "@/components/blocks/empty";
import AiInsightResultPage from "@/components/pages/ai-insight-result";
import crypto from 'crypto';
import { getCompleteAnalysisData } from "@/lib/storage/index";
import { AIInsights, AnalysisData } from "@/types/analysis";
import logger from "@/lib/utils/logger";

// 强制使用服务器端渲染
export const dynamicParams = true;

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

  // 处理Creem支付回调
  const searchParamsData = await searchParams;
  const { id, fileId, request_id, checkout_id, order_id, customer_id, subscription_id, product_id, signature } = searchParamsData;

  // 如果有支付回调参数，处理支付成功逻辑
  if (request_id && signature) {
    try {
      // 验证签名
      const apiKey = process.env.CREEM_API_KEY || "";
      const params = {
        request_id,
        checkout_id,
        order_id,
        customer_id,
        subscription_id,
        product_id
      };

      // 生成签名
      const data = Object.entries(params)
        .filter(([_, value]) => value !== null && value !== undefined)
        .map(([key, value]) => `${key}=${value}`)
        .concat(`salt=${apiKey}`)
        .join('|');

      const calculatedSignature = crypto.createHash('sha256').update(data).digest('hex');
      const isValid = calculatedSignature === signature;

      if (!isValid) {
        return <Empty message={t("errors.invalid_signature") || "Invalid signature"} />;
      }

      // 导入Prisma订单模型
      const { findOrderByOrderNo, updateOrderStatus, OrderStatus } = await import("@/models/prisma-order");

      // 查找订单
      const order = await findOrderByOrderNo(request_id);

      // 如果订单不存在，显示错误
      if (!order) {
        return <Empty message={t("errors.order_not_found") || "Order not found"} />;
      }

      // 如果订单状态是待处理，更新为已完成
      if (order.status === OrderStatus.PENDING) {
        await updateOrderStatus(request_id, OrderStatus.PAID, checkout_id);
      }

      // 从订单中获取关联的文件ID
      // 订单表中存储了fileId字段
      const fileId = order.fileId || request_id;

      if (!fileId) {
        return <Empty message={t("errors.file_not_found") || "File not found"} />;
      }

      // 导入AI分析服务
      const { performAIAnalysis } = await import("@/services/ai-analysis");

      try {
        // 支付成功后，触发AI分析，传递正确的fileId
        await performAIAnalysis(request_id, 'en', fileId);

        // 分析完成后，重定向到带有fileId参数的URL
        // 不再使用analyzing参数，直接重定向到结果页面
        return redirect(`/ai-insight-result?fileId=${fileId}`);
      } catch (error) {
        // 检查错误是否是重定向错误
        if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
          // 这是正常的重定向，让它继续执行
          throw error;
        }

        console.error("AI analysis failed:", error);
        // 如果AI分析确实失败，重定向到基础分析结果页面
        return redirect(`/chatrecapresult?fileId=${fileId}`);
      }
    } catch (error) {
      // 检查错误是否是重定向错误
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        // 这是正常的重定向，让它继续执行
        throw error;
      }

      console.error("Error processing payment callback:", error);
      return <Empty message={t("errors.payment_processing_failed") || "Payment processing failed"} />;
    }
  }

  // 支持 id 或 fileId 参数
  const analysisId = searchParamsData.id || searchParamsData.fileId;
  const analyzing = searchParamsData.analyzing === 'true';

  try {
    // Data fetching logic
    let aiInsights: AIInsights;
    let fullAnalysisData: AnalysisData | null;

    if (analysisId) {
      // If ID is provided, fetch the corresponding analysis data
      fullAnalysisData = await getCompleteAnalysisData(analysisId);

      if (!fullAnalysisData) {
        return <Empty message={t("errors.not_found")} />;
      }

      if (!fullAnalysisData.aiInsights) {
        return <Empty message={t("errors.ai_insights_not_found") || "AI insights not found"} />;
      }

      aiInsights = fullAnalysisData.aiInsights;
    } else {
      // If no ID is provided, use sample data
      aiInsights = sampleAiInsights;

      // Create a sample analysis data with AI insights
      const { generateSampleAnalysisData } = await import("@/lib/analysis/sampleData");
      fullAnalysisData = generateSampleAnalysisData("sample");

      // Ensure sample data includes AI insights
      if (fullAnalysisData) {
        fullAnalysisData.aiInsights = sampleAiInsights;
      }
    }

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