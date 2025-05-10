/**
 * 用户服务
 */
import { prisma } from '../lib/prisma';
import { User } from '../types/user';
import { v4 as uuidv4 } from 'uuid';

/**
 * 根据UUID查找用户
 * @param uuid 用户UUID
 * @returns 用户信息
 */
export async function findUserByUuid(uuid: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        uuid: uuid,
      },
    });

    if (!user) {
      return null;
    }

    return {
      uuid: user.uuid,
      email: user.email,
      signin_provider: user.signin_provider || undefined,
      signin_openid: user.signin_openid || undefined,
      credit_balance: user.credit_balance,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
    };
  } catch (e) {
    console.error("find user by uuid failed:", e);
    return null;
  }
}

/**
 * 根据邮箱查找用户
 * @param email 用户邮箱
 * @returns 用户信息
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return null;
    }

    return {
      uuid: user.uuid,
      email: user.email,
      signin_provider: user.signin_provider || undefined,
      signin_openid: user.signin_openid || undefined,
      credit_balance: user.credit_balance,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
    };
  } catch (e) {
    console.error("find user by email failed:", e);
    return null;
  }
}

/**
 * 创建用户
 * @param user 用户信息
 * @returns 创建的用户信息
 */
export async function createUser(user: Omit<User, 'uuid' | 'created_at' | 'updated_at'>): Promise<User> {
  try {
    const result = await prisma.user.create({
      data: {
        uuid: uuidv4(),
        email: user.email,
        signin_provider: user.signin_provider,
        signin_openid: user.signin_openid,
        credit_balance: user.credit_balance || 0,
      },
    });

    return {
      uuid: result.uuid,
      email: result.email,
      signin_provider: result.signin_provider || undefined,
      signin_openid: result.signin_openid || undefined,
      credit_balance: result.credit_balance,
      created_at: result.created_at.toISOString(),
      updated_at: result.updated_at.toISOString(),
    };
  } catch (e) {
    console.error("create user failed:", e);
    throw e;
  }
}

/**
 * 更新用户
 * @param uuid 用户UUID
 * @param data 更新数据
 * @returns 更新后的用户信息
 */
export async function updateUser(uuid: string, data: Partial<Omit<User, 'uuid' | 'created_at' | 'updated_at'>>): Promise<User | null> {
  try {
    const result = await prisma.user.update({
      where: {
        uuid: uuid,
      },
      data: data,
    });

    return {
      uuid: result.uuid,
      email: result.email,
      signin_provider: result.signin_provider || undefined,
      signin_openid: result.signin_openid || undefined,
      credit_balance: result.credit_balance,
      created_at: result.created_at.toISOString(),
      updated_at: result.updated_at.toISOString(),
    };
  } catch (e) {
    console.error("update user failed:", e);
    return null;
  }
}

/**
 * 更新用户积分余额
 * @param uuid 用户UUID
 * @param amount 变动金额（正数为增加，负数为减少）
 * @returns 更新后的用户信息
 */
export async function updateUserCreditBalance(uuid: string, amount: number): Promise<User | null> {
  try {
    // 获取当前用户信息
    const user = await prisma.user.findUnique({
      where: {
        uuid: uuid,
      },
    });

    if (!user) {
      return null;
    }

    // 计算新的积分余额
    const newBalance = user.credit_balance + amount;
    
    // 如果是消费积分，确保余额不会变成负数
    if (amount < 0 && newBalance < 0) {
      throw new Error("Insufficient credit balance");
    }

    // 更新用户积分余额
    const result = await prisma.user.update({
      where: {
        uuid: uuid,
      },
      data: {
        credit_balance: newBalance,
      },
    });

    return {
      uuid: result.uuid,
      email: result.email,
      signin_provider: result.signin_provider || undefined,
      signin_openid: result.signin_openid || undefined,
      credit_balance: result.credit_balance,
      created_at: result.created_at.toISOString(),
      updated_at: result.updated_at.toISOString(),
    };
  } catch (e) {
    console.error("update user credit balance failed:", e);
    throw e;
  }
}
