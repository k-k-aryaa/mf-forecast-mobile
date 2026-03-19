/**
 * Application Configuration
 * Ported from mf-forecast-frontend/src/config.js
 */

// API Configuration - use your machine's LAN IP for mobile testing
export const API_BASE_URL = 'http://192.168.1.20:8585';

// App Configuration
export const APP_NAME = 'MF Forecast';
export const APP_DESCRIPTION = 'Real-Time Mutual Fund Performance Tracker';

// Market Configuration
export const NAV_CUTOFF_HOUR = 15;
export const NAV_CUTOFF_MINUTE = 0;

// Data Refresh Intervals (in milliseconds)
export const MARKET_STATUS_REFRESH_INTERVAL = 30000;
export const ESTIMATE_REFRESH_INTERVAL = 60000;
export const MARKET_INDICES_REFRESH_INTERVAL = 60000;

// Storage Keys (for AsyncStorage)
export const STORAGE_KEYS = {
  TOKEN: 'mf-forecast-token',
  USER: 'mf-forecast-user',
  THEME: 'mf-forecast-theme',
};
