/**
 * 支付API测试脚本
 *
 * 使用方法：
 * 1. 确保已安装依赖：npm install node-fetch dotenv
 * 2. 运行脚本：node tests/payment-api-test.js [用户ID]
 */

require('dotenv').config();
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

// 初始化 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 配置
const API_BASE_URL = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000';
const TEST_PAYMENT_API = `${API_BASE_URL}/api/test/payment`;
const PAYMENT_CALLBACK_API = `${API_BASE_URL}/api/payment-callback`;

// 获取命令行参数中的用户ID，如果没有提供，则使用默认值
const userId = process.argv[2];

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// 辅助函数：打印带颜色的消息
function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

// 辅助函数：延迟执行
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 测试1：获取测试支付API说明
async function testGetPaymentApiInfo() {
  log('\n测试1：获取测试支付API说明', 'cyan');

  try {
    const response = await fetch(TEST_PAYMENT_API);
    const data = await response.json();

    log('API说明获取成功:', 'green');
    log(JSON.stringify(data, null, 2), 'yellow');

    return true;
  } catch (error) {
    log(`获取API说明失败: ${error.message}`, 'red');
    return false;
  }
}

// 测试2：使用测试支付API创建订单并模拟支付
async function testCreatePayment(userId) {
  log('\n测试2：使用测试支付API创建订单并模拟支付', 'cyan');

  if (!userId) {
    log('错误: 未提供用户ID', 'red');
    return null;
  }

  try {
    // 检查用户是否存在
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('id, email')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      log(`错误: 用户 ${userId} 不存在，尝试创建测试用户`, 'yellow');

      // 创建测试用户
      const { data: newUser, error: createError } = await supabase
        .from('User')
        .insert({
          id: userId,
          email: `test_${Date.now()}@example.com`,
          username: `testuser_${Date.now()}`,
          password_hash: 'dummy_hash',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();

      if (createError) {
        log(`错误: 无法创建测试用户: ${createError.message}`, 'red');
        return null;
      }

      log(`成功创建测试用户 ${userId}`, 'green');
    } else {
      log(`用户 ${userId} 存在，开始创建测试支付`, 'green');
    }

    // 创建测试支付
    const response = await fetch(TEST_PAYMENT_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_uuid: userId,
        amount: 9.9,
        credit_amount: 1000
      }),
    });

    const data = await response.json();

    if (data.success) {
      log('测试支付创建成功:', 'green');
      log(JSON.stringify(data, null, 2), 'yellow');
      return data.order.id; // 返回订单ID，用于后续测试
    } else {
      log(`测试支付创建失败: ${data.message}`, 'red');
      return null;
    }
  } catch (error) {
    log(`测试支付创建失败: ${error.message}`, 'red');
    return null;
  }
}

// 测试3：测试支付回调API - 成功场景
async function testPaymentCallbackSuccess(orderId) {
  log('\n测试3：测试支付回调API - 成功场景', 'cyan');

  if (!orderId) {
    log('错误: 未提供订单ID', 'red');
    return false;
  }

  try {
    const response = await fetch(PAYMENT_CALLBACK_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: orderId,
        payment_id: `callback_test_${Date.now()}`,
        status: 'success'
      }),
    });

    const data = await response.json();

    log('支付回调响应:', 'green');
    log(JSON.stringify(data, null, 2), 'yellow');

    return data.success;
  } catch (error) {
    log(`支付回调测试失败: ${error.message}`, 'red');
    return false;
  }
}

// 测试4：测试支付回调API - 失败场景
async function testPaymentCallbackFailure(orderId) {
  log('\n测试4：测试支付回调API - 失败场景', 'cyan');

  if (!orderId) {
    log('错误: 未提供订单ID', 'red');
    return false;
  }

  try {
    const response = await fetch(PAYMENT_CALLBACK_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: orderId,
        payment_id: `callback_test_${Date.now()}`,
        status: 'failed'
      }),
    });

    const data = await response.json();

    log('支付回调响应 (失败场景):', 'green');
    log(JSON.stringify(data, null, 2), 'yellow');

    return data.success;
  } catch (error) {
    log(`支付回调测试失败: ${error.message}`, 'red');
    return false;
  }
}

// 测试5：测试支付回调API - 幂等性
async function testPaymentCallbackIdempotency(orderId) {
  log('\n测试5：测试支付回调API - 幂等性', 'cyan');

  if (!orderId) {
    log('错误: 未提供订单ID', 'red');
    return false;
  }

  try {
    // 第一次调用
    await fetch(PAYMENT_CALLBACK_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: orderId,
        payment_id: `idempotency_test_${Date.now()}`,
        status: 'success'
      }),
    });

    // 等待一秒
    await sleep(1000);

    // 第二次调用（应该返回订单已处理）
    const response = await fetch(PAYMENT_CALLBACK_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: orderId,
        payment_id: `idempotency_test_${Date.now()}`,
        status: 'success'
      }),
    });

    const data = await response.json();

    log('支付回调响应 (幂等性测试):', 'green');
    log(JSON.stringify(data, null, 2), 'yellow');

    // 检查是否返回了"订单已处理"的消息
    return data.success && data.message === '订单已处理';
  } catch (error) {
    log(`幂等性测试失败: ${error.message}`, 'red');
    return false;
  }
}

// 主函数
async function main() {
  log('开始支付API测试...', 'magenta');

  if (!userId) {
    log('请提供用户ID作为命令行参数', 'red');
    log('用法: node tests/payment-api-test.js [用户ID]', 'yellow');
    return;
  }

  // 测试1：获取API说明
  await testGetPaymentApiInfo();

  // 测试2：创建测试支付
  const orderId = await testCreatePayment(userId);
  if (!orderId) {
    log('测试中止: 无法创建测试订单', 'red');
    return;
  }

  // 创建另一个订单用于测试失败场景
  log('\n为失败场景创建另一个订单...', 'cyan');
  const failureOrderId = await testCreatePayment(userId);

  // 测试3：支付回调 - 成功场景
  const successResult = await testPaymentCallbackSuccess(orderId);

  // 测试4：支付回调 - 失败场景
  if (failureOrderId) {
    const failureResult = await testPaymentCallbackFailure(failureOrderId);
  }

  // 测试5：支付回调 - 幂等性
  if (successResult) {
    const idempotencyResult = await testPaymentCallbackIdempotency(orderId);
  }

  log('\n支付API测试完成', 'magenta');
}

// 执行主函数
main().catch(error => {
  log(`测试过程中发生错误: ${error.message}`, 'red');
});
