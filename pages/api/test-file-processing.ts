/**
 * 文件处理测试API
 * 用于测试文件上传和处理流程中的字符计数功能
 */
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { processFile } from '@/lib/file-services/file-processing';
import { getFileById } from '@/services/file';
import { FileType, readFile } from '@/lib/storage/index';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 创建测试文件
    const { fileId, content } = await createTestFile();
    
    // 处理文件
    const result = await processFile(fileId, 'auto');
    
    // 读取文件状态
    const statusFileName = `${fileId}-status`;
    const status = await readFile(statusFileName, FileType.RESULT);
    
    // 获取数据库中的文件记录
    const fileRecord = await getFileById(fileId);
    
    // 返回测试结果
    res.status(200).json({
      success: true,
      fileId,
      processingResult: result ? {
        messageCount: result.messages.length,
        warnings: result.warnings
      } : null,
      fileStatus: status,
      fileRecord,
      wordsCount: {
        inStatus: status?.words_count,
        inDatabase: fileRecord?.words_count
      }
    });
  } catch (error) {
    console.error('测试失败:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

// 创建测试文件
async function createTestFile() {
  const fileId = uuidv4();
  const testContent = JSON.stringify({
    participants: [
      { name: "User1" },
      { name: "User2" }
    ],
    messages: [
      {
        sender: "User1",
        message: "Hello, how are you?",
        timestamp: new Date().toISOString()
      },
      {
        sender: "User2",
        message: "我很好，谢谢！",
        timestamp: new Date().toISOString()
      },
      {
        sender: "User1",
        message: "Great! Let's meet tomorrow.",
        timestamp: new Date().toISOString()
      }
    ]
  });

  // 保存测试文件
  const uploadDir = path.join(process.cwd(), 'tmp', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // 保存文件内容
  const filePath = path.join(uploadDir, `${fileId}`);
  fs.writeFileSync(filePath, testContent);

  // 创建元数据文件
  const metadataPath = path.join(uploadDir, `${fileId}.json`);
  const metadata = {
    id: fileId,
    originalName: `test-${fileId}.json`,
    extension: '.json',
    size: testContent.length,
    uploadedAt: new Date().toISOString(),
    path: filePath
  };

  fs.writeFileSync(metadataPath, JSON.stringify(metadata));

  return { fileId, content: testContent };
}
