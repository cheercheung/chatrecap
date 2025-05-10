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
 */
export async function createOrder(order: {
  user_uuid: string;
  amount: number;
  credit_amount: number;
  status?: string;
}) {
  try {
    const orderId = uuidv4();

    const { data, error } = await supabase
      .from('orders')
      .insert({
        uuid: orderId,
        user_uuid: order.user_uuid,
        amount: order.amount,
        credit_amount: order.credit_amount,
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
      .from('orders')
      .select('*')
      .eq('uuid', orderId)
      .single();

    if (fetchError) throw fetchError;

    // 如果订单已经是终态（已支付或已取消），则不允许再次更新
    if (orderData.status === OrderStatus.PAID || orderData.status === OrderStatus.CANCELLED) {
      throw new Error(`订单 ${orderId} 已经是终态: ${orderData.status}`);
    }

    // 准备更新数据
    const updateData: { status: string; payment_id?: string } = { status };

    // 如果提供了支付ID，添加到更新数据中
    if (paymentId) {
      updateData.payment_id = paymentId;
    }

    // 更新订单
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('uuid', orderId)
      .select()
      .single();

    if (error) {
      console.error('更新订单状态失败:', error);
      throw error;
    }

    // 如果订单状态更新为已支付，处理积分增加逻辑
    if (status === OrderStatus.PAID) {
      // 创建积分交易记录并更新用户积分余额
      await createCreditTransaction({
        user_uuid: data.user_uuid,
        amount: data.credit_amount,
        type: 'recharge',
        order_uuid: data.uuid
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
      .from('orders')
      .select('*')
      .eq('uuid', orderId)
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
      .from('orders')
      .select('*')
      .eq('user_uuid', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('获取用户订单历史失败:', error);
    return [];
  }
}