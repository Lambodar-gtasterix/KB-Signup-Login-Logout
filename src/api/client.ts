import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PORT = 8087;

export const API_BASE_URL =
  Platform.OS === 'android'
    ? `http://192.168.31.114:${PORT}` //192.168.1.5
    : `http://localhost:${PORT}`;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('kb_access_token');
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.warn('Token read error:', e);
  }

  if (__DEV__) {
    console.log(`[REQ] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  }

  return config;
});

api.interceptors.response.use(
  (res) => {
    if (__DEV__) {
      console.log(`[RES] ${res.status} ${res.config.url}`);
    }
    return res;
  },
  (err) => {
    const status = err?.response?.status;
    const url = err?.config?.url;
    const message = err?.response?.data?.message || err?.message;

    console.warn(`[ERR] ${status} ${url}: ${message}`);
    return Promise.reject(err);
  }
);

export default api;