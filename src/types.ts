export interface ConvertedImage {
  id: string;
  originalFile: File;
  preview: string;
  convertedUrl: string;
  progress: number;
  status: 'pending' | 'converting' | 'done' | 'error';
  format: string;
  size?: number;
  originalSize: number;
  parentId?: string;
}

export type ViewMode = 'list' | 'grid';