import { supabase } from '@/lib/supabase/client';
import { createServerAdminClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

/**
 * 积分交易类型
 */
export type CreditTransactionType = 'recharge' | 'consume';

/**
 * 创建积分交易记录并更新用户积分余额
 * @param transaction 交易信息
 * @returns 创建的交易记录
 */
export async function createCreditTransaction(transaction: {
  user_uuid: string;
  amount: number;
  type: CreditTransactionType;
  order_uuid?: string;
  file_uuid?: string;
}) {
  try {
    // 创建服务端管理员客户端
    const supabaseAdmin = createServerAdminClient();

    // 调用数据库函数更新用户积分
    await supabaseAdmin.rpc('update_user_credit', {
      p_user_uuid: transaction.user_uuid,
      p_amount: transaction.amount
    });

    // 创建积分交易记录
    const { data, error } = await supabase
      .from('credit_transactions')
      .insert({
        id: uuidv4(),
        user_uuid: transaction.user_uuid,
        amount: transaction.amount,
        type: transaction.type,
        order_uuid: transaction.order_uuid,
        file_uuid: transaction.file_uuid,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('创建积分交易记录失败:', error);
    throw error;
  }
}

/**
 * 消费用户积分（用于AI分析等功能）
 * @param user_uuid 用户ID
 * @param amount 消费金额
 * @param file_uuid 文件ID
 * @returns 是否成功
 */
export async function consumeCredits(user_uuid: string, amount: number, file_uuid: string) {
  try {
    // 创建服务端管理员客户端
    const supabaseAdmin = createServerAdminClient();

    // 调用数据库函数消费积分
    const { data, error } = await supabaseAdmin.rpc('consume_user_credit', {
      p_user_uuid: user_uuid,
      p_amount: amount,
      p_file_uuid: file_uuid
    });

    if (error) throw error;
    return data; // 返回布尔值，表示是否成功
  } catch (error) {
    console.error('消费积分失败:', error);
    return false;
  }
}

/**
 * 获取用户积分交易历史
 * @param userUuid 用户ID
 * @param limit 限制数量
 * @param offset 偏移量
 * @returns 交易历史
 */
export async function getUserCreditHistory(userUuid: string, limit: number = 20, offset: number = 0) {
  try {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*, orders(*)')
      .eq('user_uuid', userUuid)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('获取用户积分历史失败:', error);
    return [];
  }
}

/**
 * 获取用户当前积分余额
 * @param userUuid 用户ID
 * @returns 积分余额
 */
export async function getUserCreditBalance(userUuid: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('credit_balance')
      .eq('id', userUuid)
      .single();

    if (error) throw error;
    return data?.credit_balance || 0;
  } catch (error) {
    console.error('获取用户积分余额失败:', error);
    return 0;
  }
}

/**
 * 检查用户积分是否足够
 * @param userUuid 用户ID
 * @param amount 所需积分
 * @returns 是否足够
 */
export async function checkUserCreditSufficient(userUuid: string, amount: number) {
  try {
    const balance = await getUserCreditBalance(userUuid);
    return balance >= amount;
  } catch (error) {
    console.error('检查用户积分是否足够失败:', error);
    return false;
  }
}

/**
 * 获取特定交易详情
 * @param transactionId 交易ID
 * @returns 交易详情
 */
export async function getCreditTransactionById(transactionId: string) {
  try {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*, orders(*), chat_files(*)')
      .eq('id', transactionId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('获取交易详情失败:', error);
    return null;
  }
}