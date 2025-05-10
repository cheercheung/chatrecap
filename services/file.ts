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
      session_id: file.session_id || null, // 添加会话ID
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

    // 先获取当前文件记录
    const { data: fileRecord, error: fetchError } = await supabaseAdmin
      .from('ChatFile')
      .select('*')
      .eq('id', fileId)
      .single();

    if (fetchError) {
      console.error('获取文件记录失败:', fetchError);
      throw fetchError;
    }

    const updateData: any = {};

    if (resultType === 'basic') {
      // 更新基础分析结果
      updateData.basic_result_path = resultPath;
      updateData.status = ChatFileStatus.COMPLETED_BASIC;
    } else if (resultType === 'ai') {
      // 更新AI分析结果
      updateData.ai_result_path = resultPath;

      // 检查是否有基础分析结果
      if (!fileRecord.basic_result_path) {
        console.warn(`文件 ${fileId} 没有基础分析结果，但正在设置AI分析结果`);
      }

      updateData.status = ChatFileStatus.COMPLETE_AI;
    }

    const { data, error } = await supabaseAdmin
      .from('ChatFile')
      .update(updateData)
      .eq('id', fileId)
      .select()
      .single();

    if (error) {
      console.error('更新文件记录失败:', error);
      throw error;
    }

    console.log(`成功关联${resultType === 'basic' ? '基础' : 'AI'}分析结果:`, data);
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
 * 查询用户文件列表（包括会话文件）
 * @param userId 用户ID
 * @param sessionId 会话ID
 * @returns 文件列表
 */
export async function getUserFiles(userId?: string, sessionId?: string) {
  try {
    const supabaseAdmin = createServerAdminClient();

    let query = supabaseAdmin
      .from('ChatFile')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (userId && sessionId) {
      // 如果同时提供了userId和sessionId，查询两者的并集
      query = query.or(`user_id.eq.${userId},session_id.eq.${sessionId}`);
    } else if (userId) {
      // 只查询用户关联的文件
      query = query.eq('user_id', userId);
    } else if (sessionId) {
      // 只查询会话关联的文件
      query = query.eq('session_id', sessionId);
    } else {
      // 如果都没有提供，返回空数组
      console.warn('getUserFiles: 未提供userId或sessionId');
      return [];
    }

    const { data, error } = await query;

    if (error) {
      console.error('查询文件列表数据库错误:', error);
      throw error;
    }

    return data || [];
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

/**
 * 将会话文件迁移到用户账户
 * @param sessionId 会话ID
 * @param userId 用户ID
 * @returns 迁移结果
 */
export async function migrateSessionFiles(sessionId: string, userId: string) {
  try {
    if (!sessionId || !userId) {
      console.error('迁移会话文件失败: sessionId和userId不能为空');
      return { success: false, error: '会话ID和用户ID不能为空' };
    }

    console.log(`开始迁移会话文件，会话ID: ${sessionId}, 用户ID: ${userId}`);
    const supabaseAdmin = createServerAdminClient();

    // 查找所有与会话关联的文件
    const { data: files, error: fetchError } = await supabaseAdmin
      .from('ChatFile')
      .select('*')
      .eq('session_id', sessionId)
      .is('user_id', null); // 只迁移没有用户ID的文件

    if (fetchError) {
      console.error('查询会话文件失败:', fetchError);
      throw fetchError;
    }

    // 如果没有文件，直接返回
    if (!files || files.length === 0) {
      console.log(`没有找到与会话ID ${sessionId} 关联的文件`);
      return { success: true, migratedCount: 0 };
    }

    console.log(`找到 ${files.length} 个会话文件需要迁移`);

    // 更新文件所有权
    const { error: updateError } = await supabaseAdmin
      .from('ChatFile')
      .update({
        user_id: userId,
        session_id: null // 清除会话ID
      })
      .eq('session_id', sessionId)
      .is('user_id', null);

    if (updateError) {
      console.error('更新文件所有权失败:', updateError);
      throw updateError;
    }

    console.log(`成功迁移 ${files.length} 个文件到用户 ${userId}`);
    return {
      success: true,
      migratedCount: files.length,
      files: files.map(f => ({ id: f.id, platform: f.platform, status: f.status }))
    };
  } catch (error) {
    console.error('迁移会话文件失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      migratedCount: 0
    };
  }
}

/**
 * 获取文件所有者信息
 * @param fileId 文件ID
 * @returns 所有者信息
 */
export async function getFileOwner(fileId: string) {
  try {
    const supabaseAdmin = createServerAdminClient();

    // 获取文件记录
    const { data: fileRecord, error: fileError } = await supabaseAdmin
      .from('ChatFile')
      .select('user_id, session_id')
      .eq('id', fileId)
      .single();

    if (fileError) {
      console.error('获取文件记录失败:', fileError);
      throw fileError;
    }

    if (!fileRecord) {
      return { userId: null, sessionId: null, exists: false };
    }

    return {
      userId: fileRecord.user_id,
      sessionId: fileRecord.session_id,
      exists: true
    };
  } catch (error) {
    console.error('获取文件所有者信息失败:', error);
    return { userId: null, sessionId: null, exists: false, error };
  }
}
