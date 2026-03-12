import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { api } from '../api';
import { STORAGE_KEYS } from '../config';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const token = await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN);
            const storedUser = await SecureStore.getItemAsync(STORAGE_KEYS.USER);

            if (token && storedUser) {
                try {
                    const decoded = jwtDecode(token);
                    if (decoded.exp * 1000 < Date.now()) {
                        await performLogout();
                    } else {
                        setUser(JSON.parse(storedUser));
                    }
                } catch (e) {
                    await performLogout();
                }
            }
        } catch (e) {
            console.error('Failed to load user from storage', e);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const data = await api.login(email, password);
            const { access_token, user: userData } = data;

            await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, access_token);
            await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(userData));
            setUser(userData);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (email, password, fullName, otp) => {
        try {
            const data = await api.register(email, password, fullName, otp);
            const { access_token, user: userData } = data;

            await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, access_token);
            await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(userData));
            setUser(userData);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const requestOTP = async (email) => {
        try {
            await api.requestOTP(email);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const forgotPassword = async (email) => {
        try {
            await api.forgotPassword(email);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const resetPassword = async (email, otp, newPassword) => {
        try {
            await api.resetPassword(email, otp, newPassword);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const performLogout = async () => {
        try {
            await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN);
            await SecureStore.deleteItemAsync(STORAGE_KEYS.USER);
        } catch (e) {
            // ignore
        }
        setUser(null);
    };

    const logout = () => {
        performLogout();
    };

    return (
        <AuthContext.Provider value={{ user, login, register, requestOTP, forgotPassword, resetPassword, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
