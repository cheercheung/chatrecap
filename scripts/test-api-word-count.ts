/**
 * API 字符计数功能手动测试脚本
 * 用于测试文件上传和处理API
 */
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { processFile } from '../lib/file-services/file-processing';
import { getFileById } from '../services/file';
import { FileType, readFile } from '../lib/storage/index';

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
        content: "Hello, how are you?",
        timestamp: new Date().toISOString()
      },
      {
        sender: "User2",
        content: "我很好，谢谢！",
        timestamp: new Date().toISOString()
      },
      {
        sender: "User1",
        content: "Great! Let's meet tomorrow.",
        timestamp: new Date().toISOString()
      }
    ]
  });

  // 保存测试文件
  const uploadDir = path.join(process.cwd(), 'tmp', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, `${fileId}.json`);
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

// 测试文件处理
async function testProcessFile() {
  console.log('===== API 字符计数功能测试 =====');
  
  // 创建测试文件
  console.log('\n1. 创建测试文件...');
  const { fileId } = await createTestFile();
  console.log(`测试文件ID: ${fileId}`);
  
  // 处理文件
  console.log('\n2. 处理文件...');
  try {
    const result = await processFile(fileId, 'auto');
    console.log('处理结果:', result ? '成功' : '失败');
    
    if (result) {
      console.log(`消息数量: ${result.messages.length}`);
    }
    
    // 读取文件状态
    console.log('\n3. 读取文件状态...');
    const statusFileName = `${fileId}-status`;
    const status = await readFile(statusFileName, FileType.RESULT);
    
    if (status) {
      console.log('文件状态:', status);
      console.log('字符数:', status.words_count);
    } else {
      console.log('未找到文件状态');
    }
    
    // 获取数据库中的文件记录
    console.log('\n4. 获取数据库中的文件记录...');
    const fileRecord = await getFileById(fileId);
    
    if (fileRecord) {
      console.log('文件记录:', fileRecord);
      console.log('数据库中的字符数:', fileRecord.words_count);
    } else {
      console.log('未找到文件记录');
    }
    
  } catch (error) {
    console.error('测试失败:', error);
  }
  
  console.log('\n===== 测试完成 =====');
}

// 运行测试
testProcessFile().catch(console.error);
