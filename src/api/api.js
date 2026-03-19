import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS } from './config';

const request = async (endpoint, options = {}) => {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (res.status === 204) {
      return null;
    }

    if (!res.ok) {
      let errorMessage = `API Error: ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch (e) {
        // stick with statusText
      }
      throw new Error(errorMessage);
    }
    const data = await res.json();
    return data;
  } catch (e) {
    throw e;
  }
};

export const api = {
  // Auth
  login: (email, password) =>
    request('/auth/login/json', {
      method: 'POST',
      body: { email, password },
    }),
  register: (email, password, fullName, otp) =>
    request('/auth/register', {
      method: 'POST',
      body: { email, password, full_name: fullName, otp },
    }),
  requestOTP: (email) =>
    request('/auth/request-otp', {
      method: 'POST',
      body: { email },
    }),
  forgotPassword: (email) =>
    request('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    }),
  resetPassword: (email, otp, newPassword) =>
    request('/auth/reset-password', {
      method: 'POST',
      body: { email, otp, new_password: newPassword },
    }),

  // Favorites
  getFavorites: () => request('/favorites/'),
  addFavorite: (fundId) => request(`/favorites/${fundId}`, { method: 'POST' }),
  updateFavorite: (fundId, data) =>
    request(`/favorites/${fundId}`, { method: 'PATCH', body: data }),
  removeFavorite: (fundId) =>
    request(`/favorites/${fundId}`, { method: 'DELETE' }),

  // Funds
  getFunds: () => request('/funds'),
  getFundDetail: (id) => request(`/funds/${id}`),

  // Estimates
  getEstimate: (id) => request(`/estimate/${id}`),
  getDetailedEstimate: (id) => request(`/estimate/${id}`),

  // Market
  getMarketIndices: () => request('/market/indices'),
  getMarketStatus: () => request('/market/status'),

  // NAV History
  getNavHistory: (id, period = '1m') =>
    request(`/funds/${id}/nav-history?period=${period}`),

  // Market History
  getIndexHistory: (symbol, period = '1m') =>
    request(
      `/market/indices/${encodeURIComponent(symbol)}/history?period=${period}`
    ),

  // Holdings
  getHoldings: (id) => request(`/funds/${id}/holdings`),

  // Truth Lens
  getTruthLens: (id, date) =>
    request(`/funds/${id}/truth-lens${date ? `?date=${date}` : ''}`),

  // Holidays
  getHolidays: () => request('/market/holidays'),

  // Health
  getHealth: () => request('/admin/health'),
};

export default api;
