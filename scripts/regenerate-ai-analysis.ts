import { performAIAnalysis } from "@/services/ai-analysis";

// 文件ID
const fileId = "17c2f801-5a99-423f-a761-0cd8e5a083e5";
// 订单号（可以与文件ID相同）
const orderNo = "689302263259205";

async function main() {
  try {
    console.log(`开始为文件 ${fileId} 重新生成AI分析结果...`);
    const result = await performAIAnalysis(orderNo, 'en', fileId);
    console.log(`AI分析结果生成成功:`, result);
  } catch (error) {
    console.error(`生成AI分析结果失败:`, error);
  }
}

main();
