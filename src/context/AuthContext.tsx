// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginUser, logoutUser, LoginResponse } from '../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthState = {
  isLoading: boolean;
  isSignedIn: boolean;
  token: string | null;
  userId: number | null;
  roles: string[];
};

type AuthContextType = AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isSignedIn: false,
    token: null,
    userId: null,
    roles: [],
  });

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('kb_access_token');
      setState((s) => ({
        ...s,
        token,
        isSignedIn: !!token,
        isLoading: false,
      }));
    })();
  }, []);

  const signIn = async (email: string, password: string) => {
    const data: LoginResponse = await loginUser({ username: email, password });
    await AsyncStorage.multiSet([
      ['kb_access_token', data.accessToken],
      ['kb_user_id', String(data.userId)],
      ['kb_roles', JSON.stringify(data.roles)],
    ]);
    setState({
      isLoading: false,
      isSignedIn: true,
      token: data.accessToken,
      userId: data.userId,
      roles: data.roles,
    });
  };

  const signOut = async () => {
    try { await logoutUser(); } catch {}
    await AsyncStorage.multiRemove(['kb_access_token', 'kb_user_id', 'kb_roles']);
    setState({
      isLoading: false,
      isSignedIn: false,
      token: null,
      userId: null,
      roles: [],
    });
  };

  const value = useMemo(() => ({ ...state, signIn, signOut }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
