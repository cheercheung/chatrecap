import { NextRequest, NextResponse } from 'next/server';
import { migrateSessionFiles } from '@/services/file';
import { withPermissionCheck } from '@/lib/auth/permissions';
import { logError } from '@/lib/error-handling';

/**
 * 将会话文件迁移到用户账户
 * 当用户登录后，可以调用此API将之前上传的文件关联到账户
 */
export const POST = withPermissionCheck(
  async (request: NextRequest, user) => {
    try {
      // 检查用户是否已登录
      if (!user.isAuthenticated || !user.userId) {
        return NextResponse.json(
          { 
            success: false, 
            message: '需要登录才能迁移文件', 
            code: 'AUTH_REQUIRED' 
          },
          { status: 401 }
        );
      }

      // 获取会话ID
      const { sessionId } = await request.json();
      
      // 如果没有提供会话ID，使用当前会话ID
      const sessionIdToMigrate = sessionId || user.sessionId;

      // 迁移文件
      const result = await migrateSessionFiles(sessionIdToMigrate, user.userId);

      if (!result.success) {
        return NextResponse.json(
          { 
            success: false, 
            message: '迁移文件失败', 
            error: result.error 
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `成功迁移 ${result.migratedCount} 个文件`,
        migratedCount: result.migratedCount,
        files: result.files
      });
    } catch (error) {
      console.error('迁移会话文件失败:', error);
      logError('MigrateSessionFiles', error);

      return NextResponse.json(
        { 
          success: false, 
          message: '迁移会话文件失败', 
          error: error instanceof Error ? error.message : '未知错误' 
        },
        { status: 500 }
      );
    }
  },
  {
    // 需要登录
    requireAuth: true
  }
);
