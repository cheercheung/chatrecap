import { createServerAdminClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

/**
 * 文件状态枚举
 */
export enum ChatFileStatus {
  UPLOADED = 'uploaded',
  CLEANING = 'cleaning',
  PROCESSING = 'processing',
  COMPLETED_BASIC = 'completed_basic',
  COMPLETE_AI = 'complete_ai',
  FAILED = 'failed'
}

/**
 * 创建文件记录
 * @param file 文件信息
 * @returns 创建的文件记录
 */
export async function createFileRecord(file: {
  id?: string; // 添加可选的ID参数
  user_id?: string;
  session_id?: string;
  platform?: string;
  status?: ChatFileStatus;
  words_count?: number;
  storage_path: string; // 现在是必需的
  basic_result_path?: string;
  ai_result_path?: string;
}) {
  try {
    const fileId = file.id || uuidv4();
    const supabaseAdmin = createServerAdminClient();

    console.log('创建文件记录，ID:', fileId, '数据:', file);

    const insertData = {
      id: fileId,
      user_id: file.user_id || null,
      platform: file.platform || 'auto',
      status: file.status || ChatFileStatus.UPLOADED,
      words_count: file.words_count || null,
      storage_path: file.storage_path, // 必需的字段
      basic_result_path: file.basic_result_path || null,
      ai_result_path: file.ai_result_path || null
    };

    console.log('插入数据:', insertData);

    const { data, error } = await supabaseAdmin
      .from('ChatFile')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('数据库插入错误:', error);
      throw error;
    }

    console.log('文件记录创建成功:', data);
    return data;
  } catch (error) {
    console.error('创建文件记录失败:', error);
    throw error;
  }
}

/**
 * 更新文件状态
 * @param fileId 文件ID
 * @param status 新状态
 * @param additionalData 额外数据
 * @returns 更新后的文件记录
 */
export async function updateFileStatus(
  fileId: string,
  status: ChatFileStatus,
  additionalData: {
    platform?: string;
    words_count?: number;
    storage_path?: string;
    basic_result_path?: string;
    ai_result_path?: string;
  } = {}
) {
  try {
    const supabaseAdmin = createServerAdminClient();

    const updateData: any = {
      status
    };

    // 添加额外数据，确保字段名与数据库匹配
    if (additionalData.platform !== undefined) {
      updateData.platform = additionalData.platform;
    }

    if (additionalData.words_count !== undefined) {
      updateData.words_count = additionalData.words_count;
    }

    if (additionalData.storage_path !== undefined) {
      updateData.storage_path = additionalData.storage_path;
    }

    if (additionalData.basic_result_path) {
      updateData.basic_result_path = additionalData.basic_result_path;
    }

    if (additionalData.ai_result_path) {
      updateData.ai_result_path = additionalData.ai_result_path;
    }

    const { data, error } = await supabaseAdmin
      .from('ChatFile')
      .update(updateData)
      .eq('id', fileId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('更新文件状态失败:', error);
    throw error;
  }
}

/**
 * 关联分析结果
 * @param fileId 文件ID
 * @param resultType 结果类型
 * @param resultPath 结果路径
 * @returns 更新后的文件记录
 */
export async function associateAnalysisResult(fileId: string, resultType: 'basic' | 'ai', resultPath: string) {
  try {
    const supabaseAdmin = createServerAdminClient();

    const updateData: any = {};

    // 注意：这里我们假设数据库中有这些字段，实际可能需要调整
    if (resultType === 'basic') {
      updateData.basic_result_path = resultPath;
      updateData.status = ChatFileStatus.COMPLETED_BASIC;
    } else if (resultType === 'ai') {
      updateData.ai_result_path = resultPath;
      updateData.status = ChatFileStatus.COMPLETE_AI;
    }

    const { data, error } = await supabaseAdmin
      .from('ChatFile')
      .update(updateData)
      .eq('id', fileId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('关联分析结果失败:', error);
    throw error;
  }
}

/**
 * 获取文件详情
 * @param fileId 文件ID
 * @returns 文件详情
 */
export async function getFileById(fileId: string) {
  try {
    console.log('获取文件详情，ID:', fileId);
    const supabaseAdmin = createServerAdminClient();

    const { data, error } = await supabaseAdmin
      .from('ChatFile')
      .select('*')
      .eq('id', fileId)
      .single();

    if (error) {
      console.error('获取文件详情数据库错误:', error);
      throw error;
    }

    console.log('获取文件详情结果:', data);
    return data;
  } catch (error) {
    console.error('获取文件详情失败:', error);
    return null;
  }
}

/**
 * 查询用户文件列表
 * @param userId 用户ID
 * @returns 文件列表
 */
export async function getUserFiles(userId: string) {
  try {
    const supabaseAdmin = createServerAdminClient();

    const { data, error } = await supabaseAdmin
      .from('ChatFile')
      .select('*')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('查询用户文件列表失败:', error);
    return [];
  }
}

/**
 * 查询最近的文件列表
 * @param limit 限制数量
 * @returns 文件列表
 */
export async function getRecentFiles(limit: number = 10) {
  try {
    const supabaseAdmin = createServerAdminClient();

    const { data, error } = await supabaseAdmin
      .from('ChatFile')
      .select('*')
      .order('uploaded_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('查询最近文件列表失败:', error);
    return [];
  }
}

/**
 * 删除文件
 * @param fileId 文件ID
 * @returns 是否成功
 */
export async function deleteFile(fileId: string) {
  try {
    const supabaseAdmin = createServerAdminClient();

    // 先获取文件信息
    const { data: fileData, error: fetchError } = await supabaseAdmin
      .from('ChatFile')
      .select('*')
      .eq('id', fileId)
      .single();

    if (fetchError) throw fetchError;

    // 先删除关联的积分交易记录
    const { error: creditError } = await supabaseAdmin
      .from('CreditTransaction')
      .delete()
      .eq('file_id', fileId);

    if (creditError) {
      console.warn('删除关联的积分交易记录失败:', creditError);
      // 继续执行，不中断流程
    }

    // 删除文件记录
    const { error } = await supabaseAdmin
      .from('ChatFile')
      .delete()
      .eq('id', fileId);

    if (error) throw error;

    // 如果有存储路径，也可以考虑删除存储中的文件
    if (fileData.storage_path) {
      // 这里可以添加删除存储文件的逻辑
      // 例如：await deleteStorageFile(fileData.storage_path);
    }

    return true;
  } catch (error) {
    console.error('删除文件失败:', error);
    return false;
  }
}
