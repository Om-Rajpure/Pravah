import { apiFetch, setAuthToken } from './client';
import { User } from '../types';

export interface LoginResponse {
  status: string;
  token: string;
  user: User;
  message?: string;
}

export async function loginWithCredentials(email: string, password: string) {
  const res = await apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (res.data?.token) {
    await setAuthToken(res.data.token);
  }
  return res;
}

export async function loginAsGuest() {
  const res = await apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ is_guest: true }),
  });

  if (res.data?.token) {
    await setAuthToken(res.data.token);
  }
  return res;
}

export async function fetchCurrentUser() {
  return apiFetch<{ status: string; user: User }>('/api/auth/me');
}

export async function logoutUser() {
  try {
    await apiFetch('/api/auth/logout', { method: 'POST' });
  } finally {
    await setAuthToken(null);
  }
}
