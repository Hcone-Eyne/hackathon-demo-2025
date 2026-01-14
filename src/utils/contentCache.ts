import { logger } from "@/utils/logger";

const CACHE_NAME = 'dbt-content-cache-v1';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

interface CachedContent {
  data: any;
  timestamp: number;
}

export const contentCache = {
  async set(key: string, data: any): Promise<void> {
    const cacheData: CachedContent = {
      data,
      timestamp: Date.now(),
    };
    
    try {
      localStorage.setItem(`${CACHE_NAME}:${key}`, JSON.stringify(cacheData));
    } catch (error) {
      logger.warn('Failed to cache content:', error);
    }
  },

  async get(key: string): Promise<any | null> {
    try {
      const cached = localStorage.getItem(`${CACHE_NAME}:${key}`);
      if (!cached) return null;

      const cacheData: CachedContent = JSON.parse(cached);
      
      // Check if cache is expired
      if (Date.now() - cacheData.timestamp > CACHE_EXPIRY) {
        this.remove(key);
        return null;
      }

      return cacheData.data;
    } catch (error) {
      logger.warn('Failed to retrieve cached content:', error);
      return null;
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(`${CACHE_NAME}:${key}`);
    } catch (error) {
      logger.warn('Failed to remove cached content:', error);
    }
  },

  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(`${CACHE_NAME}:`)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      logger.warn('Failed to clear cache:', error);
    }
  },

  async getCacheSize(): Promise<number> {
    let size = 0;
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(`${CACHE_NAME}:`)) {
          const item = localStorage.getItem(key);
          if (item) {
            size += item.length;
          }
        }
      });
    } catch (error) {
      logger.warn('Failed to calculate cache size:', error);
    }
    return size;
  },
};
