import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface DropZoneProps {
  onDrop: (files: File[]) => void;
}

export function DropZone({ onDrop }: DropZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full p-8 border-2 border-dashed rounded-xl transition-colors duration-200 ease-in-out cursor-pointer
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center text-gray-600">
        <Upload className="w-12 h-12 mb-4 text-gray-400" />
        <p className="text-lg font-medium mb-2">
          {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
        </p>
        <p className="text-sm text-gray-500">
          or click to select files
        </p>
      </div>
    </div>
  );
}