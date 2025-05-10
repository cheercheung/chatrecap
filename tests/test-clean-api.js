/**
 * 测试文件清洗API
 * 
 * 这个脚本用于测试文件上传和清洗API
 * 
 * 使用方法:
 * 1. 确保服务器已启动
 * 2. 运行: node tests/test-clean-api.js
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');

// 测试文件路径
const testFilePath = path.join(__dirname, 'test-data.txt');

// 创建测试文件
function createTestFile() {
  const testData = `
[2023/01/01, 10:00:00] User1: Hello, how are you?
[2023/01/01, 10:01:00] User2: I'm good, thanks!
[2023/01/01, 10:02:00] User1: What are you doing today?
[2023/01/01, 10:03:00] User2: Just working on some code.
`;

  fs.writeFileSync(testFilePath, testData);
  console.log('测试文件已创建:', testFilePath);
}

// 测试文件上传API
async function testUploadAPI() {
  try {
    console.log('开始测试文件上传API...');
    
    // 创建FormData
    const form = new FormData();
    form.append('file', fs.createReadStream(testFilePath));
    form.append('platform', 'whatsapp');
    
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
    console.error('测试文件上传API失败:', error);
    return null;
  }
}

// 测试文件清洗API
async function testCleanAPI(fileId) {
  try {
    console.log('开始测试文件清洗API...');
    
    // 发送请求
    const response = await fetch('http://localhost:3000/api/chat-processing/clean', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileId,
        platform: 'whatsapp'
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
    console.error('测试文件清洗API失败:', error);
    return false;
  }
}

// 测试文件状态API
async function testStatusAPI(fileId) {
  try {
    console.log('开始测试文件状态API...');
    
    // 发送请求
    const response = await fetch(`http://localhost:3000/api/chat-processing/status/${fileId}`);
    
    // 解析响应
    const result = await response.json();
    
    // 输出结果
    console.log('状态API响应:', result);
    
    if (result.success) {
      console.log('文件状态:', result.status);
      return result.status;
    } else {
      console.error('获取文件状态失败:', result.message);
      return null;
    }
  } catch (error) {
    console.error('测试文件状态API失败:', error);
    return null;
  }
}

// 主函数
async function main() {
  try {
    // 创建测试文件
    createTestFile();
    
    // 测试文件上传
    const fileId = await testUploadAPI();
    if (!fileId) {
      console.error('测试失败: 文件上传失败');
      return;
    }
    
    // 测试文件清洗
    const cleanResult = await testCleanAPI(fileId);
    if (!cleanResult) {
      console.error('测试失败: 文件清洗失败');
      return;
    }
    
    // 轮询文件状态
    console.log('开始轮询文件状态...');
    let isCompleted = false;
    let retryCount = 0;
    const maxRetries = 30; // 最多等待30次，每次1秒，总共30秒
    
    while (!isCompleted && retryCount < maxRetries) {
      const status = await testStatusAPI(fileId);
      
      if (status && (status.status === 'completed' || status.dbStatus === 'completed_basic')) {
        console.log('文件处理已完成');
        isCompleted = true;
      } else if (status && status.status === 'failed') {
        console.error('文件处理失败:', status.error);
        break;
      } else {
        console.log(`文件处理中... 进度: ${status ? status.cleaningProgress || 0 : 0}%`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        retryCount++;
      }
    }
    
    if (!isCompleted) {
      console.warn('测试超时，但处理可能仍在继续');
    }
    
    console.log('测试完成');
  } catch (error) {
    console.error('测试失败:', error);
  } finally {
    // 清理测试文件
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
      console.log('测试文件已删除');
    }
  }
}

// 运行测试
main();
