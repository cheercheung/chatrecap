'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/user';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { Session } from '@supabase/supabase-js';

// 创建用户上下文
interface UserContextType {
  user: User | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
});

// 用户上下文提供者组件
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 创建客户端组件客户端
    const supabase = createClientComponentClient<Database>();

    // 获取初始会话
    const getInitialSession = async () => {
      try {
        console.log('UserProvider: Getting initial session');
        const { data } = await supabase.auth.getSession();
        console.log('UserProvider: Session data received', { hasSession: !!data.session });
        setSession(data.session);

        if (data.session?.user) {
          console.log('UserProvider: User is logged in', { userId: data.session.user.id });
          // 获取用户详细信息
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single();

          console.log('UserProvider: User data query result', {
            hasUserData: !!userData,
            hasError: !!error,
            errorMessage: error?.message
          });

          if (userData && !error) {
            console.log('UserProvider: Setting user data');
            setUser({
              uuid: userData.id,
              email: userData.email,
              nickname: userData.nickname || '',
              avatar_url: userData.avatar_url || '',
              created_at: userData.created_at,
              credits: userData.credits || 0,
            });
          } else {
            console.log('UserProvider: No user data found in database');
          }
        } else {
          console.log('UserProvider: No active session');
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
        console.log('UserProvider: Auth state changed', { event, hasSession: !!newSession });
        setSession(newSession);

        if (event === 'SIGNED_IN' && newSession?.user) {
          console.log('UserProvider: User signed in', { userId: newSession.user.id });
          setIsLoading(true);

          // 获取用户详细信息
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', newSession.user.id)
            .single();

          console.log('UserProvider: User data after sign in', {
            hasUserData: !!userData,
            hasError: !!error,
            errorMessage: error?.message
          });

          if (userData && !error) {
            console.log('UserProvider: Setting user data after sign in');
            setUser({
              uuid: userData.id,
              email: userData.email,
              nickname: userData.nickname || '',
              avatar_url: userData.avatar_url || '',
              created_at: userData.created_at,
              credits: userData.credits || 0,
            });
          } else {
            console.log('UserProvider: No user data found after sign in, creating new user record');

            // 创建新用户记录
            try {
              const { error: insertError } = await supabase.from('users').insert({
                id: newSession.user.id,
                email: newSession.user.email || '',
                nickname: newSession.user.user_metadata?.full_name || '',
                avatar_url: newSession.user.user_metadata?.avatar_url || '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                credits: 0
              });

              if (insertError) {
                console.error('UserProvider: Error creating user record:', insertError);
              } else {
                console.log('UserProvider: User record created successfully');

                // 设置用户数据
                setUser({
                  uuid: newSession.user.id,
                  email: newSession.user.email || '',
                  nickname: newSession.user.user_metadata?.full_name || '',
                  avatar_url: newSession.user.user_metadata?.avatar_url || '',
                  created_at: new Date().toISOString(),
                  credits: 0,
                });
              }
            } catch (insertErr) {
              console.error('UserProvider: Exception creating user record:', insertErr);
            }
          }

          setIsLoading(false);
        } else if (event === 'SIGNED_OUT') {
          console.log('UserProvider: User signed out');
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
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

// 自定义钩子，用于访问用户上下文
export function useUser() {
  return useContext(UserContext);
}
