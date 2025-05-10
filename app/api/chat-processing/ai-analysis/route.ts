import { NextRequest, NextResponse } from 'next/server';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';
import { readFile, FileType, saveAiAnalysisResult, saveCompleteAnalysisData } from '@/lib/storage/index';
import { AIInsights, AnalysisData } from '@/types/analysis';
import { RawMessage } from '@/lib/chat-processing/types';
import { createAiAnalysisPrompt, validateAiInsights, extractJsonFromAiResponse } from '@/lib/ai-analysis';
import { getFileById, updateFileStatus, ChatFileStatus, associateAnalysisResult } from '@/services/file';
import { checkUserCreditSufficient, consumeCredits } from '@/services/credit';
import { createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

// AI分析所需的积分数量
const AI_ANALYSIS_CREDIT_COST = 10;

/**
 * AI分析API路由
 * 接收fileId，获取处理好的消息，调用OpenRouter API生成AI分析结果
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileId, locale = 'en' } = body;

    if (!fileId) {
      return NextResponse.json(
        { success: false, message: '未提供文件ID' },
        { status: 400 }
      );
    }

    // 获取文件记录
    const fileRecord = await getFileById(fileId);
    if (!fileRecord) {
      return NextResponse.json(
        { success: false, message: '文件不存在' },
        { status: 404 }
      );
    }

    // 验证文件状态是否为 COMPLETED_BASIC
    if (fileRecord.status !== ChatFileStatus.COMPLETED_BASIC) {
      return NextResponse.json(
        {
          success: false,
          message: `文件状态不允许进行AI分析，当前状态: ${fileRecord.status}`,
          code: 'INVALID_STATE'
        },
        { status: 400 }
      );
    }

    // 获取当前用户
    const supabase = createServerClient(
      name => cookies().get(name),
      (name, value, options) => cookies().set(name, value, options)
    );
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: '用户未登录' },
        { status: 401 }
      );
    }

    // 检查用户积分是否足够
    const hasSufficientCredits = await checkUserCreditSufficient(userId, AI_ANALYSIS_CREDIT_COST);
    if (!hasSufficientCredits) {
      return NextResponse.json(
        {
          success: false,
          message: '积分不足，无法进行AI分析',
          code: 'INSUFFICIENT_CREDITS',
          requiredCredits: AI_ANALYSIS_CREDIT_COST
        },
        { status: 402 }  // 402 Payment Required
      );
    }

    // 更新文件状态为AI处理中
    await updateFileStatus(fileId, ChatFileStatus.PROCESSING, {
      // 可以添加其他需要更新的字段
    });

    // 获取清理后的消息数组
    const messages = await readFile(fileId, FileType.CLEANED) as RawMessage[];

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      // 更新文件状态为失败
      await updateFileStatus(fileId, ChatFileStatus.FAILED);

      return NextResponse.json(
        { success: false, message: '找不到处理结果或消息为空' },
        { status: 404 }
      );
    }

    // 检查分析结果是否存在
    const analysisData = await readFile(fileId, FileType.RESULT) as AnalysisData;

    if (!analysisData) {
      console.warn(`未找到分析结果数据，将使用消息数组生成分析数据`);
    }

    // 创建AI分析提示词，使用指定的语言
    const prompt = createAiAnalysisPrompt(messages, locale);

    // 调用OpenRouter API
    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    // 使用环境变量中指定的模型
    const model = openrouter(process.env.MODEL_NAME || 'anthropic/claude-3-opus-20240229');

    console.log('正在调用AI分析...');
    const { text, warnings } = await generateText({
      model,
      prompt,
    });

    if (warnings && warnings.length > 0) {
      console.warn('AI分析警告:', warnings);
    }

    // 解析响应
    let aiInsights: AIInsights;
    try {
      // 使用工具函数从响应中提取JSON
      aiInsights = extractJsonFromAiResponse(text);

      // 验证AI分析结果结构
      validateAiInsights(aiInsights);

    } catch (error) {
      // 更新文件状态为失败
      await updateFileStatus(fileId, ChatFileStatus.FAILED);

      console.error('解析AI响应失败:', error);
      console.error('AI响应内容:', text);
      return NextResponse.json(
        { success: false, message: '解析AI响应失败，请重试' },
        { status: 500 }
      );
    }

    // 保存AI分析结果
    try {
      // 保存AI分析结果到单独的文件
      const resultPath = await saveAiAnalysisResult(fileId, aiInsights);

      // 更新文件状态为AI分析完成，并关联AI分析结果
      await associateAnalysisResult(fileId, 'ai', resultPath);

      // 消费用户积分
      const creditConsumed = await consumeCredits(
        userId,
        AI_ANALYSIS_CREDIT_COST,
        fileId,
        'AI分析消费'
      );

      if (!creditConsumed) {
        console.warn('积分消费失败，但AI分析已完成');
      }

    } catch (error) {
      // 更新文件状态为失败
      await updateFileStatus(fileId, ChatFileStatus.FAILED);

      console.error('更新分析数据失败:', error);
      return NextResponse.json(
        { success: false, message: '更新分析数据失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      aiInsights,
      creditConsumed: AI_ANALYSIS_CREDIT_COST
    });
  } catch (error) {
    console.error('AI分析失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'AI分析失败'
      },
      { status: 500 }
    );
  }
}

// 注意：createAiAnalysisPrompt 和 validateAiInsights 函数已移至 lib/ai-analysis/index.ts
