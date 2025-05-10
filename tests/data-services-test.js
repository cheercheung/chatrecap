/**
 * 数据服务测试脚本
 * 
 * 使用方法：
 * 1. 确保已安装依赖：npm install dotenv
 * 2. 运行脚本：node tests/data-services-test.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// 初始化 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 测试数据
const testUser = {
  email: 'test@example.com',
  nickname: '测试用户',
  avatar_url: 'https://example.com/avatar.png',
  credit_balance: 0
};

const testOrder = {
  amount: 9.9,
  credit_amount: 1000,
  status: 'pending'
};

// 测试函数
async function runTests() {
  console.log('开始测试数据服务...\n');
  
  try {
    // 1. 测试用户服务
    console.log('===== 测试用户服务 =====');
    const userId = await testUserService();
    
    // 2. 测试订单服务
    console.log('\n===== 测试订单服务 =====');
    const orderId = await testOrderService(userId);
    
    // 3. 测试积分交易服务
    console.log('\n===== 测试积分交易服务 =====');
    await testCreditService(userId, orderId);
    
    // 4. 测试文件服务
    console.log('\n===== 测试文件服务 =====');
    await testFileService(userId);
    
    console.log('\n所有测试完成！');
  } catch (error) {
    console.error('测试失败:', error);
  }
}

// 测试用户服务
async function testUserService() {
  console.log('创建测试用户...');
  
  // 检查用户是否已存在
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', testUser.email)
    .single();
  
  let userId;
  
  if (existingUser) {
    console.log(`用户已存在，ID: ${existingUser.id}`);
    userId = existingUser.id;
  } else {
    // 创建新用户
    const { data, error } = await supabase
      .from('users')
      .insert({
        email: testUser.email,
        nickname: testUser.nickname,
        avatar_url: testUser.avatar_url,
        credit_balance: testUser.credit_balance,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    console.log(`用户创建成功，ID: ${data.id}`);
    userId = data.id;
  }
  
  // 获取用户信息
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  console.log('用户信息:', user);
  
  return userId;
}

// 测试订单服务
async function testOrderService(userId) {
  console.log('创建测试订单...');
  
  // 创建订单
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_uuid: userId,
      amount: testOrder.amount,
      credit_amount: testOrder.credit_amount,
      status: testOrder.status,
      created_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  
  console.log(`订单创建成功，ID: ${order.uuid}`);
  console.log('订单信息:', order);
  
  // 更新订单状态为已支付
  console.log('更新订单状态为已支付...');
  
  const { data: updatedOrder, error: updateError } = await supabase
    .from('orders')
    .update({
      status: 'paid',
      payment_id: `test_payment_${Date.now()}`
    })
    .eq('uuid', order.uuid)
    .select()
    .single();
  
  if (updateError) throw updateError;
  
  console.log('订单状态更新成功:', updatedOrder);
  
  return order.uuid;
}

// 测试积分交易服务
async function testCreditService(userId, orderId) {
  console.log('创建积分交易记录...');
  
  // 创建积分交易记录
  const { data: transaction, error } = await supabase
    .from('credit_transactions')
    .insert({
      user_uuid: userId,
      amount: testOrder.credit_amount,
      type: 'recharge',
      order_uuid: orderId,
      created_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  
  console.log(`积分交易记录创建成功，ID: ${transaction.id}`);
  console.log('交易信息:', transaction);
  
  // 更新用户积分余额
  console.log('更新用户积分余额...');
  
  const { data: user } = await supabase
    .from('users')
    .select('credit_balance')
    .eq('id', userId)
    .single();
  
  const newBalance = (user.credit_balance || 0) + testOrder.credit_amount;
  
  const { data: updatedUser, error: updateError } = await supabase
    .from('users')
    .update({
      credit_balance: newBalance,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();
  
  if (updateError) throw updateError;
  
  console.log(`用户积分更新成功，新余额: ${updatedUser.credit_balance}`);
}

// 测试文件服务
async function testFileService(userId) {
  console.log('创建测试文件记录...');
  
  // 创建文件记录
  const { data: file, error } = await supabase
    .from('chat_files')
    .insert({
      user_id: userId,
      session_id: `test_session_${Date.now()}`,
      file_type: 'text/plain',
      status: 'uploaded',
      created_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  
  console.log(`文件记录创建成功，ID: ${file.id}`);
  console.log('文件信息:', file);
  
  // 更新文件状态
  console.log('更新文件状态...');
  
  const { data: updatedFile, error: updateError } = await supabase
    .from('chat_files')
    .update({
      status: 'completed_basic',
      words_count: 1000,
      basic_result_path: `/results/${file.id}.json`
    })
    .eq('id', file.id)
    .select()
    .single();
  
  if (updateError) throw updateError;
  
  console.log('文件状态更新成功:', updatedFile);
}

// 运行测试
runTests();
