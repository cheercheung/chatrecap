import { supabase } from '@/lib/supabase/client';
import { createServerAdminClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';
import { createCreditTransaction } from './credit';

/**
 * 订单状态枚举
 */
export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  FAILED = 'failed'
}

/**
 * 创建订单
 *
 * @param order 订单信息
 * @param order.user_uuid 用户ID
 * @param order.amount 订单金额
 * @param order.credit_amount 积分数量（此字段在数据库中不存在，仅用于兼容旧代码）
 * @param order.status 订单状态（可选，默认为pending）
 * @returns 创建的订单
 */
export async function createOrder(order: {
  user_uuid: string;
  amount: number;
  credit_amount: number; // 此字段在数据库中不存在，仅用于兼容旧代码
  status?: string;
}) {
  try {
    const orderId = uuidv4();

    const { data, error } = await supabase
      .from('Order')
      .insert({
        id: orderId,
        user_id: order.user_uuid,
        amount: order.amount,
        status: order.status || OrderStatus.PENDING,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('创建订单失败:', error);
    throw error;
  }
}

/**
 * 更新订单状态
 * @param orderId 订单ID
 * @param status 新状态
 * @param paymentId 支付ID（可选）
 * @returns 更新后的订单
 */
export async function updateOrderStatus(orderId: string, status: string, paymentId?: string) {
  try {
    const supabaseAdmin = createServerAdminClient();

    // 获取订单信息
    const { data: orderData, error: fetchError } = await supabaseAdmin
      .from('Order')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError) throw fetchError;

    // 如果订单已经是终态（已支付或已取消），则不允许再次更新
    if (orderData.status === OrderStatus.PAID || orderData.status === OrderStatus.CANCELLED) {
      throw new Error(`订单 ${orderId} 已经是终态: ${orderData.status}`);
    }

    // 准备更新数据
    // 注意：根据数据库表结构，Order表可能没有payment_id列
    const updateData: { status: string } = { status };

    // 记录支付ID，但不更新到数据库
    if (paymentId) {
      console.log(`订单 ${orderId} 的支付ID: ${paymentId}`);
    }

    // 更新订单
    const { data, error } = await supabaseAdmin
      .from('Order')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('更新订单状态失败:', error);
      throw error;
    }

    // 如果订单状态更新为已支付，处理积分增加逻辑
    if (status === OrderStatus.PAID) {
      // 根据订单金额计算积分
      // 这里使用一个简单的规则：1元 = 100积分
      const creditAmount = Math.floor(Number(data.amount) * 100);

      // 创建积分交易记录并更新用户积分余额
      await createCreditTransaction({
        user_uuid: data.user_id,
        amount: creditAmount,
        type: 'recharge'
      });
    }

    return data;
  } catch (error) {
    console.error('更新订单状态失败:', error);
    throw error;
  }
}

/**
 * 获取订单详情
 * @param orderId 订单ID
 * @returns 订单详情
 */
export async function getOrderById(orderId: string) {
  try {
    const { data, error } = await supabase
      .from('Order')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('获取订单详情失败:', error);
    return null;
  }
}

/**
 * 获取用户订单历史
 * @param userId 用户ID
 * @returns 订单列表
 */
export async function getUserOrders(userId: string) {
  try {
    const { data, error } = await supabase
      .from('Order')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('获取用户订单历史失败:', error);
    return [];
  }
}