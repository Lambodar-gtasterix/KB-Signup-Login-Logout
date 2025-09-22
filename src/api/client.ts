// src/api/client.ts
import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PORT = 8087;

// Use your LAN IP for Android real device; emulator can use 10.0.2.2
export const API_BASE_URL =
  Platform.OS === 'android'
    ? `http://192.168.31.114:${PORT}`
    : `http://localhost:${PORT}`;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT automatically
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
  console.log('[REQ]', config.method?.toUpperCase(), config.baseURL + config.url, config.data);
  return config;
});

api.interceptors.response.use(
  (res) => {
    console.log('[RES]', res.status, res.config.url, res.data);
    return res;
  },
  (err) => {
    console.log('[ERR]', err?.response?.status, err?.config?.url, err?.response?.data || err?.message);
    return Promise.reject(err);
  }
);

export default api;
