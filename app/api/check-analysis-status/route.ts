import { hasAiAnalysisResult } from "@/lib/storage/index";
import { respData, respErr } from "@/lib/resp";

export async function GET(req: Request) {
  try {
    // 从URL参数中获取fileId
    const url = new URL(req.url);
    const fileId = url.searchParams.get('fileId');

    if (!fileId) {
      return respErr("文件ID不能为空");
    }

    // 检查是否有AI分析结果
    const hasResult = await hasAiAnalysisResult(fileId);

    return respData({
      completed: hasResult,
      fileId
    });
  } catch (e: any) {
    console.error("Check analysis status failed:", e);
    return respErr("检查分析状态失败: " + e.message);
  }
}
