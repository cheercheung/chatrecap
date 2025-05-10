/**
 * 支付流程测试脚本
 * 
 * 使用方法：
 * 1. 确保已安装依赖：npm install dotenv
 * 2. 运行脚本：node tests/payment-test.js [用户ID]
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// 初始化 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 获取命令行参数
const userId = process.argv[2];

// 测试数据
const testOrder = {
  amount: 9.9,
  credit_amount: 1000,
  status: 'pending'
};

// 主函数
async function testPaymentFlow() {
  if (!userId) {
    console.error('请提供用户ID作为参数');
    console.log('使用方法: node tests/payment-test.js [用户ID]');
    process.exit(1);
  }

  console.log(`开始测试用户 ${userId} 的支付流程...\n`);
  
  try {
    // 1. 检查用户是否存在
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.error('用户不存在或查询出错:', userError);
      process.exit(1);
    }
    
    console.log('用户信息:', {
      id: user.id,
      email: user.email,
      当前积分: user.credit_balance || 0
    });
    
    // 2. 创建订单
    console.log('\n创建订单...');
    const { data: order, error: orderError } = await supabase
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
    
    if (orderError) {
      console.error('创建订单失败:', orderError);
      process.exit(1);
    }
    
    console.log(`订单创建成功，ID: ${order.uuid}`);
    
    // 3. 模拟支付成功，更新订单状态
    console.log('\n模拟支付成功，更新订单状态...');
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_id: `test_payment_${Date.now()}`
      })
      .eq('uuid', order.uuid)
      .select()
      .single();
    
    if (updateError) {
      console.error('更新订单状态失败:', updateError);
      process.exit(1);
    }
    
    console.log('订单状态更新成功:', {
      id: updatedOrder.uuid,
      状态: updatedOrder.status,
      支付ID: updatedOrder.payment_id
    });
    
    // 4. 创建积分交易记录
    console.log('\n创建积分交易记录...');
    const { data: transaction, error: transactionError } = await supabase
      .from('credit_transactions')
      .insert({
        user_uuid: userId,
        amount: testOrder.credit_amount,
        type: 'recharge',
        order_uuid: order.uuid,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (transactionError) {
      console.error('创建积分交易记录失败:', transactionError);
      process.exit(1);
    }
    
    console.log(`积分交易记录创建成功，ID: ${transaction.id}`);
    
    // 5. 更新用户积分余额
    console.log('\n更新用户积分余额...');
    const newBalance = (user.credit_balance || 0) + testOrder.credit_amount;
    
    const { data: updatedUser, error: userUpdateError } = await supabase
      .from('users')
      .update({
        credit_balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (userUpdateError) {
      console.error('更新用户积分余额失败:', userUpdateError);
      process.exit(1);
    }
    
    console.log('用户积分更新成功:', {
      原积分: user.credit_balance || 0,
      增加积分: testOrder.credit_amount,
      新积分: updatedUser.credit_balance
    });
    
    // 6. 验证最终结果
    console.log('\n验证最终结果...');
    const { data: finalUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    const { data: transactions } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_uuid', userId)
      .order('created_at', { ascending: false })
      .limit(5);
    
    console.log('最终用户积分:', finalUser.credit_balance);
    console.log('最近5条交易记录:', transactions.map(t => ({
      id: t.id,
      类型: t.type,
      金额: t.amount,
      时间: t.created_at
    })));
    
    console.log('\n支付流程测试完成！');
  } catch (error) {
    console.error('测试过程中出错:', error);
  }
}

// 运行测试
testPaymentFlow();
