'use server';

import { NextRequest, NextResponse } from 'next/server';
import {
  saveFile,
  readFile,
  deleteFile,
  FileType,
  getCompleteAnalysisData,
  hasAiAnalysisResult
} from '@/lib/storage/index';
import { getFileById, updateFileStatus, ChatFileStatus, associateAnalysisResult, deleteFile as deleteFileRecord } from '@/services/file';
import { createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { logError } from '@/lib/error-handling';
import { getCachedAnalysisData, getCachedAiInsights, getCachedCompleteAnalysisData, updateCache, clearCache } from '@/lib/storage/cache';
import { logFileAccess, logFileOperation } from '@/lib/audit-log';
import { validateFileSize, validateMessages } from '@/lib/file-validation';

/**
 * 获取当前用户ID
 * @returns 用户ID或null
 */
async function getCurrentUserId(): Promise<string | null> {
  try {
    const supabase = createServerClient(
      name => cookies().get(name),
      (name, value, options) => cookies().set(name, value, options)
    );
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || null;
  } catch (error) {
    console.error('获取当前用户ID失败:', error);
    return null;
  }
}

/**
 * 验证文件访问权限
 * @param fileId 文件ID
 * @param userId 用户ID
 * @returns 是否有权限访问
 */
async function validateFileAccess(fileId: string, userId: string | null): Promise<boolean> {
  try {
    // 如果没有用户ID，允许访问（兼容未登录用户）
    if (!userId) return true;

    // 获取文件记录
    const fileRecord = await getFileById(fileId);

    // 如果文件不存在，允许访问（可能是新文件）
    if (!fileRecord) return true;

    // 如果文件没有关联用户，允许访问
    if (!fileRecord.user_id) return true;

    // 验证文件所有权
    return fileRecord.user_id === userId;
  } catch (error) {
    console.error('验证文件访问权限失败:', error);
    return false;
  }
}

/**
 * 保存文件
 */
export async function POST(request: NextRequest) {
  // 获取客户端IP和User-Agent
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  try {
    const { fileId, type, content } = await request.json();

    if (!fileId || !type || content === undefined) {
      return NextResponse.json(
        { success: false, message: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 获取当前用户ID
    const userId = await getCurrentUserId();

    // 记录操作开始
    await logFileOperation(
      userId,
      fileId,
      `save_${type}`,
      'success',
      { contentSize: typeof content === 'string' ? content.length : JSON.stringify(content).length },
      undefined
    );

    // 验证文件访问权限
    const hasAccess = await validateFileAccess(fileId, userId);
    if (!hasAccess) {
      // 记录权限错误
      await logFileOperation(
        userId,
        fileId,
        `save_${type}`,
        'failure',
        { reason: 'permission_denied' },
        '无权访问此文件'
      );

      return NextResponse.json(
        { success: false, message: '无权访问此文件' },
        { status: 403 }
      );
    }

    // 验证文件大小
    const contentSize = typeof content === 'string'
      ? content.length
      : JSON.stringify(content).length;

    const sizeValidation = validateFileSize(contentSize);
    if (!sizeValidation.valid) {
      // 记录验证错误
      await logFileOperation(
        userId,
        fileId,
        `save_${type}`,
        'failure',
        { reason: 'size_validation_failed', size: contentSize },
        sizeValidation.message
      );

      return NextResponse.json(
        { success: false, message: sizeValidation.message },
        { status: 400 }
      );
    }

    // 如果是消息数组，验证消息内容
    if (type === 'cleaned' && Array.isArray(content)) {
      const messagesValidation = validateMessages(content);
      if (!messagesValidation.valid) {
        // 记录验证错误
        await logFileOperation(
          userId,
          fileId,
          `save_${type}`,
          'failure',
          { reason: 'content_validation_failed', messageCount: content.length },
          messagesValidation.message
        );

        return NextResponse.json(
          { success: false, message: messagesValidation.message },
          { status: 400 }
        );
      }
    }

    let fileType: FileType;

    switch (type) {
      case 'original':
        fileType = FileType.ORIGINAL;
        break;
      case 'cleaned':
        fileType = FileType.CLEANED;
        break;
      case 'result':
        fileType = FileType.RESULT;
        break;
      case 'ai-result':
        fileType = FileType.AI_RESULT;
        break;
      default:
        // 记录类型错误
        await logFileOperation(
          userId,
          fileId,
          `save_${type}`,
          'failure',
          { reason: 'invalid_type' },
          '无效的文件类型'
        );

        return NextResponse.json(
          { success: false, message: '无效的文件类型' },
          { status: 400 }
        );
    }

    // 保存文件到本地存储
    const filePath = await saveFile(fileId, content, fileType);

    // 清除相关缓存
    clearCache(fileId);

    // 更新数据库中的文件记录
    try {
      // 获取文件记录
      const fileRecord = await getFileById(fileId);

      // 根据文件类型更新数据库记录
      if (type === 'result') {
        // 如果是分析结果，更新文件状态为基础分析完成
        if (fileRecord) {
          await associateAnalysisResult(fileId, 'basic', filePath);

          // 更新缓存
          if (typeof content === 'object') {
            updateCache(fileId, content);
          }
        }
      } else if (type === 'ai-result') {
        // 如果是AI分析结果，先检查是否有基础分析结果
        if (fileRecord) {
          if (!fileRecord.basic_result_path) {
            console.warn(`文件 ${fileId} 没有基础分析结果，但正在保存AI分析结果`);
            // 尝试查找基础分析结果文件
            try {
              const basicResultExists = await readFile(fileId, FileType.RESULT);
              if (basicResultExists) {
                // 如果存在基础分析结果文件，但数据库中没有记录，先更新基础分析结果路径
                const basicResultPath = `/results/${fileId}.json`;
                await associateAnalysisResult(fileId, 'basic', basicResultPath);
                console.log(`已自动关联基础分析结果: ${basicResultPath}`);
              }
            } catch (e) {
              console.error(`查找基础分析结果失败: ${e.message}`);
            }
          }
          // 更新AI分析结果
          await associateAnalysisResult(fileId, 'ai', filePath);

          // 更新缓存
          if (typeof content === 'object') {
            const analysisData = await getCachedAnalysisData(fileId);
            if (analysisData) {
              updateCache(fileId, { ...analysisData, aiInsights: content });
            }
          }
        }
      }
    } catch (dbError) {
      // 数据库更新失败，但文件已保存，记录错误但不中断流程
      console.error('更新数据库文件记录失败:', dbError);
      logError('StorageAPI-POST-UpdateDB', dbError);

      // 记录数据库错误
      await logFileOperation(
        userId,
        fileId,
        `save_${type}_db_update`,
        'failure',
        { reason: 'db_error' },
        dbError instanceof Error ? dbError.message : '数据库更新失败'
      );
    }

    // 记录操作成功
    await logFileOperation(
      userId,
      fileId,
      `save_${type}_complete`,
      'success',
      { filePath, contentSize },
      undefined
    );

    return NextResponse.json({
      success: true,
      filePath,
      userId: userId || undefined
    });
  } catch (error) {
    console.error('保存文件失败:', error);
    logError('StorageAPI-POST', error);

    // 记录操作失败
    const errorMessage = error instanceof Error ? error.message : '保存文件失败';
    await logFileOperation(
      null, // 可能无法获取用户ID
      'unknown', // 可能无法获取文件ID
      'save_file_error',
      'failure',
      { error: errorMessage },
      errorMessage
    );

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * 获取文件
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fileId = searchParams.get('fileId');
    const type = searchParams.get('type');

    if (!fileId || !type) {
      return NextResponse.json(
        { success: false, message: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 获取当前用户ID
    const userId = await getCurrentUserId();

    // 验证文件访问权限
    const hasAccess = await validateFileAccess(fileId, userId);
    if (!hasAccess) {
      return NextResponse.json(
        { success: false, message: '无权访问此文件' },
        { status: 403 }
      );
    }

    // 获取文件记录（用于返回额外信息）
    const fileRecord = await getFileById(fileId);

    let content = null;

    switch (type) {
      case 'original':
        content = await readFile(fileId, FileType.ORIGINAL);
        break;
      case 'cleaned':
        content = await readFile(fileId, FileType.CLEANED);
        break;
      case 'result':
        // 返回分析结果数据
        content = await readFile(fileId, FileType.RESULT);
        break;
      case 'ai-result':
        content = await readFile(fileId, FileType.AI_RESULT);
        break;
      case 'complete':
        // 获取完整的分析数据（包含基础分析和AI分析）
        content = await getCompleteAnalysisData(fileId);
        break;
      case 'exists':
        // 检查是否存在AI分析结果
        content = {
          exists: await hasAiAnalysisResult(fileId),
          fileStatus: fileRecord?.status || null
        };
        break;
      default:
        return NextResponse.json(
          { success: false, message: '无效的文件类型' },
          { status: 400 }
        );
    }

    if (content === null) {
      return NextResponse.json(
        { success: false, message: '文件不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      content,
      fileInfo: fileRecord ? {
        id: fileRecord.id,
        status: fileRecord.status,
        platform: fileRecord.platform,
        uploaded_at: fileRecord.uploaded_at
      } : undefined
    });
  } catch (error) {
    console.error('获取文件失败:', error);
    logError('StorageAPI-GET', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : '获取文件失败' },
      { status: 500 }
    );
  }
}

/**
 * 删除文件
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json(
        { success: false, message: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 获取当前用户ID
    const userId = await getCurrentUserId();

    // 验证文件访问权限
    const hasAccess = await validateFileAccess(fileId, userId);
    if (!hasAccess) {
      return NextResponse.json(
        { success: false, message: '无权删除此文件' },
        { status: 403 }
      );
    }

    // 删除所有类型的文件
    await deleteFile(fileId, FileType.ORIGINAL);
    await deleteFile(fileId, FileType.CLEANED);
    await deleteFile(fileId, FileType.RESULT);
    await deleteFile(fileId, FileType.AI_RESULT);

    // 删除数据库中的文件记录
    try {
      await deleteFileRecord(fileId);
    } catch (dbError) {
      // 数据库删除失败，但文件已删除，记录错误但不中断流程
      console.error('删除数据库文件记录失败:', dbError);
      logError('StorageAPI-DELETE-DeleteDB', dbError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除文件失败:', error);
    logError('StorageAPI-DELETE', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : '删除文件失败' },
      { status: 500 }
    );
  }
}
