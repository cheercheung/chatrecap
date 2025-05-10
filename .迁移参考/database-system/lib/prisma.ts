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
