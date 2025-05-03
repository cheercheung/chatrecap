import { NextRequest, NextResponse } from 'next/server';
import { processFile } from '@/lib/file-services/file-processing';
import { PlatformType } from '@/lib/chat-processing/types';

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

    // 如果没有提供平台类型，默认使用 'auto'
    const platformToUse = platform || 'auto';

    // 验证平台类型
    const validPlatforms: PlatformType[] = ['whatsapp', 'instagram', 'discord', 'telegram', 'snapchat', 'auto'];
    if (!validPlatforms.includes(platformToUse as PlatformType)) {
      return NextResponse.json(
        { success: false, message: '不支持的平台类型' },
        { status: 400 }
      );
    }

    // 异步处理文件，并传递 skipAiAnalysis 参数
    processFile(fileId, platformToUse as PlatformType, { skipAiAnalysis }).catch((error: Error) => {
      console.error('处理文件失败:', error);
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
