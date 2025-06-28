import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session with error handling
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Session retrieval error:', error.message);
          if (mounted) {
            setUser(null);
            setIsLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
          try {
            await fetchUserProfile(session.user.id);
          } catch (error) {
            console.error('Error during initial session check:', error);
            if (mounted) {
              setUser(null);
              setIsLoading(false);
            }
          }
        } else if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes with enhanced error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth state change:', event, session?.user?.email);
      
      // Handle specific auth events
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      if (session?.user) {
        try {
          await fetchUserProfile(session.user.id);
        } catch (error: any) {
          console.error('Error during auth state change:', error);
          if (mounted) {
            // Check for token-related errors and handle gracefully
            if (isTokenError(error)) {
              console.log('Token error detected, clearing session...');
              await clearSession();
            } else {
              setUser(null);
              setIsLoading(false);
            }
          }
        }
      } else if (mounted) {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const isTokenError = (error: any): boolean => {
    const errorMessage = error?.message?.toLowerCase() || '';
    return errorMessage.includes('invalid refresh token') ||
           errorMessage.includes('refresh token not found') ||
           errorMessage.includes('refresh_token_not_found') ||
           errorMessage.includes('jwt expired') ||
           errorMessage.includes('invalid jwt');
  };

  const clearSession = async () => {
    try {
      // Clear the session without making additional requests that might fail
      await supabase.auth.signOut({ scope: 'local' });
      setUser(null);
    } catch (error) {
      console.warn('Error during session cleanup:', error);
      // Force clear user state even if signOut fails
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        
        // Check if it's a token-related error
        if (isTokenError(error)) {
          await clearSession();
          return;
        }
        
        throw new Error('Failed to fetch user profile');
      }

      if (data) {
        // Check if user is suspended (status is not active and not admin)
        if (data.status === 'suspended' && data.role !== 'admin') {
          await supabase.auth.signOut();
          setUser(null);
          throw new Error('This account has been suspended due to violating terms and conditions. Please contact support for assistance.');
        }
        
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          phone: data.phone,
          verified: data.verified,
          status: data.status,
          createdAt: data.created_at,
        });
      } else {
        // User profile not found - gracefully handle this data inconsistency
        console.warn('User profile not found for authenticated user. Signing out user.');
        await clearSession();
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      
      // Check for token-related errors and clear session
      if (isTokenError(error)) {
        console.log('Token error detected during profile fetch, clearing session...');
        await clearSession();
        return;
      }
      
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Clear any existing session before attempting login
      await supabase.auth.signOut({ scope: 'local' });
      
      // Regular Supabase authentication for all users including admin
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and confirm your account before logging in.');
        } else if (error.message.includes('Too many requests')) {
          throw new Error('Too many login attempts. Please wait a moment and try again.');
        } else {
          throw new Error(error.message || 'Login failed. Please try again.');
        }
      }

      if (data.user) {
        try {
          await fetchUserProfile(data.user.id);
        } catch (error: any) {
          setIsLoading(false);
          throw error;
        }
      } else {
        setIsLoading(false);
        throw new Error('Login failed. Please try again.');
      }
    } catch (error: any) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (userData: Partial<User> & { password: string }) => {
    setIsLoading(true);
    try {
      // Clear any existing session before attempting registration
      await supabase.auth.signOut({ scope: 'local' });
      
      // Sign up with Supabase Auth - let Supabase handle user existence checks
      const { data, error } = await supabase.auth.signUp({
        email: userData.email!,
        password: userData.password,
      });

      if (error) {
        setIsLoading(false);
        if (error.message.includes('User already registered') || error.message.includes('user_already_exists')) {
          throw new Error('User already registered with this email');
        }
        throw new Error(error.message || 'Registration failed');
      }

      if (data.user) {
        // Create user profile in our users table
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: userData.email!,
            name: userData.name!,
            phone: userData.phone,
            role: userData.role || 'buyer',
            verified: true,
            status: 'active',
          });

        if (profileError) {
          setIsLoading(false);
          throw new Error(profileError.message || 'Failed to create user profile');
        }

        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Use global scope to ensure complete logout
      await supabase.auth.signOut({ scope: 'global' });
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear the user state
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};