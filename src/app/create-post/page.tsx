// app/create-post/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth'; // Импортируем хук для проверки аутентификации
import { fetchTags } from '@/api/tagsApi'; // Импортируем функцию для получения тегов
import { fetchLanguages } from '@/api/languagesApi'; // Импортируем функцию для получения языков
import { createPost } from '@/api/postsApi'; // Импортируем функцию для создания поста
import { Header } from '@/components/Header';
import { Button } from '@/components/Button'; // Компонент кнопки
import { InputField } from '@/components/InputField'; // Компонент поля ввода
import { SelectField } from '@/components/SelectField'; // Компонент выпадающего списка
import { TextArea } from '@/components/TextArea'; // Компонент текстового поля
import { TagInput } from '@/components/TagInput'; // Компонент для ввода тегов

interface Language {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

export default function CreatePostPage() {
  const { isAuthenticated } = useAuth(); // Проверяем аутентификацию
  const [tags, setTags] = useState<Tag[]>([]); // Состояние для доступных тегов
  const [languages, setLanguages] = useState<Language[]>([]); // Состояние для доступных языков

  // Состояние для данных формы
  const [formData, setFormData] = useState({
    title: '',
    language: '', // Выбранное значение языка (id)
    code: 'function greet() {\n  console.log("Hello, world!");\n}',
    privacy: 'PUBLIC', // Значение по умолчанию
    tags: [] as Tag[], // Массив выбранных тегов
    userId: null as number | null, // ID пользователя
  });

  // Получаем данные пользователя из localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setFormData((prevData) => ({
        ...prevData,
        userId: userData.id, // Добавляем ID пользователя в formData
      }));
    }
  }, []);

  // Получаем список тегов с сервера
  useEffect(() => {
    const loadTags = async () => {
      try {
        const tagsData = await fetchTags(); // Используем функцию из tagsApi
        setTags(tagsData); // Сохраняем список тегов
      } catch (error) {
        console.error('Error loading tags:', error);
      }
    };

    loadTags();
  }, []);

  // Получаем список языков программирования с сервера
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const languagesData = await fetchLanguages(); // Используем функцию из languagesApi
        setLanguages(languagesData); // Сохраняем список языков
      } catch (error) {
        console.error('Error loading languages:', error);
      }
    };

    loadLanguages();
  }, []);

  // Обработчик изменения полей формы
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Обработчик добавления/удаления тегов
  const handleTagsChange = (selectedTags: Tag[]) => {
    setFormData((prevData) => ({
      ...prevData,
      tags: selectedTags,
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Проверка, что userId существует
    if (!formData.userId) {
      console.error('User ID is missing. Please log in again.');
      return;
    }

    // Преобразуем данные формы в требуемый формат
    const postData = {
      title: formData.title,
      content: formData.code, // Поле "code" переименовано в "content"
      tagIds: formData.tags.map((tag) => tag.id), // Извлекаем только ID тегов
      languageId: Number(formData.language) + 1, // Преобразуем язык в число
      userId: formData.userId, // Убедитесь, что userId не null
      visibility: formData.privacy, // Поле "privacy" переименовано в "visibility"
    };

    // Логируем преобразованные данные
    console.group('Formatted Form Data'); // Группируем логи для удобства
    console.log(postData);
    console.groupEnd(); // Закрываем группу

    // Отправляем данные на сервер
    try {
      const result = await createPost(postData); // Используем функцию из postsApi
      console.log('Post created successfully:', result);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>You need to be logged in to create a post.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Хедер */}
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl mb-4">Create Post</h1>

        <form onSubmit={handleSubmit} className="bg-[#2D2D2D] p-4 rounded-lg bg-gray-800">
          {/* Заголовок */}
          <InputField
            label="Title"
            type="text"
            value={formData.title}
            onChange={(value) => handleInputChange('title', value)}
            className='mt-2 mb-2'
          />

          {/* Язык программирования */}
          <SelectField
            label="Programming Language"
            options={languages.map(({ id, name }) => ({ value: id.toString(), label: name }))} // Преобразуем языки в формат для SelectField
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
            availableTags={tags} // Передаём доступные теги
            onTagsChange={handleTagsChange}
          />

          {/* Настройки приватности */}
          <div className="mb-4 flex items-center">
            <span className="mr-2">Privacy:</span>

            {/* Кнопка Public */}
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

            {/* Кнопка Private */}
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
            <Button
              type="button"
              onClick={() => console.log('Save Draft')}
              className="bg-gray-700 text-gray-300 hover:bg-gray-600"
            >
              Save Draft
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Publish
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}