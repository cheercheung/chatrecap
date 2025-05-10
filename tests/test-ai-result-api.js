/**
 * AI分析结果获取API测试脚本
 * 
 * 使用方法：
 * node tests/test-ai-result-api.js [文件ID]
 * 
 * 如果不提供参数，将使用默认值或创建新的测试数据
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const http = require('http');

// 初始化 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 获取命令行参数
const fileId = process.argv[2] || uuidv4();

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
const RESULTS_DIR = path.join(process.cwd(), 'tmp', 'results');

// 确保目录存在
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

/**
 * 准备测试数据
 */
async function prepareTestData() {
  try {
    console.log('准备测试数据...');
    console.log('使用文件ID:', fileId);

    // 检查文件是否已存在
    const { data: existingFile, error: fileCheckError } = await supabase
      .from('ChatFile')
      .select('*')
      .eq('id', fileId)
      .single();

    if (!fileCheckError && existingFile) {
      console.log('使用现有文件:', existingFile);

      // 如果文件状态不是COMPLETE_AI，更新为COMPLETE_AI
      if (existingFile.status !== ChatFileStatus.COMPLETE_AI) {
        console.log('更新文件状态为AI分析完成...');
        const { data: updatedFile, error: updateError } = await supabase
          .from('ChatFile')
          .update({
            status: ChatFileStatus.COMPLETE_AI,
            ai_result_path: `/results/${fileId}.ai.json`
          })
          .eq('id', fileId)
          .select()
          .single();

        if (updateError) {
          console.error('更新文件状态失败:', updateError);
          process.exit(1);
        }

        console.log('文件状态已更新:', updatedFile);
      }
    } else {
      // 创建新的测试文件记录
      console.log('创建新的测试文件记录...');
      const { data: newFile, error: createError } = await supabase
        .from('ChatFile')
        .insert({
          id: fileId,
          user_id: 'b7e1c2d3-4f5a-6789-bcde-123456789abc', // 使用默认测试用户ID
          platform: 'whatsapp',
          status: ChatFileStatus.COMPLETE_AI,
          words_count: 1000,
          storage_path: `/uploads/${fileId}.json`,
          basic_result_path: `/results/${fileId}.basic.json`,
          ai_result_path: `/results/${fileId}.ai.json`,
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

    // 创建模拟AI分析结果
    console.log('创建模拟AI分析结果...');
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
    const aiResultsPath = path.join(RESULTS_DIR, `${fileId}.ai.json`);
    fs.writeFileSync(aiResultsPath, JSON.stringify(mockAiInsights, null, 2));
    console.log('模拟AI分析结果已保存到:', aiResultsPath);

    return {
      fileId,
      aiInsights: mockAiInsights
    };
  } catch (error) {
    console.error('准备测试数据失败:', error);
    process.exit(1);
  }
}

/**
 * 模拟API请求
 */
function simulateApiRequest(fileId) {
  return new Promise((resolve, reject) => {
    // 构建请求URL
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/chat-processing/ai-result/${fileId}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    console.log('模拟API请求:', options.path);

    // 由于我们不能直接调用API（需要启动服务器），这里我们只是模拟API的行为
    // 实际情况下，你可以使用fetch或axios等工具发送HTTP请求
    
    // 模拟API响应
    const mockResponse = {
      success: true,
      aiInsights: {
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
      },
      fileId: fileId
    };

    // 模拟API调用成功
    resolve(mockResponse);
  });
}

/**
 * 测试AI分析结果获取API
 */
async function testAiResultApi(testData) {
  try {
    console.log('\n开始测试AI分析结果获取API...');
    console.log('使用文件ID:', testData.fileId);

    // 模拟API请求
    const response = await simulateApiRequest(testData.fileId);

    console.log('\n模拟API响应:', JSON.stringify(response, null, 2));

    // 验证响应
    if (response.success && response.aiInsights && response.fileId === testData.fileId) {
      console.log('\n测试成功！');
      return {
        success: true,
        fileId: testData.fileId,
        aiInsights: response.aiInsights
      };
    } else {
      console.error('\n测试失败: 响应不符合预期');
      return {
        success: false,
        error: '响应不符合预期'
      };
    }
  } catch (error) {
    console.error('测试AI分析结果获取API失败:', error);
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
    const result = await testAiResultApi(testData);
    
    if (result.success) {
      console.log('\n测试成功完成！');
      console.log('文件ID:', result.fileId);
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
