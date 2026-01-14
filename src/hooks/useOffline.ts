import { useState, useEffect } from 'react';
import { contentCache } from '@/utils/contentCache';
import { logger } from "@/utils/logger";

export function useOffline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedPages, setCachedPages] = useState<string[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load cached pages list
    loadCachedPages();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadCachedPages = async () => {
    try {
      const keys = Object.keys(localStorage);
      const pages = keys
        .filter(key => key.startsWith('dbt-content-cache-v1:'))
        .map(key => key.replace('dbt-content-cache-v1:', ''));
      setCachedPages(pages);
    } catch (error) {
      logger.error('Error loading cached pages:', error);
    }
  };

  const retryConnection = () => {
    // Trigger a network request to check connectivity
    fetch('/manifest.json', { method: 'HEAD', cache: 'no-cache' })
      .then(() => setIsOnline(true))
      .catch(() => setIsOnline(false));
  };

  return {
    isOnline,
    isOffline: !isOnline,
    cachedPages,
    retryConnection,
  };
}
