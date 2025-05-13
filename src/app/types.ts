// types.ts
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'MODERATOR';
  createdAt: string; // формат ISO Date
}

export interface Post {
  id: number;
  title: string;
  content: string;
  languageName: string; // Изменено с "language" на "languageName"
  authorUsername: string; // Изменено с "author" на "authorUsername"
  tags: string[];
  visibility: string;
  createdAt: string;
}