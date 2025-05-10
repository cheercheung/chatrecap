/**
 * 订单类型定义
 */

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled'
}

export type Order = {
  // 订单唯一标识符
  uuid: string;
  
  // 创建时间
  created_at: string;
  
  // 用户UUID
  user_uuid: string;
  
  // 金额（单位：分）
  amount: number;
  
  // 订单状态
  status: OrderStatus;
  
  // 购买的积分数量
  credit_amount: number;
  
  // 支付平台订单号
  payment_id?: string;
};
