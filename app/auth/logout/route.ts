import { NextRequest, NextResponse } from 'next/server';
import { createRouteSupabaseClient } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteSupabaseClient();
    
    // Sign out the user
    await supabase.auth.signOut();
    
    // Redirect to the homepage
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
