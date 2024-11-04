import React from 'react';
import { Download, Trash2, AlertCircle, FileImage } from 'lucide-react';
import { ConvertedImage } from '../types';
import { ConvertMenu } from './ConvertMenu';
import { removeExtension } from '../utils/fileUtils';

interface ListViewProps {
  images: ConvertedImage[];
  onRemove: (id: string) => void;
  onConvertTo: (id: string, format: string) => void;
  isDark: boolean;
}

export function ListView({
  images,
  onRemove,
  onConvertTo,
  isDark,
}: ListViewProps) {
  return (
    <div
      className={`rounded-xl shadow-sm 
      ${isDark ? 'bg-gray-800' : 'bg-white'}`}
    >
      <table className="min-w-full divide-y divide-gray-200">
        <thead className={isDark ? 'bg-gray-900' : 'bg-gray-50'}>
          <tr>
            <th
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
              ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              File
            </th>
            <th
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
              ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              Status
            </th>
            <th
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
              ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              Format
            </th>
            <th
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
              ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              Original Size
            </th>
            <th
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
              ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              New Size
            </th>
            <th
              className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider
              ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody
          className={`divide-y ${
            isDark ? 'divide-gray-700' : 'divide-gray-200'
          }`}
        >
          {images.map((image) => {
            const originalFormat = image.originalFile.type.split('/')[1];
            const isSkipped = image.status === 'done' && originalFormat === image.format;

            return (
              <tr
                key={image.id}
                className={`${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
                ${
                  image.parentId
                    ? isDark
                      ? 'bg-gray-750 bg-opacity-50'
                      : 'bg-blue-50 bg-opacity-25'
                    : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`flex items-center ${
                      image.parentId ? 'pl-8' : ''
                    }`}
                  >
                    <FileImage
                      className={`w-5 h-5 mr-3 ${
                        isDark ? 'text-gray-400' : 'text-gray-400'
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isDark ? 'text-gray-200' : 'text-gray-900'
                      }`}
                    >
                      {removeExtension(image.originalFile.name)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {image.status === 'converting' ? (
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${image.progress}%` }}
                        />
                      </div>
                      <span
                        className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {image.progress}%
                      </span>
                    </div>
                  ) : (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        isSkipped
                          ? isDark
                            ? 'bg-gray-700 text-gray-200'
                            : 'bg-gray-100 text-gray-800'
                          : image.status === 'done'
                          ? isDark
                            ? 'bg-green-900 text-green-200'
                            : 'bg-green-100 text-green-800'
                          : image.status === 'error'
                          ? isDark
                            ? 'bg-red-900 text-red-200'
                            : 'bg-red-100 text-red-800'
                          : isDark
                          ? 'bg-gray-700 text-gray-200'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {isSkipped
                        ? 'Skipped'
                        : image.status.charAt(0).toUpperCase() +
                          image.status.slice(1)}
                    </span>
                  )}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {image.format.toUpperCase()}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {`${(image.originalSize / 1024).toFixed(1)} KB`}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {image.size
                    ? `${(image.size / 1024).toFixed(1)} KB`
                    : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {image.status === 'done' && (
                      <>
                        <a
                          href={image.convertedUrl}
                          download={`${removeExtension(
                            image.originalFile.name
                          )}.${image.format}`}
                          className={`p-1.5 rounded-full transition-colors
                            ${
                              isDark
                                ? 'text-blue-400 hover:bg-gray-700'
                                : 'text-blue-600 hover:bg-blue-50'
                            }`}
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        {!image.parentId && (
                          <ConvertMenu
                            onConvert={(format) =>
                              onConvertTo(image.id, format)
                            }
                            currentFormat={image.format}
                            isDark={isDark}
                          />
                        )}
                      </>
                    )}
                    <button
                      onClick={() => onRemove(image.id)}
                      className={`p-1.5 rounded-full transition-colors
                        ${
                          isDark
                            ? 'text-red-400 hover:bg-gray-700'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}