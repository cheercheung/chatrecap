import { createServerAdminClient } from '@/lib/supabase/server';
import { supabase } from '@/lib/supabase/client';
import { User } from '@/types/user';
import { v4 as uuidv4 } from 'uuid';

/**
 * 根据ID获取用户信息
 * @param id 用户ID
 * @returns 用户信息
 */
export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      uuid: data.id,
      email: data.email,
      nickname: data.nickname || '',
      avatar_url: data.avatar_url || '',
      created_at: data.created_at,
      credits: data.credit_balance || 0,
      signin_provider: data.signin_provider,
      signin_openid: data.signin_openid
    };
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
}

/**
 * 根据邮箱获取用户信息
 * @param email 用户邮箱
 * @returns 用户信息
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 未找到用户
        return null;
      }
      throw error;
    }

    return {
      uuid: data.id,
      email: data.email,
      nickname: data.nickname || '',
      avatar_url: data.avatar_url || '',
      created_at: data.created_at,
      credits: data.credit_balance || 0,
      signin_provider: data.signin_provider,
      signin_openid: data.signin_openid
    };
  } catch (error) {
    console.error('根据邮箱获取用户信息失败:', error);
    return null;
  }
}

/**
 * 更新用户积分余额
 * @param userId 用户ID
 * @param credits 积分余额
 * @returns 是否成功
 */
export async function updateUserCredits(userId: string, credits: number): Promise<boolean> {
  try {
    const supabaseAdmin = createServerAdminClient();

    const { error } = await supabaseAdmin
      .from('users')
      .update({
        credit_balance: credits,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('更新用户积分余额失败:', error);
    return false;
  }
}

/**
 * 创建用户
 * @param user 用户信息
 * @returns 创建的用户信息
 */
export async function createUser(user: Partial<User>): Promise<User | null> {
  try {
    const supabaseAdmin = createServerAdminClient();
    const userId = user.uuid || uuidv4();

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        email: user.email,
        nickname: user.nickname || '',
        avatar_url: user.avatar_url || '',
        credit_balance: user.credits || 0,
        signin_provider: user.signin_provider,
        signin_openid: user.signin_openid,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return {
      uuid: data.id,
      email: data.email,
      nickname: data.nickname || '',
      avatar_url: data.avatar_url || '',
      created_at: data.created_at,
      credits: data.credit_balance || 0,
      signin_provider: data.signin_provider,
      signin_openid: data.signin_openid
    };
  } catch (error) {
    console.error('创建用户失败:', error);
    return null;
  }
}

/**
 * 保存用户信息（更新或创建）
 * @param user 用户信息
 * @returns 保存后的用户信息
 */
export async function saveUser(user: User): Promise<User> {
  try {
    const supabaseAdmin = createServerAdminClient();

    // 检查用户是否已存在
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 是 "未找到结果" 错误，其他错误需要抛出
      throw fetchError;
    }

    if (existingUser) {
      // 用户已存在，更新信息
      const { data, error } = await supabaseAdmin
        .from('users')
        .update({
          nickname: user.nickname || existingUser.nickname,
          avatar_url: user.avatar_url || existingUser.avatar_url,
          signin_provider: user.signin_provider || existingUser.signin_provider,
          signin_openid: user.signin_openid || existingUser.signin_openid,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingUser.id)
        .select()
        .single();

      if (error) throw error;

      return {
        uuid: data.id,
        email: data.email,
        nickname: data.nickname || '',
        avatar_url: data.avatar_url || '',
        created_at: data.created_at,
        credits: data.credit_balance || 0,
        signin_provider: data.signin_provider,
        signin_openid: data.signin_openid
      };
    } else {
      // 创建新用户
      const newUser = await createUser(user);
      if (!newUser) throw new Error('创建用户失败');
      return newUser;
    }
  } catch (error) {
    console.error('保存用户信息失败:', error);
    throw error;
  }
}

/**
 * 从当前会话获取用户UUID
 * @returns 用户UUID
 */
export async function getUserUuid(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id || null;
  } catch (error) {
    console.error('获取用户UUID失败:', error);
    return null;
  }
}

/**
 * 从当前会话获取用户邮箱
 * @returns 用户邮箱
 */
export async function getUserEmail(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.email || null;
  } catch (error) {
    console.error('获取用户邮箱失败:', error);
    return null;
  }
}

/**
 * 获取当前用户信息
 * @returns 用户信息
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return null;

    const userId = session.session.user.id;
    return await getUserById(userId);
  } catch (error) {
    console.error('获取当前用户信息失败:', error);
    return null;
  }
}

/**
 * 关联未登录用户的文件
 * @param sessionId 会话ID
 * @param userId 用户ID
 * @returns 是否成功
 */
export async function associateFilesToUser(sessionId: string, userId: string): Promise<boolean> {
  try {
    const supabaseAdmin = createServerAdminClient();

    const { error } = await supabaseAdmin
      .from('chat_files')
      .update({ user_id: userId })
      .eq('session_id', sessionId)
      .is('user_id', null);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('关联未登录用户的文件失败:', error);
    return false;
  }
}
