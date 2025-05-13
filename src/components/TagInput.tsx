// components/TagInput.tsx

import React, { useState } from 'react';

interface Tag {
  id: number;
  name: string;
}

interface TagInputProps {
  label: string;
  tags: Tag[]; // Выбранные теги
  availableTags: Tag[]; // Доступные теги
  onTagsChange: (tags: Tag[]) => void; // Обработчик изменения тегов
}

export const TagInput: React.FC<TagInputProps> = ({
  label,
  tags,
  availableTags,
  onTagsChange,
}) => {
  const [inputValue, setInputValue] = useState(''); // Текущее значение поля ввода
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Состояние выпадающего списка
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние модального окна
  const [modalInputValue, setModalInputValue] = useState(''); // Значение поля ввода в модальном окне

  // Фильтрация доступных тегов по введённому тексту
  const filteredTags = availableTags.filter((tag) =>
    tag.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Обработчик добавления тега
  const handleAddTag = (tag: Tag) => {
    if (!tags.some((t) => t.id === tag.id)) {
      onTagsChange([...tags, tag]);
      setInputValue('');
      setIsDropdownOpen(false);
    }
  };

  // Обработчик удаления тега
  const handleRemoveTag = (tagToRemove: Tag) => {
    onTagsChange(tags.filter((tag) => tag.id !== tagToRemove.id));
  };

  return (
    <div className="mb-4">
      <label htmlFor={label} className="block mb-2 text-sm font-medium text-gray-300">
        {label}
      </label>

      {/* Выбранные теги */}
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center px-2 py-1 bg-gray-700 text-white rounded-md"
          >
            {tag.name}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="ml-2 text-red-500 hover:text-red-600"
            >
              &times;
            </button>
          </span>
        ))}
      </div>

      {/* Поле поиска и выпадающий список */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} // Задержка для кликов внутри списка
          placeholder="Search or add a tag..."
          className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:border-blue-500 bg-gray-800"
        />

        {/* Выпадающий список */}
        {isDropdownOpen && filteredTags.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto bg-gray-800 border border-gray-500 rounded-md shadow-lg">
            {/* Кнопка добавления нового тега */}
            <li
              className="px-3 py-2 cursor-pointer hover:bg-gray-700 flex items-center"
              onClick={() => {
                setIsModalOpen(true);
                setIsDropdownOpen(false);
              }} // Открываем модальное окно
            >
              <span className="text-green-500 mr-2">+</span>
              Add new tag
            </li>

            {/* Доступные теги */}
            {filteredTags.map((tag) => (
              <li
                key={tag.id}
                className="px-3 py-2 cursor-pointer hover:bg-gray-700"
                onClick={() => handleAddTag(tag)}
              >
                {tag.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2D2D2D] p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-medium text-white mb-4">Add New Tag</h2>
            <input
              type="text"
              value={modalInputValue}
              onChange={(e) => setModalInputValue(e.target.value)}
              placeholder="Enter new tag..."
              className="w-full p-2 mb-4 border border-gray-500 rounded-md focus:outline-none focus:border-blue-500 bg-[#2D2D2D] text-white"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setModalInputValue('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (modalInputValue.trim()) {
                    const newTag = { id: Date.now(), name: modalInputValue.trim() }; // Создаём новый тег
                    handleAddTag(newTag);
                    setIsModalOpen(false);
                    setModalInputValue('');
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
                disabled={!modalInputValue.trim()}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};