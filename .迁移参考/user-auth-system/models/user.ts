/**
 * 用户数据模型操作
 */
import { PrismaClient } from "@prisma/client";
import { User } from "@/types/user";

// 创建Prisma客户端实例
const prisma = new PrismaClient();

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
      nickname: user.nickname || "",
      avatar_url: user.avatar_url || "",
      created_at: user.created_at.toISOString(),
      invited_by: user.invited_by || undefined,
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
      nickname: user.nickname || "",
      avatar_url: user.avatar_url || "",
      created_at: user.created_at.toISOString(),
      invited_by: user.invited_by || undefined,
    };
  } catch (e) {
    console.error("find user by email failed:", e);
    return null;
  }
}

/**
 * 创建或更新用户
 * @param user 用户信息
 * @returns 创建或更新后的用户信息
 */
export async function upsertUser(user: User): Promise<User> {
  try {
    const result = await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {
        nickname: user.nickname,
        avatar_url: user.avatar_url,
        signin_type: user.signin_type,
        signin_provider: user.signin_provider,
        signin_openid: user.signin_openid,
        signin_ip: user.signin_ip,
      },
      create: {
        uuid: user.uuid,
        email: user.email,
        nickname: user.nickname,
        avatar_url: user.avatar_url,
        signin_type: user.signin_type,
        signin_provider: user.signin_provider,
        signin_openid: user.signin_openid,
        created_at: new Date(user.created_at),
        signin_ip: user.signin_ip,
      },
    });

    return {
      uuid: result.uuid,
      email: result.email,
      nickname: result.nickname || "",
      avatar_url: result.avatar_url || "",
      created_at: result.created_at.toISOString(),
      invited_by: result.invited_by || undefined,
    };
  } catch (e) {
    console.error("upsert user failed:", e);
    throw e;
  }
}

/**
 * 更新用户邀请关系
 * @param userUuid 用户UUID
 * @param invitedBy 邀请人UUID
 * @returns 更新后的用户信息
 */
export async function updateUserInvite(userUuid: string, invitedBy: string): Promise<User | null> {
  try {
    const user = await prisma.user.update({
      where: {
        uuid: userUuid,
      },
      data: {
        invited_by: invitedBy,
      },
    });

    return {
      uuid: user.uuid,
      email: user.email,
      nickname: user.nickname || "",
      avatar_url: user.avatar_url || "",
      created_at: user.created_at.toISOString(),
      invited_by: user.invited_by || undefined,
    };
  } catch (e) {
    console.error("update user invite failed:", e);
    return null;
  }
}

/**
 * 获取用户列表
 * @param page 页码
 * @param pageSize 每页数量
 * @returns 用户列表
 */
export async function getUsers(page: number, pageSize: number): Promise<User[]> {
  try {
    const skip = (page - 1) * pageSize;
    const users = await prisma.user.findMany({
      skip,
      take: pageSize,
      orderBy: {
        created_at: "desc",
      },
    });

    return users.map((user) => ({
      uuid: user.uuid,
      email: user.email,
      nickname: user.nickname || "",
      avatar_url: user.avatar_url || "",
      created_at: user.created_at.toISOString(),
      invited_by: user.invited_by || undefined,
    }));
  } catch (e) {
    console.error("get users failed:", e);
    return [];
  }
}
