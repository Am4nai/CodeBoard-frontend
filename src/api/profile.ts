import Cookies from 'js-cookie';
import { API_BASE_URL } from '@/config/apiConfig';

export interface PublicUser {
  username: string;
  email: string;
  bio: string;
  avatarUrl?: string;
  website: string;
}

export interface ProfileSettings {
  userId: number;
  username: string;
  email: string;
  bio: string;
  avatarUrl?: string;
  website: string;
  theme: 'DARK' | 'LIGHT';
  notificationsEnabled: boolean;
}

export async function fetchPublicProfileData(username: string): Promise<PublicUser | null> {
  try {
    const token = Cookies.get('authToken');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/profile-settings/public/${username}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
    console.log(response);
    

    if (!response.ok) {
      // Если пользователь не найден или у вас нет прав — обрабатываем это
      console.error(`Failed to fetch public profile data for user ${username}`);
      return null;
    }

    const data: PublicUser = await response.json();
    
    return data;
  } catch (error) {
    console.error('[fetchPublicProfileData] Error:', error);
    return null;
  }
}

export async function fetchProfileSettings(userId: number): Promise<ProfileSettings | null> {
  try {
    const token = Cookies.get('authToken');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/profile-settings/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      console.error(`Failed to fetch profile settings for user ID ${userId}`);
      return null;
    }

    const data: ProfileSettings = await response.json();
    return data;
  } catch (error) {
    console.error('[fetchProfileSettings] Error:', error);
    return null;
  }
}

export async function updateProfileSettings(userId: number, data: Partial<ProfileSettings>) {
  try {
    const token = Cookies.get('authToken');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/profile-settings/${userId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update profile settings for user ID ${userId}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[updateProfileSettings] Error:', error);
    throw error;
  }
}