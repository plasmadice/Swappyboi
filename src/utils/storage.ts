const STORAGE_KEY = 'image-converter-prefs';

export interface StoragePrefs {
  viewMode: 'list' | 'grid';
}

export const storage = {
  get: (): StoragePrefs => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : { viewMode: 'list' };
    } catch {
      return { viewMode: 'list' };
    }
  },
  
  set: (prefs: StoragePrefs) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }
};