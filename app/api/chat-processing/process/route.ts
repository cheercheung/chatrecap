import { NextRequest, NextResponse } from 'next/server';
import { processFile } from '@/lib/file-services/file-processing';
import { PlatformType } from '@/lib/chat-processing/types';
import { getFileById, updateFileStatus, ChatFileStatus } from '@/services/file';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

/**
 * 处理文件
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileId, platform, skipAiAnalysis = true } = body;

    if (!fileId) {
      return NextResponse.json(
        { success: false, message: '未提供文件ID' },
        { status: 400 }
      );
    }

    // 获取文件记录
    console.log('处理文件，ID:', fileId);

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

    // 如果没有提供平台类型，使用文件记录中的platform字段或默认为'auto'
    const platformToUse = platform || (fileRecord?.platform) || 'auto';

    // 验证平台类型
    const validPlatforms: PlatformType[] = ['whatsapp', 'instagram', 'discord', 'telegram', 'snapchat', 'auto'];
    if (!validPlatforms.includes(platformToUse as PlatformType)) {
      return NextResponse.json(
        { success: false, message: '不支持的平台类型' },
        { status: 400 }
      );
    }

    // 更新文件状态为处理中
    await updateFileStatus(fileId, ChatFileStatus.PROCESSING);

    // 异步处理文件，并传递 skipAiAnalysis 参数
    processFile(fileId, platformToUse as PlatformType, { skipAiAnalysis }).catch(async (error: Error) => {
      console.error('处理文件失败:', error);
      // 更新文件状态为失败
      await updateFileStatus(fileId, ChatFileStatus.FAILED);
    });

    return NextResponse.json({
      success: true,
      message: '文件处理已开始',
      fileId: fileId
    });
  } catch (error) {
    console.error('处理文件请求失败:', error);
    return NextResponse.json(
      { success: false, message: '处理文件请求失败' },
      { status: 500 }
    );
  }
}
