import { updateOrderStatus, OrderStatus } from "@/services/order";
import crypto from 'crypto';
import { supabase } from '@/lib/supabase/client';
import { createServerAdminClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

// 不再使用配置对象，直接使用环境变量

// 创建支付会话 - 包含必要参数
export async function createCreemCheckout(params: {
  amount?: number; // 可选参数，仅用于记录订单金额，不传给Creem
  product_id: string; // 产品ID，用于区分不同套餐
  user_id: string; // 用户ID
}) {
  // 使用Supabase创建订单记录
  const supabaseAdmin = createServerAdminClient();

  try {
    // 生成订单号
    const order_no = uuidv4();

    console.log(`Creating order ${order_no}`);

    // 创建订单记录
    const { error: orderError } = await supabaseAdmin
      .from('Order')
      .insert({
        id: order_no,
        user_id: params.user_id, // 设置用户ID
        amount: params.amount ? params.amount / 100 : 9.9, // 如果提供了amount则转换为元，否则使用默认值9.9元
        status: OrderStatus.PENDING,
      })
      .select()
      .single();

    if (orderError) {
      console.error('创建订单记录失败:', orderError);
      throw orderError;
    }

    // 构建重定向URL，支付成功后直接跳转到dashboard
    const redirectUrl = `${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/dashboard`;

    // 准备Creem支付请求 - 包含所有必要参数
    const creemPayload = {
      product_id: params.product_id, // 使用传入的product_id
      request_id: order_no, // 使用生成的订单号作为request_id
      success_url: redirectUrl, // 支付成功后跳转到dashboard
      metadata: {
        order_no, // 在元数据中存储order_no
        user_id: params.user_id // 在元数据中存储user_id
      }
    };

    const apiUrl = process.env.CREEM_API_URL || 'https://test-api.creem.io';
    console.log('Creem API URL:', apiUrl);
    console.log('Creating checkout with payload:', JSON.stringify(creemPayload));

    // 调用Creem API创建支付会话
    const response = await fetch(`${apiUrl}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CREEM_API_KEY || 'creem_test_3sioDtbY5ADbmoODbQnNiW'
      },
      body: JSON.stringify(creemPayload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Creem API error response:', data);
      throw new Error(`Creem checkout failed: ${data.message || 'Unknown error'}`);
    }

    // 更新订单状态
    // 注意：我们不传递checkout_id，因为Order表中没有paymentId字段
    await updateOrderStatus(order_no, OrderStatus.PENDING);

    return {
      order_no,
      checkout_url: data.checkout_url
    };
  } catch (e: any) {
    console.error("Creem checkout failed:", e);
    throw e;
  }
}

// 验证签名
export interface RedirectParams {
  request_id?: string | null;
  checkout_id?: string | null;
  order_id?: string | null;
  customer_id?: string | null;
  subscription_id?: string | null;
  product_id?: string | null;
}

export function verifySignature(params: RedirectParams, signature: string): boolean {
  try {
    const apiKey = process.env.CREEM_API_KEY || 'creem_test_3sioDtbY5ADbmoODbQnNiW';
    const calculatedSignature = generateSignature(params, apiKey);
    return calculatedSignature === signature;
  } catch (e) {
    console.error("Signature verification failed:", e);
    return false;
  }
}

function generateSignature(params: RedirectParams, apiKey: string): string {
  const data = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .concat(`salt=${apiKey}`)
    .join('|');
  return crypto.createHash('sha256').update(data).digest('hex');
}

// 处理支付成功
export async function handlePaymentSuccess(requestId: string) {
  try {
    // 使用updateOrderStatus函数更新订单状态
    await updateOrderStatus(requestId, OrderStatus.PAID);

    console.log(`Order ${requestId} status updated to PAID`);
    return true;
  } catch (e) {
    console.error("Update order status failed:", e);
    return false;
  }
}

// 处理Creem支付回调
export async function handleCreemPaymentCallback(data: any) {
  try {
    if (!data || !data.metadata || data.status !== 'success') {
      throw new Error("Invalid payment data");
    }

    // 从元数据中获取order_no，如果不存在则使用request_id
    const order_no = data.metadata.order_no || data.request_id;

    // 记录支付详情
    console.log('Payment details:', JSON.stringify(data));

    try {
      // 使用updateOrderStatus函数更新订单状态
      // 注意：我们不传递checkout_id，因为Order表中没有paymentId字段
      await updateOrderStatus(order_no, OrderStatus.PAID);

      console.log(`Order ${order_no} status updated to PAID`);
    } catch (updateError) {
      console.error("Failed to update order status:", updateError);
      throw updateError;
    }

    console.log("Creem payment processed successfully:", order_no);
    return true;
  } catch (e) {
    console.error("Handle Creem payment failed:", e);
    throw e;
  }
}

// 验证支付状态
export async function verifyCreemPayment(order_no: string) {
  try {
    const apiUrl = process.env.CREEM_API_URL || 'https://test-api.creem.io';
    const apiKey = process.env.CREEM_API_KEY || 'creem_test_3sioDtbY5ADbmoODbQnNiW';

    // 调用Creem API验证支付状态
    const response = await fetch(`${apiUrl}/v1/orders/${order_no}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Verify payment failed: ${data.message || 'Unknown error'}`);
    }

    if (data.status === 'success') {
      try {
        // 使用updateOrderStatus函数更新订单状态
        // 注意：我们不传递checkout_id，因为Order表中没有paymentId字段
        await updateOrderStatus(order_no, OrderStatus.PAID);

        console.log(`Order ${order_no} status updated to PAID`);
        return true;
      } catch (updateError) {
        console.error("Failed to update order status:", updateError);
        throw updateError;
      }
    }

    return false;
  } catch (e) {
    console.error("Verify Creem payment failed:", e);
    return false;
  }
}
