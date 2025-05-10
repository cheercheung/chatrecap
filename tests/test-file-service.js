/**
 * 文件服务测试脚本
 *
 * 使用方法：
 * node tests/test-file-service.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 初始化 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 文件状态枚举
const ChatFileStatus = {
  UPLOADED: 'uploaded',
  CLEANING: 'cleaning',
  PROCESSING: 'processing',
  COMPLETED_BASIC: 'completed_basic',
  COMPLETE_AI: 'complete_ai',
  FAILED: 'failed'
};

// 生成测试数据
const sessionId = crypto.randomBytes(16).toString('hex');
const userId = uuidv4();

/**
 * 测试文件服务
 */
async function testFileService() {
  try {
    console.log('开始测试文件服务...');
    console.log('会话ID:', sessionId);
    console.log('用户ID:', userId);

    // 1. 创建用户记录
    console.log('\n创建测试用户记录...');

    const timestamp = Date.now();
    const { data: user, error: userError } = await supabase
      .from('User')
      .insert({
        id: userId,
        email: `test-${timestamp}@example.com`,
        username: `Test User ${timestamp}`, // 使用唯一的用户名
        password_hash: 'dummy_hash_for_testing', // 添加密码哈希
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (userError) {
      console.error('创建用户记录失败:', userError);
      return { success: false, error: userError };
    }

    console.log('用户记录创建成功:', user);

    // 2. 测试创建会话文件（未登录用户）
    console.log('\n测试创建会话文件（未登录用户）...');

    const guestFileId = uuidv4();

    const { data: guestFile, error: guestFileError } = await supabase
      .from('ChatFile')
      .insert({
        id: guestFileId,
        session_id: sessionId,
        platform: 'whatsapp',
        status: ChatFileStatus.UPLOADED,
        storage_path: `/uploads/${guestFileId}`,
        uploaded_at: new Date().toISOString()
      })
      .select()
      .single();

    if (guestFileError) {
      console.error('创建会话文件失败:', guestFileError);
      return { success: false, error: guestFileError };
    }

    console.log('会话文件创建成功:', guestFile);

    // 3. 测试创建用户文件（已登录用户）
    console.log('\n测试创建用户文件（已登录用户）...');

    const userFileId = uuidv4();

    const { data: userFile, error: userFileError } = await supabase
      .from('ChatFile')
      .insert({
        id: userFileId,
        user_id: userId,
        platform: 'discord',
        status: ChatFileStatus.UPLOADED,
        storage_path: `/uploads/${userFileId}`,
        uploaded_at: new Date().toISOString()
      })
      .select()
      .single();

    if (userFileError) {
      console.error('创建用户文件失败:', userFileError);
      return { success: false, error: userFileError };
    }

    console.log('用户文件创建成功:', userFile);

    // 4. 测试查询会话文件
    console.log('\n测试查询会话文件...');

    const { data: sessionFiles, error: sessionFilesError } = await supabase
      .from('ChatFile')
      .select('*')
      .eq('session_id', sessionId);

    if (sessionFilesError) {
      console.error('查询会话文件失败:', sessionFilesError);
      return { success: false, error: sessionFilesError };
    }

    console.log(`找到 ${sessionFiles.length} 个会话文件:`, sessionFiles.map(f => f.id));

    // 5. 测试查询用户文件
    console.log('\n测试查询用户文件...');

    const { data: userFiles, error: userFilesError } = await supabase
      .from('ChatFile')
      .select('*')
      .eq('user_id', userId);

    if (userFilesError) {
      console.error('查询用户文件失败:', userFilesError);
      return { success: false, error: userFilesError };
    }

    console.log(`找到 ${userFiles.length} 个用户文件:`, userFiles.map(f => f.id));

    // 6. 测试文件迁移
    console.log('\n测试文件迁移...');

    const { data: migratedFile, error: migrateError } = await supabase
      .from('ChatFile')
      .update({
        user_id: userId,
        session_id: null
      })
      .eq('id', guestFileId)
      .select()
      .single();

    if (migrateError) {
      console.error('迁移文件失败:', migrateError);
      return { success: false, error: migrateError };
    }

    console.log('文件迁移成功:', migratedFile);

    // 7. 再次查询用户文件，验证迁移结果
    console.log('\n再次查询用户文件，验证迁移结果...');

    const { data: updatedUserFiles, error: updatedUserFilesError } = await supabase
      .from('ChatFile')
      .select('*')
      .eq('user_id', userId);

    if (updatedUserFilesError) {
      console.error('查询更新后的用户文件失败:', updatedUserFilesError);
      return { success: false, error: updatedUserFilesError };
    }

    console.log(`迁移后找到 ${updatedUserFiles.length} 个用户文件:`, updatedUserFiles.map(f => f.id));

    // 8. 清理测试数据
    console.log('\n清理测试数据...');

    // 删除测试文件记录
    const { error: deleteFilesError } = await supabase
      .from('ChatFile')
      .delete()
      .in('id', [guestFileId, userFileId]);

    if (deleteFilesError) {
      console.error('删除测试文件记录失败:', deleteFilesError);
    } else {
      console.log('测试文件记录删除成功');
    }

    // 删除测试用户记录
    const { error: deleteUserError } = await supabase
      .from('User')
      .delete()
      .eq('id', userId);

    if (deleteUserError) {
      console.error('删除测试用户记录失败:', deleteUserError);
    } else {
      console.log('测试用户记录删除成功');
    }

    console.log('\n测试完成！');
    return { success: true };
  } catch (error) {
    console.error('测试文件服务失败:', error);
    return { success: false, error };
  }
}

// 执行测试
async function runTest() {
  try {
    const result = await testFileService();

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
