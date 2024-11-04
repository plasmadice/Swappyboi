import React from 'react';
import { Download, Trash2, AlertCircle } from 'lucide-react';
import { ConvertedImage } from '../types';

interface ImagePreviewProps {
  image: ConvertedImage;
  onRemove: (id: string) => void;
}

export function ImagePreview({ image, onRemove }: ImagePreviewProps) {
  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-square relative">
        <img
          src={image.preview}
          alt={image.originalFile.name}
          className="w-full h-full object-cover"
        />
        {image.status === 'converting' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {image.status === 'error' && (
          <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-white" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <p className="text-sm font-medium truncate mb-2" title={image.originalFile.name}>
          {image.originalFile.name}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {image.status === 'done' 
              ? `Converted to ${image.format.toUpperCase()}`
              : image.status.charAt(0).toUpperCase() + image.status.slice(1)}
          </span>
          
          <div className="flex gap-2">
            {image.status === 'done' && (
              <a
                href={image.convertedUrl}
                download={`converted-${image.originalFile.name}.${image.format}`}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              >
                <Download className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={() => onRemove(image.id)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {image.status === 'converting' && (
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${image.progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}