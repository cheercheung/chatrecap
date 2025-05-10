/**
 * 支付流程测试脚本 (适配真实表结构)
 * 
 * 使用方法：
 * node tests/payment-test-final.js [用户ID]
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// 初始化 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 获取命令行参数
const userId = process.argv[2] || 'b7e1c2d3-4f5a-6789-bcde-123456789abc';

// 测试数据
const testOrder = {
  amount: 9.9,
  credit_amount: 1000,
  status: 'pending'
};

// 主函数
async function testPaymentFlow() {
  console.log(`开始测试用户 ${userId} 的支付流程...\n`);
  
  try {
    // 1. 检查用户是否存在
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.error('用户不存在或查询出错:', userError);
      
      // 如果用户不存在，创建一个测试用户
      console.log('创建测试用户...');
      const { data: newUser, error: createError } = await supabase
        .from('User')
        .insert({
          id: userId,
          username: 'testuser',
          email: 'test@example.com',
          password_hash: 'hashed_password_for_testing',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (createError) {
        console.error('创建用户失败:', createError);
        process.exit(1);
      }
      
      console.log('测试用户创建成功:', newUser);
      user = newUser;
    } else {
      console.log('用户信息:', {
        id: user.id,
        username: user.username,
        email: user.email
      });
    }
    
    // 2. 创建订单
    console.log('\n创建订单...');
    const orderId = uuidv4();
    const { data: order, error: orderError } = await supabase
      .from('Order')
      .insert({
        id: orderId,
        user_id: userId,
        amount: testOrder.amount,
        status: testOrder.status,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (orderError) {
      console.error('创建订单失败:', orderError);
      process.exit(1);
    }
    
    console.log(`订单创建成功，ID: ${order.id}`);
    
    // 3. 模拟支付成功，更新订单状态
    console.log('\n模拟支付成功，更新订单状态...');
    const { data: updatedOrder, error: updateError } = await supabase
      .from('Order')
      .update({
        status: 'paid'
      })
      .eq('id', order.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('更新订单状态失败:', updateError);
      process.exit(1);
    }
    
    console.log('订单状态更新成功:', {
      id: updatedOrder.id,
      状态: updatedOrder.status
    });
    
    // 4. 获取用户当前积分余额（如果有）
    let currentBalance = 0;
    const { data: latestTransaction, error: balanceError } = await supabase
      .from('CreditTransaction')
      .select('balance_after')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (!balanceError && latestTransaction && latestTransaction.length > 0) {
      currentBalance = latestTransaction[0].balance_after;
    }
    
    console.log(`当前积分余额: ${currentBalance}`);
    
    // 5. 创建积分交易记录
    console.log('\n创建积分交易记录...');
    const transactionId = uuidv4();
    const newBalance = currentBalance + testOrder.credit_amount;
    
    const { data: transaction, error: transactionError } = await supabase
      .from('CreditTransaction')
      .insert({
        id: transactionId,
        user_id: userId,
        change_amount: testOrder.credit_amount,
        balance_after: newBalance,
        type: 'recharge',
        description: `订单 ${order.id} 充值`,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (transactionError) {
      console.error('创建积分交易记录失败:', transactionError);
      process.exit(1);
    }
    
    console.log(`积分交易记录创建成功，ID: ${transaction.id}`);
    console.log('积分变更:', {
      变更金额: transaction.change_amount,
      变更后余额: transaction.balance_after
    });
    
    // 6. 验证最终结果
    console.log('\n验证最终结果...');
    const { data: transactions } = await supabase
      .from('CreditTransaction')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);
    
    console.log('最近交易记录:', transactions.map(t => ({
      id: t.id,
      类型: t.type,
      变更金额: t.change_amount,
      变更后余额: t.balance_after,
      描述: t.description,
      时间: t.created_at
    })));
    
    console.log('\n支付流程测试完成！');
  } catch (error) {
    console.error('测试过程中出错:', error);
  }
}

// 运行测试
testPaymentFlow();
