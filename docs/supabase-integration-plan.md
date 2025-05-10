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

### 6.1 支付回调处理 API✅

1. **修改 `app/api/payment-callback/route.ts`**
   - 使用 Supabase 客户端替换现有的 Prisma 调用
   - 使用 `services/order.ts` 中的 `updateOrderStatus` 函数更新订单状态
   - 确保事务安全，使用数据库函数处理复杂操作
   - 实现支付成功后的积分增加逻辑（已在 `updateOrderStatus` 中集成）
   - 添加适当的错误处理和日志记录

2. **修改 `app/api/test/payment/route.ts`**（测试支付API）
   - 更新测试支付API，使用 Supabase 客户端
   - 使用 `services/order.ts` 和 `services/user.ts` 中的函数
   - 保持测试支付流程的功能完整性

### 6.2 文件处理 API ✅

文件处理系统包含多个阶段：上传、清洗(clean)、基础分析(basic analysis)和AI分析(AI analysis)。以下是各阶段API的实施方案。

#### 6.2.1 文件状态流转

文件处理过程中的状态流转如下：

```
UPLOADED → CLEANING → PROCESSING → COMPLETED_BASIC → AI_PROCESSING → COMPLETED_AI
                   ↘            ↘                  ↘               ↘
                     FAILED       FAILED             FAILED          FAILED
```

- **UPLOADED**: 文件已上传
- **CLEANING**: 文件清洗中
- **PROCESSING**: 基础分析处理中
- **COMPLETED_BASIC**: 基础分析完成
- **AI_PROCESSING**: AI分析处理中
- **COMPLETED_AI**: AI分析完成
- **FAILED**: 处理失败（任何阶段）

#### 6.2.2 文件上传 API ✅

1. **修改 `app/api/chat-processing/upload/route.ts`**
   - 使用 `services/file.ts` 中的 `createFileRecord` 函数创建文件记录
   - 保持文件内容存储在现有系统中
   - 获取当前用户ID，关联到文件记录
   - 设置初始状态为 `UPLOADED`
   - 保存存储路径到 `storage_path` 字段

**端点**: `/api/chat-processing/upload`

**方法**: POST

**请求参数**:
- `file`: 文件对象（FormData）
- `platform`: 平台类型（whatsapp, instagram, discord, telegram, snapchat）

**响应**:
```json
{
  "success": true,
  "fileId": "uuid",
  "message": "文件上传成功"
}
```

#### 6.2.3 文件处理 API ✅

1. **修改 `app/api/chat-processing/process/route.ts`**
   - 使用 `getFileById` 函数获取文件记录
   - 使用 `updateFileStatus` 函数更新文件状态为 `PROCESSING`
   - 异步处理文件，并在处理完成后更新状态
   - 处理失败时更新状态为 `FAILED`

**端点**: `/api/chat-processing/process`

**方法**: POST

**请求参数**:
```json
{
  "fileId": "uuid",
  "platform": "platform_type",
  "skipAiAnalysis": true
}
```

**响应**:
```json
{
  "success": true,
  "fileId": "uuid",
  "message": "文件处理已开始"
}
```

#### 6.2.4 文件状态查询 API ✅

1. **修改 `app/api/chat-processing/status/[fileId]/route.ts`**
   - 从Supabase数据库获取文件记录
   - 从本地存储获取处理状态
   - 合并状态信息返回给客户端

**端点**: `/api/chat-processing/status/:fileId`

#### 6.2.5 平台特定处理 API ✅

1. **修改平台特定处理API**
   - 更新 `app/api/chat-processing/{platform}/route.ts` 文件
   - 使用 `getFileById` 函数获取文件记录
   - 使用 `updateFileStatus` 函数更新文件状态
   - 确保平台信息正确设置

**支持的平台**:
- `app/api/chat-processing/discord/route.ts`
- `app/api/chat-processing/instagram/route.ts`
- `app/api/chat-processing/snapchat/route.ts`
- `app/api/chat-processing/telegram/route.ts`
- `app/api/chat-processing/whatsapp/route.ts`

**端点**: `/api/chat-processing/:platform`

**测试结果**:
- 创建了专门的测试脚本 `tests/test-platform-specific-apis.js`
- 测试了所有5个平台的特定处理API
- 所有平台的测试都成功通过
- 验证了文件状态正确更新到数据库
- 验证了平台信息正确设置

