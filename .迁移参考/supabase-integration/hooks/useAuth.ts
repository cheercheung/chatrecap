import { useState, useEffect } from 'react';
import { getSession, getCurrentUser, signOut } from '../models/auth';
import { getUserByEmail } from '../models/user';
import { User } from '../types/user';

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true);
        
        // Get the session
        const currentSession = await getSession();
        setSession(currentSession);
        
        if (currentSession) {
          // Get the auth user
          const authUser = await getCurrentUser();
          
          if (authUser?.email) {
            // Get the user profile from our database
            const userProfile = await getUserByEmail(authUser.email);
            setUser(userProfile);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
    
    // Set up listener for auth state changes
    const { data: { subscription } } = getSupabaseClient().auth.onAuthStateChange(
      (_event, _session) => {
        loadUserData();
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    user,
    session,
    loading,
    logout,
    isAuthenticated: !!user && !!session,
  };
}