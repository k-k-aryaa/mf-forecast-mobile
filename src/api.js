import { API_BASE_URL, STORAGE_KEYS } from './config';
import * as SecureStore from 'expo-secure-store';

const API_BASE = API_BASE_URL;

const request = async (endpoint, options = {}) => {
    let token = null;
    try {
        token = await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN);
    } catch (e) {
        // SecureStore might not be available (web)
    }

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
        const res = await fetch(`${API_BASE}${endpoint}`, config);

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
                // stick with statusText if no json body
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
    login: (email, password) => {
        return request('/auth/login/json', {
            method: 'POST',
            body: { email, password }
        });
    },
    register: (email, password, fullName, otp) => {
        return request('/auth/register', {
            method: 'POST',
            body: { email, password, full_name: fullName, otp }
        });
    },
    requestOTP: (email) => {
        return request('/auth/request-otp', {
            method: 'POST',
            body: { email }
        });
    },
    forgotPassword: (email) => {
        return request('/auth/forgot-password', {
            method: 'POST',
            body: { email }
        });
    },
    resetPassword: (email, otp, newPassword) => {
        return request('/auth/reset-password', {
            method: 'POST',
            body: { email, otp, new_password: newPassword }
        });
    },

    // Favorites
    getFavorites: () => request('/favorites/'),
    addFavorite: (fundId) => request(`/favorites/${fundId}`, { method: 'POST' }),
    updateFavorite: (fundId, data) => request(`/favorites/${fundId}`, {
        method: 'PATCH',
        body: data
    }),
    removeFavorite: (fundId) => request(`/favorites/${fundId}`, { method: 'DELETE' }),

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
    getNavHistory: (id, period = '1m') => request(`/funds/${id}/nav-history?period=${period}`),

    // Market History
    getIndexHistory: (symbol, period = '1m') => request(`/market/indices/${encodeURIComponent(symbol)}/history?period=${period}`),

    // Holdings
    getHoldings: (id) => request(`/funds/${id}/holdings`),

    // Truth Lens
    getTruthLens: (id, date) => request(`/funds/${id}/truth-lens${date ? `?date=${date}` : ''}`),

    // Holidays
    getHolidays: () => request('/market/holidays'),

    // Health
    getHealth: () => request('/admin/health'),
};

export default api;
