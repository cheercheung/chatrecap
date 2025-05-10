/**
 * 测试所有平台的文件清洗API
 * 
 * 这个脚本用于测试所有平台（WhatsApp、Discord、Instagram、Telegram、Snapchat）的文件上传和清洗API
 * 
 * 使用方法:
 * 1. 确保服务器已启动
 * 2. 运行: node tests/test-all-platforms.js
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');

// 测试平台列表
const platforms = ['whatsapp', 'discord', 'instagram', 'telegram', 'snapchat'];

// 测试文件路径
const testFilesDir = path.join(__dirname, 'test-data');

// 确保测试数据目录存在
if (!fs.existsSync(testFilesDir)) {
  fs.mkdirSync(testFilesDir, { recursive: true });
}

// 创建测试文件
function createTestFiles() {
  // WhatsApp测试数据 (TXT格式)
  const whatsappData = `
[2023/01/01, 10:00:00] User1: Hello, how are you?
[2023/01/01, 10:01:00] User2: I'm good, thanks!
[2023/01/01, 10:02:00] User1: What are you doing today?
[2023/01/01, 10:03:00] User2: Just working on some code.
`;
  fs.writeFileSync(path.join(testFilesDir, 'whatsapp.txt'), whatsappData);

  // Discord测试数据 (JSON格式)
  const discordData = {
    channel: {
      id: "123456789",
      type: 1,
      name: "test-channel"
    },
    messages: [
      {
        id: "1",
        type: 0,
        timestamp: "2023-01-01T10:00:00.000Z",
        author: { id: "user1", name: "User1" },
        content: "Hello, how are you?"
      },
      {
        id: "2",
        type: 0,
        timestamp: "2023-01-01T10:01:00.000Z",
        author: { id: "user2", name: "User2" },
        content: "I'm good, thanks!"
      }
    ]
  };
  fs.writeFileSync(path.join(testFilesDir, 'discord.json'), JSON.stringify(discordData, null, 2));

  // Instagram测试数据 (JSON格式)
  const instagramData = {
    participants: [
      { name: "User1" },
      { name: "User2" }
    ],
    messages: [
      {
        sender_name: "User1",
        timestamp_ms: 1672567200000,
        content: "Hello, how are you?"
      },
      {
        sender_name: "User2",
        timestamp_ms: 1672567260000,
        content: "I'm good, thanks!"
      }
    ]
  };
  fs.writeFileSync(path.join(testFilesDir, 'instagram.json'), JSON.stringify(instagramData, null, 2));

  // Telegram测试数据 (JSON格式)
  const telegramData = {
    name: "Telegram Chat",
    type: "personal_chat",
    messages: [
      {
        id: 1,
        type: "message",
        date: "2023-01-01T10:00:00",
        from: "User1",
        text: "Hello, how are you?"
      },
      {
        id: 2,
        type: "message",
        date: "2023-01-01T10:01:00",
        from: "User2",
        text: "I'm good, thanks!"
      }
    ]
  };
  fs.writeFileSync(path.join(testFilesDir, 'telegram.json'), JSON.stringify(telegramData, null, 2));

  // Snapchat测试数据 (JSON格式)
  const snapchatData = {
    conversations: [
      {
        id: "conversation1",
        participants: ["User1", "User2"],
        messages: [
          {
            from: "User1",
            timestamp: "2023-01-01T10:00:00.000Z",
            content: "Hello, how are you?"
          },
          {
            from: "User2",
            timestamp: "2023-01-01T10:01:00.000Z",
            content: "I'm good, thanks!"
          }
        ]
      }
    ]
  };
  fs.writeFileSync(path.join(testFilesDir, 'snapchat.json'), JSON.stringify(snapchatData, null, 2));

  console.log('测试文件已创建在目录:', testFilesDir);
}

// 测试文件上传API
async function testUploadAPI(platform) {
  try {
    console.log(`开始测试 ${platform} 文件上传API...`);
    
    // 确定文件路径和类型
    let filePath;
    if (platform === 'whatsapp') {
      filePath = path.join(testFilesDir, 'whatsapp.txt');
    } else {
      filePath = path.join(testFilesDir, `${platform}.json`);
    }
    
    // 创建FormData
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('platform', platform);
    
    // 发送请求
    const response = await fetch('http://localhost:3000/api/chat-processing/upload', {
      method: 'POST',
      body: form
    });
    
    // 解析响应
    const result = await response.json();
    
    // 输出结果
    console.log(`${platform} 上传API响应:`, result);
    
    if (result.success) {
      console.log(`${platform} 文件上传成功，fileId:`, result.fileId);
      return result.fileId;
    } else {
      console.error(`${platform} 文件上传失败:`, result.message);
      return null;
    }
  } catch (error) {
    console.error(`测试 ${platform} 文件上传API失败:`, error);
    return null;
  }
}

// 测试文件清洗API
async function testCleanAPI(platform, fileId) {
  try {
    console.log(`开始测试 ${platform} 文件清洗API...`);
    
    // 发送请求
    const response = await fetch('http://localhost:3000/api/chat-processing/clean', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileId,
        platform
      })
    });
    
    // 解析响应
    const result = await response.json();
    
    // 输出结果
    console.log(`${platform} 清洗API响应:`, result);
    
    if (result.success) {
      console.log(`${platform} 文件清洗已开始`);
      return true;
    } else {
      console.error(`${platform} 文件清洗失败:`, result.message);
      return false;
    }
  } catch (error) {
    console.error(`测试 ${platform} 文件清洗API失败:`, error);
    return false;
  }
}

// 测试文件状态API
async function testStatusAPI(platform, fileId) {
  try {
    console.log(`开始测试 ${platform} 文件状态API...`);
    
    // 发送请求
    const response = await fetch(`http://localhost:3000/api/chat-processing/status/${fileId}`);
    
    // 解析响应
    const result = await response.json();
    
    // 输出结果
    console.log(`${platform} 状态API响应:`, result);
    
    if (result.success) {
      console.log(`${platform} 文件状态:`, result.status);
      return result.status;
    } else {
      console.error(`${platform} 获取文件状态失败:`, result.message);
      return null;
    }
  } catch (error) {
    console.error(`测试 ${platform} 文件状态API失败:`, error);
    return null;
  }
}

// 测试单个平台
async function testPlatform(platform) {
  console.log(`\n========== 开始测试 ${platform} 平台 ==========\n`);
  
  // 测试文件上传
  const fileId = await testUploadAPI(platform);
  if (!fileId) {
    console.error(`${platform} 测试失败: 文件上传失败`);
    return false;
  }
  
  // 测试文件清洗
  const cleanResult = await testCleanAPI(platform, fileId);
  if (!cleanResult) {
    console.error(`${platform} 测试失败: 文件清洗失败`);
    return false;
  }
  
  // 轮询文件状态
  console.log(`开始轮询 ${platform} 文件状态...`);
  let isCompleted = false;
  let retryCount = 0;
  const maxRetries = 30; // 最多等待30次，每次1秒，总共30秒
  
  while (!isCompleted && retryCount < maxRetries) {
    const status = await testStatusAPI(platform, fileId);
    
    if (status && (status.status === 'completed' || status.dbStatus === 'completed_basic')) {
      console.log(`${platform} 文件处理已完成`);
      isCompleted = true;
      return true;
    } else if (status && (status.status === 'failed' || status.dbStatus === 'failed')) {
      console.error(`${platform} 文件处理失败:`, status.error || '未知错误');
      return false;
    } else {
      console.log(`${platform} 文件处理中... 进度: ${status ? status.cleaningProgress || 0 : 0}%`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      retryCount++;
    }
  }
  
  if (!isCompleted) {
    console.warn(`${platform} 测试超时，但处理可能仍在继续`);
    return false;
  }
  
  return true;
}

// 主函数
async function main() {
  try {
    // 创建测试文件
    createTestFiles();
    
    // 测试结果
    const results = {};
    
    // 测试所有平台
    for (const platform of platforms) {
      results[platform] = await testPlatform(platform);
    }
    
    // 输出测试结果摘要
    console.log('\n========== 测试结果摘要 ==========\n');
    for (const platform of platforms) {
      console.log(`${platform}: ${results[platform] ? '成功' : '失败'}`);
    }
    
    console.log('\n测试完成');
  } catch (error) {
    console.error('测试失败:', error);
  } finally {
    // 清理测试文件
    if (fs.existsSync(testFilesDir)) {
      fs.rmSync(testFilesDir, { recursive: true, force: true });
      console.log('测试文件已删除');
    }
  }
}

// 运行测试
main();
