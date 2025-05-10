import { supabase } from '@/lib/supabase/client';
import { createServerAdminClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';
import { FileType } from '@/services/constant';

/**
 * 文件状态枚举
 */
export enum ChatFileStatus {
  UPLOADED = 'uploaded',
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
  user_id?: string;
  session_id: string;
  file_type: string;
  file_url?: string;
  file_name?: string;
}) {
  try {
    const fileId = uuidv4();

    const { data, error } = await supabase
      .from('ChatFile')
      .insert({
        id: fileId,
        user_id: file.user_id || null,
        session_id: file.session_id,
        file_type: file.file_type,
        file_url: file.file_url || 'https://example.com/placeholder.txt',
        file_name: file.file_name || `file_${Date.now()}.txt`,
        uploaded_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
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
    words_count?: number;
    basic_result_path?: string;
    ai_result_path?: string;
  } = {}
) {
  try {
    const supabaseAdmin = createServerAdminClient();

    const updateData: any = {
      status
    };

    // 添加额外数据，但需要确保字段名与数据库匹配
    if (additionalData.words_count !== undefined) {
      updateData.words_count = additionalData.words_count;
    }

    // 注意：这里我们假设数据库中有这些字段，实际可能需要调整
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
    const { data, error } = await supabase
      .from('ChatFile')
      .select('*')
      .eq('id', fileId)
      .single();

    if (error) throw error;
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
    const { data, error } = await supabase
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
 * 查询会话文件列表
 * @param sessionId 会话ID
 * @returns 文件列表
 */
export async function getSessionFiles(sessionId: string) {
  try {
    const { data, error } = await supabase
      .from('ChatFile')
      .select('*')
      .eq('session_id', sessionId)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('查询会话文件列表失败:', error);
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

    // 如果有文件URL，也可以考虑删除存储中的文件
    if (fileData.file_url) {
      // 这里可以添加删除存储文件的逻辑
      // 例如：await deleteStorageFile(fileData.file_url);
    }

    return true;
  } catch (error) {
    console.error('删除文件失败:', error);
    return false;
  }
}
