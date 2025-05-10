/**
 * 字符计数功能测试脚本 - 测试所有平台
 * 
 * 使用方法：
 * node tests/test-all-platforms-word-count.js
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

// 测试平台配置
const platforms = [
  {
    name: 'WhatsApp',
    file: 'whatsapp.txt',
    platform: 'whatsapp',
    contentField: 'message' // 消息内容字段
  },
  {
    name: 'Discord',
    file: 'discord.json',
    platform: 'discord',
    contentField: 'content' // 消息内容字段
  },
  {
    name: 'Instagram',
    file: 'ig.json',
    platform: 'instagram',
    contentField: 'content' // 消息内容字段
  },
  {
    name: 'Snapchat',
    file: 'snap.json',
    platform: 'snapchat',
    contentField: 'content' // 消息内容字段
  },
  {
    name: 'Telegram',
    file: 'telegram.json',
    platform: 'telegram',
    contentField: 'text' // 消息内容字段
  }
];

// 准备测试文件
function prepareTestFile(platform) {
  const testFilePath = path.join(__dirname, platform.file);
  console.log(`使用${platform.name}测试文件:`, testFilePath);
  
  // 检查文件是否存在
  if (!fs.existsSync(testFilePath)) {
    console.error('测试文件不存在:', testFilePath);
    throw new Error('测试文件不存在');
  }
  
  return testFilePath;
}

// 测试文件上传API
async function testUploadAPI(platform, testFilePath) {
  try {
    console.log(`开始测试${platform.name}文件上传API...`);
    
    // 创建FormData
    const form = new FormData();
    form.append('file', fs.createReadStream(testFilePath));
    form.append('platform', platform.platform);
    
    // 发送请求
    const response = await fetch('http://localhost:3000/api/chat-processing/upload', {
      method: 'POST',
      body: form
    });
    
    // 解析响应
    const result = await response.json();
    
    // 输出结果
    console.log('上传API响应:', result);
    
    if (result.success) {
      console.log('文件上传成功，fileId:', result.fileId);
      return result.fileId;
    } else {
      console.error('文件上传失败:', result.message);
      return null;
    }
  } catch (error) {
    console.error(`测试${platform.name}文件上传API失败:`, error);
    return null;
  }
}

// 测试文件清洗API
async function testCleanAPI(platform, fileId) {
  try {
    console.log(`开始测试${platform.name}文件清洗API...`);
    
    // 发送请求
    const response = await fetch('http://localhost:3000/api/chat-processing/clean', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileId,
        platform: platform.platform
      })
    });
    
    // 解析响应
    const result = await response.json();
    
    // 输出结果
    console.log('清洗API响应:', result);
    
    if (result.success) {
      console.log('文件清洗已开始');
      return true;
    } else {
      console.error('文件清洗失败:', result.message);
      return false;
    }
  } catch (error) {
    console.error(`测试${platform.name}文件清洗API失败:`, error);
    return false;
  }
}

// 测试文件状态查询API
async function testStatusAPI(fileId) {
  try {
    console.log('开始测试文件状态查询API...');
    
    // 发送请求
    const response = await fetch(`http://localhost:3000/api/chat-processing/status/${fileId}`);
    
    // 解析响应
    const result = await response.json();
    
    // 输出结果
    console.log('状态查询API响应:', result);
    
    if (result.success) {
      console.log('文件状态:', result.status);
      return result.status;
    } else {
      console.error('文件状态查询失败:', result.message);
      return null;
    }
  } catch (error) {
    console.error('测试文件状态查询API失败:', error);
    return null;
  }
}

// 等待文件处理完成并获取状态
async function waitForProcessingAndGetStatus(fileId, maxAttempts = 10, interval = 2000) {
  console.log(`等待文件处理完成，最多尝试 ${maxAttempts} 次，间隔 ${interval}ms...`);
  
  for (let i = 0; i < maxAttempts; i++) {
    console.log(`尝试 ${i + 1}/${maxAttempts}...`);
    
    const status = await testStatusAPI(fileId);
    
    if (!status) {
      console.error('获取状态失败');
      return null;
    }
    
    if (status.dbStatus === 'completed_basic' || status.status === 'completed') {
      console.log('文件处理已完成');
      return status;
    }
    
    if (status.dbStatus === 'failed' || status.status === 'failed') {
      console.error('文件处理失败');
      return null;
    }
    
    console.log(`文件处理中，状态: ${status.dbStatus || status.status}，等待 ${interval}ms...`);
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  console.error(`已达到最大尝试次数 ${maxAttempts}，文件处理可能仍在进行中`);
  return null;
}

// 测试单个平台
async function testPlatform(platform) {
  console.log(`\n===== 开始测试 ${platform.name} 平台 =====\n`);
  
  try {
    // 准备测试文件
    const testFilePath = prepareTestFile(platform);
    
    // 测试文件上传
    const fileId = await testUploadAPI(platform, testFilePath);
    
    if (!fileId) {
      console.error('文件上传失败，无法继续测试');
      return false;
    }
    
    // 测试文件清洗
    const cleanResult = await testCleanAPI(platform, fileId);
    
    if (!cleanResult) {
      console.error('文件清洗失败，无法继续测试');
      return false;
    }
    
    // 等待文件处理完成并获取状态
    const status = await waitForProcessingAndGetStatus(fileId);
    
    if (!status) {
      console.error('文件处理未完成或获取状态失败，无法验证字符计数');
      return false;
    }
    
    // 从状态中获取字符计数
    const wordsCount = status.words_count;
    
    if (wordsCount) {
      console.log('\n字符计数测试结果:');
      console.log('文件ID:', fileId);
      console.log('数据库中的字符数:', wordsCount);
      
      console.log('字符计数功能正常工作 ✓');
      return true;
    } else {
      console.error('无法获取字符计数');
      return false;
    }
  } catch (error) {
    console.error(`测试${platform.name}平台时发生错误:`, error);
    return false;
  } finally {
    console.log(`\n===== ${platform.name} 平台测试完成 =====\n`);
  }
}

// 运行所有平台测试
async function runAllTests() {
  console.log('开始测试所有平台的字符计数功能...\n');
  
  const results = {};
  
  for (const platform of platforms) {
    results[platform.name] = await testPlatform(platform);
    
    // 测试之间稍作暂停
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // 输出总结
  console.log('\n===== 测试结果总结 =====');
  let allPassed = true;
  
  for (const platform of platforms) {
    const result = results[platform.name];
    console.log(`${platform.name}: ${result ? '✓ 通过' : '✗ 失败'}`);
    if (!result) allPassed = false;
  }
  
  console.log(`\n总体结果: ${allPassed ? '✓ 所有平台测试通过' : '✗ 部分平台测试失败'}`);
  console.log('\n测试完成');
}

// 执行测试
runAllTests().catch(error => {
  console.error('测试执行失败:', error);
});
