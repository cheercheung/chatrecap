import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedFile } from '@/lib/storage/index';
import { updateFileStatus } from '@/lib/file-services/file-processing';
import { createFileRecord, ChatFileStatus } from '@/services/file';
import { v4 as uuidv4 } from 'uuid';
import { withPermissionCheck } from '@/lib/auth/permissions';
import { logError } from '@/lib/error-handling';
import { logFileOperation } from '@/lib/audit-log';
import { validateFileSize } from '@/lib/file-validation';

/**
 * 处理文件上传请求
 */
export const POST = withPermissionCheck(
  async (request: NextRequest, user) => {
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

      // 记录文件上传开始
      await logFileOperation(
        user.userId,
        'new-upload',
        'upload_start',
        'success',
        {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          platform
        }
      );

      // 验证文件类型
      const validTypes = ['text/plain', 'application/json', 'text/csv'];
      const validExtensions = ['.txt', '.json', '.zip'];
      const fileExtension = '.' + (file.name.split('.').pop() || '');

      if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
        // 记录验证失败
        await logFileOperation(
          user.userId,
          'new-upload',
          'upload_validate_type',
          'failure',
          {
            fileName: file.name,
            fileType: file.type,
            fileExtension
          },
          '不支持的文件类型'
        );

        return NextResponse.json(
          { success: false, message: '不支持的文件类型，请上传文本文件、JSON文件或ZIP文件' },
          { status: 400 }
        );
      }

      // 验证文件大小
      const sizeValidation = validateFileSize(file.size);
      if (!sizeValidation.valid) {
        // 记录验证失败
        await logFileOperation(
          user.userId,
          'new-upload',
          'upload_validate_size',
          'failure',
          {
            fileName: file.name,
            fileSize: file.size
          },
          sizeValidation.message
        );

        return NextResponse.json(
          { success: false, message: sizeValidation.message },
          { status: 400 }
        );
      }

      // 将File对象转换为Buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // 生成文件ID
      const fileId = uuidv4();

      // 记录文件ID生成
      await logFileOperation(
        user.userId,
        fileId,
        'upload_generate_id',
        'success',
        {
          fileName: file.name,
          platform
        }
      );

      // 创建文件记录到Supabase数据库
      await createFileRecord({
        id: fileId, // 使用生成的ID
        user_id: user.userId, // 使用用户ID（如果已登录）
        session_id: user.userId ? null : user.sessionId, // 未登录用户使用会话ID
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

      // 记录文件上传成功
      await logFileOperation(
        user.userId,
        fileId,
        'upload_complete',
        'success',
        {
          fileName: file.name,
          fileSize: file.size,
          platform
        }
      );

      return NextResponse.json({
        success: true,
        fileId: fileId, // 返回文件ID
        message: '文件上传成功',
        userInfo: {
          isAuthenticated: user.isAuthenticated,
          sessionId: user.sessionId
        }
      });
    } catch (error) {
      console.error('文件上传失败:', error);
      logError('FileUpload', error);

      // 记录文件上传失败
      await logFileOperation(
        user.userId,
        'upload-error',
        'upload_error',
        'failure',
        {
          error: error instanceof Error ? error.message : String(error)
        },
        '文件上传失败'
      );

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
  },
  {
    // 文件上传不需要登录，所有用户都可以上传
    requireAuth: false,
    // 不需要检查资源权限，因为是创建新资源
    resourceType: undefined,
    // 允许游客访问
    allowGuest: true
  }
);