#### 6.2.6 基础分析结果获取 API ✅

1. **修改 `app/api/chat-processing/result/[fileId]/route.ts`**
   - 使用 `getFileById` 函数获取文件记录
   - 验证文件状态是否为 `COMPLETED_BASIC` 或 `COMPLETED_AI`
   - 从 `basic_result_path` 读取基础分析结果

**端点**: `/api/chat-processing/result/:fileId`

**测试结果**:
- 创建了专门的测试脚本 `tests/test-result-api.js`
- 测试了基础分析结果获取API的功能
- 验证了API能够正确处理不同的文件状态
- 验证了API能够正确处理不存在的文件ID
- 验证了API返回的结果结构符合预期
- 所有测试都成功通过



### 6.3 AI 分析 API✅

AI分析是文件处理流程的最后阶段，需要消耗用户积分。以下是AI分析API的实施方案。

#### 6.3.1 AI分析触发 API

1. **修改 `app/api/chat-processing/ai-analysis/route.ts`**
   - 使用 `getFileById` 函数获取文件记录
   - 验证文件状态是否为 `COMPLETED_BASIC`
   - 使用 `checkUserCreditSufficient` 函数检查用户积分是否足够
   - 使用 `consumeCredits` 函数消费用户积分
   - 使用 `updateFileStatus` 函数更新文件状态为 `AI_PROCESSING`
   - 异步执行AI分析，并在分析完成后更新状态
   - 分析失败时更新状态为 `FAILED`

**端点**: `/api/chat-processing/ai-analysis`


#### 6.3.2 AI分析状态查询 API

1. **修改 `app/api/check-analysis-status/route.ts`**
   - 使用 `getFileById` 函数获取文件记录
   - 验证文件是否存在
   - 返回文件的AI分析状态

**端点**: `/api/check-analysis-status`



#### 6.3.3 AI分析结果获取 API

1. **修改 `app/api/chat-processing/ai-result/[fileId]/route.ts`**
   - 使用 `getFileById` 函数获取文件记录
   - 验证文件状态是否为 `COMPLETED_AI`
   - 从 `ai_result_path` 读取AI分析结果

**端点**: `/api/chat-processing/ai-result/:fileId`


#### 6.3.4 AI分析触发检查 API

1. **修改 `app/api/trigger-analysis/route.ts`**
   - 使用 Supabase 客户端查询订单和文件状态
   - 集成 `services/order.ts` 和 `services/file.ts` 中的函数
   - 检查用户是否有足够积分进行AI分析
   - 返回用户是否可以触发AI分析

**端点**: `/api/trigger-analysis`

*
#### 6.3.5 积分消费实现

AI分析需要消费用户积分，实现方式如下：

1. **使用数据库事务确保原子性**
   - 在同一事务中扣减积分和更新文件状态
   - 如果任一操作失败，整个事务回滚

2. **积分消费记录**
   - 创建积分交易记录，类型为 `CONSUME`
   - 记录消费原因为AI分析，并关联文件ID
   - 记录消费后的余额

3. **积分不足处理**
   - 如果用户积分不足，返回错误信息
   - 提供购买积分的选项

### 6.4 存储 API 调整✅

#### 6.4.1 存储系统集成方案✅
由于项目决定保留现有的服务器本地存储系统而不是迁移到Supabase存储桶，我们采用以下方案来调整存储API：
1. **保留现有的文件存储逻辑**
   - 继续使用现有的本地文件系统存储机制
   - 不迁移文件内容到Supabase存储桶
   - 保持 `lib/storage/index.ts` 中的核心文件操作函数不变

2. **增强存储API与数据库的集成**
   - 修改 `app/api/storage/route.ts` 以在文件操作的同时更新Supabase数据库中的文件元数据
   - 使用 `services/file.ts` 中的函数来操作数据库中的文件记录
   - 确保文件操作和数据库操作的一致性

3. **增加用户认证和权限检查**
   - 在文件操作前验证用户身份和权限
   - 确保用户只能访问和修改自己的文件
   - 使用Supabase Auth会话进行身份验证

#### 6.4.2 具体实施内容✅

1. **修改 `app/api/storage/route.ts`**
   - 添加用户认证和权限验证
   - 在文件上传/保存时，同时创建或更新Supabase中的文件记录
   - 在文件读取时，验证用户权限和文件状态
   - 在文件删除时，同时删除Supabase中的文件记录
   - 保持API接口兼容性，确保现有前端代码不需要大幅修改

