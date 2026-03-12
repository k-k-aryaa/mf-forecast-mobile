import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 30000,
            refetchOnWindowFocus: false,
        },
    },
});

const AppWithStatusBar = () => {
    const { theme } = useTheme();
    return (
        <>
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
            <AppNavigator />
        </>
    );
};

export default function App() {
    return (
        <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <AuthProvider>
                        <AppWithStatusBar />
                    </AuthProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </SafeAreaProvider>
    );
}
