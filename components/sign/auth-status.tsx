'use client';

import { useUser } from '@/components/providers/user-provider';
import SignIn from './sign_in';
import SignUser from './user';

export default function AuthStatus() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>;
  }

  return user ? <SignUser user={user} /> : <SignIn />;
}
