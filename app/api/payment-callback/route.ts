import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/services/order';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证支付回调数据
    if (!body.order_id || !body.payment_id || body.status !== 'success') {
      return NextResponse.json({ error: 'Invalid payment data' }, { status: 400 });
    }
    
    // 更新订单状态
    const order = await updateOrderStatus(body.order_id, 'paid', body.payment_id);
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
