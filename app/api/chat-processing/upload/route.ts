import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedFile } from '@/lib/storage/index';
import { updateFileStatus } from '@/lib/file-services/file-processing';

/**
 * 处理文件上传请求
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const platform = formData.get('platform') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, message: '未提供文件' },
        { status: 400 }
      );
    }

    if (!platform) {
      return NextResponse.json(
        { success: false, message: '未提供平台类型' },
        { status: 400 }
      );
    }

    // 验证文件类型
    const validTypes = ['text/plain', 'application/json', 'text/csv'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.txt')) {
      return NextResponse.json(
        { success: false, message: '不支持的文件类型，请上传文本文件' },
        { status: 400 }
      );
    }

    // 验证文件大小（最大10MB）
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: '文件太大，最大支持10MB' },
        { status: 400 }
      );
    }

    // 保存文件
    // 将File对象转换为Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileId = await saveUploadedFile(buffer, file.name.split('.').pop() || '');

    // 初始化处理状态
    await updateFileStatus(fileId, {
      status: 'uploading',
      cleaningProgress: 0,
      analysisProgress: 0
    });

    return NextResponse.json({
      success: true,
      fileId,
      message: '文件上传成功'
    });
  } catch (error) {
    console.error('文件上传失败:', error);
    return NextResponse.json(
      { success: false, message: '文件上传失败' },
      { status: 500 }
    );
  }
}
