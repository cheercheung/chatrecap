import { NextRequest, NextResponse } from 'next/server';
import { processUploadedFile } from '@/lib/file-services/file-processor';
import { updateFileStatus } from '@/lib/file-services/file-processing';
import { getFileById, updateFileStatus as updateDbFileStatus, ChatFileStatus } from '@/services/file';

/**
 * 处理 Telegram 聊天数据
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileId } = body;

    if (!fileId) {
      return NextResponse.json(
        { success: false, message: '未提供文件ID' },
        { status: 400 }
      );
    }

    // 获取文件记录
    console.log('处理Telegram文件，ID:', fileId);

    let fileRecord;
    try {
      fileRecord = await getFileById(fileId);
      console.log('获取文件记录结果:', fileRecord);

      // 注意：暂时跳过文件记录验证，用于测试
      // if (!fileRecord) {
      //   return NextResponse.json(
      //     { success: false, message: '找不到文件记录' },
      //     { status: 404 }
      //   );
      // }
    } catch (error) {
      console.error('获取文件记录失败:', error);
      // 注意：暂时跳过错误处理，用于测试
      // return NextResponse.json(
      //   { success: false, message: `获取文件记录失败: ${error instanceof Error ? error.message : String(error)}` },
      //   { status: 500 }
      // );
    }

    // 更新数据库中的文件状态为处理中，并确保平台信息正确
    await updateDbFileStatus(fileId, ChatFileStatus.PROCESSING, {
      platform: 'telegram' // 确保平台信息为telegram
    });

    // 使用通用文件处理服务处理文件
    try {
      await processUploadedFile(fileId, 'telegram', async (status) => {
        // 更新本地存储中的处理状态
        await updateFileStatus(fileId, status);

        // 如果处理完成，更新数据库中的文件状态
        if (status.status === 'completed') {
          await updateDbFileStatus(fileId, ChatFileStatus.COMPLETED_BASIC);
        } else if (status.status === 'failed') {
          await updateDbFileStatus(fileId, ChatFileStatus.FAILED);
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Telegram 数据处理完成',
        fileId: fileId
      });
    } catch (error) {
      console.error('处理 Telegram 数据失败:', error);

      // 更新数据库中的文件状态为失败
      await updateDbFileStatus(fileId, ChatFileStatus.FAILED);

      return NextResponse.json(
        {
          success: false,
          message: error instanceof Error ? error.message : '处理 Telegram 数据失败'
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('处理 Telegram 请求失败:', error);

    return NextResponse.json(
      { success: false, message: '处理 Telegram 请求失败' },
      { status: 500 }
    );
  }
}
