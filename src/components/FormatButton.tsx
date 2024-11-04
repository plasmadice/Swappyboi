import React from 'react';
import { ImageIcon } from 'lucide-react';

interface FormatButtonProps {
  format: string;
  selected: boolean;
  onClick: () => void;
  isDark: boolean;
}

export function FormatButton({ format, selected, onClick, isDark }: FormatButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
        ${selected
          ? isDark
            ? 'bg-blue-500 text-white'
            : 'bg-blue-600 text-white'
          : isDark
            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
    >
      <span className="uppercase">{format}</span>
    </button>
  );
}