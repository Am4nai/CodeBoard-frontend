// src/api/auth.ts

import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: 'USER' | 'MODERATOR';
    createdAt: string; // ISO дата
  };
}

export const registerUser = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  try {
    const response = await apiClient.post<RegisterResponse>('/api/users/register', data);
    console.log('Registration successful. Server response:', response.data); // Логируем ответ сервера
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw new Error('Failed to register user');
  }
};

export const loginUser = async (data: LoginRequest): Promise<RegisterResponse> => {
  try {
    const response = await apiClient.post<RegisterResponse>('/api/auth/login', data);
    console.log('Login successful. Server response:', response.data); // Логируем ответ сервера
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Failed to login');
  }
};