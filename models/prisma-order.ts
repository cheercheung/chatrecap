import { prisma } from '@/lib/prisma';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED'
}

export interface PrismaOrder {
  id: string; // 订单ID
  userId?: string;
  productId?: string;
  orderNo?: string;
  amount: number;
  currency?: string;
  status: OrderStatus;
  paymentId?: string;
  fileId?: string; // 关联的文件ID
  createdAt: Date;
}

export async function createPrismaOrder(order: Partial<PrismaOrder>): Promise<PrismaOrder | null> {
  try {
    // 使用导入的prisma实例而不是创建新实例

    const newOrder = await prisma.order.create({
      data: {
        id: order.id || order.orderNo || '',
        amount: order.amount || 0,
        status: order.status || OrderStatus.PENDING
      }
    });

    await prisma.$disconnect();
    return newOrder as PrismaOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

export async function getPrismaOrderById(id: string): Promise<PrismaOrder | null> {
  try {
    // 使用导入的prisma实例

    const order = await prisma.order.findUnique({
      where: { id }
    });

    await prisma.$disconnect();
    return order as PrismaOrder;
  } catch (error) {
    console.error('Error getting order by ID:', error);
    return null;
  }
}

export async function findOrderByOrderNo(orderNo: string): Promise<PrismaOrder | null> {
  try {
    console.log(`Finding order by order number: ${orderNo}`);
    // 使用导入的prisma实例

    const order = await prisma.order.findUnique({
      where: { id: orderNo }
    });

    await prisma.$disconnect();

    if (!order) {
      console.log(`Order ${orderNo} not found`);
      return null;
    }

    console.log(`Found order ${orderNo} with status ${order.status}`);
    return order as PrismaOrder;
  } catch (error) {
    console.error('Error finding order by order number:', error);
    // 数据库错误时返回null，不再返回模拟数据
    return null;
  }
}

export async function updateOrderStatus(orderNo: string, status: OrderStatus, paymentId?: string): Promise<boolean> {
  try {
    console.log(`Updating order ${orderNo} status to ${status}${paymentId ? ` with payment ID ${paymentId}` : ''}`);

    // 使用导入的prisma实例

    const updateData: any = { status };
    if (paymentId) {
      updateData.paymentId = paymentId;
    }

    await prisma.order.update({
      where: { id: orderNo },
      data: updateData
    });

    await prisma.$disconnect();
    console.log(`Order ${orderNo} status updated to ${status}`);
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false; // 返回false表示更新失败
  }
}
