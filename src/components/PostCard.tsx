import React from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  content: string;
  languageName: string;
  authorUsername: string;
  tags: string[];
  visibility: string;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  isCurrentUser?: boolean; // Флаг, указывающий, является ли текущий пользователь автором
  onDelete?: (post: Post) => void; // Функция для удаления поста
}

export const PostCard: React.FC<PostCardProps> = ({ post, isCurrentUser = false, onDelete }) => {
  return (
    <div className="bg-gray-800 text-white rounded-md p-4 transition-shadow hover:shadow-lg relative">
      {/* Кнопка удаления */}
      {isCurrentUser && onDelete && (
        <button
          onClick={() => onDelete(post)}
          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded-md hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      )}

      <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
      <div className="text-sm whitespace-pre-wrap break-words mb-4">
        {post.content}
      </div>
      <footer className="flex items-center justify-between">
        {/* Информация об авторе */}
        <div className="flex items-center">
          {/* Аватар с переходом на профиль */}
          <Link href={`/profile/${post.authorUsername}`}>
            <img
              src="https://randomuser.me/api/portraits/men/3.jpg "
              alt={`${post.authorUsername} avatar`}
              className="w-8 h-8 rounded-full mr-2 cursor-pointer"
            />
          </Link>

          {/* Имя автора с переходом на профиль */}
          <Link href={`/profile/${post.authorUsername}`} className="cursor-pointer hover:underline">
            {post.authorUsername}
          </Link>
        </div>

        {/* Лайки и комментарии */}
        <div className="flex items-center space-x-2">
          {/* Лайки */}
          <button className="text-green-500 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M11.5 7l-5 5v4h20v-4l-5-5z" />
            </svg>
            <span className="ml-1">0</span>
          </button>

          {/* Комментарии */}
          <button className="text-blue-500 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 3v14l-6-6H4V4h16zM8 16h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z" />
            </svg>
            <span className="ml-1">0</span>
          </button>
        </div>
      </footer>
    </div>
  );
};