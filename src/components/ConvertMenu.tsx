import React, { useRef } from 'react';
import { MoreVertical } from 'lucide-react';
import { useClickOutside } from '../hooks/useClickOutside';

interface ConvertMenuProps {
  onConvert: (format: string) => void;
  currentFormat: string;
  isDark: boolean;
}

export function ConvertMenu({ onConvert, currentFormat, isDark }: ConvertMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const formats = ['jpeg', 'png', 'webp', 'avif'].filter(f => f !== currentFormat);

  useClickOutside(menuRef, () => setIsOpen(false));

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1.5 rounded-full transition-colors
          ${isDark
            ? 'text-gray-400 hover:bg-gray-700'
            : 'text-gray-600 hover:bg-gray-100'}`}
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      
      {isOpen && (
        <div className={`absolute right-0 mt-1 w-48 rounded-md shadow-lg z-10
          ${isDark ? 'bg-gray-800' : 'bg-white'} ring-1 ring-black ring-opacity-5`}>
          <div className="py-1">
            {formats.map((format) => (
              <button
                key={format}
                onClick={() => {
                  onConvert(format);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm
                  ${isDark
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Convert to {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}