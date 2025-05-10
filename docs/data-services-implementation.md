# 数据服务实现文档

本文档详细说明了 Supabase 集成的第五阶段 - 数据服务实现的完成情况。

## 概述

在第五阶段，我们实现了四个主要的数据服务：

1. 用户服务 (`services/user.ts`)
2. 订单服务 (`services/order.ts`)
3. 积分交易服务 (`services/credit.ts`)
4. 文件服务 (`services/file.ts`)

这些服务提供了与 Supabase 数据库交互的功能，封装了数据操作逻辑，确保数据一致性和安全性。

## 1. 用户服务 (`services/user.ts`)

### 主要功能

- **获取用户信息**：根据 ID 或邮箱获取用户详情
- **创建/更新用户**：创建新用户或更新现有用户信息
- **获取当前用户**：从会话中获取当前登录用户信息
- **关联未登录用户的文件**：将匿名用户上传的文件关联到登录用户

### 关键函数

- `getUserById(id: string)`: 根据 ID 获取用户信息
- `getUserByEmail(email: string)`: 根据邮箱获取用户信息
- `createUser(user: Partial<User>)`: 创建新用户
- `saveUser(user: User)`: 保存用户信息（创建或更新）
- `getCurrentUser()`: 获取当前登录用户信息
- `associateFilesToUser(sessionId: string, userId: string)`: 关联未登录用户的文件

## 2. 订单服务 (`services/order.ts`)

### 主要功能

- **创建订单**：创建新的充值订单
- **更新订单状态**：更新订单状态，处理支付完成逻辑
- **查询订单**：获取订单详情和用户订单历史

### 关键函数

- `createOrder(order: {...})`: 创建新订单
- `updateOrderStatus(orderId: string, status: string, paymentId?: string)`: 更新订单状态
- `getOrderById(orderId: string)`: 获取订单详情
- `getUserOrders(userId: string)`: 获取用户订单历史

### 订单状态流转

- `PENDING`: 待支付
- `PAID`: 已支付（触发积分增加）
- `CANCELLED`: 已取消
- `FAILED`: 支付失败

## 3. 积分交易服务 (`services/credit.ts`)

### 主要功能

- **创建积分交易记录**：记录积分变动（充值或消费）
- **消费积分**：用于 AI 分析等功能
- **查询积分**：获取用户积分余额和交易历史

### 关键函数

- `createCreditTransaction(transaction: {...})`: 创建积分交易记录并更新用户积分
- `consumeCredits(user_uuid: string, amount: number, file_uuid: string)`: 消费用户积分
- `getUserCreditHistory(userUuid: string, limit?: number, offset?: number)`: 获取用户积分交易历史
- `getUserCreditBalance(userUuid: string)`: 获取用户当前积分余额
- `checkUserCreditSufficient(userUuid: string, amount: number)`: 检查用户积分是否足够

### 交易类型

- `recharge`: 充值（增加积分）
- `consume`: 消费（减少积分）

## 4. 文件服务 (`services/file.ts`)

### 主要功能

- **创建文件记录**：记录上传的聊天文件信息
- **更新文件状态**：更新文件处理状态
- **关联分析结果**：关联基础分析和 AI 分析结果
- **查询文件**：获取文件详情和用户文件列表

### 关键函数

- `createFileRecord(file: {...})`: 创建文件记录
- `updateFileStatus(fileId: string, status: ChatFileStatus, additionalData?: {...})`: 更新文件状态
- `associateAnalysisResult(fileId: string, resultType: 'basic' | 'ai', resultPath: string)`: 关联分析结果
- `getFileById(fileId: string)`: 获取文件详情
- `getUserFiles(userId: string)`: 查询用户文件列表
- `getSessionFiles(sessionId: string)`: 查询会话文件列表
- `deleteFile(fileId: string)`: 删除文件

### 文件状态流转

- `UPLOADED`: 已上传
- `PROCESSING`: 处理中
- `COMPLETED_BASIC`: 基础分析完成
- `COMPLETE_AI`: AI 分析完成
- `FAILED`: 处理失败

## 数据一致性保障

1. **事务安全**：
   - 使用 Supabase RPC 函数确保积分更新的事务安全
   - 订单支付完成后，在同一事务中创建积分交易记录和更新用户积分

2. **错误处理**：
   - 所有服务函数都有完善的错误处理机制
   - 使用 try-catch 捕获异常，记录错误日志

3. **状态验证**：
   - 订单状态更新前验证当前状态，防止重复处理
   - 积分消费前检查余额是否足够

## 下一步工作

完成数据服务实现后，下一阶段将进行 API 路由调整，包括：

1. 支付回调处理
2. 文件处理 API
3. AI 分析 API

这些 API 将使用我们实现的数据服务来处理业务逻辑。
