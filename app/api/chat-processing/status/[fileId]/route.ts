import { NextRequest, NextResponse } from 'next/server';
import { getChatFileStatus } from '@/services/file-processing';

/**
 * 获取文件处理状态
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

    // 获取处理状态
    const status = await getChatFileStatus(fileId);

    if (!status) {
      return NextResponse.json(
        { success: false, message: '找不到文件处理状态' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      status
    });
  } catch (error) {
    console.error('获取文件处理状态失败:', error);
    return NextResponse.json(
      { success: false, message: '获取文件处理状态失败' },
      { status: 500 }
    );
  }
}
