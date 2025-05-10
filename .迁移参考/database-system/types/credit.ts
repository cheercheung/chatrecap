/**
 * 积分交易类型定义
 */

export enum CreditTransactionType {
  RECHARGE = 'recharge',
  CONSUME = 'consume'
}

export type CreditTransaction = {
  // 交易ID
  id: number;
  
  // 用户UUID
  user_uuid: string;
  
  // 变动金额（正数为充值，负数为消费）
  amount: number;
  
  // 交易类型
  type: CreditTransactionType;
  
  // 关联订单UUID（仅充值时有值）
  order_uuid?: string;
  
  // 关联文件UUID（仅消费时有值）
  file_uuid?: string;
  
  // 创建时间
  created_at: string;
};
