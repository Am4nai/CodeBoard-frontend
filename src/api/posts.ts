import Cookies from 'js-cookie';
import { API_BASE_URL } from '@/config/apiConfig';
import axios from 'axios';

export async function fetchPostsByUsername(username: string) {
  try {
    const token = Cookies.get('authToken'); // Получаем токен из куки

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/posts/user/${username}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}` // Добавляем заголовок авторизации
      },
      credentials: 'include', // Не забываем, если используются cookies или session-токены
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts for user ${username}`);
    }

    const data = await response.json();

    console.log(data);
    
    return data;
  } catch (error) {
    console.error('[fetchPostsByUsername] Error:', error);
    return [];
  }
}

// Удаление поста по ID
export const deletePostApi = async (postId: number): Promise<void> => {
  try {
    const token = Cookies.get('authToken'); // Получаем токен из Cookies
    if (!token) {
      throw new Error('Authentication token is missing');
    }

    // Отправляем DELETE-запрос на сервер
    const response = await axios.delete(`${API_BASE_URL}/api/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
      },
    });

    // Проверяем статус ответа
    if (response.status === 204) {
      console.log('Post deleted successfully');
    } else {
      throw new Error('Unexpected response status');
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error; // Передаем ошибку выше для обработки в компоненте
  }
};