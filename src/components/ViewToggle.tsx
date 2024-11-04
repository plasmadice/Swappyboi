import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { ViewMode } from '../types';

interface ViewToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
  return (
    <div className="flex bg-gray-100 p-1 rounded-lg">
      <button
        onClick={() => onChange('list')}
        className={`p-2 rounded ${
          viewMode === 'list'
            ? 'bg-white shadow text-blue-600'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => onChange('grid')}
        className={`p-2 rounded ${
          viewMode === 'grid'
            ? 'bg-white shadow text-blue-600'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
    </div>
  );
}