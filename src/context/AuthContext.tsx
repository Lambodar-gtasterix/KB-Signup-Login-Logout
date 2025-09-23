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

  // 🔹 On app load, check if token exists in storage
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('kb_access_token');
      const userId = await AsyncStorage.getItem('kb_user_id');
      const rolesStr = await AsyncStorage.getItem('kb_roles');

      setState((s) => ({
        ...s,
        token,
        userId: userId ? Number(userId) : null,
        roles: rolesStr ? JSON.parse(rolesStr) : [],
        isSignedIn: !!token,
        isLoading: false,
      }));
    })();
  }, []);

  // 🔹 Login
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

  // 🔹 Logout
  const signOut = async () => {
    try {
      const res = await logoutUser();
      console.log('[LOGOUT API]', res);
    } catch (err) {
      console.warn('[LOGOUT API ERROR]', err);
      // We still clear local storage even if API fails
    }

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
