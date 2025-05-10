import { hasAiAnalysisResult } from "@/lib/storage/index";
import { respData, respErr } from "@/lib/resp";
import { getFileById, ChatFileStatus } from "@/services/file";

export async function GET(req: Request) {
  try {
    // 从URL参数中获取fileId
    const url = new URL(req.url, process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000');
    const fileId = url.searchParams.get('fileId');

    if (!fileId) {
      return respErr("文件ID不能为空");
    }

    // 从数据库获取文件记录
    const fileRecord = await getFileById(fileId);

    // 检查是否有AI分析结果（从存储中）
    const hasResult = await hasAiAnalysisResult(fileId);

    // 确定分析状态
    let status = 'unknown';
    let completed = false;

    if (fileRecord) {
      // 根据文件状态确定分析状态
      switch (fileRecord.status) {
        case ChatFileStatus.COMPLETE_AI:
          status = 'completed';
          completed = true;
          break;
        case ChatFileStatus.PROCESSING:
          status = 'processing';
          break;
        case ChatFileStatus.FAILED:
          status = 'failed';
          break;
        case ChatFileStatus.COMPLETED_BASIC:
          status = 'ready';
          break;
        default:
          status = 'not_ready';
      }
    } else if (hasResult) {
      // 如果数据库中没有记录但存储中有结果，也认为是完成的
      status = 'completed';
      completed = true;
    }

    return respData({
      status,
      completed,
      fileId,
      dbStatus: fileRecord?.status || null,
      hasStorageResult: hasResult
    });
  } catch (e: any) {
    console.error("Check analysis status failed:", e);
    return respErr("检查分析状态失败: " + e.message);
  }
}
