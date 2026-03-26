/**
 * Application Configuration
 * All configurable values are centralized here.
 */

// API Configuration
export const API_BASE_URL = 'https://mfforecast.com/api';

// App Configuration
export const APP_NAME = 'MF Forecast';
export const APP_DESCRIPTION = 'Real-Time Mutual Fund Performance Tracker';

// Market Configuration (NAV cutoff time in IST)
export const NAV_CUTOFF_HOUR = 15;
export const NAV_CUTOFF_MINUTE = 0;

// Data Refresh Intervals (in milliseconds)
export const MARKET_STATUS_REFRESH_INTERVAL = 30000;
export const ESTIMATE_REFRESH_INTERVAL = 60000;
export const MARKET_INDICES_REFRESH_INTERVAL = 60000;

// Local Storage Keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    THEME: 'mf-forecast-theme',
};

export default {
    API_BASE_URL,
    APP_NAME,
    APP_DESCRIPTION,
    NAV_CUTOFF_HOUR,
    NAV_CUTOFF_MINUTE,
    MARKET_STATUS_REFRESH_INTERVAL,
    ESTIMATE_REFRESH_INTERVAL,
    MARKET_INDICES_REFRESH_INTERVAL,
    STORAGE_KEYS,
};
