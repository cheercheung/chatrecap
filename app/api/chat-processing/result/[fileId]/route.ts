import { NextRequest, NextResponse } from 'next/server';
import { getProcessResult } from '@/services/result-service';
import { adaptProcessResultErrors } from '@/lib/adapters/error-adapter';
import { logError, createUserFriendlyErrorMessage } from '@/lib/error-handling';
import { getFileById, ChatFileStatus } from '@/services/file';
import { readFile, FileType } from '@/lib/storage/index';

/**
 * 获取处理结果
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

    // 验证文件状态是否为 COMPLETED_BASIC 或 COMPLETE_AI
    if (fileRecord.status !== ChatFileStatus.COMPLETED_BASIC &&
        fileRecord.status !== ChatFileStatus.COMPLETE_AI) {
      return NextResponse.json(
        {
          success: false,
          message: `文件状态不允许获取结果，当前状态: ${fileRecord.status}`,
          code: 'INVALID_STATE'
        },
        { status: 400 }
      );
    }

    // 从basic_result_path读取基础分析结果
    let result;
    if (fileRecord.basic_result_path) {
      // 如果文件记录中有basic_result_path，直接从该路径读取
      try {
        // 从路径中提取文件ID
        const pathParts = fileRecord.basic_result_path.split('/');
        const resultFileName = pathParts[pathParts.length - 1];
        const resultFileId = resultFileName.split('.')[0];

        // 读取结果文件
        result = await readFile(resultFileId, FileType.RESULT);
      } catch (error) {
        console.error('从basic_result_path读取结果失败:', error);
        // 如果读取失败，回退到使用getProcessResult
        result = await getProcessResult(fileId);
      }
    } else {
      // 如果没有basic_result_path，使用getProcessResult
      result = await getProcessResult(fileId);
    }

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Result not found', code: 'RESULT_NOT_FOUND' },
        { status: 404 }
      );
    }

    // 获取请求的语言
    const locale = request.headers.get('Accept-Language')?.split(',')[0] || 'en';

    // 转换错误消息
    const adaptedResult = await adaptProcessResultErrors(result, locale);

    return NextResponse.json({
      success: true,
      result: adaptedResult,
      fileId: fileId
    });
  } catch (error) {
    // 使用错误处理模块记录错误
    logError('GetProcessResult', error);

    // 创建用户友好的错误消息
    const errorMessage = await createUserFriendlyErrorMessage(
      error,
      'Failed to retrieve processing result'
    );

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
