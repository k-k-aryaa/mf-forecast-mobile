import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ProcessingState from './ProcessingState';

const EstimateCard = ({ fundId }) => {
    const { colors } = useTheme();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data, isLoading, isFetching, error, refetch } = useQuery({
        queryKey: ['detailedEstimate', fundId],
        queryFn: () => api.getDetailedEstimate(fundId),
        enabled: !!fundId,
        refetchInterval: 30000,
    });

    const { data: favorites } = useQuery({
        queryKey: ['favorites'],
        queryFn: api.getFavorites,
        enabled: !!user,
        staleTime: 60000,
    });

    const isFavorited = favorites?.some(f => f.id === fundId);

    const addFav = useMutation({
        mutationFn: () => api.addFavorite(fundId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
    });

    const removeFav = useMutation({
        mutationFn: () => api.removeFavorite(fundId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
    });

    const toggleFavorite = () => {
        if (!user) return;
        if (isFavorited) removeFav.mutate();
        else addFav.mutate();
    };

    const [aiThinking, setAiThinking] = useState(true);

    useEffect(() => {
        setAiThinking(true);
        const delay = Math.random() * 2500 + 500;
        const timer = setTimeout(() => setAiThinking(false), delay);
        return () => clearTimeout(timer);
    }, [fundId]);

    const handleRefresh = async () => {
        setAiThinking(true);
        const delay = Math.random() * 2500 + 500;
        const delayPromise = new Promise(resolve => setTimeout(resolve, delay));
        try {
            await Promise.all([refetch(), delayPromise]);
        } catch (err) {
            console.error('Refresh failed', err);
        } finally {
            setAiThinking(false);
        }
    };

    if (isLoading || aiThinking) {
        return <ProcessingState />;
    }

    if (error) {
        return (
            <View style={[styles.card, { backgroundColor: colors.accentRedDim, borderColor: colors.accentRed }]}>
                <Text style={{ fontSize: 24, textAlign: 'center' }}>⚠️</Text>
                <Text style={[styles.errorText, { color: colors.accentRed }]}>Signal Lost</Text>
            </View>
        );
    }

    if (!data) return <ProcessingState />;

    const isPositive = data.estimated_return_pct >= 0;

    return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderPrimary }]}>
            <View style={styles.topRow}>
                <View style={styles.badgeRow}>
                    {user && (
                        <TouchableOpacity onPress={toggleFavorite} style={styles.favBtn}>
                            <Ionicons
                                name={isFavorited ? 'heart' : 'heart-outline'}
                                size={18}
                                color={isFavorited ? colors.accentRed : colors.textMuted}
                            />
                        </TouchableOpacity>
                    )}
                    <Text style={[styles.badgeLabel, { color: colors.accentNeonGreen }]}>LIVE FORECAST</Text>
                    <View style={[styles.liveDot, {
                        backgroundColor: colors.accentNeonGreen,
                        shadowColor: colors.accentNeonGreen,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.8,
                        shadowRadius: 4,
                        elevation: 4,
                    }]} />
                </View>
                <TouchableOpacity
                    style={[styles.refreshBtn, { backgroundColor: colors.primaryDim, borderColor: colors.borderGlow }]}
                    onPress={handleRefresh}
                    disabled={isFetching}
                >
                    <Text style={[styles.refreshText, { color: colors.primary }]}>
                        {isFetching ? 'Syncing...' : 'Refresh'}
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={[styles.fundName, { color: colors.textPrimary }]} numberOfLines={2}>
                {data.scheme_name}
            </Text>

            <View style={styles.heroSection}>
                <Text style={[styles.heroPercent, { color: isPositive ? colors.accentGreen : colors.accentRed }]}>
                    {isPositive ? '+' : ''}{data.estimated_return_pct?.toFixed(2) ?? '0.00'}%
                </Text>
            </View>

            <View style={styles.navGrid}>
                <View style={[styles.navBox, { backgroundColor: colors.primaryDim, borderColor: colors.borderGlow }]}>
                    <Text style={[styles.navLabel, { color: colors.textMuted }]}>Predicted NAV</Text>
                    <Text style={[styles.navValue, { color: colors.textPrimary }]}>₹{data.estimated_nav?.toFixed(2) ?? '-'}</Text>
                </View>
                <View style={[styles.navBox, { backgroundColor: colors.surfaceHoverOverlay, borderColor: colors.borderPrimary }]}>
                    <Text style={[styles.navLabel, { color: colors.textMuted }]}>Previous</Text>
                    <Text style={[styles.navValue, { color: colors.textSecondary }]}>₹{data.previous_nav?.toFixed(2) ?? '-'}</Text>
                </View>
            </View>

            <View style={[styles.metricsRow, { borderTopColor: colors.borderPrimary }]}>
                <View style={styles.metric}>
                    <Text style={[styles.metricLabel, { color: colors.textMuted }]}>CONFIDENCE</Text>
                    <View style={styles.progressRow}>
                        <View style={[styles.progressBg, { backgroundColor: colors.borderPrimary }]}>
                            <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${data.confidence?.price_coverage_pct ?? 0}%` }]} />
                        </View>
                        <Text style={[styles.metricValue, { color: colors.primary }]}>{data.confidence?.score ?? 'N/A'}</Text>
                    </View>
                </View>
                <View style={styles.metric}>
                    <Text style={[styles.metricLabel, { color: colors.textMuted }]}>MARKET COVERAGE</Text>
                    <Text style={[styles.metricValue, { color: colors.textSecondary }]}>
                        {data.confidence?.price_coverage_pct?.toFixed(0) ?? '-'}% Assets Live
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    badgeLabel: {
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    favBtn: {
        padding: 2,
        marginRight: 4,
    },
    refreshBtn: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
    },
    refreshText: {
        fontSize: 10,
        fontWeight: '700',
    },
    fundName: {
        fontSize: 13,
        fontWeight: '600',
        fontFamily: 'monospace',
        marginBottom: 12,
    },
    heroSection: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    heroPercent: {
        fontSize: 36,
        fontWeight: '800',
        fontFamily: 'monospace',
    },
    navGrid: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 12,
    },
    navBox: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
    },
    navLabel: {
        fontSize: 9,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    navValue: {
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'monospace',
    },
    metricsRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
    },
    metric: {
        flex: 1,
    },
    metricLabel: {
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 6,
    },
    metricValue: {
        fontSize: 11,
        fontFamily: 'monospace',
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    progressBg: {
        height: 4,
        flex: 1,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    errorText: {
        textAlign: 'center',
        fontSize: 12,
        fontFamily: 'monospace',
        marginTop: 8,
    },
});

export default EstimateCard;
