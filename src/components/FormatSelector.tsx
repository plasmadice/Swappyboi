import React, { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { FormatButton } from './FormatButton';
import { useClickOutside } from '../hooks/useClickOutside';

interface FormatSelectorProps {
  format: string;
  onFormatChange: (format: string) => void;
  isDark: boolean;
}

export function FormatSelector({ format, onFormatChange, isDark }: FormatSelectorProps) {
  const formats = ['jpeg', 'png', 'webp', 'avif'];
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center space-x-2">
        {formats.map((f) => (
          <FormatButton
            key={f}
            format={f}
            selected={format === f}
            onClick={() => onFormatChange(f)}
            isDark={isDark}
          />
        ))}
      </div>
      
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${isDark 
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
        >
          Convert to {format.toUpperCase()}
          <ChevronDown className="w-4 h-4" />
        </button>
        
        {isDropdownOpen && (
          <div className={`absolute left-0 mt-1 w-48 rounded-md shadow-lg z-20
            ${isDark ? 'bg-gray-800' : 'bg-white'} 
            ring-1 ring-black ring-opacity-5`}
          >
            <div className="py-1">
              {formats.map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    onFormatChange(f);
                    setIsDropdownOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm
                    ${format === f 
                      ? isDark 
                        ? 'bg-gray-700 text-blue-400' 
                        : 'bg-blue-50 text-blue-700'
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Convert to {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}