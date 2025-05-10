import { createServerAdminClient } from '@/lib/supabase/server';
import { supabase } from '@/lib/supabase/client';
import { User } from '@/types/user';
import { v4 as uuidv4 } from 'uuid';
import { getUserCreditBalance } from './credit';

/**
 * 根据ID获取用户信息
 * @param id 用户ID
 * @returns 用户信息
 */
export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // 获取用户积分余额
    const credits = await getUserCreditBalance(id);

    return {
      uuid: data.id,
      email: data.email,
      created_at: data.created_at,
      credits, // 从CreditTransaction表中计算得到
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
      .from('User')
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

    // 获取用户积分余额
    const credits = await getUserCreditBalance(data.id);

    return {
      uuid: data.id,
      email: data.email,
      created_at: data.created_at,
      credits, // 从CreditTransaction表中计算得到
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
 *
 * 注意：由于User表中没有credit_balance字段，此函数不再直接更新用户表
 * 而是通过创建积分交易记录来间接更新用户积分
 * 实际积分余额需要通过getUserCreditBalance函数获取
 */
export async function updateUserCredits(userId: string, credits: number): Promise<boolean> {
  try {
    const supabaseAdmin = createServerAdminClient();

    // 获取当前积分余额
    const { data: transactions, error: fetchError } = await supabaseAdmin
      .from('CreditTransaction')
      .select('change_amount')
      .eq('user_id', userId);

    if (fetchError) throw fetchError;

    // 计算当前积分余额
    const currentBalance = transactions && transactions.length > 0
      ? transactions.reduce((sum, tx) => sum + tx.change_amount, 0)
      : 0;

    // 计算需要增加的积分
    const changeAmount = credits - currentBalance;

    // 如果没有变化，直接返回
    if (changeAmount === 0) {
      return true;
    }

    // 创建积分交易记录
    const { error } = await supabaseAdmin
      .from('CreditTransaction')
      .insert({
        user_id: userId,
        change_amount: changeAmount,
        balance_after: credits,
        type: changeAmount > 0 ? 'adjustment_add' : 'adjustment_subtract',
        description: '管理员调整积分',
        created_at: new Date().toISOString()
      });

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
      .from('User')
      .insert({
        id: userId,
        email: user.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // 获取用户积分余额（新用户默认为0）
    const credits = 0;

    return {
      uuid: data.id,
      email: data.email,
      created_at: data.created_at,
      credits, // 新用户默认积分为0
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
      .from('User')
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
        .from('User')
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingUser.id)
        .select()
        .single();

      if (error) throw error;

      // 获取用户积分余额
      const credits = await getUserCreditBalance(data.id);

      return {
        uuid: data.id,
        email: data.email,
        created_at: data.created_at,
        credits, // 从CreditTransaction表中计算得到
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
 * @param userId 用户ID
 * @returns 是否成功
 */
export async function associateFilesToUser(userId: string): Promise<boolean> {
  try {
    const supabaseAdmin = createServerAdminClient();

    const { error } = await supabaseAdmin
      .from('ChatFile')
      .update({ user_id: userId })
      .is('user_id', null);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('关联未登录用户的文件失败:', error);
    return false;
  }
}
