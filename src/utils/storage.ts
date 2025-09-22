// src/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'kb_access_token';
const USER_ID_KEY = 'kb_user_id';
const ROLES_KEY = 'kb_roles';

export async function saveSession(token: string, userId: number, roles: string[]) {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token],
    [USER_ID_KEY, String(userId)],
    [ROLES_KEY, JSON.stringify(roles)],
  ]);
}

export async function clearSession() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_ID_KEY, ROLES_KEY]);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function getUserId() {
  const v = await AsyncStorage.getItem(USER_ID_KEY);
  return v ? Number(v) : null;
}

export async function getRoles(): Promise<string[]> {
  const v = await AsyncStorage.getItem(ROLES_KEY);
  return v ? JSON.parse(v) : [];
}
