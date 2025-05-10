import { NextRequest, NextResponse } from 'next/server';
import { createOrder, updateOrderStatus, OrderStatus } from '@/services/order';
import { getUserById } from '@/services/user';
import { v4 as uuidv4 } from 'uuid';

/**
 * 测试支付API - 创建订单并模拟支付成功
 * 
 * 请求参数:
 * - user_uuid: 用户ID
 * - amount: 金额（可选，默认9.9）
 * - credit_amount: 积分数量（可选，默认1000）
 * 
 * 响应:
 * - success: 是否成功
 * - order: 订单信息
 * - message: 消息
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求数据
    const data = await request.json();
    const { user_uuid, amount = 9.9, credit_amount = 1000 } = data;

    if (!user_uuid) {
      return NextResponse.json(
        { success: false, message: '缺少用户ID' },
        { status: 400 }
      );
    }

    // 检查用户是否存在
    const user = await getUserById(user_uuid);
    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 }
      );
    }

    // 1. 创建订单
    const order = await createOrder({
      user_uuid,
      amount,
      credit_amount,
      status: OrderStatus.PENDING
    });

    // 2. 模拟支付成功，更新订单状态
    const paymentId = `test_payment_${uuidv4()}`;
    const updatedOrder = await updateOrderStatus(
      order.uuid,
      OrderStatus.PAID,
      paymentId
    );

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: '测试支付成功，积分已增加'
    });
  } catch (error) {
    console.error('测试支付失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : '测试支付失败' 
      },
      { status: 500 }
    );
  }
}

/**
 * 获取测试支付说明
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: '测试支付API',
    usage: {
      method: 'POST',
      params: {
        user_uuid: '用户ID (必填)',
        amount: '金额 (可选，默认9.9)',
        credit_amount: '积分数量 (可选，默认1000)'
      },
      example: {
        request: {
          user_uuid: 'abc123',
          amount: 9.9,
          credit_amount: 1000
        },
        response: {
          success: true,
          order: {
            uuid: 'order123',
            user_uuid: 'abc123',
            amount: 9.9,
            credit_amount: 1000,
            status: 'paid',
            payment_id: 'test_payment_xyz',
            created_at: '2023-01-01T00:00:00Z'
          },
          message: '测试支付成功，积分已增加'
        }
      }
    }
  });
}
