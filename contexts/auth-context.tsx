'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, UserSession } from '@/types/user';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Session } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// 创建认证上下文
const AuthContext = createContext<UserSession>({
  user: null,
  isLoading: true,
});

// 认证上下文提供者组件
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 创建客户端组件客户端
    const supabase = createClientComponentClient<Database>();

    // 获取初始会话
    const getInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);

        if (data.session?.user) {
          // 获取用户详细信息
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single();

          if (userData && !error) {
            setUser({
              uuid: userData.id,
              email: userData.email,
              nickname: userData.nickname || '',
              avatar_url: userData.avatar_url || '',
              created_at: userData.created_at,
              credits: userData.credits || 0,
            });
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // 监听认证状态变化
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);

        if (event === 'SIGNED_IN' && newSession?.user) {
          setIsLoading(true);

          // 获取用户详细信息
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', newSession.user.id)
            .single();

          if (userData && !error) {
            setUser({
              uuid: userData.id,
              email: userData.email,
              nickname: userData.nickname || '',
              avatar_url: userData.avatar_url || '',
              created_at: userData.created_at,
              credits: userData.credits || 0,
            });
          }

          setIsLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // 清理函数
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 自定义钩子，用于访问认证上下文
export function useAuth() {
  return useContext(AuthContext);
}
