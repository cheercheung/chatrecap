import { getSnowId } from "@/lib/hash";
import { updateOrderStatus, OrderStatus } from "@/models/prisma-order";
import crypto from 'crypto';

// 不再使用配置对象，直接使用环境变量

// 创建支付会话 - 包含必要参数
export async function createCreemCheckout(params: {
  amount?: number; // 可选参数，仅用于记录订单金额，不传给Creem
  fileId: string;
  product_id?: string; // 可选参数，如果提供则使用，否则使用环境变量中的默认值
}) {
  // 使用Prisma创建订单记录
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  try {
    // 生成订单号
    const order_no = getSnowId().toString();

    console.log(`Creating order ${order_no} for file ${params.fileId}`);

    // 创建订单记录
    await prisma.order.create({
      data: {
        id: order_no,
        amount: params.amount ? params.amount / 100 : 9.9, // 如果提供了amount则转换为美元，否则使用默认值9.9美元
        status: OrderStatus.PENDING,
        fileId: params.fileId
      }
    });

    // 构建重定向URL，包含fileId
    const redirectUrl = `${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/ai-insight-result?fileId=${params.fileId}`;

    // 准备Creem支付请求 - 包含所有必要参数
    const creemPayload = {
      product_id: params.product_id || process.env.CREEM_PRODUCT_ID || 'prod_7KaJdvcGzJFuSSlt2iDJjv', // 使用传入的product_id或环境变量
      request_id: order_no, // 使用生成的订单号作为request_id
      success_url: redirectUrl, // 使用包含fileId的重定向URL
      metadata: {
        file_id: params.fileId,
        order_no // 在元数据中同时存储order_no和file_id
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

    // 更新订单状态，添加支付ID
    await prisma.order.update({
      where: { id: order_no },
      data: {
        paymentId: data.checkout_id
      }
    });

    return {
      order_no,
      checkout_url: data.checkout_url
    };
  } catch (e: any) {
    console.error("Creem checkout failed:", e);
    throw e;
  } finally {
    // 确保断开数据库连接
    await prisma.$disconnect();
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
export async function handlePaymentSuccess(requestId: string, checkoutId: string) {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  try {
    // 使用Prisma事务更新订单状态
    await prisma.order.update({
      where: { id: requestId },
      data: {
        status: OrderStatus.PAID,
        paymentId: checkoutId
      }
    });

    console.log(`Order ${requestId} status updated to PAID with checkout ID ${checkoutId}`);
    return true;
  } catch (e) {
    console.error("Update order status failed:", e);
    return false;
  } finally {
    await prisma.$disconnect();
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

    // 使用Prisma事务更新订单状态
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    try {
      // 更新订单状态为已支付
      await prisma.order.update({
        where: { id: order_no },
        data: {
          status: OrderStatus.PAID,
          paymentId: data.checkout_id
        }
      });

      console.log(`Order ${order_no} status updated to PAID with checkout ID ${data.checkout_id}`);
    } catch (updateError) {
      console.error("Failed to update order status:", updateError);
      throw updateError;
    } finally {
      await prisma.$disconnect();
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
      // 支付成功，使用Prisma事务更新订单状态
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      try {
        // 更新订单状态为已支付
        await prisma.order.update({
          where: { id: order_no },
          data: {
            status: OrderStatus.PAID,
            paymentId: data.checkout_id
          }
        });

        console.log(`Order ${order_no} status updated to PAID with checkout ID ${data.checkout_id}`);
        return true;
      } catch (updateError) {
        console.error("Failed to update order status:", updateError);
        throw updateError;
      } finally {
        await prisma.$disconnect();
      }
    }

    return false;
  } catch (e) {
    console.error("Verify Creem payment failed:", e);
    return false;
  }
}
