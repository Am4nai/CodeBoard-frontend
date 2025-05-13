'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { InputField } from '@/components/InputField';
import { SocialButton } from '@/components/SocialButton';
import { FormError } from '@/components/FormError';
import { registerUser, RegisterRequest } from '@/api/auth';
import { loginUser } from '@/api/auth'; // Импортируем функцию авторизации
import { saveToken } from '@/utils/authUtils'; // Управление куки
import { useAuth } from '@/hooks/useAuth'; // Хук для проверки аутентификации

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialFormData: FormData = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function AuthPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth(); // Используем хук для проверки аутентификации
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(true); // true - регистрация, false - вход
  const [formError, setFormError] = useState<string | null>(null);

  // Перенаправление — внутри useEffect
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Проверка заполненности полей
    if (
      !formData.email ||
      !formData.password ||
      (isRegisterMode && (!formData.username || !formData.confirmPassword))
    ) {
      setFormError('All fields are required.');
      return;
    }

    if (isRegisterMode && !passwordsMatch) {
      setFormError('Passwords do not match.');
      return;
    }

    try {
      let response;

      if (isRegisterMode) {
        // Режим регистрации
        const registrationData: RegisterRequest = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        };

        response = await registerUser(registrationData);
      } else {
        // Режим входа
        response = await loginUser({
          usernameOrEmail: formData.email, // Используем email для входа
          password: formData.password,
        });
      }

      // Сохраняем токен в куки
      saveToken(response.token);

      // Сохраняем данные пользователя в localStorage
      localStorage.setItem('user', JSON.stringify(response.user));

      // Переход на dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error(isRegisterMode ? 'Registration failed:' : 'Login failed:', error);
      setFormError(
        isRegisterMode
          ? 'Registration failed. Please try again.'
          : 'Invalid credentials. Please try again.'
      );
    }
  };

  // Если проверка ещё не завершена, показываем загрузочный экран
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      {/* Логотип */}
      <div className="flex items-center mb-8">
        <span className="text-green-500">{"[<>]"}</span>
        <h1 className="text-4xl ml-2">CodeBoard</h1>
      </div>

      {/* Заголовок формы */}
      <h2 className="text-3xl mb-4 text-center">
        {isRegisterMode ? 'Sign up to CodeBoard' : 'Log in to CodeBoard'}
      </h2>

      {/* Переключение между логином и регистрацией */}
      <p className="mb-4">
        {isRegisterMode ? 'Already have an account? ' : "Don't have an account? "}
        <a
          href="#"
          className="text-green-500 underline cursor-pointer"
          onClick={() => {
            setIsRegisterMode(!isRegisterMode);
            setFormError(null);
            formData.email = ''
            formData.username = ''
            formData.password = ''
            formData.confirmPassword = ''
          }}
        >
          {isRegisterMode ? 'Log in' : 'Sign up'}
        </a>
      </p>

      {/* Форма */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        {/* Поле Email */}
        <InputField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(value) => handleInputChange('email', value)}
          className='mt-1 mb-2'
        />

        {/* Поле Username (только для регистрации) */}
        {isRegisterMode && (
          <InputField
            label="Username"
            type="text"
            value={formData.username}
            onChange={(value) => handleInputChange('username', value)}
            className='mt-1 mb-2'
          />
        )}

        {/* Поле Password */}
        <InputField
          label="Password"
          type="password"
          value={formData.password}
          onChange={(value) => handleInputChange('password', value)}
          className={isRegisterMode ? 'mt-1 mb-2' : 'mt-1 mb-3'}
        />

        {/* Поле Confirm Password (только для регистрации) */}
        {isRegisterMode && (
          <InputField
            label="Confirm password"
            type="password"
            value={formData.confirmPassword}
            onChange={(value) => handleInputChange('confirmPassword', value)}
            error={!passwordsMatch ? 'Passwords do not match.' : undefined}
            className='mt-1 mb-3'
          />
        )}

        {/* Кнопка Continue */}
        <Button
          type="submit"
          disabled={
            !formData.email ||
            !formData.password ||
            (isRegisterMode &&
              (!formData.username || !formData.confirmPassword || !passwordsMatch))
          }
        >
          Continue
        </Button>

        {/* Кнопка GitHub */}
        <SocialButton
          onClick={() => console.log('Continue with GitHub')}
        />

        {/* Сообщения об ошибках */}
        {formError && <FormError message={formError} />}
      </form>

      {/* Политика */}
      <div className="mt-6 text-sm text-gray-400 text-center">
        By {isRegisterMode ? 'signing up' : 'logging in'}, you agree to our{' '}
        <a href="#" className="text-blue-500 underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="text-blue-500 underline">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}