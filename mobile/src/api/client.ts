/**
 * PRAVAAH Central Mobile API Client
 * Connects directly to the existing Flask Backend
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Fallback host resolution depending on device environment
const getDefaultApiUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Android Emulator uses 10.0.2.2 to reach host machine localhost
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000';
  }
  // iOS Simulator & Web
  return 'http://localhost:5000';
};

let customApiUrl: string | null = null;

export const setCustomApiUrl = (url: string | null) => {
  customApiUrl = url;
};

export const getApiBaseUrl = (): string => {
  return customApiUrl || getDefaultApiUrl();
};

const TOKEN_KEY = 'pravaah_auth_token';

// In-memory token cache for fast access
let inMemoryToken: string | null = null;

export const setAuthToken = async (token: string | null) => {
  inMemoryToken = token;
  try {
    if (token) {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  } catch (err) {
    // Non-fatal if SecureStore fails on web or unsupported environment
    console.warn('[SecureStore] Storage notice:', err);
  }
};

export const getStoredAuthToken = async (): Promise<string | null> => {
  if (inMemoryToken) return inMemoryToken;
  try {
    const stored = await SecureStore.getItemAsync(TOKEN_KEY);
    inMemoryToken = stored;
    return stored;
  } catch (err) {
    return null;
  }
};

export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  status: number;
  isOffline?: boolean;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const baseUrl = getApiBaseUrl().replace(/\/$/, '');
  const url = `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const token = await getStoredAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    let parsedData: any = null;

    if (contentType.includes('application/json')) {
      parsedData = await response.json();
    } else {
      parsedData = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        (typeof parsedData === 'object' && parsedData?.error?.message) ||
        (typeof parsedData === 'object' && parsedData?.message) ||
        `Server returned ${response.status}: ${response.statusText}`;

      return {
        data: null,
        error: errorMessage,
        status: response.status,
      };
    }

    return {
      data: parsedData as T,
      error: null,
      status: response.status,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    const isTimeout = err.name === 'AbortError';
    const isNetwork = err.message?.includes('Network request failed') || isTimeout;

    const errorText = isTimeout
      ? 'Connection timed out. Please check your network.'
      : isNetwork
      ? 'Unable to connect to PRAVAAH server. Please check your connection.'
      : (err.message || 'An unexpected error occurred.');

    return {
      data: null,
      error: errorText,
      status: isTimeout ? 408 : isNetwork ? 0 : 500,
      isOffline: isNetwork,
    };
  }
}
