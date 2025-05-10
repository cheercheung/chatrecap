import { getSupabaseClient } from "../db";
import { User } from "../types/user";

export async function saveUser(user: User): Promise<User> {
  const supabase = getSupabaseClient();
  
  // Check if user exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("email", user.email)
    .single();

  if (existingUser) {
    // Update user
    const { data, error } = await supabase
      .from("users")
      .update({
        nickname: user.nickname,
        avatar_url: user.avatar_url,
        signin_type: user.signin_type,
        signin_provider: user.signin_provider,
        signin_openid: user.signin_openid,
        signin_ip: user.signin_ip,
      })
      .eq("email", user.email)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Insert new user
    const { data, error } = await supabase
      .from("users")
      .insert(user)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) return null;
  return data;
}

export async function getUserByUuid(uuid: string): Promise<User | null> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("uuid", uuid)
    .single();

  if (error) return null;
  return data;
}