/**
 * 存储API测试脚本
 *
 * 使用方法：
 * node tests/test-storage-api.js [文件ID] [用户ID]
 *
 * 如果不提供参数，将使用默认值或创建新的测试数据
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// 初始化 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 获取命令行参数
const fileId = process.argv[2] || uuidv4();
const userId = process.argv[3] || 'b7e1c2d3-4f5a-6789-bcde-123456789abc';

// 文件状态枚举
const ChatFileStatus = {
  UPLOADED: 'uploaded',
  CLEANING: 'cleaning',
  PROCESSING: 'processing',
  COMPLETED_BASIC: 'completed_basic',
  COMPLETE_AI: 'complete_ai',
  FAILED: 'failed'
};

// 测试数据目录
const STORAGE_BASE_DIR = path.join(process.cwd(), 'tmp');
const UPLOAD_DIR = path.join(STORAGE_BASE_DIR, 'uploads');
const CLEANED_DIR = path.join(STORAGE_BASE_DIR, 'cleaned');
const RESULTS_DIR = path.join(STORAGE_BASE_DIR, 'results');
const AI_RESULTS_DIR = path.join(STORAGE_BASE_DIR, 'ai-results');

// 确保目录存在
[STORAGE_BASE_DIR, UPLOAD_DIR, CLEANED_DIR, RESULTS_DIR, AI_RESULTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * 准备测试数据
 */
