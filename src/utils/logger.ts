/**
 * Secure logging utility that only logs in development mode.
 * Prevents sensitive information from being exposed in production console.
 * 
 * Usage:
 * import { logger } from '@/utils/logger';
 * logger.error('Operation failed');
 * logger.warn('Warning message');
 * logger.info('Info message');
 */

const isDev = import.meta.env.DEV;

export const logger = {
  /**
   * Log error messages - only in development mode
   */
  error: (message: string, ...args: unknown[]): void => {
    if (isDev) {
      console.error(message, ...args);
    }
    // In production, errors should go to a monitoring service like Sentry
    // This is where you would integrate error tracking
  },

  /**
   * Log warning messages - only in development mode
   */
  warn: (message: string, ...args: unknown[]): void => {
    if (isDev) {
      console.warn(message, ...args);
    }
  },

  /**
   * Log info messages - only in development mode
   */
  info: (message: string, ...args: unknown[]): void => {
    if (isDev) {
      console.log(message, ...args);
    }
  },

  /**
   * Log debug messages - only in development mode
   */
  debug: (message: string, ...args: unknown[]): void => {
    if (isDev) {
      console.debug(message, ...args);
    }
  },
};
