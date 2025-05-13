// app/profile/[username]/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { InputField } from '@/components/InputField';
import { Switch } from '@/components/Switch';
import { PostCard } from '@/components/PostCard';
import Masonry from 'react-masonry-css';
import { useAuth } from '@/hooks/useAuth';
import { fetchPostsByUsername } from '@/api/posts';
import { fetchPublicProfileData, fetchProfileSettings, updateProfileSettings } from '@/api/profile';
import { deletePostApi } from '@/api/posts'; // Импортируем функцию для удаления поста

interface User {
  id: number;
  username: string;
  email: string;
  description: string;
  socialLink: string;
  role: string;
  createdAt: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  languageName: string;
  tags: string[];
  visibility: string;
  createdAt: string;
  authorUsername: string;
}

export default function ProfilePage() {
  const params = useParams(); // Получаем параметры маршрута
  const [user, setUser] = useState<User | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkThemeEnabled, setDarkThemeEnabled] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const { logout } = useAuth();

  // Получаем данные пользователя из localStorage и API
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      setIsCurrentUser(parsedUser.username === params.username);

      if (parsedUser.username === params.username) {
        // Это свой профиль — делаем запрос к API по ID
        fetchProfileSettings(parsedUser.id)
          .then((data) => {
            if (data) {
              setUser({
                id: data.userId,
                username: data.username,
                email: data.email,
                description: data.bio,
                socialLink: data.website,
                role: parsedUser.role,
                createdAt: parsedUser.createdAt,
              });
              setNotificationsEnabled(data.notificationsEnabled);
              setDarkThemeEnabled(data.theme === 'DARK');
            }
          })
          .catch(console.error);
      } else {
        // Это чужой профиль — используем публичные данные
        fetchPublicProfileData(params.username as string).then((data) => {
          if (data) {
            setUser({
              id: 0,
              username: data.username,
              email: data.email,
              description: data.bio,
              socialLink: data.website,
              role: '',
              createdAt: '',
            });
          }
        });
      }

      // Загружаем посты по username из URL
      fetchPostsByUsername(params.username as string)
        .then(setPosts)
        .catch(console.error)
        .finally(() => setLoadingPosts(false));
    }
  }, [params]);

  const handleChange = (field: keyof User, value: string) => {
    if (user) {
      setUser({ ...user, [field]: value });
    }
  };

  const handleUpdateProfile = async () => {
    if (!user || !isCurrentUser) return;
  
    const data = {
      bio: user.description || '',
      avatarUrl: '', // Можно передать пустое значение или undefined
      website: user.socialLink || '',
      theme: darkThemeEnabled ? 'DARK' : 'LIGHT',
      notificationsEnabled: notificationsEnabled,
    };
  
    console.log('Sending data to server:', data);
  
    try {
      const result = await updateProfileSettings(user.id, data); // Отправляем на сервер
      console.log('Profile updated successfully:', result);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  const handleDeletePost = async (post: Post) => {
    if (!isCurrentUser) return;
  
    try {
      // Вызываем API для удаления поста
      await deletePostApi(post.id);
  
      // Удаляем пост из состояния
      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== post.id));
  
      // Опционально: показать уведомление об успешном удалении
      alert('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete the post.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-[#E0E0E0]">
      {/* Хедер */}
      <Header />

      {/* Кнопка выхода */}
      <div className="container mx-auto px-4 py-4">
        {isCurrentUser && (
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-md float-right hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        )}
      </div>

      {/* Основной контент */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Левая колонка */}
            <div className="flex flex-col items-center space-y-4">
              <img
                src="https://randomuser.me/api/portraits/men/3.jpg  "
                alt="User Avatar"
                className="w-52 h-52 rounded-full border border-gray-600"
              />
              <InputField
                label="Username"
                type="text"
                value={user?.username || ''}
                onChange={(value) => handleChange('username', value)}
                disabled={!isCurrentUser}
                className="bg-gray-900 border border-gray-700 focus:border-[#50C878] w-full"
              />
              <InputField
                label="Email"
                type="email"
                value={user?.email || ''}
                onChange={(value) => handleChange('email', value)}
                disabled={!isCurrentUser}
                className="bg-gray-900 border border-gray-700 focus:border-[#50C878] w-full"
              />
            </div>

            {/* Правая колонка */}
            <div className="md:col-span-2 flex flex-col justify-between space-y-4 h-full">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={user?.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder={!isCurrentUser ? '' : 'Write something about yourself...'}
                  disabled={!isCurrentUser}
                  className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white resize-none h-64 focus:outline-none focus:border-[#50C878]"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-300">Social Link</label>
                <div className="flex gap-2">
                  <InputField
                    label=""
                    type="text"
                    value={user?.socialLink || ''}
                    onChange={(value) => handleChange('socialLink', value)}
                    disabled={!isCurrentUser}
                    className="flex-1 bg-gray-900 border border-gray-700 focus:border-[#50C878]"
                    classNameDiv='flex-1'
                  />
                  {isCurrentUser && (
                    <button
                      onClick={handleUpdateProfile}
                      className="px-4 py-2 rounded-md text-white font-semibold bg-[#4A90E2] hover:bg-[#3B7DEE]"
                    >
                      Update
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Переключатели */}
          {isCurrentUser && (
            <div className="border-t border-gray-700 pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-300">Notifications</span>
              <Switch
                on={notificationsEnabled}
                setOn={setNotificationsEnabled}
                disabled={!isCurrentUser}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-300">Dark Theme</span>
              <Switch
                on={darkThemeEnabled}
                setOn={setDarkThemeEnabled}
                disabled={!isCurrentUser}
              />
            </div>
          </div>
          )}
        </div>

        {/* Список постов с Masonry */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">User Posts</h2>
          {loadingPosts ? (
            <p className="text-gray-400">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-400">No posts found.</p>
          ) : (
            <Masonry
              breakpointCols={{
                default: 3,
                1024: 2,
                640: 1,
              }}
              className="flex -ml-4 w-auto"
              columnClassName="pl-4"
            >
              {posts.map((post) => (
                <div key={post.id} className="mb-4">
                  <PostCard
                    key={post.id}
                    post={post}
                    isCurrentUser={isCurrentUser} // Установите true, если текущий пользователь — автор
                    onDelete={handleDeletePost} // Передаем функцию удаления
                  />
                </div>
              ))}
            </Masonry>
          )}
        </div>
      </div>
    </div>
  );
}