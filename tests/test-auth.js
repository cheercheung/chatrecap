/**
 * 用户身份验证测试脚本
 *
 * 使用方法：
 * node tests/test-auth.js
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

// 模拟会话ID
const sessionId = crypto.randomBytes(16).toString('hex');

/**
 * 测试用户身份验证
 */
async function testAuth() {
  try {
    console.log('开始测试用户身份验证...');
    console.log('会话ID:', sessionId);

    // 1. 创建测试用户
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'Test@123456';

    console.log('创建测试用户:', testEmail);

    // 使用管理员API创建用户
    const { data: user, error: createError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true // 自动确认邮箱
    });

    if (createError) {
      console.error('创建测试用户失败:', createError);
      return { success: false, error: createError };
    }

    console.log('测试用户创建成功:', user);

    // 在User表中创建对应的记录
    console.log('在User表中创建记录...');
    const timestamp = Date.now();
    const { data: userRecord, error: userRecordError } = await supabase
      .from('User')
      .insert({
        id: user.user.id,
        email: user.user.email,
        username: `Test User ${timestamp}`, // 使用唯一的用户名
        password_hash: 'dummy_hash_for_testing', // 添加密码哈希
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (userRecordError) {
      console.error('创建用户记录失败:', userRecordError);
      return { success: false, error: userRecordError };
    }

    console.log('用户记录创建成功:', userRecord);

    // 2. 模拟未登录状态（游客）
    console.log('\n模拟未登录状态（游客）...');

    // 模拟getCurrentUser函数的行为
    const guestUser = {
      userId: null,
      role: 'guest',
      sessionId,
      isAuthenticated: false
    };

    console.log('游客用户信息:', guestUser);

    // 3. 模拟登录状态
    console.log('\n模拟登录状态...');

    // 模拟getCurrentUser函数的行为
    const authenticatedUser = {
      userId: user.user.id,
      role: 'user',
      sessionId,
      email: user.user.email,
      isAuthenticated: true
    };

    console.log('已登录用户信息:', authenticatedUser);

    // 4. 测试文件访问权限验证
    console.log('\n测试文件访问权限验证...');

    // 创建一个测试文件记录
    const fileId = uuidv4();

    // 游客上传的文件（关联会话ID）
    const { data: guestFile, error: guestFileError } = await supabase
      .from('ChatFile')
      .insert({
        id: fileId,
        session_id: sessionId,
        platform: 'test',
        status: 'uploaded',
        storage_path: `/uploads/${fileId}`,
        uploaded_at: new Date().toISOString()
      })
      .select()
      .single();

    if (guestFileError) {
      console.error('创建游客文件记录失败:', guestFileError);
      return { success: false, error: guestFileError };
    }

    console.log('游客文件记录创建成功:', guestFile);

    // 模拟validateFileAccess函数的行为
    const guestCanAccessOwnFile = guestFile.session_id === guestUser.sessionId;
    const userCanAccessGuestFile = guestFile.user_id === authenticatedUser.userId ||
                                  (guestFile.session_id === authenticatedUser.sessionId);

    console.log('游客是否可以访问自己的文件:', guestCanAccessOwnFile);
    console.log('已登录用户是否可以访问游客文件:', userCanAccessGuestFile);

    // 5. 测试文件迁移
    console.log('\n测试文件迁移...');

    // 更新文件所有权
    const { data: migratedFile, error: migrateError } = await supabase
      .from('ChatFile')
      .update({
        user_id: authenticatedUser.userId,
        session_id: null
      })
      .eq('id', fileId)
      .select()
      .single();

    if (migrateError) {
      console.error('迁移文件失败:', migrateError);
      return { success: false, error: migrateError };
    }

    console.log('文件迁移成功:', migratedFile);

    // 验证迁移后的权限
    const guestCanAccessAfterMigrate = migratedFile.session_id === guestUser.sessionId;
    const userCanAccessAfterMigrate = migratedFile.user_id === authenticatedUser.userId;

    console.log('迁移后游客是否可以访问文件:', guestCanAccessAfterMigrate);
    console.log('迁移后已登录用户是否可以访问文件:', userCanAccessAfterMigrate);

    // 6. 清理测试数据
    console.log('\n清理测试数据...');

    // 删除测试文件记录
    const { error: deleteFileError } = await supabase
      .from('ChatFile')
      .delete()
      .eq('id', fileId);

    if (deleteFileError) {
      console.error('删除测试文件记录失败:', deleteFileError);
    } else {
      console.log('测试文件记录删除成功');
    }

    // 删除测试用户
    const { error: deleteUserError } = await supabase.auth.admin.deleteUser(
      user.user.id
    );

    if (deleteUserError) {
      console.error('删除测试用户失败:', deleteUserError);
    } else {
      console.log('测试用户删除成功');
    }

    console.log('\n测试完成！');
    return { success: true };
  } catch (error) {
    console.error('测试用户身份验证失败:', error);
    return { success: false, error };
  }
}

// 执行测试
async function runTest() {
  try {
    const result = await testAuth();

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
