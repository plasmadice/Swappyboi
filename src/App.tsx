import React, { useState, useCallback, useEffect } from 'react';
import { Download, Image as ImageIcon, Trash } from 'lucide-react';
import JSZip from 'jszip';
import imageCompression from 'browser-image-compression';
import { DropZone } from './components/DropZone';
import { ImagePreview } from './components/ImagePreview';
import { ListView } from './components/ListView';
import { ViewToggle } from './components/ViewToggle';
import { FormatSelector } from './components/FormatSelector';
import { ConvertedImage, ViewMode } from './types';
import { useColorScheme } from './hooks/useColorScheme';
import { storage } from './utils/storage';
import { removeExtension } from './utils/fileUtils';

function App() {
  const isDark = useColorScheme();
  const [images, setImages] = useState<ConvertedImage[]>([]);
  const [format, setFormat] = useState<string>('jpeg');
  const [viewMode, setViewMode] = useState<ViewMode>(
    () => storage.get().viewMode
  );

  useEffect(() => {
    storage.set({ viewMode });
  }, [viewMode]);

  const convertImage = async (
    file: File,
    targetFormat: string,
    parentId?: string
  ): Promise<ConvertedImage> => {
    const id = Math.random().toString(36).substr(2, 9);
    const preview = URL.createObjectURL(file);

    const newImage: ConvertedImage = {
      id,
      originalFile: file,
      preview,
      convertedUrl: '',
      progress: 0,
      status: 'converting',
      format: targetFormat,
      originalSize: file.size,
      parentId,
    };

    setImages((prev) => [...prev, newImage]);

    try {
      const options = {
        maxSizeMB: 1,
        useWebWorker: true,
        fileType: `image/${targetFormat}`,
        onProgress: (progress: number) => {
          setImages((prev) =>
            prev.map((img) =>
              img.id === id
                ? { ...img, progress: Math.min(Math.round(progress * 100), 100) }
                : img
            )
          );
        },
      };

      const compressedFile = await imageCompression(file, options);
      const convertedUrl = URL.createObjectURL(compressedFile);

      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? {
                ...img,
                convertedUrl,
                status: 'done',
                progress: 100,
                size: compressedFile.size,
              }
            : img
        )
      );

      return {
        ...newImage,
        convertedUrl,
        status: 'done',
        progress: 100,
        size: compressedFile.size,
      };
    } catch (error) {
      setImages((prev) =>
        prev.map((img) =>
          img.id === id ? { ...img, status: 'error', progress: 0 } : img
        )
      );
      throw error;
    }
  };

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        convertImage(file, format).catch(console.error);
      });
    },
    [format]
  );

  const handleConvertTo = async (imageId: string, newFormat: string) => {
    const image = images.find((img) => img.id === imageId);
    if (!image) return;

    const currentFormat = image.originalFile.type.split('/')[1];
    if (currentFormat === newFormat) {
      const currentSize = image.size || image.originalSize;
      if (currentSize > 1024 * 1024) {
        await convertImage(image.originalFile, newFormat, imageId);
      }
      return;
    }

    await convertImage(image.originalFile, newFormat, imageId);
  };

  const handleRemove = (id: string) => {
    setImages((prev) =>
      prev.filter((img) => img.id !== id && img.parentId !== id)
    );
  };

  const handleClearAll = () => {
    setImages([]);
  };

  const downloadAll = async () => {
    const zip = new JSZip();
    const completedImages = images.filter(
      (img) => img.status === 'done' && !img.parentId
    );

    for (const image of completedImages) {
      const response = await fetch(image.convertedUrl);
      const blob = await response.blob();
      zip.file(
        `${removeExtension(image.originalFile.name)}.${image.format}`,
        blob
      );
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted-images.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors
      ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <ImageIcon
            className={`mx-auto h-12 w-12 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}
          />
          <h1
            className={`mt-4 text-4xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Bulk Image Converter
          </h1>
          <p
            className={`mt-2 text-lg ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Convert your images to different formats with ease
          </p>
        </div>

        <div
          className={`rounded-xl shadow-sm p-6 mb-8 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <FormatSelector
              format={format}
              onFormatChange={setFormat}
              isDark={isDark}
            />

            <div className="flex items-center space-x-4">
              {images.length > 0 && (
                <>
                  <button
                    onClick={handleClearAll}
                    className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md
                      ${
                        isDark
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                      }`}
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Clear All
                  </button>

                  {images.some((img) => img.status === 'done') && (
                    <button
                      onClick={downloadAll}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download All
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <DropZone onDrop={handleDrop} isDark={isDark} />
        </div>

        {images.length > 0 && (
          <div className="mb-4 flex justify-end">
            <ViewToggle
              viewMode={viewMode}
              onChange={setViewMode}
              isDark={isDark}
            />
          </div>
        )}

        {images.length > 0 &&
          (viewMode === 'list' ? (
            <ListView
              images={images}
              onRemove={handleRemove}
              onConvertTo={handleConvertTo}
              isDark={isDark}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image) => (
                <ImagePreview
                  key={image.id}
                  image={image}
                  onRemove={handleRemove}
                  onConvertTo={handleConvertTo}
                  isDark={isDark}
                />
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;