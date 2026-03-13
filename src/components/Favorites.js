import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Favorites = ({ onFundSelect, onLogin }) => {
    const { colors } = useTheme();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const { data: favorites, isLoading, error } = useQuery({
        queryKey: ['favorites'],
        queryFn: api.getFavorites,
        enabled: !!user,
    });

    const removeMutation = useMutation({
        mutationFn: api.removeFavorite,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
    });

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>Watchlist</Text>
                <View style={[styles.loginGate, { backgroundColor: colors.card, borderColor: colors.borderPrimary }]}>
                    <View style={[styles.lockIcon, { backgroundColor: colors.primaryDim }]}>
                        <Ionicons name="lock-closed" size={28} color={colors.primary} />
                    </View>
                    <Text style={[styles.loginTitle, { color: colors.textPrimary }]}>Login Required</Text>
                    <Text style={[styles.loginDesc, { color: colors.textMuted }]}>
                        Please login to view and manage your favorite funds.
                    </Text>
                    <TouchableOpacity style={[styles.loginBtn, { backgroundColor: colors.primary }]} onPress={onLogin}>
                        <Text style={styles.loginBtnText}>Login to Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (isLoading) return <Text style={{ color: colors.textMuted, padding: 20 }}>Loading favorites...</Text>;
    if (error) return <Text style={{ color: colors.accentRed, padding: 20 }}>Error loading favorites</Text>;

    const handleRemove = (fundId) => {
        Alert.alert('Remove Favorite', 'Remove from favorites?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Remove', style: 'destructive', onPress: () => removeMutation.mutate(fundId) },
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>Watchlist</Text>
                    <Text style={[styles.subtitle, { color: colors.textMuted }]}>Track your favorite funds</Text>
                </View>
                <Text style={[styles.count, { color: colors.textMuted }]}>{favorites?.length || 0} ITEMS</Text>
            </View>

            {!favorites?.length ? (
                <View style={[styles.emptyState, { backgroundColor: colors.card, borderColor: colors.borderPrimary }]}>
                    <Ionicons name="heart-dislike-outline" size={32} color={colors.textMuted} />
                    <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Favorites Yet</Text>
                    <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>
                        Start adding mutual funds to your watchlist.
                    </Text>
                    <TouchableOpacity
                        style={[styles.browseBtn, { backgroundColor: colors.primaryDim, borderColor: colors.borderGlow }]}
                        onPress={() => onFundSelect(null)}
                    >
                        <Text style={[styles.browseBtnText, { color: colors.primary }]}>Browse Funds</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => String(item.id)}
                    scrollEnabled={false}
                    renderItem={({ item }) => {
                        const isPositive = (item.day_change_pct || 0) >= 0;
                        return (
                            <View style={[styles.favCard, { backgroundColor: colors.card, borderColor: colors.borderPrimary }]}>
                                <TouchableOpacity style={styles.favInfo} onPress={() => onFundSelect(item.id)}>
                                    <Text style={[styles.favName, { color: colors.textPrimary }]} numberOfLines={2}>
                                        {item.scheme_name}
                                    </Text>
                                    <View style={styles.favStats}>
                                        <Text style={[styles.statLabel, { color: colors.textMuted }]}>Day Change</Text>
                                        <View style={styles.statRow}>
                                            <Ionicons
                                                name={isPositive ? 'trending-up' : 'trending-down'}
                                                size={14}
                                                color={isPositive ? colors.accentGreen : colors.accentRed}
                                            />
                                            <Text style={[styles.statValue, { color: isPositive ? colors.accentGreen : colors.accentRed }]}>
                                                {isPositive ? '+' : ''}{item.day_change_pct?.toFixed(2) ?? '0.00'}%
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.favActions}>
                                    <TouchableOpacity onPress={() => onFundSelect(item.id)} style={styles.actionBtn}>
                                        <Ionicons name="bar-chart" size={16} color={colors.primary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.actionBtn}>
                                        <Ionicons name="heart-dislike" size={16} color={colors.accentRed} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12,
    },
    count: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
    },
    loginGate: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 32,
        alignItems: 'center',
    },
    lockIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    loginTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    loginDesc: {
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 20,
    },
    loginBtn: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 10,
    },
    loginBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    emptyState: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 32,
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 12,
        marginBottom: 4,
    },
    emptyDesc: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 16,
    },
    browseBtn: {
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 10,
        borderWidth: 1,
    },
    browseBtnText: {
        fontSize: 12,
        fontWeight: '700',
    },
    favCard: {
        flexDirection: 'row',
        borderRadius: 12,
        borderWidth: 1,
        padding: 14,
        marginBottom: 8,
    },
    favInfo: {
        flex: 1,
    },
    favName: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
    },
    favStats: {},
    statLabel: {
        fontSize: 9,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    statValue: {
        fontSize: 14,
        fontWeight: '700',
        fontFamily: 'monospace',
    },
    favActions: {
        justifyContent: 'center',
        gap: 8,
    },
    actionBtn: {
        padding: 6,
    },
});

export default Favorites;
