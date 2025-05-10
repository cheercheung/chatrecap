/**
 * 用户服务函数
 */
import { User } from "@/types/user";
import { findUserByEmail, findUserByUuid, upsertUser, updateUserInvite } from "@/models/user";
import { auth } from "@/auth";

/**
 * 保存用户信息
 * @param user 用户信息
 * @returns 保存后的用户信息
 */
export async function saveUser(user: User): Promise<User> {
  try {
    // 查找是否已存在该用户
    const existingUser = await findUserByEmail(user.email);
    
    if (existingUser) {
      // 如果用户已存在，保留原有的UUID
      user.uuid = existingUser.uuid;
    }
    
    // 创建或更新用户
    return await upsertUser(user);
  } catch (e) {
    console.error("save user failed:", e);
    throw e;
  }
}

/**
 * 获取当前登录用户的UUID
 * @returns 用户UUID
 */
export async function getUserUuid(): Promise<string | null> {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.uuid) {
      return null;
    }
    
    return session.user.uuid;
  } catch (e) {
    console.error("get user uuid failed:", e);
    return null;
  }
}

/**
 * 获取当前登录用户的邮箱
 * @returns 用户邮箱
 */
export async function getUserEmail(): Promise<string | null> {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return null;
    }
    
    return session.user.email;
  } catch (e) {
    console.error("get user email failed:", e);
    return null;
  }
}

/**
 * 获取当前登录用户信息
 * @returns 用户信息
 */
export async function getUserInfo(): Promise<User | null> {
  try {
    const userUuid = await getUserUuid();
    if (!userUuid) {
      return null;
    }
    
    return await findUserByUuid(userUuid);
  } catch (e) {
    console.error("get user info failed:", e);
    return null;
  }
}

/**
 * 更新用户邀请关系
 * @param userUuid 用户UUID
 * @param inviteCode 邀请码
 * @returns 更新后的用户信息
 */
export async function updateInviteRelation(userUuid: string, inviteCode: string): Promise<User | null> {
  try {
    // 根据邀请码查找邀请人
    // 这里假设邀请码就是邀请人的UUID，实际应用中可能需要更复杂的逻辑
    const inviter = await findUserByUuid(inviteCode);
    if (!inviter) {
      throw new Error("invalid invite code");
    }
    
    // 不能自己邀请自己
    if (inviter.uuid === userUuid) {
      throw new Error("cannot invite yourself");
    }
    
    // 更新邀请关系
    return await updateUserInvite(userUuid, inviter.uuid);
  } catch (e) {
    console.error("update invite relation failed:", e);
    return null;
  }
}
