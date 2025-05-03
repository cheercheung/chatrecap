import { performAIAnalysis } from "@/services/ai-analysis";
import { findOrderByOrderNo, OrderStatus } from "@/models/prisma-order";
import { respData, respErr } from "@/lib/resp";

export async function POST(req: Request) {
  try {
    const { orderNo } = await req.json();

    if (!orderNo) {
      return respErr("订单号不能为空");
    }

    // 检查订单状态
    const order = await findOrderByOrderNo(orderNo);
    if (!order) {
      return respErr("订单不存在");
    }

    if (order.status !== OrderStatus.PAID) {
      return respErr("订单未支付完成");
    }

    // 检查是否已经完成分析
    let analysisCompleted = false;

    // 直接使用 order.fileId
    const fileId = order.fileId || '';

    // 假设已支付的订单已经完成了分析
    if (order.status === OrderStatus.PAID && fileId) {
      return respData({
        status: "completed",
        message: "分析已完成",
        fileId
      });
    }

    // 触发AI分析
    const result = await performAIAnalysis(orderNo);

    return respData({
      status: "completed",
      message: "AI分析已完成",
      fileId: result.fileId
    });
  } catch (e: any) {
    console.error("Trigger analysis failed:", e);
    return respErr("AI分析失败: " + e.message);
  }
}
