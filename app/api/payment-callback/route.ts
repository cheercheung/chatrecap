import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus, OrderStatus, findOrderByOrderNo } from '@/models/prisma-order';
import { performAIAnalysis } from '@/services/ai-analysis';

/**
 * 支付回调处理
 * 处理支付成功后的回调，更新订单状态，触发AI分析，然后重定向到结果页面
 */
export async function GET(request: NextRequest) {
  // 获取URL参数
  const searchParams = request.nextUrl.searchParams;
  const fileId = searchParams.get('fileId');
  const orderNo = searchParams.get('order_no');

  // 验证必要参数
  if (!fileId || !orderNo) {
    return NextResponse.redirect(new URL('/error?message=Missing+required+parameters', request.url));
  }

  try {
    // 查找订单
    const order = await findOrderByOrderNo(orderNo);

    // 如果订单不存在，重定向到错误页面
    if (!order) {
      return NextResponse.redirect(new URL('/error?message=Order+not+found', request.url));
    }

    // 如果订单状态是待处理，更新为已完成
    if (order.status === OrderStatus.PENDING) {
      await updateOrderStatus(orderNo, OrderStatus.PAID);
    }

    // 触发AI分析
    try {
      await performAIAnalysis(orderNo, 'en', fileId);
    } catch (error) {
      console.error('AI analysis failed:', error);
      // 即使AI分析失败，我们仍然继续处理
    }

    // 重定向到结果页面，只带fileId参数
    return NextResponse.redirect(new URL(`/ai-insight-result?fileId=${fileId}`, request.url));
  } catch (error) {
    console.error('Payment callback processing failed:', error);
    return NextResponse.redirect(new URL('/error?message=Payment+processing+failed', request.url));
  }
}
