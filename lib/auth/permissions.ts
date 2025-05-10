/**
 * 权限验证工具
 * 用于验证资源访问权限
 */

import { NextRequest, NextResponse } from 'next/server';
import { getFileById, getFileOwner } from '@/services/file';
import { getCurrentUser, UserRole, UserInfo } from './user';
import { logError } from '@/lib/error-handling';

/**
 * 资源访问权限枚举
 */
export enum ResourcePermission {
  READ = 'read',       // 读取权限
  WRITE = 'write',     // 写入权限
  DELETE = 'delete',   // 删除权限
  EXECUTE = 'execute'  // 执行操作权限（如触发分析）
}

/**
 * 验证文件访问权限
 * @param fileId 文件ID
 * @param user 用户信息
 * @param permission 请求的权限
 * @returns 是否有权限
 */
export async function validateFileAccess(
  fileId: string,
  user: UserInfo,
  permission: ResourcePermission
): Promise<boolean> {
  try {
    // 获取文件记录
    const fileRecord = await getFileById(fileId);

    // 如果文件不存在，只允许写入操作（创建新文件）
    if (!fileRecord) {
      return permission === ResourcePermission.WRITE;
    }

    // 检查文件所有权
    const isOwner = (user.userId && fileRecord.user_id === user.userId) ||
                   (!fileRecord.user_id && fileRecord.session_id === user.sessionId);

    // 所有者拥有全部权限
    if (isOwner) {
      return true;
    }

    // 非所有者默认没有权限
    return false;
  } catch (error) {
    console.error('验证文件访问权限失败:', error);
    logError('validateFileAccess', error);
    return false; // 出错时拒绝访问
  }
}

/**
 * 验证用户是否有权限执行AI分析
 * @param user 用户信息
 * @returns 是否有权限
 */
export function canPerformAiAnalysis(user: UserInfo): boolean {
  // 只有已登录用户可以执行AI分析
  return user.isAuthenticated;
}

/**
 * 验证用户是否有权限充值积分
 * @param user 用户信息
 * @returns 是否有权限
 */
export function canRechargeCredits(user: UserInfo): boolean {
  // 只有已登录用户可以充值积分
  return user.isAuthenticated;
}

/**
 * API权限检查选项
 */
export interface PermissionCheckOptions {
  requireAuth?: boolean;
  resourceType?: 'file' | 'credit' | 'user';
  permission?: ResourcePermission;
  allowGuest?: boolean;
}

/**
 * API权限检查中间件
 * @param handler API处理函数
 * @param options 权限选项
 * @returns 处理结果
 */
export function withPermissionCheck(
  handler: (req: NextRequest, user: UserInfo) => Promise<NextResponse>,
  options: PermissionCheckOptions = {}
) {
  return async (req: NextRequest) => {
    try {
      // 获取用户信息
      const user = await getCurrentUser();

      // 检查是否需要登录
      if (options.requireAuth && user.role === UserRole.GUEST) {
        return NextResponse.json(
          {
            success: false,
            message: '需要登录',
            code: 'AUTH_REQUIRED'
          },
          { status: 401 }
        );
      }

      // 如果是文件资源，检查文件权限
      if (options.resourceType === 'file' && options.permission) {
        // 从请求中获取文件ID
        const url = new URL(req.url);
        const fileId = url.searchParams.get('fileId') ||
                      (req.method === 'GET' ? null : await req.clone().json().then(body => body.fileId).catch(() => null));

        if (!fileId) {
          return NextResponse.json(
            { success: false, message: '缺少文件ID' },
            { status: 400 }
          );
        }

        const hasPermission = await validateFileAccess(
          fileId,
          user,
          options.permission
        );

        if (!hasPermission) {
          return NextResponse.json(
            { success: false, message: '无权访问此资源', code: 'PERMISSION_DENIED' },
            { status: 403 }
          );
        }
      }

      // 权限检查通过，调用原始处理函数
      return handler(req, user);
    } catch (error) {
      console.error('权限检查失败:', error);
      logError('permissionCheck', error);

      return NextResponse.json(
        {
          success: false,
          message: '权限验证失败',
          error: error instanceof Error ? error.message : '未知错误'
        },
        { status: 500 }
      );
    }
  };
}

/**
 * 检查用户是否有权限访问特定页面
 * @param user 用户信息
 * @param page 页面路径
 * @returns 是否有权限
 */
export function canAccessPage(user: UserInfo, page: string): boolean {
  // 登录用户可以访问所有页面
  if (user.isAuthenticated) {
    return true;
  }

  // 未登录用户不能访问需要登录的页面
  const authRequiredPages = [
    '/dashboard',
    '/profile',
    '/settings',
    '/credits',
    '/payment'
  ];

  // 如果页面需要登录，未登录用户不能访问
  if (authRequiredPages.some(p => page.startsWith(p))) {
    return false;
  }

  // 其他页面未登录用户可以访问
  return true;
}
