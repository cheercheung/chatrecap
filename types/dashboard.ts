// 积分历史记录项
export interface CreditHistoryItem {
  type: 'purchase' | 'used';
  amount: number;
  date: string;
}

// 分析历史记录项
export interface AnalysisHistoryItem {
  id: string;
  platform: string;
  date: string;
}

// 仪表盘数据
export interface DashboardData {
  credits: number;
  creditHistory: CreditHistoryItem[];
  analysisHistory: AnalysisHistoryItem[];
}

// 仪表盘页面组件属性
export interface DashboardPageProps {
  credits: number;
  creditHistory: CreditHistoryItem[];
  analysisHistory: AnalysisHistoryItem[];
}
