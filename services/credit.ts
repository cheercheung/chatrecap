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
  file_uuid?: string;
}) {
  try {
    // 创建服务端管理员客户端
    const supabaseAdmin = createServerAdminClient();

    // 获取用户当前积分余额
    let currentBalance = 0;
    const { data: userData, error: userError } = await supabaseAdmin
      .from('User')
      .select('credit_balance')
      .eq('id', transaction.user_uuid)
      .single();

    if (!userError && userData) {
      currentBalance = userData.credit_balance || 0;
    }

    // 计算新的积分余额
    const newBalance = currentBalance + transaction.amount;

    // 更新用户积分余额
    await supabaseAdmin
      .from('User')
      .update({
        credit_balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction.user_uuid);

    // 创建积分交易记录
    // 注意：根据数据库表结构，CreditTransaction表可能没有order_id列
    const insertData: any = {
      id: uuidv4(),
      user_id: transaction.user_uuid,
      change_amount: transaction.amount,
      balance_after: newBalance,
      type: transaction.type,
      description: transaction.type === 'recharge' ? '充值积分' : '消费积分',
      created_at: new Date().toISOString()
    };

    // 如果提供了文件ID，添加到插入数据中
    if (transaction.file_uuid) {
      insertData.file_id = transaction.file_uuid;
    }

    const { data, error } = await supabase
      .from('CreditTransaction')
      .insert(insertData)
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
 * @param amount 消费金额（正数）
 * @param file_uuid 文件ID
 * @param description 描述信息
 * @returns 是否成功
 */
export async function consumeCredits(user_uuid: string, amount: number, file_uuid: string, description: string = '文件分析消费') {
  try {
    // 创建服务端管理员客户端
    const supabaseAdmin = createServerAdminClient();

    // 获取用户当前积分余额
    const { data: userData, error: userError } = await supabaseAdmin
      .from('User')
      .select('credit_balance')
      .eq('id', user_uuid)
      .single();

    if (userError) throw userError;

    const currentBalance = userData.credit_balance || 0;

    // 检查积分是否足够
    if (currentBalance < amount) {
      throw new Error('用户积分不足');
    }

    // 计算新的积分余额（消费为负数）
    const changeAmount = -Math.abs(amount);
    const newBalance = currentBalance + changeAmount;

    // 更新用户积分余额
    await supabaseAdmin
      .from('User')
      .update({
        credit_balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', user_uuid);

    // 创建积分消费记录
    const { error } = await supabaseAdmin
      .from('CreditTransaction')
      .insert({
        id: uuidv4(),
        user_id: user_uuid,
        change_amount: changeAmount,
        balance_after: newBalance,
        type: 'consume',
        file_id: file_uuid,
        description: description,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    return true;
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
      .from('CreditTransaction')
      .select('*, Order(*), ChatFile(*)')
      .eq('user_id', userUuid)
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
    // 由于User表中没有credit_balance字段，我们从CreditTransaction表中计算
    // 获取用户的所有交易记录
    const { data, error } = await supabase
      .from('CreditTransaction')
      .select('change_amount')
      .eq('user_id', userUuid);

    if (error) throw error;

    // 如果没有交易记录，返回0
    if (!data || data.length === 0) {
      return 0;
    }

    // 计算总积分（所有交易的change_amount之和）
    const totalCredits = data.reduce((sum, transaction) => sum + transaction.change_amount, 0);
    return totalCredits;
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
      .from('CreditTransaction')
      .select('*, Order(*), ChatFile(*)')
      .eq('id', transactionId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('获取交易详情失败:', error);
    return null;
  }
}