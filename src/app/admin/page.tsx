// app/admin/page.tsx

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { InputField } from '@/components/InputField';
import { SelectField } from '@/components/SelectField';
import { Button } from '@/components/Button';
import { TextArea } from '@/components/TextArea';
import { TagInput } from '@/components/TagInput';
import { fetchAdminUsers, fetchUserByUsername, updateUser } from '@/api/admin';
import { fetchPostsByUsername } from '@/api/posts';
import { fetchLanguages } from '@/api/languagesApi';
import { fetchTags } from '@/api/tagsApi';
import { deletePostApi } from '@/api/posts'; // Импортируем функцию для удаления поста

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

interface formData {
  id: number;
  title: string;
  language: string;
  code: string;
  privacy: string;
  tags: Tag[];
}

interface Post {
  id: number;
  title: string;
  content: string;
  languageName: string;
  tags: string[];
  visibility: string;
  createdAt: string;
}

interface Language {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

export default function AdminPanel() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [formData, setFormData] = useState({
    id: 0,
    title: '',
    language: '', // <--- здесь хранится languageName
    code: '',
    privacy: 'PUBLIC',
    tags: [] as Tag[], // <--- массив объектов { id, name }
  });
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    role: 'USER',
    password: '',
  });

  interface UserFormData {
    username: string;
    email: string;
    role: string;
    password: string;
  }

  // Мемоизация loadUsers для предотвращения ненужных пересозданий функции
  const loadUsers = useCallback(async (page: number) => {
    try {
      const data = await fetchAdminUsers(page, 5);
      if (data && data.content) {
        setUsers(data.content);
        setTotalPages(data.page.totalPages);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      // Можно добавить уведомление для пользователя, например, через toast
    }
  }, []);

  // Проверка роли пользователя при загрузке страницы
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role === 'MODERATOR') {
        setRole(parsedUser.role);
        loadUsers(currentPage);
      } else {
        router.push('/dashboard');
      }
    } else {
      router.push('/dashboard');
    }
  }, [router, currentPage, loadUsers]);

  // Эффект для обновления пользователей при изменении currentPage
  useEffect(() => {
    if (role === 'MODERATOR') {
      loadUsers(currentPage);
    }
  }, [currentPage, role, loadUsers]);

  // Обработчик поиска пользователя
  const handleSearch = async () => {
    try {
      const user = await fetchUserByUsername(searchTerm);
      if (user) {
        setSelectedUser(user);
        setUserData({
          username: user.username,
          email: user.email,
          role: user.role,
          password: '',
        });
        const posts = await fetchPostsByUsername(user.username);
        setUserPosts(posts || []);
      } else {
        setSelectedUser(null);
        setUserPosts([]);
        alert('User not found.');
      }
    } catch (error) {
      console.error('Error searching for user:', error);
      alert('Failed to find user.');
    }
  };

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const data = await fetchLanguages();
        setLanguages(data);
      } catch (error) {
        console.error('Error loading languages:', error);
      }
    };
  
    loadLanguages();
  }, []);
  
  useEffect(() => {
    const loadTags = async () => {
      try {
        const data = await fetchTags();
        setTags(data);
      } catch (error) {
        console.error('Error loading tags:', error);
      }
    };
  
    loadTags();
  }, []);

  // Обработчик выбора пользователя из списка
  const handleUserSelect = async (user: User) => {
    setSelectedUser(user);
    setUserData({
      username: user.username,
      email: user.email,
      role: user.role,
      password: '', // Пароль не заполняется автоматически
    });
    const posts = await fetchPostsByUsername(user.username);
    setUserPosts(posts || []);
  };

  const handleSaveUserChanges = async () => {
    if (!selectedUser) return;
  
    // Получаем обновлённые данные из формы
    const updatedData = {
      username: userData.username,
      email: userData.email,
      role: userData.role,
      password: userData.password,
    };
    console.log(updatedData);
    
    try {
      const updatedUser = await updateUser(selectedUser.id, updatedData);
  
      if (updatedUser) {
        alert('User updated successfully!');
        // Обновляем список пользователей после успешного изменения
        loadUsers(currentPage);
      } else {
        alert('Failed to update user.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('An error occurred while updating the user.');
    }
  };

  // Обработчики изменения полей формы
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Обработчик изменения полей формы пользователя
  const handleUserInputChange = (field: keyof UserFormData, value: string) => {
    setUserData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleTagsChange = (selectedTags: Tag[]) => {
    setFormData((prevData) => ({
      ...prevData,
      tags: selectedTags,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Добавить логику отправки данных на сервер
  };

  const handleUpdatePost = (post: formData) => {
    console.log('Updating post:', post);
  };

  const handleDeletePost = async (postId: number) => {
      try {
        // Вызываем API для удаления поста
        await deletePostApi(postId);
    
        // Опционально: показать уведомление об успешном удалении
        alert('Post deleted successfully!');
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete the post.');
      }
    };

  // Если роль ещё не определена, показываем загрузочный экран
  if (role === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Хедер */}
      <Header />

      {/* Основная форма */}
      <div className="container mx-auto px-8 py-8 grid grid-cols-3 gap-8">
        {/* Левая часть: Поиск и список пользователей */}
        <div className="bg-gray-800 p-4 rounded-lg space-y-4">
          <h2 className="text-lg font-semibold">Search User</h2>
          <div className="flex justify-center items-center space-x-2">
            <InputField
              label=""
              type="text"
              value={searchTerm}
              onChange={(value) => setSearchTerm(value)}
              className=""
            />
            <Button onClick={handleSearch} className="bg-blue-500 text-white hover:bg-blue-600">
              Find
            </Button>
          </div>

          <h2 className="text-lg font-semibold">User List</h2>
          <ul className="space-y-2 overflow-y-auto max-h-64">
            {users.map((user) => (
              <li
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className={`cursor-pointer p-2 rounded ${
                  selectedUser?.id === user.id ? 'bg-gray-700' : 'hover:bg-gray-600'
                }`}
              >
                {user.username} ({user.email})
              </li>
            ))}
          </ul>

          {/* Кнопки пагинации */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
              disabled={currentPage === 0}
              className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-gray-300">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Средняя часть: Редактирование данных пользователя */}
        <div className="bg-gray-800 p-4 rounded-lg space-y-4">
          <h2 className="text-lg font-semibold">Edit User</h2>
          {selectedUser && (
            <>
              <InputField
                label="Username"
                type="text"
                value={userData.username}
                onChange={(value) => handleUserInputChange('username', value)}
              />
              <InputField
                label="Email"
                type="email"
                value={userData.email}
                onChange={(value) => handleUserInputChange('email', value)}
              />
              <SelectField
                label="Role"
                options={[
                  { value: 'USER', label: 'User' },
                  { value: 'MODERATOR', label: 'Moderator' },
                ]}
                value={userData.role}
                onChange={(value) => handleUserInputChange('role', value)}
              />
              <InputField
                label="Password"
                type="text"
                value={userData.password}
                onChange={(value) => handleUserInputChange('password', value)}
              />
              <Button
                onClick={handleSaveUserChanges}
                className="bg-green-500 text-white hover:bg-green-600"
              >
                Save Changes
              </Button>
            </>
          )}
        </div>

        {/* Правая часть: Список постов пользователя */}
        <div className="bg-gray-800 p-4 rounded-lg space-y-4">
          <h2 className="text-lg font-semibold">User Posts</h2>
          <ul className="space-y-2 overflow-y-auto max-h-64">
            {userPosts.map((post) => (
              <li
                key={post.id}
                onClick={() => {
                  const selectedLanguage = languages.find(lang => lang.name === post.languageName)?.name || '';
                  const tagObjects = post.tags.map(tagName =>
                    tags.find(tag => tag.name === tagName) || { id: -1, name: tagName }
                  );
                  setFormData({
                    id: post.id,
                    title: post.title,
                    language: selectedLanguage, // <--- сохраняем languageName
                    code: post.content,
                    privacy: post.visibility,
                    tags: tagObjects, // <--- позже добавим логику тегов
                  });
                }}
                className="p-2 rounded bg-gray-700 cursor-pointer"
              >
                <h3 className="font-medium">{post.title}</h3>
                <p className="text-xs text-gray-400">
                  Language: {post.languageName}, Tags: {post.tags.join(', ')}, Visibility: {post.visibility}
                </p>
                <p className="text-xs text-gray-400">{post.createdAt}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Форма для редактирования поста */}
      <div className="container mx-auto px-8 py-8">
        <h2 className="text-lg font-semibold mb-4">Edit Post</h2>
        <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg space-y-4">
          {/* Заголовок */}
          <InputField
            label="Title"
            type="text"
            value={formData.title}
            onChange={(value) => handleInputChange('title', value)}
          />

          {/* Язык программирования */}
          <SelectField
            label="Programming Language"
            options={languages.map(({ name }) => ({
              value: name,
              label: name,
            }))}
            value={formData.language}
            onChange={(value) => handleInputChange('language', value)}
          />

          {/* Код */}
          <TextArea
            label="Code"
            value={formData.code}
            onChange={(value) => handleInputChange('code', value)}
            placeholder="Provide your code here..."
          />

          {/* Теги */}
          <TagInput
            label="Tags"
            tags={formData.tags}
            availableTags={tags} // Передаем все теги из состояния
            onTagsChange={handleTagsChange}
          />

          {/* Настройки приватности */}
          <div className="mb-4 flex items-center">
            <span className="mr-2">Privacy:</span>
            <button
              type="button"
              onClick={() => handleInputChange('privacy', 'PUBLIC')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                formData.privacy === 'PUBLIC'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              } transition-colors duration-200 mr-2`}
            >
              Public
            </button>
            <button
              type="button"
              onClick={() => handleInputChange('privacy', 'PRIVATE')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                formData.privacy === 'PRIVATE'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              } transition-colors duration-200`}
            >
              Private
            </button>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end space-x-4 mt-6">
            {/* Кнопка Update Post */}
            <Button
              type="button"
              onClick={() => handleUpdatePost(formData)} // Выводим данные поста в консоль
              className="bg-gray-700 text-gray-300 hover:bg-gray-600"
            >
              Update Post
            </Button>
            {/* Кнопка Delete Post */}
            <Button
              type="submit"
              onClick={() => handleDeletePost(formData.id)} // Удаляем пост
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete Post
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}