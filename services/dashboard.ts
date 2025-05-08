import { DashboardData } from "@/types/dashboard";

/**
 * 获取仪表盘数据
 * 
 * 在实际应用中，这个函数应该从API获取数据
 * 目前使用模拟数据进行演示
 */
export async function getDashboardData(): Promise<DashboardData> {
  // 模拟数据 - 在实际应用中应该从API获取
  return {
    credits: 120,
    creditHistory: [
      { type: "purchase", amount: 100, date: "2023-05-01" },
      { type: "used", amount: -20, date: "2023-05-03" },
      { type: "used", amount: -10, date: "2023-05-10" }
    ],
    analysisHistory: [
      { id: "abc123", platform: "whatsapp", date: "2023-05-01" },
      { id: "def456", platform: "discord", date: "2023-05-03" },
      { id: "ghi789", platform: "whatsapp", date: "2023-05-10" }
    ]
  };
}
