import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginUser, logoutUser, LoginResponse } from '../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';

type AuthState = {
  isLoading: boolean;
  isSignedIn: boolean;
  token: string | null;
  userId: number | null;
  sellerId: number | null;
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
    sellerId: null,
    roles: [],
  });

  // Restore from storage on app start
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('kb_access_token');
      const userId = await AsyncStorage.getItem('kb_user_id');
      const rolesStr = await AsyncStorage.getItem('kb_roles');
      const sellerId = await AsyncStorage.getItem('kb_seller_id');

      setState((s) => ({
        ...s,
        token,
        userId: userId ? Number(userId) : null,
        sellerId: sellerId ? Number(sellerId) : null,
        roles: rolesStr ? JSON.parse(rolesStr) : [],
        isSignedIn: !!token,
        isLoading: false,
      }));
    })();
  }, []);

  // Login
  const signIn = async (email: string, password: string) => {
    const data: LoginResponse = await loginUser({ username: email, password });

    // fetch sellerId for this user
    let sellerId: number | null = null;
    try {
      const sellerRes = await api.get(`/api/v1/sellers/${data.userId}`);
      sellerId = sellerRes.data?.sellerId ?? null;
    } catch {
      sellerId = null;
    }

    await AsyncStorage.multiSet([
      ['kb_access_token', data.accessToken],
      ['kb_user_id', String(data.userId)],
      ['kb_roles', JSON.stringify(data.roles)],
      ['kb_seller_id', sellerId ? String(sellerId) : ''],
    ]);

    setState({
      isLoading: false,
      isSignedIn: true,
      token: data.accessToken,
      userId: data.userId,
      sellerId,
      roles: data.roles,
    });
  };

  // Logout
  const signOut = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore API failure, still clear local session
    }

    await AsyncStorage.multiRemove([
      'kb_access_token',
      'kb_user_id',
      'kb_roles',
      'kb_seller_id',
    ]);

    setState({
      isLoading: false,
      isSignedIn: false,
      token: null,
      userId: null,
      sellerId: null,
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
