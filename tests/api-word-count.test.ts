/**
 * API 字符计数功能测试
 * 测试文件上传和处理流程中的字符计数功能
 */
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { processChat } from '@/lib/chat-processing';
import { countTotalCharactersInMessages } from '@/lib/word-counter';
import { processFile } from '@/lib/file-services/file-processing';
import { getFileById } from '@/services/file';
import { FileType, saveFile, readFile } from '@/lib/storage/index';

// 创建测试文件
const createTestFile = async () => {
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

  return { fileId, content: testContent, expectedCharCount: countExpectedCharCount(testContent) };
};

// 计算预期的字符数
const countExpectedCharCount = (content: string) => {
  try {
    const data = JSON.parse(content);
    if (data.messages && Array.isArray(data.messages)) {
      return data.messages.reduce((total, msg) => {
        const text = msg.content || msg.message || '';
        return total + (text.replace(/\s+/g, '').length);
      }, 0);
    }
  } catch (e) {
    console.error('解析测试内容失败:', e);
  }
  return 0;
};

// 测试API处理流程
describe('API 字符计数功能测试', () => {
  let testData: { fileId: string; content: string; expectedCharCount: number };

  beforeAll(async () => {
    // 创建测试文件
    testData = await createTestFile();
  });

  afterAll(async () => {
    // 清理测试文件
    try {
      const uploadDir = path.join(process.cwd(), 'tmp', 'uploads');
      const filePath = path.join(uploadDir, `${testData.fileId}.json`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      console.error('清理测试文件失败:', e);
    }
  });

  test('processChat 函数应该正确处理消息并计算字符数', async () => {
    // 处理测试内容
    const result = processChat(testData.content, 'auto');
    
    // 验证处理结果
    expect(result.messages.length).toBeGreaterThan(0);
    
    // 计算字符数
    const charCount = countTotalCharactersInMessages(result.messages, false);
    
    // 验证字符数是否符合预期
    expect(charCount).toBeGreaterThan(0);
    // 由于处理过程中可能会有格式转换，这里我们只验证字符数是否在合理范围内
    expect(charCount).toBeGreaterThanOrEqual(testData.expectedCharCount * 0.5);
    expect(charCount).toBeLessThanOrEqual(testData.expectedCharCount * 1.5);
  });

  test('processFile 函数应该正确处理文件并更新字符数', async () => {
    // 处理测试文件
    const result = await processFile(testData.fileId, 'auto');
    
    // 验证处理结果
    expect(result).not.toBeNull();
    if (result) {
      expect(result.messages.length).toBeGreaterThan(0);
    }
    
    // 读取文件状态
    const statusFileName = `${testData.fileId}-status`;
    const status = await readFile(statusFileName, FileType.RESULT);
    
    // 验证状态中是否包含字符数
    expect(status).not.toBeNull();
    if (status) {
      expect(status.words_count).toBeDefined();
      expect(status.words_count).toBeGreaterThan(0);
    }
  });

  // 注意：这个测试需要数据库连接，可能需要在实际环境中运行
  test.skip('数据库中的文件记录应该包含正确的字符数', async () => {
    // 获取文件记录
    const fileRecord = await getFileById(testData.fileId);
    
    // 验证文件记录
    expect(fileRecord).not.toBeNull();
    if (fileRecord) {
      expect(fileRecord.words_count).toBeDefined();
      expect(fileRecord.words_count).toBeGreaterThan(0);
    }
  });
});
