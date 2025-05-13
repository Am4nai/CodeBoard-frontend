'use client';

import React, { useState, useRef, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { fetchPosts } from '@/api/postsApi'; // Импортируем обновлённую функцию
import { PostCard } from '@/components/PostCard';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth'; // Импортируем хук

interface Post {
  id: number;
  title: string;
  content: string;
  languageName: string; // Изменено с "language" на "languageName"
  authorUsername: string; // Изменено с "author" на "authorUsername"
  tags: string[];
  visibility: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { logout, isLoading } = useAuth(); // Используем isLoading
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(-1); // Начинаем с первой страницы (0)
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Флаг для определения, есть ли ещё данные
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Конфигурация колонок для Masonry
  const breakpointColumnsObj = {
    default: 3,
    1280: 3,
    1024: 2,
    640: 1,
  };

  const fetchNextPage = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newPosts = await fetchPosts(currentPage + 1); // Загружаем следующую страницу
      if (newPosts.length === 0) {
        setHasMore(false); // Больше данных нет
      } else {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]); // Добавляем новые посты
        setCurrentPage((prevPage) => prevPage + 1); // Увеличиваем номер страницы
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        console.log('Observer triggered:', entries[0].isIntersecting); // Логируем событие
        if (entries[0].isIntersecting && !loading) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [fetchNextPage, loading]);

  // Если проверка аутентификации ещё не завершена, показываем загрузочный экран
  if (isLoading) {
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

      {/* Кнопка выхода */}
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-md float-right"
        >
          Logout
        </button>
      </div>

      {/* Лента постов с Masonry */}
      <div className="container mx-auto px-4 py-8">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4"
        >
          {posts.map((post) => (
            <div key={post.id} className="mb-4">
              <PostCard post={post} />
            </div>
          ))}
        </Masonry>

        {/* Индикатор загрузки */}
        {loading && (
          <div className="text-center mt-8">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Элемент для отслеживания скролла */}
        {hasMore && <div ref={observerRef} className="h-20" />}
      </div>
    </div>
  );
}