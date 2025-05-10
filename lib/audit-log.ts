/**
 * 审计日志模块
 * 用于记录系统中的重要操作，特别是文件访问和修改
 */

import { createServerAdminClient } from '@/lib/supabase/server';

// 审计日志类型
export enum AuditLogType {
  FILE_UPLOAD = 'file_upload',
  FILE_ACCESS = 'file_access',
  FILE_DELETE = 'file_delete',
  FILE_UPDATE = 'file_update',
  CREDIT_CONSUME = 'credit_consume',
  CREDIT_RECHARGE = 'credit_recharge',
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  ADMIN_ACTION = 'admin_action',
  SYSTEM_ERROR = 'system_error'
}

// 审计日志接口
export interface AuditLogEntry {
  type: AuditLogType;
  user_id?: string;
  resource_id?: string;
  resource_type?: string;
  action: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  status: 'success' | 'failure';
  error_message?: string;
}

/**
 * 记录审计日志
 * 注意：此函数不会抛出异常，以避免影响主要业务流程
 * 
 * @param entry 审计日志条目
 * @returns 是否成功记录
 */
export async function logAudit(entry: AuditLogEntry): Promise<boolean> {
  try {
    // 在控制台记录日志（开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log('[AUDIT]', JSON.stringify(entry, null, 2));
      return true;
    }

    // 在生产环境，将日志写入数据库或发送到日志服务
    // 这里我们使用控制台记录，实际应用中可以替换为数据库写入
    console.log('[AUDIT]', JSON.stringify(entry, null, 2));
    
    // 如果有配置Supabase审计日志表，则写入数据库
    if (process.env.ENABLE_DB_AUDIT_LOG === 'true') {
      try {
        const supabaseAdmin = createServerAdminClient();
        
        // 写入审计日志表
        // 注意：需要先在Supabase中创建AuditLog表
        const { error } = await supabaseAdmin
          .from('AuditLog')
          .insert({
            type: entry.type,
            user_id: entry.user_id || null,
            resource_id: entry.resource_id || null,
            resource_type: entry.resource_type || null,
            action: entry.action,
            details: entry.details || null,
            ip_address: entry.ip_address || null,
            user_agent: entry.user_agent || null,
            status: entry.status,
            error_message: entry.error_message || null,
            created_at: new Date().toISOString()
          });
        
        if (error) {
          console.error('写入审计日志到数据库失败:', error);
          return false;
        }
        
        return true;
      } catch (dbError) {
        console.error('写入审计日志到数据库时发生异常:', dbError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('记录审计日志失败:', error);
    return false;
  }
}

/**
 * 记录文件访问日志
 * @param userId 用户ID
 * @param fileId 文件ID
 * @param action 操作
 * @param status 状态
 * @param details 详情
 * @param errorMessage 错误信息
 * @returns 是否成功记录
 */
export async function logFileAccess(
  userId: string | null,
  fileId: string,
  action: string,
  status: 'success' | 'failure' = 'success',
  details?: any,
  errorMessage?: string
): Promise<boolean> {
  return logAudit({
    type: AuditLogType.FILE_ACCESS,
    user_id: userId || undefined,
    resource_id: fileId,
    resource_type: 'file',
    action,
    details,
    status,
    error_message: errorMessage
  });
}

/**
 * 记录文件操作日志
 * @param userId 用户ID
 * @param fileId 文件ID
 * @param action 操作
 * @param status 状态
 * @param details 详情
 * @param errorMessage 错误信息
 * @returns 是否成功记录
 */
export async function logFileOperation(
  userId: string | null,
  fileId: string,
  action: string,
  status: 'success' | 'failure' = 'success',
  details?: any,
  errorMessage?: string
): Promise<boolean> {
  const type = action.includes('delete') 
    ? AuditLogType.FILE_DELETE 
    : action.includes('upload') 
      ? AuditLogType.FILE_UPLOAD 
      : AuditLogType.FILE_UPDATE;
  
  return logAudit({
    type,
    user_id: userId || undefined,
    resource_id: fileId,
    resource_type: 'file',
    action,
    details,
    status,
    error_message: errorMessage
  });
}
