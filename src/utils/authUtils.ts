// src/utils/authUtils.ts

import Cookies from 'js-cookie';

const TOKEN_KEY = 'authToken'; // Имя ключа для хранения токена

export const saveToken = (token: string) => {
  console.log(token);
  
  Cookies.set(TOKEN_KEY, token, {
    expires: 7, // Токен действителен 7 дней
    secure: process.env.NODE_ENV === 'production', // Только для HTTPS в продакшене
    sameSite: 'strict', // Защита от CSRF
  });
};

export const getToken = (): string | undefined => {
  const token = Cookies.get(TOKEN_KEY);
  return token;
};

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};