import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedFile } from '@/lib/storage/index';
import { updateFileStatus } from '@/lib/file-services/file-processing';
import { createFileRecord, ChatFileStatus } from '@/services/file';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';

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
    const validExtensions = ['.txt', '.json',  '.zip'];
    const fileExtension = '.' + (file.name.split('.').pop() || '');

    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { success: false, message: '不支持的文件类型，请上传文本文件、JSON文件或ZIP文件' },
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

    // 获取当前用户ID（如果已登录）
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || null;

    // 将File对象转换为Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 生成文件ID
    const fileId = uuidv4();

    // 创建文件记录到Supabase数据库
    await createFileRecord({
      id: fileId, // 使用生成的ID
      user_id: userId,
      platform: platform, // 保存平台信息到platform字段
      status: ChatFileStatus.UPLOADED,
      storage_path: `tmp/uploads/${fileId}` // 使用生成的ID作为存储路径
    });

    // 保存文件到存储系统
    await saveUploadedFile(buffer, file.name.split('.').pop() || '', fileId);

    // 初始化处理状态
    await updateFileStatus(fileId, {
      status: 'uploading',
      cleaningProgress: 0,
      analysisProgress: 0
    });

    // 更新文件状态为已上传
    await updateFileStatus(fileId, {
      status: 'completed' // 使用FileStatus中定义的状态值
    });

    return NextResponse.json({
      success: true,
      fileId: fileId, // 返回文件ID
      message: '文件上传成功'
    });
  } catch (error) {
    console.error('文件上传失败:', error);

    let errorMessage = '文件上传失败';
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
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