2. **实现事务安全**
   - 确保文件操作和数据库操作的原子性
   - 如果任一操作失败，进行适当的回滚或错误处理
   - 添加详细的错误日志和用户友好的错误消息

3. **优化性能和安全性**
   - 添加缓存机制，减少重复读取
   - 实现文件访问的审计日志
   - 添加文件大小和类型的验证

#### 6.4.3 用户验证和权限验证方案✅

##### 用户角色与权限模型

1. **用户角色定义**
   ```typescript
   enum UserRole {
     GUEST = 'guest',     // 未登录用户
     USER = 'user',       // 已登录用户
     ADMIN = 'admin'      // 管理员（可选，未来扩展用）
   }
   ```

2. **资源访问权限**
   ```typescript
   enum ResourcePermission {
     READ = 'read',       // 读取权限
     WRITE = 'write',     // 写入权限
     DELETE = 'delete',   // 删除权限
     EXECUTE = 'execute'  // 执行操作权限（如触发分析）
   }
   ```

3. **权限矩阵**

   | 资源/功能 | 未登录用户 (GUEST) | 已登录用户 (USER) |
   |----------|-------------------|------------------|
   | 页面访问  | 除 auth/signin 外的所有页面 | 所有页面 |
   | 文件上传  | ✅ 允许 | ✅ 允许 |
   | 基础分析  | ✅ 允许 | ✅ 允许 |
   | AI分析    | ❌ 不允许 | ✅ 允许（需要积分） |
   | 充值      | ❌ 不允许（需登录） | ✅ 允许 |
   | 查看自己的文件 | ✅ 允许（通过会话ID） | ✅ 允许 |
   | 查看他人文件 | ❌ 不允许 | ❌ 不允许 |
   | 删除文件  | ✅ 允许（仅自己的） | ✅ 允许（仅自己的） |

##### 文件所有权规则

1. **未登录用户上传的文件**：
   - 使用会话ID作为临时标识
   - 文件与会话关联，而非用户ID
   - 当用户登录后，可以选择将文件关联到账户

2. **已登录用户上传的文件**：
   - 文件直接与用户ID关联
   - 用户拥有完全控制权

3. **文件访问控制**：
   - 默认情况下，文件为私有（只有所有者可访问）
   - 未来可扩展支持文件共享功能




在前端，需要处理未登录和已登录状态的切换：

```typescript
// 检查用户是否可以进行AI分析
async function checkCanTriggerAiAnalysis(fileId: string) {
  const response = await fetch(`/api/trigger-analysis?fileId=${fileId}`);
  const data = await response.json();

  if (!data.success) {
    if (data.code === 'AUTH_REQUIRED') {
      // 提示用户登录
      showLoginPrompt();
    } else if (data.code === 'INSUFFICIENT_CREDITS') {
      // 提示用户充值
      showRechargePrompt();
    }
    return false;
  }

  return data.canTrigger;
}

// 显示登录提示
function showLoginPrompt() {
  // 实现登录提示UI
  // 可以提供"登录以保存您的文件"的选项
}
```



##### 步骤
步骤2：修改文件服务✅
更新services/file.ts文件，添加对session_id的支持：

修改createFileRecord函数，支持session_id
修改getUserFiles函数，支持通过session_id查询文件
添加migrateSessionFiles函数，用于将会话文件迁移到用户账户

步骤3：实现用户身份验证✅
创建用户身份验证工具函数，用于获取当前用户信息：

创建lib/auth/user.ts文件，实现getCurrentUser函数
实现会话ID的生成和管理

步骤4：实现权限验证✅
创建权限验证工具函数，用于验证资源访问权限：

创建lib/auth/permissions.ts文件，实现validateFileAccess函数
实现API权限检查中间件withPermissionCheck

步骤5：修改API路由✅
更新API路由，集成权限验证：
修改文件上传API
修改文件获取API
修改AI分析触发API



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

## 8. 实时功能实现 ✅

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


   ## 表结构