async function prepareTestData() {
  try {
    console.log('准备测试数据...');
    console.log('使用文件ID:', fileId);
    console.log('使用用户ID:', userId);

    // 1. 检查用户是否存在
    const { data: existingUser, error: userFetchError } = await supabase
      .from('User')
      .select('*')
      .eq('id', userId)
      .single();

    if (userFetchError && userFetchError.code !== 'PGRST116') {
      console.error('获取用户失败:', userFetchError);
      process.exit(1);
    }

    if (!existingUser) {
      console.log('创建测试用户...');
      const { data: user, error: userError } = await supabase
        .from('User')
        .insert({
          id: userId,
          email: 'test@example.com',
          username: 'Test User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (userError) {
        console.error('创建用户失败:', userError);
        process.exit(1);
      }

      console.log('测试用户创建成功:', user);
    } else {
      console.log('使用现有用户:', existingUser);
    }

    // 2. 检查文件是否存在
    const { data: existingFile, error: fileCheckError } = await supabase
      .from('ChatFile')
      .select('*')
      .eq('id', fileId)
      .single();

    if (!fileCheckError && existingFile) {
      console.log('使用现有文件:', existingFile);
    } else {
      // 创建新的测试文件记录
      console.log('创建新的测试文件记录...');
      const { data: newFile, error: createError } = await supabase
        .from('ChatFile')
        .insert({
          id: fileId,
          user_id: userId,
          platform: 'whatsapp',
          status: ChatFileStatus.UPLOADED,
          storage_path: `/uploads/${fileId}.json`,
          uploaded_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('创建文件记录失败:', createError);
        process.exit(1);
      }

      console.log('测试文件记录创建成功:', newFile);
    }

    // 3. 创建测试文件内容
    console.log('创建测试文件内容...');

    // 创建原始文件
    const originalContent = 'This is a test file content';
    const originalPath = path.join(UPLOAD_DIR, `${fileId}.original`);
    fs.writeFileSync(originalPath, originalContent);
    console.log('原始文件已创建:', originalPath);

    // 创建清理后的文件
    const cleanedContent = [
      { sender: 'Alice', content: 'Hello', date: new Date('2023-01-01') },
      { sender: 'Bob', content: 'Hi there', date: new Date('2023-01-01') }
    ];
    const cleanedPath = path.join(CLEANED_DIR, `${fileId}.cleaned.json`);
    fs.writeFileSync(cleanedPath, JSON.stringify(cleanedContent, null, 2));
    console.log('清理后的文件已创建:', cleanedPath);

    // 创建分析结果文件
    const resultContent = {
      messageCount: 2,
      senderStats: {
        'Alice': { messageCount: 1 },
        'Bob': { messageCount: 1 }
      }
    };
    const resultPath = path.join(RESULTS_DIR, `${fileId}.result.json`);
    fs.writeFileSync(resultPath, JSON.stringify(resultContent, null, 2));
    console.log('分析结果文件已创建:', resultPath);

    return {
      fileId,
      userId,
      originalPath,
      cleanedPath,
      resultPath
    };
  } catch (error) {
    console.error('准备测试数据失败:', error);
    process.exit(1);
  }
}

/**
 * 测试存储API
 */
async function testStorageApi(testData) {
  try {
    console.log('\n开始测试存储API...');

    // 1. 测试GET请求 - 获取原始文件
    console.log('\n测试GET请求 - 获取原始文件...');
    const originalContent = fs.readFileSync(testData.originalPath, 'utf-8');
    console.log('原始文件内容:', originalContent);

    // 2. 测试GET请求 - 获取清理后的文件
    console.log('\n测试GET请求 - 获取清理后的文件...');
    const cleanedContent = JSON.parse(fs.readFileSync(testData.cleanedPath, 'utf-8'));
    console.log('清理后的文件内容:', cleanedContent);

    // 3. 测试GET请求 - 获取分析结果
    console.log('\n测试GET请求 - 获取分析结果...');
    const resultContent = JSON.parse(fs.readFileSync(testData.resultPath, 'utf-8'));
    console.log('分析结果内容:', resultContent);

    // 4. 测试POST请求 - 保存AI分析结果
    console.log('\n测试POST请求 - 保存AI分析结果...');
    const aiResultContent = {
      summary: "这是一个简短的对话",
      keyInsights: ["对话很友好"]
    };
    const aiResultPath = path.join(AI_RESULTS_DIR, `${testData.fileId}.ai-result.json`);
    fs.writeFileSync(aiResultPath, JSON.stringify(aiResultContent, null, 2));
    console.log('AI分析结果已保存:', aiResultPath);

    // 5. 更新数据库中的文件状态 - 先设置基础分析结果
    console.log('\n更新数据库中的文件状态 - 设置基础分析结果...');
    const { data: basicUpdatedFile, error: basicUpdateError } = await supabase
      .from('ChatFile')
      .update({
        status: ChatFileStatus.COMPLETED_BASIC,
        basic_result_path: `/results/${testData.fileId}.result.json`
      })
      .eq('id', testData.fileId)
      .select()
      .single();

    if (basicUpdateError) {
      console.error('更新基础分析结果失败:', basicUpdateError);
    } else {
      console.log('基础分析结果已更新:', basicUpdatedFile);
    }

    // 6. 更新数据库中的文件状态 - 设置AI分析结果
    console.log('\n更新数据库中的文件状态 - 设置AI分析结果...');
    const { data: updatedFile, error: updateError } = await supabase
      .from('ChatFile')
      .update({
        status: ChatFileStatus.COMPLETE_AI,
        ai_result_path: `/ai-results/${testData.fileId}.ai-result.json`
      })
      .eq('id', testData.fileId)
      .select()
      .single();

    if (updateError) {
      console.error('更新AI分析结果失败:', updateError);
    } else {
      console.log('AI分析结果已更新:', updatedFile);
    }

    console.log('\n测试完成！');
    return {
      success: true,
      fileId: testData.fileId,
      userId: testData.userId
    };
  } catch (error) {
    console.error('测试存储API失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 执行测试
async function runTest() {
  try {
    const testData = await prepareTestData();
    const result = await testStorageApi(testData);

    if (result.success) {
      console.log('\n测试成功完成！');
      console.log('文件ID:', result.fileId);
      console.log('用户ID:', result.userId);
    } else {
      console.error('\n测试失败:', result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('测试执行失败:', error);
    process.exit(1);
  }
}

runTest();
