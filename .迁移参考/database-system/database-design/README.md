# 数据库设计文档

本文档详细说明了系统的数据库设计、表结构和业务逻辑。

## 目录

1. [数据库表结构](#数据库表结构)
2. [业务逻辑流程](#业务逻辑流程)
3. [数据流示例](#数据流示例)
4. [实现建议](#实现建议)

## 数据库表结构

系统包含四个主要表：

### 1. User 表（用户信息）

```
User 表:
- uuid (主键): 用户唯一标识符
- email (唯一): 用户邮箱，用于识别用户
- signin_provider: 登录提供商
- signin_openid: 提供商账号ID
- credit_balance: 当前积分余额
- created_at: 创建时间
- updated_at: 最新登录时间
```

### 2. Order 表（充值订单）

```
Order 表:
- uuid (主键): 订单唯一标识符
- created_at: 创建时间
- user_uuid (外键): 关联到User表
- amount: 金额
- status: 订单状态 (pending, paid, cancelled)
- credit_amount: 购买的积分数量
- payment_id: 支付平台订单号
```

### 3. CreditTransaction 表（积分交易记录）

```
CreditTransaction 表:
- id (主键): 自增ID
- user_uuid (外键): 关联到User表
- amount: 变动金额
- type: 类型 (recharge, consume)
- order_uuid: 关联订单UUID (仅充值时有值)
- file_uuid: 关联文件UUID (仅消费时有值)
- created_at: 创建时间
```

### 4. ChatFile 表（聊天记录文件）

```
ChatFile 表:
- uuid (主键): 文件唯一标识符
- user_uuid (外键): 关联到User表，可以为NULL（未登录用户）
- session_id: 会话标识符（用于后续关联未登录用户）
- file_type: 文件类型
- status: 处理状态（uploaded, processing, completed_basic, failed, complete_ai）
- created_at: 上传时间
- words_count: 文字数量
- storage_path: 存储路径
- basic_result_path: 基础分析结果存储路径
- ai_result_path: AI分析结果存储路径（仅当完成AI分析时有值）
```

## 业务逻辑流程

### 用户访问和认证逻辑

- **未登录用户**可以：
  - 上传文件进行基础分析(basic)
  - 查看基础分析结果
  - 注册/登录账号

- **已登录用户**可以：
  - 执行未登录用户的所有操作
  - 进行AI分析（需消耗积分）
  - 充值积分
  - 查看历史分析记录
  - 管理个人账户

### 文件处理流程

1. **文件上传**：
   - 用户上传聊天记录文件
   - 系统创建ChatFile记录，状态为"uploaded"
   - 系统分配唯一UUID给文件

2. **基础分析**（不需要登录）：
   - 系统处理文件，状态更新为"processing"
   - 系统计算文件字数(words_count)
   - 完成基础分析后，状态更新为"completed_basic"
   - 用户可查看基础分析结果

3. **AI分析**（需要登录）：
   - 用户请求AI分析
   - 系统检查用户是否登录
     - 如未登录，提示用户登录
   - 系统检查用户积分是否足够
     - 如积分不足，提示用户充值
   - 系统消耗用户积分（创建CreditTransaction记录）
   - 系统执行AI分析
   - 完成后，状态更新为"complete_ai"

### 用户关联逻辑

- **未登录用户上传的文件**：
  - 初始没有user_uuid关联
  - 用户后续登录时，系统将文件关联到用户账户
  - 关联方式可以通过会话ID或临时标识符

- **已登录用户上传的文件**：
  - 直接关联到用户账户

### 积分系统逻辑

- **积分充值**：
  - 用户选择充值套餐
  - 系统创建Order记录
  - 用户完成支付
  - 系统创建CreditTransaction记录（类型为"recharge"）
  - 系统更新用户积分余额

- **积分消费**：
  - 用户请求AI分析
  - 系统根据文件字数计算所需积分
  - 系统创建CreditTransaction记录（类型为"consume"）
  - 系统更新用户积分余额
  - 系统执行AI分析

## 数据流示例

### 示例1：未登录用户上传文件并进行基础分析

```
1. 创建ChatFile记录:
   {
     "uuid": "f123e4b5-6c78-9d0e-1f2a-3b4c5d6e7f89",
     "user_uuid": null,
     "session_id": "temp-session-12345",
     "file_type": "txt",
     "status": "uploaded",
     "created_at": "2023-06-01T10:00:00Z",
     "words_count": null,
     "storage_path": "/uploads/chat123.txt",
     "basic_result_path": null,
     "ai_result_path": null
   }

2. 基础分析完成后更新:
   {
     "uuid": "f123e4b5-6c78-9d0e-1f2a-3b4c5d6e7f89",
     "status": "completed_basic",
     "words_count": 5000,
     "basic_result_path": "/results/basic/chat123.json"
   }
```

### 示例2：用户登录并关联之前上传的文件

```
1. 用户登录，创建User记录:
   {
     "uuid": "u987f6e5-4d32-1c0b-9a8b-7c6d5e4f3a2b",
     "email": "user@example.com",
     "signin_provider": "google",
     "signin_openid": "google-id-12345",
     "credit_balance": 0,
     "created_at": "2023-06-01T10:30:00Z",
     "updated_at": "2023-06-01T10:30:00Z"
   }

2. 关联之前上传的文件:
   {
     "uuid": "f123e4b5-6c78-9d0e-1f2a-3b4c5d6e7f89",
     "user_uuid": "u987f6e5-4d32-1c0b-9a8b-7c6d5e4f3a2b",
     "session_id": "temp-session-12345"
   }
```

### 示例3：用户充值积分

```
1. 创建Order记录:
   {
     "uuid": "o567a8b9-0c12-3d45-6e78-9f0a1b2c3d4e",
     "created_at": "2023-06-01T11:00:00Z",
     "user_uuid": "u987f6e5-4d32-1c0b-9a8b-7c6d5e4f3a2b",
     "amount": 990, // 9.9元
     "status": "pending",
     "credit_amount": 1000,
     "payment_id": null
   }

2. 支付完成后更新Order:
   {
     "uuid": "o567a8b9-0c12-3d45-6e78-9f0a1b2c3d4e",
     "status": "paid",
     "payment_id": "pay-platform-id-12345"
   }

3. 创建CreditTransaction记录:
   {
     "id": 1,
     "user_uuid": "u987f6e5-4d32-1c0b-9a8b-7c6d5e4f3a2b",
     "amount": 1000,
     "type": "recharge",
     "order_uuid": "o567a8b9-0c12-3d45-6e78-9f0a1b2c3d4e",
     "file_uuid": null,
     "created_at": "2023-06-01T11:05:00Z"
   }

4. 更新User积分余额:
   {
     "uuid": "u987f6e5-4d32-1c0b-9a8b-7c6d5e4f3a2b",
     "credit_balance": 1000,
     "updated_at": "2023-06-01T11:05:00Z"
   }
```

### 示例4：用户请求AI分析

```
1. 创建CreditTransaction记录:
   {
     "id": 2,
     "user_uuid": "u987f6e5-4d32-1c0b-9a8b-7c6d5e4f3a2b",
     "amount": -500, // 消费500积分
     "type": "consume",
     "order_uuid": null,
     "file_uuid": "f123e4b5-6c78-9d0e-1f2a-3b4c5d6e7f89",
     "created_at": "2023-06-01T11:10:00Z"
   }

2. 更新User积分余额:
   {
     "uuid": "u987f6e5-4d32-1c0b-9a8b-7c6d5e4f3a2b",
     "credit_balance": 500,
     "updated_at": "2023-06-01T11:10:00Z"
   }

3. 更新ChatFile状态:
   {
     "uuid": "f123e4b5-6c78-9d0e-1f2a-3b4c5d6e7f89",
     "status": "complete_ai",
     "ai_result_path": "/results/ai/chat123.json"
   }
```

## 实现建议

### 数据库选择

1. **PostgreSQL**: 推荐使用，功能强大，支持UUID、JSON等高级数据类型
2. **Supabase**: 基于PostgreSQL的云数据库服务，提供额外的功能如实时订阅、存储等

### ORM选择

1. **Prisma**: 强类型ORM，提供类型安全的数据库访问
2. **Supabase Client**: 如果使用Supabase，可以使用其客户端库

### 数据库索引建议

为了提高查询性能，建议添加以下索引：

```sql
-- 用户邮箱索引
CREATE INDEX idx_user_email ON "User"("email");

-- 订单状态索引
CREATE INDEX idx_order_status ON "Order"("status");

-- 积分交易类型索引
CREATE INDEX idx_credit_transaction_type ON "CreditTransaction"("type");

-- 积分交易用户索引
CREATE INDEX idx_credit_transaction_user ON "CreditTransaction"("user_uuid");

-- 聊天文件状态索引
CREATE INDEX idx_chat_file_status ON "ChatFile"("status");

-- 聊天文件会话索引
CREATE INDEX idx_chat_file_session ON "ChatFile"("session_id");
```

### 事务处理

在以下操作中使用数据库事务确保数据一致性：

1. 订单支付完成后的积分充值
2. AI分析时的积分消费
3. 用户关联文件操作

### 安全考虑

1. 使用参数化查询防止SQL注入
2. 实施适当的访问控制，确保用户只能访问自己的数据
3. 对敏感数据进行加密存储
