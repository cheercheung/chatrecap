import { NextRequest, NextResponse } from 'next/server';
import { createRouteSupabaseClient } from '@/lib/supabase/client';
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
        // 使用直接的方式创建客户端，避免使用 createRouteSupabaseClient
        console.log('Creating Supabase client directly');

        // 先获取 cookie 存储
        const cookieStore = await cookies();

        // 使用 try-catch 包装可能出错的代码
        try {
          const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

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