| table_name        | column_name       | data_type                | is_nullable | column_default    |
| ----------------- | ----------------- | ------------------------ | ----------- | ----------------- |
| ChatFile          | id                | uuid                     | NO          | gen_random_uuid() |
| ChatFile          | user_id           | uuid                     | YES         | null              |
| ChatFile          | session_id        | text                     | YES         | null              |
| ChatFile          | uploaded_at       | timestamp with time zone | YES         | now()             |
| ChatFile          | platform          | text                     | YES         | null              |
| ChatFile          | status            | text                     | YES         | null              |
| ChatFile          | words_count       | integer                  | YES         | null              |
| ChatFile          | storage_path      | text                     | YES         | null              |
| ChatFile          | basic_result_path | text                     | YES         | null              |
| ChatFile          | ai_result_path    | text                     | YES         | null              |
| CreditTransaction | id                | uuid                     | NO          | gen_random_uuid() |
| CreditTransaction | user_id           | uuid                     | YES         | null              |
| CreditTransaction | change_amount     | integer                  | NO          | null              |
| CreditTransaction | balance_after     | integer                  | NO          | null              |
| CreditTransaction | type              | character varying        | NO          | null              |
| CreditTransaction | description       | text                     | YES         | null              |
| CreditTransaction | created_at        | timestamp with time zone | YES         | now()             |
| CreditTransaction | file_id           | uuid                     | YES         | null              |
| Order             | id                | uuid                     | NO          | gen_random_uuid() |
| Order             | user_id           | uuid                     | YES         | null              |
| Order             | amount            | numeric                  | NO          | null              |
| Order             | status            | character varying        | NO          | null              |
| Order             | created_at        | timestamp with time zone | YES         | now()             |
| User              | id                | uuid                     | NO          | gen_random_uuid() |
| User              | username          | character varying        | NO          | null              |
| User              | email             | character varying        | NO          | null              |
| User              | password_hash     | character varying        | NO          | null              |
| User              | created_at        | timestamp with time zone | YES         | now()             |
| User              | updated_at        | timestamp with time zone | YES         | now()             |

## 单词计数功能实施方案
### 1. 功能概述
开发一个单词计数组件，用于：

分析txt和json格式的聊天文件
计算文件中的单词总数
将计数结果更新到ChatFile表的words_count字段

### 2. 实施步骤
2.1 创建单词计数工具函数
位置：在lib/word-counter目录下创建相关文件
index.ts：主入口，导出所有计数函数
text-counter.ts：处理txt文件的计数逻辑
json-counter.ts：处理json文件的计数逻辑
功能设计：
创建通用接口，支持不同格式文件的计数
针对不同平台（WhatsApp、Discord等）的消息格式进行优化
支持多语言文本的单词计数（中文、英文等）

2.2 集成到基础分析流程
修改基础分析处理器：
在lib/chat-processing/processors中找到基础分析处理器
在分析流程中添加单词计数步骤
确保在生成分析结果前完成计数
更新文件状态：
在完成单词计数后，更新ChatFile记录的words_count字段
使用services/file.ts中的函数进行数据库更新

2.3 单词计数算法设计
文本文件(txt)处理：
按行读取文件内容
识别并提取消息文本部分（排除时间戳、发送者等信息）
使用正则表达式或分词工具计算单词数量
JSON文件处理：
解析JSON结构
遍历消息数组，提取每条消息的文本内容
累计计算所有消息的单词数量
多语言支持：
英文：以空格分隔的单词计数
中文：使用分词库（如jieba）进行中文分词计数
混合文本：综合处理不同语言的文本

2.4 数据库更新
修改文件服务：
在services/file.ts中添加或修改更新words_count的函数
确保更新操作是原子的，避免并发问题
事务处理：
考虑在更新words_count的同时更新其他相关字段
使用数据库事务确保数据一致性

### 3. 测试计划
单元测试：
测试不同格式文件的单词计数准确性
测试多语言文本的计数结果
测试边缘情况（空文件、超大文件等）
集成测试：
测试单词计数组件与基础分析流程的集成
验证数据库更新是否正确
性能测试：
测试大文件处理性能
优化计数算法，减少内存使用和处理时间
#### 4. 注意事项
性能考虑：大文件处理可能需要流式处理，避免内存溢出
考虑使用worker线程进行并行计算

准确性考虑：不同语言的"单词"定义可能不同
需要明确定义计数规则（是否包括表情符号、URL等）

扩展性考虑：设计时考虑未来可能支持的新文件格式
保持代码模块化，便于添加新的计数算法