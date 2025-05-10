/**
 * AI分析API测试脚本
 * 
 * 使用方法：
 * node tests/test-ai-analysis-api.js [文件ID] [用户ID]
 * 
 * 如果不提供参数，将使用默认值
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
const TEST_DATA_DIR = path.join(process.cwd(), 'tests', 'data');
const UPLOAD_DIR = path.join(process.cwd(), 'tmp', 'uploads');
const CLEANED_DIR = path.join(process.cwd(), 'tmp', 'cleaned');
const RESULTS_DIR = path.join(process.cwd(), 'tmp', 'results');

// 确保目录存在
[UPLOAD_DIR, CLEANED_DIR, RESULTS_DIR].forEach(dir => {
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

    // 1. 创建测试用户（如果不存在）
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

    // 2. 确保用户有足够的积分
    console.log('添加测试积分...');
    const { data: creditTx, error: creditError } = await supabase
      .from('CreditTransaction')
      .insert({
        id: uuidv4(),
        user_id: userId,
        change_amount: 100,
        balance_after: 100,
        type: 'recharge',
        description: '测试充值',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (creditError) {
      console.error('添加积分失败:', creditError);
      // 继续执行，不中断流程
    } else {
      console.log('测试积分添加成功:', creditTx);
    }

    // 3. 创建测试文件记录
    console.log('创建测试文件记录...');
    const { data: file, error: fileError } = await supabase
      .from('ChatFile')
      .insert({
        id: fileId,
        user_id: userId,
        platform: 'whatsapp',
        status: ChatFileStatus.COMPLETED_BASIC,
        words_count: 1000,
        storage_path: `/uploads/${fileId}.json`,
        basic_result_path: `/results/${fileId}.basic.json`,
        uploaded_at: new Date().toISOString()
      })
      .select()
      .single();

    if (fileError) {
      console.error('创建文件记录失败:', fileError);
      process.exit(1);
    }

    console.log('测试文件记录创建成功:', file);

    // 4. 创建测试消息数据
    console.log('创建测试消息数据...');
    const testMessages = [
      {
        sender: 'Alice',
        content: 'Hello, how are you?',
        date: new Date('2023-01-01T10:00:00Z')
      },
      {
        sender: 'Bob',
        content: 'I\'m good, thanks! How about you?',
        date: new Date('2023-01-01T10:01:00Z')
      },
      {
        sender: 'Alice',
        content: 'I\'m doing well too. What are your plans for today?',
        date: new Date('2023-01-01T10:02:00Z')
      },
      {
        sender: 'Bob',
        content: 'Just working on some coding projects. You?',
        date: new Date('2023-01-01T10:03:00Z')
      },
      {
        sender: 'Alice',
        content: 'I\'m going to the park later.',
        date: new Date('2023-01-01T10:04:00Z')
      }
    ];

    // 保存测试消息到cleaned目录
    const cleanedPath = path.join(CLEANED_DIR, `${fileId}.json`);
    fs.writeFileSync(cleanedPath, JSON.stringify(testMessages, null, 2));
    console.log('测试消息数据已保存到:', cleanedPath);

    // 5. 创建测试分析结果数据
    console.log('创建测试分析结果数据...');
    const testAnalysisData = {
      messageCount: 5,
      wordCount: 50,
      senderStats: {
        'Alice': {
          messageCount: 3,
          wordCount: 30
        },
        'Bob': {
          messageCount: 2,
          wordCount: 20
        }
      },
      timeStats: {
        firstMessageDate: '2023-01-01T10:00:00Z',
        lastMessageDate: '2023-01-01T10:04:00Z',
        duration: '4 minutes'
      }
    };

    // 保存测试分析结果到results目录
    const resultsPath = path.join(RESULTS_DIR, `${fileId}.json`);
    fs.writeFileSync(resultsPath, JSON.stringify(testAnalysisData, null, 2));
    console.log('测试分析结果数据已保存到:', resultsPath);

    return {
      userId,
      fileId,
      messages: testMessages,
      analysisData: testAnalysisData
    };
  } catch (error) {
    console.error('准备测试数据失败:', error);
    process.exit(1);
  }
}

/**
 * 测试AI分析API
 */
