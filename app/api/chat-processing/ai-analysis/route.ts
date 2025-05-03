import { NextRequest, NextResponse } from 'next/server';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';
import { readFile, FileType, saveAiAnalysisResult, saveCompleteAnalysisData } from '@/lib/storage/index';
import { AIInsights, AnalysisData } from '@/types/analysis';
import { RawMessage } from '@/lib/chat-processing/types';
import { createAiAnalysisPrompt, validateAiInsights, extractJsonFromAiResponse } from '@/lib/ai-analysis';

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

    // 获取清理后的消息数组
    const messages = await readFile(fileId, FileType.CLEANED) as RawMessage[];

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
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
      await saveAiAnalysisResult(fileId, aiInsights);

    } catch (error) {
      console.error('更新分析数据失败:', error);
      return NextResponse.json(
        { success: false, message: '更新分析数据失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      aiInsights,
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
