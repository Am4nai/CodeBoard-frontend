import React from 'react';

interface SwitchProps {
  on: boolean;
  setOn: (value: boolean) => void;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ on, setOn, disabled = false }) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={on}
        onChange={() => setOn(!on)}
        disabled={disabled}
        className="sr-only"
      />
      <div
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
          on ? 'bg-[#50C878]' : 'bg-gray-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div
          className={`absolute top-[2px] left-[2px] w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
            on ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </label>
  );
};