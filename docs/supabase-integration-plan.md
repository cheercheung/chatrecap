# Supabase 集成实施方案

本文档提供了将 Supabase 集成到现有项目的详细步骤和实施计划。

## 1. 前期准备工作✅

1. **创建 Supabase 项目**
   - 注册/登录 Supabase 账户 (https://app.supabase.com)
   - 创建新项目，选择合适的区域
   - 记录项目 URL 和 API 密钥（在项目设置 > API 中）

2. **环境变量配置**
   - 在 `.env.local` 文件中添加以下环境变量：
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     ```

## 2. 数据库迁移方案✅

1. **数据库表设计**✅
   - 在 Supabase SQL 编辑器中执行以下 SQL 创建必要的表：
     - User 表（用户信息）
     - Order 表（充值订单）
     - CreditTransaction 表（积分交易记录）
     - ChatFile 表（聊天记录文件）
   - 参考 `database-system/README.md` 中的表结构设计

2. **行级安全策略设置**✅
   - 为每个表启用行级安全 (RLS)
   - 设置适当的访问策略，确保用户只能访问自己的数据
   - 例如：用户只能查看自己的订单、文件等

3. **数据库函数创建**wan✅
   - 创建积分更新函数，确保事务安全 ✅
   - 创建订单处理函数，处理支付完成后的操作✅
   - 使用 PostgreSQL 事务确保数据一致性

## 3. 认证系统集成✅（检查是否成功花费很长时间）

1. **Supabase 认证配置** ✅
   - 在 Supabase 控制台 > Authentication > Providers 中配置：
     - OAuth 提供商（已启用 Google 登录）
   - 设置站点 URL 和重定向 URL（项目设置 > Authentication）

2. **认证服务实现** ✅
   - 创建 `lib/supabase/client.ts` 初始化 Supabase 客户端
   - 创建 `lib/supabase/server.ts` 服务端 Supabase 客户端
   - 创建 `lib/supabase/auth.ts` 实现认证相关功能：
     - OAuth 登录（Google）
     - 登出
     - 获取当前用户
   - 替换现有的认证逻辑

3. **认证 UI 组件调整** ✅
   - 修改 `components/sign/form.tsx` 登录表单，适配 Supabase 认证流程
   - 创建 `components/sign/user.tsx` 用户菜单组件
   - 创建 `components/sign/sign_in.tsx` 登录按钮组件
   - 创建 `components/sign/auth-status.tsx` 认证状态组件
   - 创建 `components/providers/user-provider.tsx` 用户提供者组件
   - 创建 `app/auth/callback/route.ts` 认证回调处理页面
   - 创建 `app/[locale]/auth/signin/page.tsx` 登录页面

## 4. 存储系统集成（保留现有存储）✅

1. **保留现有存储系统**
   - 继续使用现有的本地文件系统存储和 S3 兼容存储
   - 不迁移到 Supabase 存储桶
   - 保持现有的文件上传、下载和管理功能

2. **存储元数据管理**
   - 在 Supabase 数据库中存储文件元数据（如文件 ID、路径、状态等）
   - 使用 `chat_files` 表跟踪文件状态和处理进度
   - 实现文件元数据的 CRUD 操作

3. **文件服务实现**
   - 创建 `services/file.ts` 服务，封装文件元数据操作
   - 实现以下功能：
     - 创建文件记录
     - 更新文件状态
     - 关联分析结果
     - 查询用户文件
   - 与现有存储系统集成，保持文件内容和元数据的一致性

4. **文件处理 API 调整**
   - 修改文件上传 API，使用 Supabase 数据库存储元数据
   - 保持文件内容存储在现有系统中
   - 实现文件处理状态更新和查询

## 5. 数据服务实现✅
1. **用户服务**✅
   - 实现用户相关的数据操作函数：
     - 创建/更新用户信息
     - 获取用户详情
     - 关联未登录用户的文件

2. **订单服务**✅
   - 实现订单相关的数据操作函数：
     - 创建订单
     - 更新订单状态
     - 查询用户订单历史

3. **积分交易服务**✅
   - 实现积分交易相关的数据操作函数：
     - 创建积分交易记录
     - 更新用户积分余额
     - 查询交易历史

4. **文件服务**✅
   - 实现文件相关的数据操作函数：
     - 创建文件记录
     - 更新文件状态
     - 关联分析结果
     - 查询用户文件

### 数据服务实现总结

在第五阶段，我们成功实现了四个核心数据服务，为应用提供了与 Supabase 数据库交互的完整功能。

#### 用户服务 (`services/user.ts`)
- 实现了完整的用户管理功能，包括创建、查询和更新用户信息
- 提供了多种获取用户信息的方式：通过ID、邮箱或当前会话
- 实现了未登录用户文件关联功能，确保用户登录后能访问之前上传的文件
- 主要函数：`getUserById`, `getUserByEmail`, `createUser`, `saveUser`, `getCurrentUser`, `associateFilesToUser`

#### 订单服务 (`services/order.ts`)
- 实现了订单生命周期管理，从创建到支付完成
- 定义了清晰的订单状态流转：`PENDING` → `PAID`/`CANCELLED`/`FAILED`
- 集成了支付完成后的积分增加逻辑，确保数据一致性
- 主要函数：`createOrder`, `updateOrderStatus`, `getOrderById`, `getUserOrders`

#### 积分交易服务 (`services/credit.ts`)
- 实现了完整的积分管理系统，支持充值和消费两种交易类型
- 使用数据库函数确保积分更新的事务安全
- 提供了积分余额查询和交易历史功能
- 主要函数：`createCreditTransaction`, `consumeCredits`, `getUserCreditHistory`, `getUserCreditBalance`, `checkUserCreditSufficient`

#### 文件服务 (`services/file.ts`)
- 实现了文件元数据管理，支持文件上传、处理和分析的完整流程
- 定义了文件状态流转：`UPLOADED` → `PROCESSING` → `COMPLETED_BASIC`/`COMPLETE_AI`/`FAILED`
- 提供了文件查询和管理功能，支持按用户和会话查询
- 主要函数：`createFileRecord`, `updateFileStatus`, `associateAnalysisResult`, `getFileById`, `getUserFiles`, `getSessionFiles`

#### 数据一致性保障
- 使用 Supabase RPC 函数确保积分更新的事务安全
- 所有服务函数都实现了完善的错误处理机制
- 订单状态更新前验证当前状态，防止重复处理
- 积分消费前检查余额是否足够

这些数据服务为下一阶段的 API 路由调整和前端组件集成提供了坚实的基础。

## 6. API 路由调整
1. **支付回调处理**
   - 修改支付回调 API，使用 Supabase 客户端更新订单状态
   - 确保事务安全，使用数据库函数处理复杂操作
   - 实现支付成功后的积分增加逻辑

2. **文件处理 API**
   - 修改文件上传 API，使用 Supabase 存储和数据库
   - 实现文件分析状态更新
   - 处理未登录用户的会话标识

3. **AI 分析 API**
   - 修改 AI 分析 API，适配 Supabase 数据模型
   - 实现积分检查和消费逻辑
   - 确保分析结果正确存储

## 7. 前端组件调整

1. **支付触发组件**
   - 修改支付相关组件，适配 Supabase 数据模型
   - 确保正确处理支付流程和回调
   - 实现支付状态的实时更新

2. **用户信息组件**
   - 修改用户信息相关组件，使用 Supabase Auth
   - 实现用户登录状态的实时更新
   - 显示用户积分余额和基本信息

3. **文件处理组件**
   - 修改文件上传和处理相关组件
   - 适配 Supabase 存储和数据模型
   - 实现文件处理状态的实时更新

## 8. 实时功能实现

1. **Supabase 实时订阅配置**
   - 在 Supabase 控制台 > Database > Replication 中配置：
     - 启用需要实时更新的表
     - 设置发布/订阅权限

2. **实时更新实现**
   - 使用 Supabase 实时 API 订阅数据变化：
     - 文件状态变化
     - 订单状态变化
     - 积分余额变化
   - 实现 UI 的实时更新

## 9. 测试与部署

1. **本地测试**
   - 测试认证流程（注册、登录、登出）
   - 测试文件上传和处理流程
   - 测试支付和积分系统
   - 测试实时更新功能

2. **部署配置**
   - 在生产环境中配置必要的环境变量
   - 确保 Supabase 项目设置适合生产环境
   - 配置适当的 CORS 和安全设置

3. **监控与日志**
   - 在 Supabase 控制台中设置日志和监控
   - 实现应用级错误跟踪
   - 设置关键操作的审计日志


## 注意事项

1. **安全考虑**
   - 确保敏感操作使用服务端 API 和服务角色密钥
   - 正确配置 RLS 策略，防止数据泄露
   - 定期审查访问日志和权限设置

2. **性能优化**
   - 为频繁查询的字段创建索引
   - 使用适当的缓存策略
   - 监控查询性能，优化慢查询

3. **用户体验**
   - 确保认证流程流畅，提供清晰的错误信息
   - 实现加载状态和进度指示
   - 提供适当的反馈机制

4. **扩展性考虑**
   - 设计模块化的服务和组件
   - 考虑未来可能的功能扩展
   - 使用类型安全的接口和模型



   ## 表结构
  | table_name        | column_name   | data_type                | is_nullable |
| ----------------- | ------------- | ------------------------ | ----------- |
| ChatFile          | id            | uuid                     | NO          |
| ChatFile          | user_id       | uuid                     | YES         |
| ChatFile          | file_url      | text                     | NO          |
| ChatFile          | file_name     | character varying        | NO          |
| ChatFile          | uploaded_at   | timestamp with time zone | YES         |
| CreditTransaction | id            | uuid                     | NO          |
| CreditTransaction | user_id       | uuid                     | YES         |
| CreditTransaction | change_amount | integer                  | NO          |
| CreditTransaction | balance_after | integer                  | NO          |
| CreditTransaction | type          | character varying        | NO          |
| CreditTransaction | description   | text                     | YES         |
| CreditTransaction | created_at    | timestamp with time zone | YES         |
| CreditTransaction | file_id       | uuid                     | YES         |
| Order             | id            | uuid                     | NO          |
| Order             | user_id       | uuid                     | YES         |
| Order             | amount        | numeric                  | NO          |
| Order             | status        | character varying        | NO          |
| Order             | created_at    | timestamp with time zone | YES         |
| User              | id            | uuid                     | NO          |
| User              | username      | character varying        | NO          |
| User              | email         | character varying        | NO          |
| User              | password_hash | character varying        | NO          |
| User              | created_at    | timestamp with time zone | YES         |
| User              | updated_at    | timestamp with time zone | YES         |