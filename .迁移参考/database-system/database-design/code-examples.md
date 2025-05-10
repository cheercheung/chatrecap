# 代码示例

本文档提供了实现数据库操作的代码示例，包括使用 Prisma ORM 和 Supabase。

## 1. 初始化数据库客户端

### Prisma 客户端

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// PrismaClient 是一个重量级对象，应该在应用程序中重用
// 在开发环境中，Next.js 的热重载会导致创建多个 PrismaClient 实例
// 为了避免这个问题，我们在全局对象上缓存 PrismaClient 实例

// 添加 prisma 到 NodeJS.Global 类型
declare global {
  var prisma: PrismaClient | undefined
}

// 如果不是生产环境，使用全局变量存储 PrismaClient 实例
// 如果是生产环境，创建一个新的 PrismaClient 实例
export const prisma = global.prisma || new PrismaClient()

// 在开发环境中，将 prisma 实例保存到全局变量中
if (process.env.NODE_ENV !== 'production') global.prisma = prisma
```

### Supabase 客户端

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// 从环境变量中获取 Supabase URL 和匿名密钥
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 2. 文件上传和处理

```typescript
// services/chatfile.ts
import { prisma } from '../lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import { ChatFileStatus } from '../types/chatfile'

/**
 * 上传文件处理
 * @param file 文件对象
 * @param userId 用户ID（可选）
 * @param sessionId 会话ID（可选）
 * @returns 创建的文件记录
 */
export async function uploadFile(file: File, userId?: string, sessionId?: string) {
  // 生成会话ID（如果未提供）
  const session = sessionId || uuidv4()
  
  // 保存文件到存储
  const storagePath = await saveFileToStorage(file)
  
  // 创建文件记录
  const chatFile = await prisma.chatFile.create({
    data: {
      uuid: uuidv4(),
      user_uuid: userId || null,
      session_id: session,
      file_type: file.type,
      status: ChatFileStatus.UPLOADED,
      storage_path: storagePath,
    },
  })
  
  // 开始基础分析（异步）
  startBasicAnalysis(chatFile.uuid)
  
  return chatFile
}

/**
 * 基础分析处理
 * @param fileId 文件ID
 */
export async function startBasicAnalysis(fileId: string) {
  try {
    // 更新文件状态为处理中
    await prisma.chatFile.update({
      where: { uuid: fileId },
      data: { status: ChatFileStatus.PROCESSING },
    })
    
    // 获取文件信息
    const file = await prisma.chatFile.findUnique({
      where: { uuid: fileId },
    })
    
    if (!file || !file.storage_path) {
      throw new Error('File not found or storage path is missing')
    }
    
    // 读取文件内容
    const content = await readFileFromStorage(file.storage_path)
    
    // 计算字数
    const wordCount = countWords(content)
    
    // 执行基础分析
    const analysisResult = await performBasicAnalysis(content)
    
    // 保存分析结果
    const resultPath = await saveResultToStorage(analysisResult, `basic/${fileId}.json`)
    
    // 更新文件状态和结果
    await prisma.chatFile.update({
      where: { uuid: fileId },
      data: {
        status: ChatFileStatus.COMPLETED_BASIC,
        words_count: wordCount,
        basic_result_path: resultPath,
      },
    })
    
    return { success: true }
  } catch (error) {
    // 更新文件状态为失败
    await prisma.chatFile.update({
      where: { uuid: fileId },
      data: { status: ChatFileStatus.FAILED },
    })
    
    console.error('Basic analysis failed:', error)
    return { success: false, error }
  }
}

/**
 * 关联未登录用户的文件
 * @param userId 用户ID
 * @param sessionId 会话ID
 */