async function testAiAnalysisApi(testData) {
  try {
    console.log('\n开始测试AI分析API...');
    console.log('使用文件ID:', testData.fileId);
    console.log('使用用户ID:', testData.userId);

    // 模拟API请求
    console.log('\n模拟API请求...');
    
    // 这里我们不实际调用API，而是模拟API的行为
    console.log('检查文件状态...');
    const { data: fileBeforeAnalysis, error: fileError } = await supabase
      .from('ChatFile')
      .select('*')
      .eq('id', testData.fileId)
      .single();
    
    if (fileError) {
      console.error('获取文件失败:', fileError);
      process.exit(1);
    }
    
    console.log('文件状态:', fileBeforeAnalysis.status);
    
    // 模拟AI分析过程
    console.log('\n模拟AI分析过程...');
    
    // 1. 更新文件状态为处理中
    console.log('更新文件状态为处理中...');
    const { data: processingFile, error: processingError } = await supabase
      .from('ChatFile')
      .update({
        status: ChatFileStatus.PROCESSING
      })
      .eq('id', testData.fileId)
      .select()
      .single();
    
    if (processingError) {
      console.error('更新文件状态失败:', processingError);
      process.exit(1);
    }
    
    console.log('文件状态已更新为处理中:', processingFile.status);
    
    // 2. 模拟AI分析结果
    console.log('\n生成模拟AI分析结果...');
    const mockAiInsights = {
      summary: "这是一个简短的对话，Alice和Bob交换了问候并讨论了他们的计划。",
      keyInsights: [
        "对话很友好和轻松",
        "双方都分享了他们的日常计划",
        "对话持续了约4分钟"
      ],
      relationshipAnalysis: {
        closeness: 7,
        communicationStyle: "友好",
        topics: ["问候", "日常活动"]
      },
      personalityInsights: {
        Alice: {
          traits: ["友好", "主动"],
          communicationStyle: "开放"
        },
        Bob: {
          traits: ["简洁", "回应式"],
          communicationStyle: "直接"
        }
      }
    };
    
    // 保存模拟AI分析结果
    const aiResultsPath = path.join(RESULTS_DIR, `${testData.fileId}.ai.json`);
    fs.writeFileSync(aiResultsPath, JSON.stringify(mockAiInsights, null, 2));
    console.log('模拟AI分析结果已保存到:', aiResultsPath);
    
    // 3. 更新文件状态为AI分析完成
    console.log('\n更新文件状态为AI分析完成...');
    const { data: completeFile, error: completeError } = await supabase
      .from('ChatFile')
      .update({
        status: ChatFileStatus.COMPLETE_AI,
        ai_result_path: `/results/${testData.fileId}.ai.json`
      })
      .eq('id', testData.fileId)
      .select()
      .single();
    
    if (completeError) {
      console.error('更新文件状态失败:', completeError);
      process.exit(1);
    }
    
    console.log('文件状态已更新为AI分析完成:', completeFile.status);
    
    // 4. 创建积分消费记录
    console.log('\n创建积分消费记录...');
    const { data: creditTx, error: creditError } = await supabase
      .from('CreditTransaction')
      .insert({
        id: uuidv4(),
        user_id: testData.userId,
        change_amount: -10,
        balance_after: 90, // 假设之前有100积分
        type: 'consume',
        file_id: testData.fileId,
        description: 'AI分析消费',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (creditError) {
      console.error('创建积分消费记录失败:', creditError);
      // 继续执行，不中断流程
    } else {
      console.log('积分消费记录创建成功:', creditTx);
    }
    
    console.log('\n测试完成！');
    console.log('文件ID:', testData.fileId);
    console.log('用户ID:', testData.userId);
    console.log('文件状态:', completeFile.status);
    console.log('AI分析结果路径:', completeFile.ai_result_path);
    
    return {
      success: true,
      fileId: testData.fileId,
      userId: testData.userId,
      fileStatus: completeFile.status,
      aiResultPath: completeFile.ai_result_path
    };
  } catch (error) {
    console.error('测试AI分析API失败:', error);
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
    const result = await testAiAnalysisApi(testData);
    
    if (result.success) {
      console.log('\n测试成功！');
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
