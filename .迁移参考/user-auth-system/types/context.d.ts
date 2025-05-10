import { ReactNode } from "react";
import { User } from "./user";

export interface ContextValue {
  // 主题
  theme?: string;
  setTheme?: (theme: string) => void;
  
  // 登录模态框显示状态
  showSignModal: boolean;
  setShowSignModal: (show: boolean) => void;
  
  // 用户信息
  user: User | null;
  setUser: (user: User | null) => void;
  
  // 其他上下文属性
  [propName: string]: any;
}