export async function associateFilesWithUser(userId: string, sessionId: string) {
  try {
    // 查找与会话ID关联的文件
    const files = await prisma.chatFile.findMany({
      where: {
        session_id: sessionId,
        user_uuid: null,
      },
    })
    
    // 关联文件到用户
    for (const file of files) {
      await prisma.chatFile.update({
        where: { uuid: file.uuid },
        data: { user_uuid: userId },
      })
    }
    
    return { success: true, count: files.length }
  } catch (error) {
    console.error('Associate files failed:', error)
    return { success: false, error }
  }
}
```

## 3. 积分充值和消费

```typescript
// services/credit.ts
import { prisma } from '../lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import { CreditTransactionType } from '../types/credit'
import { OrderStatus } from '../types/order'

/**
 * 创建充值订单
 * @param userId 用户ID
 * @param amount 金额（分）
 * @param creditAmount 积分数量
 * @returns 创建的订单
 */
export async function createRechargeOrder(userId: string, amount: number, creditAmount: number) {
  try {
    const order = await prisma.order.create({
      data: {
        uuid: uuidv4(),
        user_uuid: userId,
        amount,
        credit_amount: creditAmount,
        status: OrderStatus.PENDING,
      },
    })
    
    return order
  } catch (error) {
    console.error('Create recharge order failed:', error)
    throw error
  }
}

/**
 * 完成订单支付
 * @param orderId 订单ID
 * @param paymentId 支付平台订单号
 */
export async function completeOrderPayment(orderId: string, paymentId: string) {
  try {
    // 使用事务确保数据一致性
    return await prisma.$transaction(async (tx) => {
      // 查找订单
      const order = await tx.order.findUnique({
        where: { uuid: orderId },
      })
      
      if (!order) {
        throw new Error('Order not found')
      }
      
      if (order.status !== OrderStatus.PENDING) {
        throw new Error(`Order is already in ${order.status} status`)
      }
      
      // 更新订单状态
      const updatedOrder = await tx.order.update({
        where: { uuid: orderId },
        data: {
          status: OrderStatus.PAID,
          payment_id: paymentId,
        },
      })
      
      // 创建积分充值记录
      await tx.creditTransaction.create({
        data: {
          user_uuid: order.user_uuid,
          amount: order.credit_amount,
          type: CreditTransactionType.RECHARGE,
          order_uuid: order.uuid,
        },
      })
      
      // 更新用户积分余额
      const user = await tx.user.findUnique({
        where: { uuid: order.user_uuid },
      })
      
      if (!user) {
        throw new Error('User not found')
      }
      
      await tx.user.update({
        where: { uuid: order.user_uuid },
        data: {
          credit_balance: user.credit_balance + order.credit_amount,
        },
      })
      
      return updatedOrder
    })
  } catch (error) {
    console.error('Complete order payment failed:', error)
    throw error
  }
}

/**
 * 消费积分进行AI分析
 * @param userId 用户ID
 * @param fileId 文件ID
 * @param requiredCredits 所需积分
 */
export async function consumeCreditsForAiAnalysis(userId: string, fileId: string, requiredCredits: number) {
  try {
    // 使用事务确保数据一致性
    return await prisma.$transaction(async (tx) => {
      // 查找用户
      const user = await tx.user.findUnique({
        where: { uuid: userId },
      })
      
      if (!user) {
        throw new Error('User not found')
      }
      
      // 检查积分是否足够
      if (user.credit_balance < requiredCredits) {
        throw new Error('Insufficient credit balance')
      }
      
      // 创建积分消费记录
      await tx.creditTransaction.create({
        data: {
          user_uuid: userId,
          amount: -requiredCredits,
          type: CreditTransactionType.CONSUME,
          file_uuid: fileId,
        },
      })
      
      // 更新用户积分余额
      await tx.user.update({
        where: { uuid: userId },
        data: {
          credit_balance: user.credit_balance - requiredCredits,
        },
      })
      
      // 更新文件状态
      await tx.chatFile.update({
        where: { uuid: fileId },
        data: {
          status: ChatFileStatus.PROCESSING,
        },
      })
      
      return { success: true }
    })
  } catch (error) {
    console.error('Consume credits failed:', error)
    throw error
  }
}
```
