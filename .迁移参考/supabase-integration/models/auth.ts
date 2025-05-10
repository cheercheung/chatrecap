import { getSupabaseClient } from "../db";
import { User } from "../types/user";
import { saveUser } from "./user";

export async function signInWithEmail(email: string, password: string) {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signInWithOAuth(provider: 'google' | 'github') {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
  });
  
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email: string, password: string, userData: Partial<User>) {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  
  // If signup successful, save user data to users table
  if (data.user) {
    const user: User = {
      uuid: data.user.id,
      email: data.user.email || email,
      nickname: userData.nickname || email.split('@')[0],
      avatar_url: userData.avatar_url || '',
      signin_type: 'email',
      signin_provider: 'supabase',
      signin_openid: data.user.id,
      created_at: new Date().toISOString(),
      signin_ip: userData.signin_ip || '',
    };
    
    await saveUser(user);
  }
  
  return data;
}

export async function signOut() {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email: string) {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
  return data;
}

export async function updatePassword(newPassword: string) {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (error) throw error;
  return data;
}

export async function getCurrentUser() {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

export async function getSession() {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session;
}