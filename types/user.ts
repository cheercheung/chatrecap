export interface User {
  uuid: string;
  email: string;
  nickname?: string;
  avatar_url?: string;
  created_at: string;
  credits?: number;
  signin_type?: string;
  signin_provider?: string;
  signin_openid?: string;
  signin_ip?: string;
  invited_by?: string;
}

export interface UserSession {
  user: User | null;
  isLoading: boolean;
}
