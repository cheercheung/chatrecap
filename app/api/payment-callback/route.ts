import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus, OrderStatus, getOrderById } from '@/services/order';

/**
 * 支付回调处理API
 * 接收支付平台的回调通知，更新订单状态
 *
 * 请求参数:
 * - order_id: 订单ID
 * - payment_id: 支付ID
 * - status: 支付状态 ('success' | 'failed')
 *
 * 响应:
 * - success: 是否成功处理
 * - message: 处理结果消息
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证支付回调数据
    if (!body.order_id || !body.payment_id) {
      console.error('支付回调缺少必要参数:', body);
      return NextResponse.json({
        success: false,
        message: '缺少必要参数'
      }, { status: 400 });
    }

    // 检查支付状态
    const paymentStatus = body.status || 'success'; // 默认为成功
    const orderStatus = paymentStatus === 'success' ? OrderStatus.PAID : OrderStatus.FAILED;

    // 先检查订单是否存在
    const existingOrder = await getOrderById(body.order_id);
    if (!existingOrder) {
      console.error(`支付回调处理失败: 订单 ${body.order_id} 不存在`);
      return NextResponse.json({
        success: false,
        message: '订单不存在'
      }, { status: 404 });
    }

    // 如果订单已经是终态，直接返回成功（幂等性处理）
    if (existingOrder.status === OrderStatus.PAID) {
      console.log(`订单 ${body.order_id} 已经是已支付状态，无需再次处理`);
      return NextResponse.json({
        success: true,
        message: '订单已处理'
      });
    }

    // 更新订单状态
    const order = await updateOrderStatus(body.order_id, orderStatus, body.payment_id);

    console.log(`订单 ${body.order_id} 状态已更新为 ${orderStatus}`, {
      paymentId: body.payment_id,
      userId: order.user_id
    });

    return NextResponse.json({
      success: true,
      message: orderStatus === OrderStatus.PAID ? '支付成功' : '支付失败',
      order_id: body.order_id,
      status: orderStatus
    });
  } catch (error) {
    console.error('支付回调处理错误:', error);
    const errorMessage = error instanceof Error ? error.message : '内部服务器错误';

    return NextResponse.json({
      success: false,
      message: errorMessage
    }, { status: 500 });
  }
}
