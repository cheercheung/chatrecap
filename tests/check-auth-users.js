/**
 * 查询 Supabase auth.users 表
 * 
 * 使用方法：
 * node tests/check-auth-users.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// 初始化 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAuthUsers() {
  try {
    console.log('正在查询 auth.users 表...');
    
    // 获取当前用户会话
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('获取会话失败:', sessionError);
    } else {
      console.log('当前会话:', sessionData);
    }
    
    // 获取用户
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('获取用户失败:', userError);
    } else {
      console.log('当前用户:', userData);
    }
    
    // 尝试使用管理员API查询所有用户
    console.log('\n尝试查询所有用户...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('查询所有用户失败:', usersError);
    } else {
      console.log('用户列表:');
      console.log(users);
    }
    
    // 尝试查询指定ID的用户
    const userId = 'b7e1c2d3-4f5a-6789-bcde-123456789abc';
    console.log(`\n尝试查询用户ID: ${userId}`);
    
    const { data: user, error: userIdError } = await supabase.auth.admin.getUserById(userId);
    
    if (userIdError) {
      console.error('查询用户失败:', userIdError);
    } else {
      console.log('用户信息:');
      console.log(user);
    }
    
  } catch (error) {
    console.error('执行查询时出错:', error);
  }
}

// 运行函数
checkAuthUsers();
