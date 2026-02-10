'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { getUser, setUser, removeUser } from '@/utils/storage';

export const useAuth = () => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getUser();
    setUserState(storedUser);
    setLoading(false);
  }, []);

  const login = (phone: string, code: string): boolean => {
    // Mock verification - code is always 123456 for demo
    if (code !== '123456') return false;
    
    const user: User = {
      phone,
      token: `mock_token_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    setUser(user);
    setUserState(user);
    return true;
  };

  const register = (phone: string, code: string): boolean => {
    // Mock verification - code is always 123456 for demo
    if (code !== '123456') return false;
    
    const user: User = {
      phone,
      token: `mock_token_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    setUser(user);
    setUserState(user);
    return true;
  };

  const logout = () => {
    removeUser();
    setUserState(null);
  };

  const sendVerificationCode = (phone: string): boolean => {
    // Mock - always succeed, code is 123456
    console.log(`Verification code sent to ${phone}: 123456`);
    return true;
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    sendVerificationCode,
  };
};
