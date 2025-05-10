/**
 * 测试文件上传API
 * 
 * 使用方法：
 * node tests/test-upload-api.js
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

// 测试文件路径
const testFilePath = path.join(__dirname, 'test-data.txt');

// 创建测试文件
fs.writeFileSync(testFilePath, 'This is a test file for API testing.');

// 测试文件上传API
async function testUploadAPI() {
  try {
    console.log('开始测试文件上传API...');
    
    // 创建FormData
    const form = new FormData();
    form.append('file', fs.createReadStream(testFilePath));
    form.append('platform', 'discord');
    
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
  } finally {
    // 清理测试文件
    fs.unlinkSync(testFilePath);
  }
}

// 测试文件处理API
async function testProcessAPI(fileId) {
  try {
    console.log('开始测试文件处理API...');
    
    // 发送请求
    const response = await fetch('http://localhost:3000/api/chat-processing/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileId,
        platform: 'discord'
      })
    });
    
    // 解析响应
    const result = await response.json();
    
    // 输出结果
    console.log('处理API响应:', result);
    
    if (result.success) {
      console.log('文件处理已开始');
      return true;
    } else {
      console.error('文件处理失败:', result.message);
      return false;
    }
  } catch (error) {
    console.error('测试文件处理API失败:', error);
    return false;
  }
}

// 测试平台特定处理API
async function testPlatformAPI(fileId, platform = 'discord') {
  try {
    console.log(`开始测试${platform}处理API...`);
    
    // 发送请求
    const response = await fetch(`http://localhost:3000/api/chat-processing/${platform}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileId
      })
    });
    
    // 解析响应
    const result = await response.json();
    
    // 输出结果
    console.log(`${platform}处理API响应:`, result);
    
    if (result.success) {
      console.log(`${platform}数据处理完成`);
      return true;
    } else {
      console.error(`${platform}数据处理失败:`, result.message);
      return false;
    }
  } catch (error) {
    console.error(`测试${platform}处理API失败:`, error);
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
      return true;
    } else {
      console.error('文件状态查询失败:', result.message);
      return false;
    }
  } catch (error) {
    console.error('测试文件状态查询API失败:', error);
    return false;
  }
}

// 运行测试
async function runTests() {
  // 测试文件上传
  const fileId = await testUploadAPI();
  
  if (!fileId) {
    console.error('文件上传失败，无法继续测试');
    return;
  }
  
  // 等待一段时间
  console.log('等待2秒...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 测试文件状态查询
  await testStatusAPI(fileId);
  
  // 测试文件处理
  const processResult = await testProcessAPI(fileId);
  
  if (!processResult) {
    console.error('文件处理失败，无法继续测试');
    return;
  }
  
  // 等待一段时间
  console.log('等待2秒...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 再次测试文件状态查询
  await testStatusAPI(fileId);
  
  // 测试平台特定处理
  await testPlatformAPI(fileId, 'discord');
  
  // 等待一段时间
  console.log('等待2秒...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 最后测试文件状态查询
  await testStatusAPI(fileId);
  
  console.log('所有测试完成');
}

// 执行测试
runTests().catch(error => {
  console.error('测试过程中发生错误:', error);
});
