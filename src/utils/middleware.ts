// src/middleware.ts

import { NextResponse, NextRequest } from 'next/server';
import { getToken } from '@/utils/authUtils';

export async function middleware(request: NextRequest) {
  const token = getToken(); // Проверяем наличие токена в куках
  console.log('Middleware executed. Token:', token); // Логируем токен

  const protectedPaths = ['/dashboard']; // Список защищённых путей
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !token) {
    console.log('Redirecting to /auth'); // Логируем перенаправление
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (!isProtectedPath && token) {
    console.log('Redirecting to /dashboard'); // Логируем перенаправление
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth', '/dashboard'], // Мидлвар применяется только к этим путям
};