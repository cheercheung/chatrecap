import { NextRequest, NextResponse } from 'next/server';
import { getChatFileStatus } from '@/services/file-processing';
import { getFileById } from '@/services/file';
import { getFileStatus } from '@/lib/file-services/file-processing';

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

    // 首先从Supabase数据库获取文件记录
    const fileRecord = await getFileById(fileId);

    // 然后从本地存储获取处理状态
    const processingStatus = await getFileStatus(fileId);

    // 如果两者都不存在，则返回错误
    if (!fileRecord && !processingStatus) {
      return NextResponse.json(
        { success: false, message: '找不到文件处理状态' },
        { status: 404 }
      );
    }

    // 合并状态信息
    const status = {
      // 从数据库记录中获取的状态
      dbStatus: fileRecord ? fileRecord.status : null,
      // 从本地存储获取的处理进度
      ...processingStatus
    };

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
