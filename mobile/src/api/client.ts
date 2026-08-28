/**
 * PRAVAAH Central Mobile API Client
 * Connects directly to the existing Flask Backend
 */

import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Smart host resolution depending on device environment & Expo Go host
const getDefaultApiUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;

  // 1. If running in Expo Go on a physical phone, automatically resolve computer's LAN IP from Metro host
  try {
    const hostUri =
      Constants.expoConfig?.hostUri ||
      (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ||
      (Constants as any).manifest?.debuggerHost;

    if (hostUri) {
      const hostIp = hostUri.split(':')[0];
      if (hostIp && hostIp !== 'localhost' && hostIp !== '127.0.0.1' && hostIp !== '10.0.2.2') {
        // If envUrl is not set or still points to emulator 10.0.2.2 / localhost, use inferred LAN IP
        if (!envUrl || envUrl.includes('10.0.2.2') || envUrl.includes('localhost')) {
          return `http://${hostIp}:5000`;
        }
      }
    }
  } catch (e) {
    // Non-fatal
  }

  // 2. Use explicitly configured environment URL
  if (envUrl) {
    return envUrl;
  }

  // 3. Fallback for Android Emulator
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000';
  }

  // 4. Fallback for iOS Simulator & Web
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
    // Non-fatal fallback for environments where SecureStore is unavailable
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

  let token: string | null = null;
  try {
    token = await getStoredAuthToken();
  } catch (e) {
    // Non-fatal
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  // Safe 8s timeout to avoid keeping startup waiting
  const timeoutId = setTimeout(() => controller.abort(), 8000);

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
      ? 'Connection timed out. Server taking too long to respond.'
      : isNetwork
      ? 'Unable to connect to PRAVAAH server. Showing cached/simulated telemetry.'
      : (err.message || 'An unexpected network error occurred.');

    return {
      data: null,
      error: errorText,
      status: isTimeout ? 408 : isNetwork ? 0 : 500,
      isOffline: true,
    };
  }
}
