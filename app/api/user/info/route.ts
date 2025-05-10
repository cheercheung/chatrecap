import { NextRequest, NextResponse } from 'next/server';
import { withPermissionCheck } from '@/lib/auth/permissions';
import { getUserFiles } from '@/services/file';
import { logError } from '@/lib/error-handling';

/**
 * 获取当前用户信息
 * 包括用户ID、会话ID、角色、是否已登录等
 */
export const GET = withPermissionCheck(
  async (request: NextRequest, user) => {
    try {
      // 获取用户文件数量
      let fileCount = 0;
      try {
        const files = await getUserFiles(
          user.userId, 
          user.userId ? undefined : user.sessionId
        );
        fileCount = files.length;
      } catch (fileError) {
        console.error('获取用户文件数量失败:', fileError);
      }

      return NextResponse.json({
        success: true,
        user: {
          userId: user.userId,
          sessionId: user.sessionId,
          role: user.role,
          isAuthenticated: user.isAuthenticated,
          email: user.email,
          name: user.name,
          fileCount
        }
      });
    } catch (error) {
      console.error('获取用户信息失败:', error);
      logError('GetUserInfo', error);

      return NextResponse.json(
        { 
          success: false, 
          message: '获取用户信息失败', 
          error: error instanceof Error ? error.message : '未知错误' 
        },
        { status: 500 }
      );
    }
  },
  {
    // 不需要登录
    requireAuth: false,
    // 允许游客访问
    allowGuest: true
  }
);
