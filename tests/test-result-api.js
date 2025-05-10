/**
 * 测试基础分析结果获取API
 *
 * 这个脚本用于测试基础分析结果获取API的功能
 *
 * 使用方法:
 * 1. 确保服务器已启动
 * 2. 运行: node tests/test-result-api.js
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
async function uploadFile() {
  try {
    console.log('开始上传测试文件...');

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
async function cleanFile(fileId) {
  try {
    console.log('开始清洗文件...');

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

// 测试文件状态查询API
async function checkFileStatus(fileId) {
  try {
    console.log('检查文件状态...');

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
    console.error('检查文件状态失败:', error);
    return null;
  }
}

// 轮询文件状态直到完成
async function pollStatusUntilComplete(fileId, maxRetries = 30) {
  console.log('开始轮询文件状态...');
  let isCompleted = false;
  let retryCount = 0;

  while (!isCompleted && retryCount < maxRetries) {
    const status = await checkFileStatus(fileId);

    if (status && (status.status === 'completed' || status.dbStatus === 'completed_basic')) {
      console.log('文件处理已完成');
      isCompleted = true;
      return status;
    } else if (status && (status.status === 'failed' || status.dbStatus === 'failed')) {
      console.error('文件处理失败:', status.error || '未知错误');
      return status;
    } else {
      console.log(`文件处理中... 进度: ${status ? status.cleaningProgress || 0 : 0}%`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      retryCount++;
    }
  }

  if (!isCompleted) {
    console.warn('轮询超时，但处理可能仍在继续');
  }

  return null;
}

// 测试基础分析结果获取API
async function testResultAPI(fileId) {
  try {
    console.log('\n测试基础分析结果获取API...');

    // 发送请求
    const response = await fetch(`http://localhost:3000/api/chat-processing/result/${fileId}`);

    // 解析响应
    const result = await response.json();

    // 输出结果
    console.log('结果API响应状态码:', response.status);
    console.log('结果API响应:', result);

    if (result.success) {
      console.log('成功获取基础分析结果');
      // 验证结果结构
      if (result.result && result.result.overview && result.result.textAnalysis && result.result.timeAnalysis) {
        console.log(`总消息数量: ${result.result.overview.totalMessages}`);
        console.log(`总词数: ${result.result.overview.totalWords}`);
        console.log(`每条消息平均词数: ${result.result.overview.wordsPerMessage}`);
        console.log('结果结构验证通过');
        return true;
      } else {
        console.error('结果结构验证失败');
        return false;
      }
    } else {
      console.error('获取基础分析结果失败:', result.message);
      return false;
    }
  } catch (error) {
    console.error('测试基础分析结果获取API失败:', error);
    return false;
  }
}

// 测试不存在的文件ID
async function testNonExistentFileId() {
  try {
    console.log('\n测试不存在的文件ID...');
    const nonExistentId = 'non-existent-file-id';

    // 发送请求
    const response = await fetch(`http://localhost:3000/api/chat-processing/result/${nonExistentId}`);

    // 解析响应
    const result = await response.json();

    // 输出结果
    console.log('结果API响应状态码:', response.status);
    console.log('结果API响应:', result);

    // 验证是否返回404错误
    if (!result.success && response.status === 404 && result.code === 'FILE_NOT_FOUND') {
      console.log('测试通过: 正确处理了不存在的文件ID');
      return true;
    } else {
      console.error('测试失败: 未正确处理不存在的文件ID');
      return false;
    }
  } catch (error) {
    console.error('测试不存在的文件ID失败:', error);
    return false;
  }
}

// 测试无效的文件状态
async function testInvalidFileState(fileId) {
  try {
    console.log('\n测试无效的文件状态...');

    // 首先将文件状态设置为UPLOADED（通过上传新文件）
    const newFileId = await uploadFile();
    if (!newFileId) {
      console.error('无法创建测试文件');
      return false;
    }

    // 发送请求
    const response = await fetch(`http://localhost:3000/api/chat-processing/result/${newFileId}`);

    // 解析响应
    const result = await response.json();

    // 输出结果
    console.log('结果API响应状态码:', response.status);
    console.log('结果API响应:', result);

    // 验证是否返回400错误
    if (!result.success && response.status === 400 && result.code === 'INVALID_STATE') {
      console.log('测试通过: 正确处理了无效的文件状态');
      return true;
    } else {
      console.error('测试失败: 未正确处理无效的文件状态');
      return false;
    }
  } catch (error) {
    console.error('测试无效的文件状态失败:', error);
    return false;
  }
}

// 主函数
async function main() {
  try {
    // 创建测试文件
    createTestFile();

    // 测试结果
    const results = {
      fileUpload: false,
      fileCleaning: false,
      fileProcessing: false,
      resultAPI: false,
      nonExistentFileId: false,
      invalidFileState: false
    };

    // 上传文件
    const fileId = await uploadFile();
    if (!fileId) {
      console.error('测试失败: 文件上传失败');
      return;
    }
    results.fileUpload = true;

    // 清洗文件
    const cleanResult = await cleanFile(fileId);
    if (!cleanResult) {
      console.error('测试失败: 文件清洗失败');
      return;
    }
    results.fileCleaning = true;

    // 轮询状态直到完成
    const finalStatus = await pollStatusUntilComplete(fileId);
    if (!finalStatus) {
      console.error('测试失败: 文件处理未完成');
      return;
    }
    results.fileProcessing = true;

    // 测试基础分析结果获取API
    results.resultAPI = await testResultAPI(fileId);

    // 测试不存在的文件ID
    results.nonExistentFileId = await testNonExistentFileId();

    // 测试无效的文件状态
    results.invalidFileState = await testInvalidFileState(fileId);

    // 输出测试结果摘要
    console.log('\n========== 测试结果摘要 ==========');
    console.log(`文件上传: ${results.fileUpload ? '成功' : '失败'}`);
    console.log(`文件清洗: ${results.fileCleaning ? '成功' : '失败'}`);
    console.log(`文件处理: ${results.fileProcessing ? '成功' : '失败'}`);
    console.log(`基础分析结果获取API: ${results.resultAPI ? '成功' : '失败'}`);
    console.log(`不存在的文件ID测试: ${results.nonExistentFileId ? '成功' : '失败'}`);
    console.log(`无效的文件状态测试: ${results.invalidFileState ? '成功' : '失败'}`);

    // 总体测试结果
    const allTestsPassed = Object.values(results).every(result => result);
    console.log(`\n总体测试结果: ${allTestsPassed ? '所有测试通过' : '部分测试失败'}`);

    console.log('\n测试完成');
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
