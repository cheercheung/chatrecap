# 数据库系统

这个文件夹包含了一个完整的数据库系统，基于 Prisma ORM 和 PostgreSQL/Supabase 实现。

## 系统架构

```
数据库系统
├── 数据模型 (Database Models)
│   ├── Prisma Schema (prisma/schema.prisma)
│   └── 类型定义 (types/*.ts)
├── 数据服务 (Database Services)
│   ├── 用户服务 (services/user.ts)
│   ├── 文件服务 (services/chatfile.ts)
│   ├── 订单服务 (services/order.ts)
│   └── 积分服务 (services/credit.ts)
└── 数据库客户端 (Database Client)
    ├── Prisma 客户端 (lib/prisma.ts)
    └── Supabase 客户端 (lib/supabase.ts)
```

## 数据库表结构

### 1. User 表（用户信息）

```
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

## 业务流程

1. **文件上传和分析流程**
   - 未登录用户可以上传文件并获取基础分析
   - 登录用户可以进行AI分析（消耗积分）
   - 文件状态从 uploaded → processing → completed_basic/complete_ai

2. **用户积分流程**
   - 用户充值创建订单，支付成功后增加积分
   - 用户进行AI分析消耗积分
   - 所有积分变动记录在 CreditTransaction 表中

3. **未登录用户关联**
   - 未登录用户上传的文件通过 session_id 标识
   - 用户登录后，系统自动关联之前上传的文件

## 设计优点

1. **清晰的数据模型**：
   - 表结构设计合理，关系明确
   - 使用 UUID 作为主键，有利于分布式系统
   - 字段命名规范，含义明确

2. **完善的业务流程**：
   - 详细描述了文件上传、用户登录、积分充值等核心流程
   - 考虑了未登录用户的使用场景
   - 定义了明确的状态流转规则

3. **技术选择合理**：
   - 使用 Prisma ORM 提供类型安全的数据库操作
   - 集成 Supabase 提供存储和实时功能
   - 代码实现遵循最佳实践

4. **安全性考虑**：
   - 积分消费有余额检查
   - 订单状态有严格的流转规则
   - 考虑了数据库索引优化

## 待改进事项

1. **缺少 CreditTransaction 服务实现**：
   - order.ts 中引用了 createCreditTransaction 函数，但没有找到对应的实现文件
   - 需要创建 credit.ts 服务文件，实现积分交易相关功能

2. **文件处理服务缺失**：
   - README 中提到了 chatfile.ts 服务，但实际目录中没有找到
   - 需要实现文件处理相关的服务函数

3. **事务处理**：
   - 在涉及多表操作的场景（如订单支付完成后更新积分），应使用数据库事务确保数据一致性
   - 例如，在 updateOrderStatus 函数中，创建积分记录和更新用户积分余额应在同一事务中完成

4. **错误处理改进**：
   - 部分服务函数在遇到错误时只是记录日志，没有提供足够的错误信息
   - 建议实现更详细的错误类型和处理机制

5. **数据验证**：
   - 缺少输入数据的验证逻辑
   - 建议添加数据验证层，确保数据符合业务规则

6. **并发控制**：
   - 在高并发场景下，可能出现积分余额计算错误
   - 建议使用数据库锁或乐观并发控制机制

## 优化建议

1. **索引优化**：
   - 已经定义了基本索引，但可以根据查询模式进一步优化
   - 考虑添加复合索引，如 (user_uuid, created_at) 用于按时间查询用户记录

2. **数据库监控**：
   - 实现数据库性能监控机制
   - 记录慢查询并进行优化

3. **扩展用户模型**：
   - 考虑添加更多用户属性，如昵称、头像等
   - 支持用户偏好设置

4. **API 限流**：
   - 实现 API 请求限流机制，防止滥用
   - 特别是对于文件上传和分析等资源密集型操作

5. **数据备份策略**：
   - 制定定期数据备份计划
   - 实现数据恢复机制

6. **添加审计日志**：
   - 记录关键操作的审计日志，如积分变动、订单状态变更等
   - 有助于问题排查和安全审计

## 使用方法

1. **配置环境变量**
   - 复制 `.env.example` 到 `.env.local`
   - 填写数据库连接信息

2. **初始化数据库**
   - 运行 `npx prisma db push` 创建数据库表
   - 运行 `npx prisma generate` 生成 Prisma 客户端

3. **使用数据服务**
   - 导入相应的服务函数
   - 调用函数进行数据操作

## 与 Supabase 集成

如果您使用 Supabase 作为数据库解决方案，可以：

1. 使用 Prisma 连接 Supabase PostgreSQL 数据库
2. 使用 Supabase 客户端进行额外的操作（如存储、实时订阅等）

详细配置请参考 `lib/supabase.ts` 和 `.env.example`。

## 下一步计划

1. **实现缺失的服务文件**：
   - 创建 credit.ts 实现积分交易服务
   - 创建 chatfile.ts 实现文件处理服务

2. **添加数据迁移脚本**：
   - 使用 Prisma Migrate 创建版本化的数据库迁移
   - 编写数据迁移和回滚脚本

3. **实现事务处理**：
   - 在关键业务流程中添加事务支持
   - 确保数据一致性和完整性

4. **添加单元测试**：
   - 为所有服务函数编写单元测试
   - 实现集成测试验证业务流程
