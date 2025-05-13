// components/ProfileForm.tsx

import React, { useState } from 'react';
import { InputField } from '@/components/InputField'; // Используем существующий компонент InputField
import { Button } from '@/components/Button'; // Используем существующий компонент Button

interface ProfileFormData {
  username: string;
  email: string;
  description: string;
  socialLink: string;
}

export const ProfileForm: React.FC = () => {
  const [formData, setFormData] = useState<ProfileFormData>({
    username: '',
    email: '',
    description: '',
    socialLink: '',
  });

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <div className="bg-[#2D2D2D] p-4 rounded-lg space-y-4">
      {/* Форма профиля */}
      <div className="flex items-start space-x-4">
        {/* Авата́р */}
        <div>
          <img
            src="https://randomuser.me/api/portraits/men/3.jpg "
            alt="User Avatar"
            className="w-20 h-20 rounded-full"
          />
        </div>

        {/* Поля ввода */}
        <div>
          {/* Email */}
          <InputField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => handleInputChange('email', value)}
          />

          {/* Description */}
          <InputField
            label="Description"
            type="text"
            value={formData.description}
            onChange={(value) => handleInputChange('description', value)}
          />

          {/* Social Link */}
          <div className="flex items-center space-x-2">
            <InputField
              label="Social link"
              type="text"
              value={formData.socialLink}
              onChange={(value) => handleInputChange('socialLink', value)}
            />
            <Button
              className="px-4 py-2 bg-[#4A90E2] text-white hover:bg-[#4A90E2]/90"
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};