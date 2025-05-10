import { NextRequest, NextResponse } from 'next/server';
import { processUploadedFile } from '@/lib/file-services/file-processor';
import { updateFileStatus } from '@/lib/file-services/file-processing';
import { getFileById, updateFileStatus as updateDbFileStatus, ChatFileStatus } from '@/services/file';
import { createServerAdminClient } from '@/lib/supabase/server';

/**
 * 处理文件清洗请求
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileId, platform } = body;

    if (!fileId) {
      return NextResponse.json(
        { success: false, message: '未提供文件ID', code: 'MISSING_FILE_ID' },
        { status: 400 }
      );
    }

    if (!platform) {
      return NextResponse.json(
        { success: false, message: '未提供平台类型', code: 'MISSING_PLATFORM' },
        { status: 400 }
      );
    }

    // 获取文件记录
    const fileRecord = await getFileById(fileId);
    if (!fileRecord) {
      return NextResponse.json(
        { success: false, message: '文件不存在', code: 'FILE_NOT_FOUND' },
        { status: 404 }
      );
    }

    // 验证文件状态
    if (fileRecord.status !== ChatFileStatus.UPLOADED) {
      return NextResponse.json(
        { 
          success: false, 
          message: `文件状态不允许清洗操作，当前状态: ${fileRecord.status}`, 
          code: 'INVALID_STATE' 
        },
        { status: 400 }
      );
    }

    // 更新数据库中的文件状态为清洗中
    await updateDbFileStatus(fileId, ChatFileStatus.CLEANING);

    // 异步处理文件清洗
    // 注意：这里我们不等待处理完成，而是立即返回响应
    processUploadedFile(fileId, platform, async (status) => {
      // 更新本地存储中的处理状态
      await updateFileStatus(fileId, status);

      // 如果处理完成，更新数据库中的文件状态
      if (status.status === 'completed') {
        await updateDbFileStatus(fileId, ChatFileStatus.COMPLETED_BASIC, {
          basic_result_path: `tmp/results/${fileId}.result.json`
        });
      } else if (status.status === 'failed') {
        await updateDbFileStatus(fileId, ChatFileStatus.FAILED);
      }
    }).catch(error => {
      console.error(`文件清洗失败 (${fileId}):`, error);
      // 更新数据库中的文件状态为失败
      updateDbFileStatus(fileId, ChatFileStatus.FAILED).catch(err => {
        console.error(`更新文件状态失败 (${fileId}):`, err);
      });
    });

    return NextResponse.json({
      success: true,
      fileId,
      message: '文件清洗已开始'
    });
  } catch (error) {
    console.error('文件清洗请求处理失败:', error);

    let errorMessage = '文件清洗失败';
    if (error instanceof Error) {
      errorMessage += ': ' + error.message;
    } else if (typeof error === 'object') {
      try {
        errorMessage += ': ' + JSON.stringify(error);
      } catch (e) {
        errorMessage += ': 未知错误';
      }
    } else {
      errorMessage += ': ' + String(error);
    }

    return NextResponse.json(
      { success: false, message: errorMessage, code: 'PROCESSING_FAILED' },
      { status: 500 }
    );
  }
}
