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
  storage_path?: string;
}) {
  try {
    const fileId = uuidv4();
    
    const { data, error } = await supabase
      .from('chat_files')
      .insert({
        id: fileId,
        user_id: file.user_id || null,
        session_id: file.session_id,
        file_type: file.file_type,
        status: ChatFileStatus.UPLOADED,
        created_at: new Date().toISOString(),
        storage_path: file.storage_path || null
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
      status,
      ...additionalData
    };

    const { data, error } = await supabaseAdmin
      .from('chat_files')
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
    
    if (resultType === 'basic') {
      updateData.basic_result_path = resultPath;
      updateData.status = ChatFileStatus.COMPLETED_BASIC;
    } else if (resultType === 'ai') {
      updateData.ai_result_path = resultPath;
      updateData.status = ChatFileStatus.COMPLETE_AI;
    }

    const { data, error } = await supabaseAdmin
      .from('chat_files')
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
      .from('chat_files')
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
      .from('chat_files')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

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
      .from('chat_files')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

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
      .from('chat_files')
      .select('*')
      .eq('id', fileId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // 删除文件记录
    const { error } = await supabaseAdmin
      .from('chat_files')
      .delete()
      .eq('id', fileId);

    if (error) throw error;
    
    // 如果有存储路径，也删除存储中的文件
    // 注意：这里假设存储路径是相对于某个存储桶的路径
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
