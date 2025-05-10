/**
 * 用户身份验证工具
 * 用于获取当前用户信息和管理会话ID
 */

import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

/**
 * 用户角色枚举
 */
export enum UserRole {
  GUEST = 'guest',     // 未登录用户
  USER = 'user',       // 已登录用户
  ADMIN = 'admin'      // 管理员（可选，未来扩展用）
}

/**
 * 会话ID的cookie名称
 */
export const SESSION_ID_COOKIE = 'chatrecap_session_id';

/**
 * 会话ID的有效期（30天）
 */
export const SESSION_ID_MAX_AGE = 30 * 24 * 60 * 60;

/**
 * 生成会话ID
 * @returns 生成的会话ID
 */
export function generateSessionId(): string {
  return uuidv4();
}

/**
 * 获取或创建会话ID
 * @returns 会话ID
 */
export function getOrCreateSessionId(): string {
  const cookieStore = cookies();
  const sessionId = cookieStore.get(SESSION_ID_COOKIE)?.value;

  if (sessionId) {
    return sessionId;
  }

  // 如果没有会话ID，生成一个新的
  const newSessionId = generateSessionId();

  // 设置会话ID cookie
  cookieStore.set(SESSION_ID_COOKIE, newSessionId, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_ID_MAX_AGE,
    path: '/'
  });

  return newSessionId;
}

/**
 * 用户信息接口
 */
export interface UserInfo {
  userId: string | null;
  role: UserRole;
  sessionId: string;
  email?: string | null;
  name?: string | null;
  isAuthenticated: boolean;
}

/**
 * 获取当前用户信息
 * @returns 用户信息对象
 */
export async function getCurrentUser(): Promise<UserInfo> {
  try {
    // 获取或创建会话ID
    const sessionId = getOrCreateSessionId();

    // 尝试获取登录用户信息
    const supabase = createServerClient(
      name => cookies().get(name),
      (name, value, options) => cookies().set(name, value, options)
    );

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || null;
    const email = session?.user?.email || null;
    const name = session?.user?.user_metadata?.name || null;

    // 确定用户角色
    const role = userId ? UserRole.USER : UserRole.GUEST;
    const isAuthenticated = !!userId;

    return {
      userId,
      role,
      sessionId,
      email,
      name,
      isAuthenticated
    };
  } catch (error) {
    console.error('获取用户信息失败:', error);

    // 出错时返回游客身份
    return {
      userId: null,
      role: UserRole.GUEST,
      sessionId: getOrCreateSessionId(),
      email: null,
      name: null,
      isAuthenticated: false
    };
  }
}

/**
 * 检查用户是否已登录
 * @returns 是否已登录
 */
export async function isUserAuthenticated(): Promise<boolean> {
  try {
    const { isAuthenticated } = await getCurrentUser();
    return isAuthenticated;
  } catch (error) {
    console.error('检查用户登录状态失败:', error);
    return false;
  }
}

/**
 * 获取用户ID
 * @returns 用户ID或null
 */
export async function getUserId(): Promise<string | null> {
  try {
    const { userId } = await getCurrentUser();
    return userId;
  } catch (error) {
    console.error('获取用户ID失败:', error);
    return null;
  }
}

/**
 * 获取会话ID
 * @returns 会话ID
 */
export function getSessionId(): string {
  return getOrCreateSessionId();
}
