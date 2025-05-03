import { NextRequest, NextResponse } from 'next/server';
import { processUploadedFile } from '@/lib/file-services/file-processor';
import { updateFileStatus } from '@/lib/file-services/file-processing';

/**
 * 处理 Instagram 聊天数据
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

    // 使用通用文件处理服务处理文件
    try {
      await processUploadedFile(fileId, 'instagram', async (status) => {
        await updateFileStatus(fileId, status);
      });

      return NextResponse.json({
        success: true,
        message: 'Instagram 数据处理完成',
        fileId: fileId
      });
    } catch (error) {
      console.error('处理 Instagram 数据失败:', error);

      return NextResponse.json(
        {
          success: false,
          message: error instanceof Error ? error.message : '处理 Instagram 数据失败'
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('处理 Instagram 请求失败:', error);

    return NextResponse.json(
      { success: false, message: '处理 Instagram 请求失败' },
      { status: 500 }
    );
  }
}
