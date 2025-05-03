import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@/prisma/schema';

// Function to find an order by order number
export async function findOrderByOrderNo(orderNo: string) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderNo
      }
    });
    return order;
  } catch (error) {
    console.error('Error finding order by order number:', error);
    return null;
  }
}

// Function to update order status
export async function updateOrderStatus(
  orderNo: string, 
  status: OrderStatus, 
  paymentId?: string
) {
  try {
    const updateData: any = { status };
    
    if (paymentId) {
      updateData.paymentId = paymentId;
    }
    
    const order = await prisma.order.update({
      where: {
        id: orderNo
      },
      data: updateData
    });
    
    return order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

// Re-export OrderStatus from Prisma schema
export { OrderStatus } from '@/prisma/schema';
