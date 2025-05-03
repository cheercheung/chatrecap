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

/**
 * 保存文件
 */
export async function POST(request: NextRequest) {
  try {
    const { fileId, type, content } = await request.json();

    if (!fileId || !type || content === undefined) {
      return NextResponse.json(
        { success: false, message: '缺少必要参数' },
        { status: 400 }
      );
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
        return NextResponse.json(
          { success: false, message: '无效的文件类型' },
          { status: 400 }
        );
    }

    const filePath = await saveFile(fileId, content, fileType);
    return NextResponse.json({ success: true, filePath });
  } catch (error) {
    console.error('保存文件失败:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : '保存文件失败' },
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
        content = { exists: await hasAiAnalysisResult(fileId) };
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

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error('获取文件失败:', error);
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

    // 删除所有类型的文件
    await deleteFile(fileId, FileType.ORIGINAL);
    await deleteFile(fileId, FileType.CLEANED);
    await deleteFile(fileId, FileType.RESULT);
    await deleteFile(fileId, FileType.AI_RESULT);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除文件失败:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : '删除文件失败' },
      { status: 500 }
    );
  }
}
