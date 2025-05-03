import { findOrderByOrderNo, updateOrderStatus, OrderStatus } from "@/models/prisma-order";
import { getProcessResult } from "@/lib/storage/index";
import { AIInsights } from "@/types/analysis";

/**
 * 执行AI分析
 * 处理订单验证、数据获取、AI分析和结果保存
 *
 * @param orderNo 订单编号
 * @param locale 语言，默认为英文
 * @param customFileId 可选的自定义文件ID，如果提供则使用此ID而不是订单号
 * @returns 分析结果对象，包含fileId和analysisResult
 */
export async function performAIAnalysis(orderNo: string, locale: string = 'en', customFileId?: string) {
  try {
    // 获取订单信息
    const order = await findOrderByOrderNo(orderNo);
    if (!order) {
      throw new Error("Order not found");
    }

    // 检查订单状态
    if (order.status !== OrderStatus.PAID) {
      throw new Error("Order not paid");
    }

    // 确定要使用的文件ID
    // 优先使用传入的自定义fileId，其次使用订单中的fileId，最后使用订单号作为备选
    const fileId = customFileId || order.fileId || orderNo;

    if (!fileId) {
      throw new Error("File ID not found in order");
    }

    console.log(`Using fileId ${fileId} for AI analysis of order ${orderNo}`);

    // 获取处理后的数据
    const processedData = await getProcessResult(fileId);
    if (!processedData) {
      throw new Error("Processed data not found or empty");
    }

    // 如果需要原始消息数据，从清理后的数据文件中获取
    const { readFile, FileType } = await import("@/lib/storage/index");
    const cleanedData = await readFile(fileId, FileType.CLEANED);
    if (!cleanedData || !Array.isArray(cleanedData) || cleanedData.length === 0) {
      console.warn("Cleaned data not found or empty, but continuing with analysis");
    }

    // 直接调用AI分析函数，而不是通过API
    // 导入AI分析模块
    console.log("Importing AI analysis module...");
    const { generateAIInsights } = await import("../lib/analysis/ai-insights");

    // 生成AI分析结果
    console.log("Generating AI insights...");
    try {
      const aiInsights = await generateAIInsights(processedData, locale);

      if (!aiInsights) {
        console.error("AI insights generation returned null or undefined");
        throw new Error("AI analysis failed to generate insights");
      }

      // 保存AI分析结果
      console.log("Saving AI analysis result...");
      const { saveAiAnalysisResult } = await import("@/lib/storage/index");
      await saveAiAnalysisResult(fileId, aiInsights);
      console.log("AI analysis result saved successfully");

      return {
        fileId,
        analysisResult: aiInsights
      };
    } catch (error) {
      console.error("Error during AI insights generation:", error);
      throw error;
    }

    // 更新订单状态已经在前面完成，这里不需要再次更新
  } catch (e: any) {
    console.error("AI analysis failed:", e);
    throw e;
  }
}
