
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'kb_access_token';
const USER_ID_KEY = 'kb_user_id';
const ROLES_KEY = 'kb_roles';
const SELLER_ID_KEY = 'kb_seller_id';

export async function saveSession(
  token: string,
  userId: number,
  roles: string[],
  sellerId?: number | null
) {
  const items: [string, string][] = [
    [TOKEN_KEY, token],
    [USER_ID_KEY, String(userId)],
    [ROLES_KEY, JSON.stringify(roles)],
  ];
  if (sellerId !== undefined && sellerId !== null) {
    items.push([SELLER_ID_KEY, String(sellerId)]);
  }
  await AsyncStorage.multiSet(items);
}

export async function clearSession() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_ID_KEY, ROLES_KEY, SELLER_ID_KEY]);
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

export async function getSellerId() {
  const v = await AsyncStorage.getItem(SELLER_ID_KEY);
  return v ? Number(v) : null;
}