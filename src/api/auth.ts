// src/api/auth.ts
import api from './client';

export type RegisterBody = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobileNumber: number | string;
  address: string;
  role: 'BUYER' | 'SELLER' | 'USER' ;
};

export async function registerUser(body: RegisterBody) {
  const res = await api.post('/api/v1/users/register', body);
  return res.data;
}

// ========== LOGIN ==========
export type LoginBody = {
  username: string; // backend expects "username" key (email as username)
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  roles: string[];
  userId: number;
};

export async function loginUser(body: LoginBody): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>('/jwt/login', body);
  return res.data;
}

// ========== LOGOUT (optional) ==========
export async function logoutUser() {
  return api.post('/api/v1/auth/logout');
}
