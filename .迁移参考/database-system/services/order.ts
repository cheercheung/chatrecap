/**
 * 订单服务
 */
import { prisma } from '../lib/prisma';
import { Order, OrderStatus } from '../types/order';
import { v4 as uuidv4 } from 'uuid';
import { createCreditTransaction } from './credit';
import { updateUserCreditBalance } from './user';

/**
 * 创建订单
 * @param order 订单信息
 * @returns 创建的订单信息
 */
export async function createOrder(order: Omit<Order, 'uuid' | 'created_at' | 'status' | 'payment_id'>): Promise<Order> {
  try {
    const result = await prisma.order.create({
      data: {
        uuid: uuidv4(),
        user_uuid: order.user_uuid,
        amount: order.amount,
        status: OrderStatus.PENDING,
        credit_amount: order.credit_amount,
      },
    });

    return {
      uuid: result.uuid,
      created_at: result.created_at.toISOString(),
      user_uuid: result.user_uuid,
      amount: result.amount,
      status: result.status as OrderStatus,
      credit_amount: result.credit_amount,
      payment_id: result.payment_id || undefined,
    };
  } catch (e) {
    console.error("create order failed:", e);
    throw e;
  }
}

/**
 * 根据UUID查找订单
 * @param uuid 订单UUID
 * @returns 订单信息
 */
export async function findOrderByUuid(uuid: string): Promise<Order | null> {
  try {
    const order = await prisma.order.findUnique({
      where: {
        uuid: uuid,
      },
    });

    if (!order) {
      return null;
    }

    return {
      uuid: order.uuid,
      created_at: order.created_at.toISOString(),
      user_uuid: order.user_uuid,
      amount: order.amount,
      status: order.status as OrderStatus,
      credit_amount: order.credit_amount,
      payment_id: order.payment_id || undefined,
    };
  } catch (e) {
    console.error("find order by uuid failed:", e);
    return null;
  }
}

/**
 * 更新订单状态
 * @param uuid 订单UUID
 * @param status 订单状态
 * @param payment_id 支付平台订单号
 * @returns 更新后的订单信息
 */
export async function updateOrderStatus(uuid: string, status: OrderStatus, payment_id?: string): Promise<Order | null> {
  try {
    const order = await prisma.order.findUnique({
      where: {
        uuid: uuid,
      },
    });

    if (!order) {
      return null;
    }

    // 如果订单已经是终态（已支付或已取消），则不允许再次更新
    if (order.status === OrderStatus.PAID || order.status === OrderStatus.CANCELLED) {
      throw new Error(`Order ${uuid} is already in final status: ${order.status}`);
    }

    // 更新订单状态
    const result = await prisma.order.update({
      where: {
        uuid: uuid,
      },
      data: {
        status: status,
        payment_id: payment_id,
      },
    });

    // 如果订单状态更新为已支付，则创建积分充值记录并更新用户积分余额
    if (status === OrderStatus.PAID) {
      await createCreditTransaction({
        user_uuid: result.user_uuid,
        amount: result.credit_amount,
        type: 'recharge',
        order_uuid: result.uuid,
      });

      await updateUserCreditBalance(result.user_uuid, result.credit_amount);
    }

    return {
      uuid: result.uuid,
      created_at: result.created_at.toISOString(),
      user_uuid: result.user_uuid,
      amount: result.amount,
      status: result.status as OrderStatus,
      credit_amount: result.credit_amount,
      payment_id: result.payment_id || undefined,
    };
  } catch (e) {
    console.error("update order status failed:", e);
    throw e;
  }
}

/**
 * 获取用户订单列表
 * @param user_uuid 用户UUID
 * @param limit 限制数量
 * @param offset 偏移量
 * @returns 订单列表
 */
export async function getUserOrders(user_uuid: string, limit: number = 10, offset: number = 0): Promise<Order[]> {
  try {
    const orders = await prisma.order.findMany({
      where: {
        user_uuid: user_uuid,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return orders.map(order => ({
      uuid: order.uuid,
      created_at: order.created_at.toISOString(),
      user_uuid: order.user_uuid,
      amount: order.amount,
      status: order.status as OrderStatus,
      credit_amount: order.credit_amount,
      payment_id: order.payment_id || undefined,
    }));
  } catch (e) {
    console.error("get user orders failed:", e);
    return [];
  }
}
