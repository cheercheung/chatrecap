import { NextRequest, NextResponse } from 'next/server';
import { getFileById, ChatFileStatus } from '@/services/file';
import { readFile, FileType } from '@/lib/storage/index';
import { AIInsights } from '@/types/analysis';
import { logError, createUserFriendlyErrorMessage } from '@/lib/error-handling';

/**
 * 获取AI分析结果
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    // 获取fileId
    const { fileId } = await params;

    if (!fileId) {
      return NextResponse.json(
        { success: false, message: '未提供文件ID' },
        { status: 400 }
      );
    }

    // 从Supabase数据库获取文件记录
    const fileRecord = await getFileById(fileId);

    if (!fileRecord) {
      return NextResponse.json(
        { success: false, message: '文件不存在', code: 'FILE_NOT_FOUND' },
        { status: 404 }
      );
    }

    // 验证文件状态是否为 COMPLETE_AI
    if (fileRecord.status !== ChatFileStatus.COMPLETE_AI) {
      return NextResponse.json(
        {
          success: false,
          message: `文件状态不允许获取AI分析结果，当前状态: ${fileRecord.status}`,
          code: 'INVALID_STATE'
        },
        { status: 400 }
      );
    }

    // 从ai_result_path读取AI分析结果
    let aiInsights: AIInsights | null = null;
    
    if (fileRecord.ai_result_path) {
      // 如果文件记录中有ai_result_path，尝试从该路径读取
      try {
        // 从路径中提取文件ID
        const pathParts = fileRecord.ai_result_path.split('/');
        const resultFileName = pathParts[pathParts.length - 1];
        const resultFileId = resultFileName.split('.')[0];

        // 读取结果文件
        aiInsights = await readFile(resultFileId, FileType.AI_RESULT) as AIInsights;
      } catch (error) {
        console.error('从ai_result_path读取结果失败:', error);
        // 如果读取失败，尝试直接使用fileId读取
        aiInsights = await readFile(fileId, FileType.AI_RESULT) as AIInsights;
      }
    } else {
      // 如果没有ai_result_path，直接使用fileId读取
      aiInsights = await readFile(fileId, FileType.AI_RESULT) as AIInsights;
    }

    if (!aiInsights) {
      return NextResponse.json(
        { success: false, message: 'AI分析结果不存在', code: 'RESULT_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      aiInsights,
      fileId: fileId
    });
  } catch (error) {
    // 使用错误处理模块记录错误
    logError('GetAiAnalysisResult', error);

    // 创建用户友好的错误消息
    const errorMessage = await createUserFriendlyErrorMessage(
      error,
      '获取AI分析结果失败'
    );

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
