import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { cookies } from 'next/headers';

// 处理 OAuth 回调
export async function GET(request: NextRequest) {
  try {
    console.log('Auth callback triggered');
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    console.log('Auth code present:', !!code);

    if (code) {
      try {
        // 创建 Supabase 客户端，直接传递 cookies 函数
        const supabase = createRouteHandlerClient<Database>({ cookies });

        try {
          // 使用 code 交换会话
          console.log('Exchanging code for session');
          const sessionResult = await supabase.auth.exchangeCodeForSession(code);
          console.log('Session exchange result:', !!sessionResult);
        } catch (innerError) {
          console.error('Error during session exchange:', innerError);
          // 即使出错，我们也继续执行，尝试重定向到首页
        }
      } catch (clientError) {
        console.error('Error creating Supabase client:', clientError);
      }
    }

    console.log('Redirecting to homepage');
    // 重定向到首页或其他页面
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Error in auth callback:', error);
    return NextResponse.redirect(
      new URL('/auth/signin?error=Something went wrong during sign in', request.url)
    );
  }
}
