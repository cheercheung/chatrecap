/**
 * 文件上传API测试脚本（会话支持）
 * 
 * 使用方法：
 * node tests/test-upload-api-session.js
 * 
 * 注意：此测试需要启动Next.js服务器
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

// 初始化 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// API基础URL
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * 创建测试文件
 * @returns 测试文件路径
 */
function createTestFile() {
  const testDir = path.join(__dirname, 'temp');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  
  const testFilePath = path.join(testDir, 'test-chat.txt');
  const content = `
[2023/01/01, 10:00:00] Alice: Hello, how are you?
[2023/01/01, 10:01:00] Bob: I'm good, thanks! How about you?
[2023/01/01, 10:02:00] Alice: I'm doing well too. What are your plans for today?
[2023/01/01, 10:03:00] Bob: Just working on some coding projects. You?
[2023/01/01, 10:04:00] Alice: I'm going to the park later.
  `;
  
  fs.writeFileSync(testFilePath, content);
  return testFilePath;
}

/**
 * 测试文件上传API
 */
async function testUploadApi() {
  try {
    console.log('开始测试文件上传API（会话支持）...');
    
    // 1. 创建测试文件
    const testFilePath = createTestFile();
    console.log('测试文件创建成功:', testFilePath);
    
    // 2. 准备表单数据
    const form = new FormData();
    form.append('file', fs.createReadStream(testFilePath));
    form.append('platform', 'whatsapp');
    
    console.log('准备上传文件...');
    
    // 3. 发送上传请求
    console.log('发送上传请求...');
    const uploadResponse = await fetch(`${API_BASE_URL}/chat-processing/upload`, {
      method: 'POST',
      body: form
    });
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('上传请求失败:', uploadResponse.status, errorText);
      return { success: false, error: `上传请求失败: ${uploadResponse.status} ${errorText}` };
    }
    
    const uploadResult = await uploadResponse.json();
    console.log('上传响应:', uploadResult);
    
    if (!uploadResult.success || !uploadResult.fileId) {
      console.error('上传失败:', uploadResult);
      return { success: false, error: '上传失败' };
    }
    
    const fileId = uploadResult.fileId;
    console.log('文件上传成功，文件ID:', fileId);
    
    // 4. 验证文件记录
    console.log('\n验证文件记录...');
    const { data: fileRecord, error: fileError } = await supabase
      .from('ChatFile')
      .select('*')
      .eq('id', fileId)
      .single();
    
    if (fileError) {
      console.error('获取文件记录失败:', fileError);
      return { success: false, error: fileError };
    }
    
    console.log('文件记录:', fileRecord);
    
    // 5. 验证会话ID
    console.log('\n验证会话ID...');
    if (fileRecord.session_id) {
      console.log('文件已关联会话ID:', fileRecord.session_id);
    } else if (fileRecord.user_id) {
      console.log('文件已关联用户ID:', fileRecord.user_id);
    } else {
      console.warn('文件既没有关联会话ID也没有关联用户ID');
    }
    
    // 6. 获取用户信息API测试
    console.log('\n测试用户信息API...');
    try {
      const userInfoResponse = await fetch(`${API_BASE_URL}/user/info`);
      if (userInfoResponse.ok) {
        const userInfo = await userInfoResponse.json();
        console.log('用户信息:', userInfo);
        
        // 验证会话ID是否匹配
        if (userInfo.user && userInfo.user.sessionId && fileRecord.session_id) {
          console.log('会话ID匹配:', userInfo.user.sessionId === fileRecord.session_id);
        }
      } else {
        console.warn('获取用户信息失败:', await userInfoResponse.text());
      }
    } catch (userInfoError) {
      console.warn('调用用户信息API失败:', userInfoError);
    }
    
    // 7. 清理测试数据
    console.log('\n清理测试数据...');
    
    // 删除测试文件记录
    const { error: deleteError } = await supabase
      .from('ChatFile')
      .delete()
      .eq('id', fileId);
    
    if (deleteError) {
      console.error('删除文件记录失败:', deleteError);
    } else {
      console.log('文件记录删除成功');
    }
    
    // 删除测试文件
    fs.unlinkSync(testFilePath);
    console.log('测试文件删除成功');
    
    console.log('\n测试完成！');
    return { success: true, fileId };
  } catch (error) {
    console.error('测试文件上传API失败:', error);
    return { success: false, error };
  }
}

// 执行测试
async function runTest() {
  try {
    console.log('注意：此测试需要启动Next.js服务器');
    console.log('请确保服务器正在运行，端口为3000');
    console.log('按Enter键继续...');
    
    // 等待用户按Enter
    await new Promise(resolve => {
      process.stdin.once('data', () => {
        resolve();
      });
    });
    
    const result = await testUploadApi();
    
    if (result.success) {
      console.log('\n测试成功完成！');
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
