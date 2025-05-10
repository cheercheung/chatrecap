/**
 * 用户类型定义
 */

export type User = {
  // 用户唯一标识符
  uuid: string;
  
  // 用户邮箱
  email: string;
  
  // 登录提供商 (google, github等)
  signin_provider?: string;
  
  // 提供商账号ID
  signin_openid?: string;
  
  // 当前积分余额
  credit_balance: number;
  
  // 创建时间
  created_at: string;
  
  // 更新时间
  updated_at: string;
};
