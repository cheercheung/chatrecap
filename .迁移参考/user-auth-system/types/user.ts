/**
 * 用户类型定义
 */

export type User = {
  // 用户唯一标识符
  uuid: string;
  
  // 用户邮箱
  email: string;
  
  // 用户昵称
  nickname: string;
  
  // 用户头像URL
  avatar_url: string;
  
  // 登录类型 (oauth, credentials等)
  signin_type?: string;
  
  // 登录提供商 (google, github等)
  signin_provider?: string;
  
  // 提供商账号ID
  signin_openid?: string;
  
  // 创建时间
  created_at: string;
  
  // 登录IP
  signin_ip?: string;
  
  // 邀请人
  invited_by?: string;
  
  // 是否为推广员
  is_affiliate?: boolean;
};
