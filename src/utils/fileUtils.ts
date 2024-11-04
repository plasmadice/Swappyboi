export const removeExtension = (filename: string): string => {
  return filename.replace(/\.[^/.]+$/, '');
};

export const calculateSizeReduction = (originalSize: number, newSize: number): number => {
  const reduction = ((originalSize - newSize) / originalSize) * 100;
  return Math.round(reduction);
};