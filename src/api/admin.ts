// lib/api/admin.ts

import Cookies from 'js-cookie';
import { API_BASE_URL } from '@/config/apiConfig';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface UsersPageResponse {
  content: User[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export async function fetchAdminUsers(page: number, size = 5): Promise<UsersPageResponse | null> {
  try {
    const token = Cookies.get('authToken');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/users?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch admin users (page ${page})`);
    }

    return await response.json();
  } catch (error) {
    console.error('[fetchAdminUsers] Error:', error);
    return null;
  }
}

export async function fetchUserByUsername(username: string): Promise<User | null> {
  try {
    const token = Cookies.get('authToken');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/users/${username}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user with username: ${username}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[fetchUserByUsername] Error:', error);
    return null;
  }
}

// Новая функция: Обновление пользователя по ID
export async function updateUser(userId: number, data: Partial<User>): Promise<User | null> {
  try {
    const token = Cookies.get('authToken');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
        console.error(`Server responded with status ${response.status}:`, errorText);
      } catch {
        console.error('Failed to read error text from server');
      }
      throw new Error('Failed to update user.');
    }

    return await response.json();
  } catch (error) {
    console.error('[updateUser] Error:', error);
    return null;
  }
}