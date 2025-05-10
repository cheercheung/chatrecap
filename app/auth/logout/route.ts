import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

export async function GET(request: NextRequest) {
  try {
    // 直接创建 Supabase 客户端，避免使用中间函数
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // 登出用户
    await supabase.auth.signOut();

    // 重定向到首页
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
