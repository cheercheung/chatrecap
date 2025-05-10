import { NextRequest } from 'next/server';
import { getFileById, ChatFileStatus } from '@/services/file';
import { checkUserCreditSufficient } from '@/services/credit';
import { createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { respData, respErr } from "@/lib/resp";

// AI分析所需的积分数量
const AI_ANALYSIS_CREDIT_COST = 10;

/**
 * AI分析触发检查API
 * 检查用户是否可以触发AI分析
 */
export async function GET(request: NextRequest) {
  try {
    // 从URL参数中获取fileId
    const fileId = request.nextUrl.searchParams.get('fileId');

    if (!fileId) {
      return respErr("文件ID不能为空");
    }

    // 获取文件记录
    const fileRecord = await getFileById(fileId);
    if (!fileRecord) {
      return respErr("文件不存在");
    }

    // 验证文件状态是否为 COMPLETED_BASIC
    if (fileRecord.status !== ChatFileStatus.COMPLETED_BASIC) {
      return respData({
        canTrigger: false,
        message: `文件状态不允许进行AI分析，当前状态: ${fileRecord.status}`,
        code: 'INVALID_STATE',
        requiredCredits: AI_ANALYSIS_CREDIT_COST
      });
    }

    // 获取当前用户
    const supabase = createServerClient(
      name => cookies().get(name),
      (name, value, options) => cookies().set(name, value, options)
    );
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      return respData({
        canTrigger: false,
        message: '用户未登录',
        code: 'NOT_AUTHENTICATED',
        requiredCredits: AI_ANALYSIS_CREDIT_COST
      });
    }

    // 检查用户积分是否足够
    const hasSufficientCredits = await checkUserCreditSufficient(userId, AI_ANALYSIS_CREDIT_COST);

    return respData({
      canTrigger: hasSufficientCredits,
      requiredCredits: AI_ANALYSIS_CREDIT_COST,
      message: hasSufficientCredits ? '可以触发AI分析' : '积分不足，无法进行AI分析',
      code: hasSufficientCredits ? 'CAN_TRIGGER' : 'INSUFFICIENT_CREDITS',
      fileId,
      fileStatus: fileRecord.status
    });
  } catch (error) {
    console.error('AI分析触发检查失败:', error);
    return respErr(error instanceof Error ? error.message : 'AI分析触发检查失败');
  }
}

/**
 * 触发AI分析API
 * 已被新的AI分析触发API替代，保留此API以兼容旧版本
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fileId } = body;

    if (!fileId) {
      return respErr("文件ID不能为空");
    }

    // 获取文件记录
    const fileRecord = await getFileById(fileId);
    if (!fileRecord) {
      return respErr("文件不存在");
    }

    // 检查文件状态
    if (fileRecord.status === ChatFileStatus.COMPLETE_AI) {
      return respData({
        status: "completed",
        message: "分析已完成",
        fileId
      });
    } else if (fileRecord.status !== ChatFileStatus.COMPLETED_BASIC) {
      return respErr(`文件状态不允许进行AI分析，当前状态: ${fileRecord.status}`);
    }

    // 获取当前用户
    const supabase = createServerClient(
      name => cookies().get(name),
      (name, value, options) => cookies().set(name, value, options)
    );
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      return respErr("用户未登录");
    }

    // 检查用户积分是否足够
    const hasSufficientCredits = await checkUserCreditSufficient(userId, AI_ANALYSIS_CREDIT_COST);
    if (!hasSufficientCredits) {
      return respErr("积分不足，无法进行AI分析");
    }

    // 重定向到新的AI分析API
    return respData({
      status: "redirect",
      message: "请使用新的AI分析API",
      endpoint: "/api/chat-processing/ai-analysis",
      fileId
    });
  } catch (e: any) {
    console.error("Trigger analysis failed:", e);
    return respErr("AI分析失败: " + e.message);
  }
}
