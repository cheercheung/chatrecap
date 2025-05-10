# 支付API测试指南

本文档提供了测试支付相关API的方法和步骤。

## 前提条件

1. 确保项目已经启动并运行在本地开发环境
2. 确保Supabase项目已配置并可访问
3. 确保环境变量已正确设置

## 安装依赖

测试脚本需要以下依赖：

```bash
npm install node-fetch dotenv @supabase/supabase-js
```

## 测试方法

### 方法1：使用自动化测试脚本

我们提供了一个自动化测试脚本，可以一次性测试所有支付相关API：

```bash
# 获取一个有效的用户ID
# 可以从Supabase控制台查询User表

# 运行测试脚本，替换YOUR_USER_ID为实际用户ID
node tests/payment-api-test.js YOUR_USER_ID
```

测试脚本会执行以下测试：
1. 获取测试支付API说明
2. 使用测试支付API创建订单并模拟支付
3. 测试支付回调API - 成功场景
4. 测试支付回调API - 失败场景
5. 测试支付回调API - 幂等性

### 方法2：使用curl命令手动测试

如果您想手动测试各个API，可以使用以下curl命令：

#### 1. 测试支付API - 获取说明

```bash
curl http://localhost:3000/api/test/payment
```

#### 2. 测试支付API - 创建订单并模拟支付

```bash
curl -X POST http://localhost:3000/api/test/payment \
  -H "Content-Type: application/json" \
  -d '{"user_uuid": "YOUR_USER_ID", "amount": 9.9, "credit_amount": 1000}'
```

#### 3. 支付回调API - 成功场景

```bash
curl -X POST http://localhost:3000/api/payment-callback \
  -H "Content-Type: application/json" \
  -d '{"order_id": "ORDER_ID", "payment_id": "test_payment_123", "status": "success"}'
```

#### 4. 支付回调API - 失败场景

```bash
curl -X POST http://localhost:3000/api/payment-callback \
  -H "Content-Type: application/json" \
  -d '{"order_id": "ORDER_ID", "payment_id": "test_payment_456", "status": "failed"}'
```

#### 5. 支付回调API - 幂等性测试

```bash
# 对同一个订单重复调用支付回调API
curl -X POST http://localhost:3000/api/payment-callback \
  -H "Content-Type: application/json" \
  -d '{"order_id": "PAID_ORDER_ID", "payment_id": "test_payment_789", "status": "success"}'
```

### 方法3：使用Postman或其他API测试工具

您也可以使用Postman或其他API测试工具来测试这些API。创建以下请求：

1. GET http://localhost:3000/api/test/payment
2. POST http://localhost:3000/api/test/payment
3. POST http://localhost:3000/api/payment-callback

## 验收标准

测试成功应满足以下条件：

1. **测试支付API**
   - 能够成功创建订单
   - 能够模拟支付成功
   - 用户积分余额正确增加
   - 返回正确的订单和积分信息

2. **支付回调API**
   - 能够成功处理支付成功回调
   - 能够正确处理支付失败回调
   - 对已支付订单的重复回调能够正确处理（幂等性）
   - 返回适当的错误信息（如订单不存在）

## 故障排除

如果测试失败，请检查以下几点：

1. 确保Supabase连接正常
2. 确保用户ID存在且有效
3. 检查服务器日志中的错误信息
4. 确保订单表和积分交易表结构正确

## 注意事项

- 测试脚本使用的是服务角色密钥，具有较高权限，请勿在生产环境中使用
- 测试会创建真实的订单和积分交易记录，可能会影响数据统计
- 如果需要，可以在测试后手动清理测试数据
