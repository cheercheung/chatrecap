# Supabase 集成指南

本文档提供了如何将 Supabase 集成到项目中的详细指南。

## 什么是 Supabase？

Supabase 是一个开源的 Firebase 替代品，提供了以下功能：

- PostgreSQL 数据库
- 身份验证和用户管理
- 实时订阅
- 存储
- 边缘函数

## 为什么选择 Supabase？

1. **PostgreSQL 数据库**：使用功能强大的 PostgreSQL 数据库，支持复杂查询、JSON 数据类型等
2. **简单的 API**：提供简单易用的 JavaScript/TypeScript API
3. **存储解决方案**：内置文件存储功能，非常适合存储聊天记录文件和分析结果
4. **实时功能**：支持实时数据更新，适合构建实时聊天分析应用
5. **身份验证**：提供完整的身份验证解决方案，可以与社交登录集成

## 设置 Supabase

### 1. 创建 Supabase 项目

1. 访问 [Supabase 控制台](https://app.supabase.io/)
2. 点击 "New Project"
3. 填写项目详情并创建项目

### 2. 安装 Supabase 客户端

```bash
npm install @supabase/supabase-js
# 或
pnpm add @supabase/supabase-js
```

### 3. 配置环境变量

在 `.env.local` 文件中添加以下环境变量：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 创建 Supabase 客户端

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 使用 Supabase 存储

### 1. 创建存储桶

在 Supabase 控制台中：

1. 导航到 "Storage" 部分
2. 点击 "Create new bucket"
3. 创建以下存储桶：
   - `chat-files`：存储上传的聊天记录文件
   - `analysis-results`：存储分析结果

### 2. 配置存储桶权限

对于每个存储桶，设置适当的权限：

1. 点击存储桶名称
2. 导航到 "Policies" 选项卡
3. 添加适当的策略，例如：
   - 允许已认证用户上传文件
   - 允许公共读取某些文件

### 3. 文件上传和下载

```typescript
// services/storage.ts
import { supabase } from '../lib/supabase'

/**
 * 上传文件到 Supabase 存储
 * @param bucket 存储桶名称
 * @param path 文件路径
 * @param file 文件对象
 * @returns 上传结果
 */
export async function uploadFile(bucket: string, path: string, file: File) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    throw error
  }

  return data
}

/**
 * 从 Supabase 存储获取文件公共 URL
 * @param bucket 存储桶名称
 * @param path 文件路径
 * @returns 文件公共 URL
 */
export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/**
 * 从 Supabase 存储下载文件
 * @param bucket 存储桶名称
 * @param path 文件路径
 * @returns 下载结果
 */
export async function downloadFile(bucket: string, path: string) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(path)

  if (error) {
    throw error
  }

  return data
}
```

## 使用 Supabase 数据库

### 1. 创建数据库表

可以使用 SQL 编辑器或 Prisma 迁移来创建表。

使用 SQL 编辑器：

1. 导航到 Supabase 控制台中的 "SQL Editor"
2. 创建新查询
3. 粘贴并执行 [database-schema.md](./database-schema.md) 中的 SQL 创建表语句

### 2. 使用 Prisma 与 Supabase

Prisma 可以与 Supabase 的 PostgreSQL 数据库一起使用：

1. 更新 `prisma/schema.prisma` 文件中的数据源：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. 在 `.env` 文件中设置 `DATABASE_URL`：

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres
```

3. 运行 Prisma 迁移：

```bash
npx prisma migrate dev --name init
```

### 3. 直接使用 Supabase 客户端

如果不想使用 Prisma，可以直接使用 Supabase 客户端进行数据库操作：

```typescript
// 查询用户
const { data: users, error } = await supabase
  .from('User')
  .select('*')
  .eq('email', 'user@example.com')

// 插入数据
const { data, error } = await supabase
  .from('ChatFile')
  .insert([
    {
      uuid: uuidv4(),
      user_uuid: userId,
      file_type: 'text/plain',
      status: 'uploaded',
      storage_path: '/path/to/file.txt'
    }
  ])
```

## 使用 Supabase 身份验证

### 1. 配置身份验证提供商

在 Supabase 控制台中：

1. 导航到 "Authentication" > "Providers"
2. 启用并配置所需的提供商（如 Google、GitHub）

### 2. 实现社交登录

```typescript
// 使用 Google 登录
async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
  
  if (error) {
    console.error('Error signing in with Google:', error)
  }
}

// 获取当前用户
async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// 退出登录
async function signOut() {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Error signing out:', error)
  }
}
```

## 使用 Supabase 实时功能

Supabase 提供实时订阅功能，可以用于实时更新聊天分析状态：

```typescript
// 订阅文件状态变化
const subscription = supabase
  .channel('public:ChatFile')
  .on('postgres_changes', 
    { 
      event: 'UPDATE', 
      schema: 'public', 
      table: 'ChatFile',
      filter: `uuid=eq.${fileId}`
    }, 
    (payload) => {
      console.log('File status changed:', payload.new)
      // 更新 UI
      updateFileStatus(payload.new.status)
    }
  )
  .subscribe()

// 取消订阅
function unsubscribe() {
  supabase.removeChannel(subscription)
}
```

## 最佳实践

1. **使用事务**：对于涉及多个表的操作（如订单支付完成），使用事务确保数据一致性
2. **实现错误处理**：妥善处理 Supabase 操作中的错误
3. **使用 RLS（行级安全）**：配置行级安全策略，确保用户只能访问自己的数据
4. **缓存常用查询**：使用客户端缓存减少数据库请求
5. **监控性能**：使用 Supabase 控制台监控查询性能
