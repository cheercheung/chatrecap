import { NextRequest, NextResponse } from 'next/server';
import { getProcessResult } from '@/services/result-service';
import { adaptProcessResultErrors } from '@/lib/adapters/error-adapter';
import { logError, createUserFriendlyErrorMessage } from '@/lib/error-handling';

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

    // 获取处理结果
    const result = await getProcessResult(fileId);

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Result not found' },
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
