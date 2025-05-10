import { NextRequest, NextResponse } from 'next/server';
import { createOrder, updateOrderStatus, OrderStatus } from '@/services/order';
import { getUserCreditBalance } from '@/services/credit';
import { supabase } from '@/lib/supabase/client';

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
 * - credits: 用户当前积分余额
 * - message: 消息
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求数据
    const data = await request.json();
    // 注意：我们接收 user_uuid 参数，但在内部使用 user_id 字段
    const { user_uuid, amount = 9.9, credit_amount = 1000 } = data;
    const user_id = user_uuid; // 使用 user_uuid 作为 user_id

    console.log('测试支付: 收到请求参数', { user_uuid, user_id, amount, credit_amount });

    if (!user_uuid) {
      return NextResponse.json(
        { success: false, message: '缺少用户ID' },
        { status: 400 }
      );
    }

    // 跳过用户查询步骤，直接使用用户ID
    console.log(`测试支付: 使用用户ID ${user_id} 直接创建订单`);

    // 先查询所有用户，看看数据库中有哪些用户（仅用于调试）
    const { data: allUsers, error: allUsersError } = await supabase
      .from('User')
      .select('id, username, email')
      .limit(5);

    console.log('数据库中的用户示例:', {
      count: allUsers?.length || 0,
      samples: allUsers?.map(u => ({ id: u.id, email: u.email })) || [],
      error: allUsersError
    });

    // 由于我们确定用户存在，直接跳过用户查询步骤
    console.log(`测试支付: 假定用户 ${user_id} 存在，继续处理`);

    // 获取用户当前积分余额（用于对比增加前后）
    const balanceBefore = await getUserCreditBalance(user_id);

    // 1. 创建订单
    const order = await createOrder({
      user_uuid: user_id, // 使用 user_id 作为 user_uuid
      amount,
      credit_amount: 0, // 这个字段在数据库中不存在，但函数签名需要它
      status: OrderStatus.PENDING
    });

    console.log(`测试支付: 已创建订单 ${order.id}`, {
      userId: user_id,
      amount,
      creditAmount: credit_amount
    });

    // 2. 模拟支付成功，更新订单状态
    const updatedOrder = await updateOrderStatus(
      order.id, // 注意这里使用 id 而不是 uuid
      OrderStatus.PAID
    );

    // 3. 获取更新后的积分余额
    const balanceAfter = await getUserCreditBalance(user_id);
    const increasedAmount = balanceAfter - balanceBefore;

    console.log(`测试支付: 订单 ${order.id} 支付成功，积分已增加`, {
      userId: user_id,
      balanceBefore,
      balanceAfter,
      increasedAmount
    });

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        user_id: updatedOrder.user_id,
        amount: updatedOrder.amount,
        status: updatedOrder.status,
        created_at: updatedOrder.created_at
      },
      credits: {
        before: balanceBefore,
        after: balanceAfter,
        increased: increasedAmount
      },
      message: `测试支付成功，积分已增加 ${increasedAmount} 点`
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
            id: 'order123',
            user_id: 'abc123',
            amount: 9.9,
            status: 'paid',
            created_at: '2023-01-01T00:00:00Z'
          },
          credits: {
            before: 0,
            after: 1000,
            increased: 1000
          },
          message: '测试支付成功，积分已增加 1000 点'
        }
      }
    }
  });
}
