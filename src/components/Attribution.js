import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { useTheme } from '../context/ThemeContext';

const Attribution = ({ fundId }) => {
    const { colors, theme } = useTheme();

    const { data, isLoading } = useQuery({
        queryKey: ['detailedEstimate', fundId],
        queryFn: () => api.getDetailedEstimate(fundId),
        enabled: !!fundId,
    });

    if (isLoading || !data) {
        return (
            <View style={styles.loadingRow}>
                <View style={[styles.skeleton, { backgroundColor: colors.primaryDim }]} />
                <View style={[styles.skeleton, { backgroundColor: colors.primaryDim }]} />
            </View>
        );
    }

    const { top_gainers = [], top_losers = [] } = data?.breakdown || {};

    const MoversList = ({ title, items, type }) => (
        <View style={[styles.moversCard, { backgroundColor: colors.card, borderColor: colors.borderPrimary }]}>
            <View style={styles.moversHeader}>
                <Text style={{ fontSize: 16 }}>{type === 'gainers' ? '📈' : '📉'}</Text>
                <Text style={[styles.moversTitle, { color: colors.textPrimary }]}>{title}</Text>
            </View>
            {items.length === 0 ? (
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>No significant movers</Text>
            ) : (
                items.map((item, index) => {
                    const intensity = Math.min(Math.abs(item.contribution_pct ?? 0) * 2000, 100);
                    const barColor = type === 'gainers' ? colors.accentGreen : colors.accentRed;
                    return (
                        <View key={index} style={[styles.moverItem, { borderBottomColor: colors.borderSubtle }]}>
                            <Text style={[styles.rank, { color: colors.textMuted }]}>{index + 1}</Text>
                            <View style={styles.moverInfo}>
                                <Text style={[styles.ticker, { color: colors.textPrimary }]} numberOfLines={1}>
                                    {item.name || item.ticker}
                                </Text>
                                <Text style={[styles.weight, { color: colors.textMuted }]}>
                                    {item.weight?.toFixed(1) ?? '0.0'}% portfolio
                                </Text>
                            </View>
                            <View style={styles.moverStats}>
                                <Text style={[styles.returnPct, { color: barColor }]}>
                                    {type === 'gainers' ? '+' : ''}{item.return_pct?.toFixed(2) ?? '0.00'}%
                                </Text>
                                <Text style={[styles.contribution, { color: barColor }]}>
                                    {(item.contribution_pct ?? 0).toFixed(2)}%
                                </Text>
                            </View>
                            <View style={[styles.barBg, { backgroundColor: colors.borderPrimary }]}>
                                <View style={[styles.barFill, { backgroundColor: barColor, width: `${intensity}%` }]} />
                            </View>
                        </View>
                    );
                })
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <View style={[styles.headerBar, { backgroundColor: colors.accentCyan }]} />
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Market Drivers</Text>
            </View>
            <MoversList title="Top Gainers" items={top_gainers} type="gainers" />
            <MoversList title="Top Losers" items={top_losers} type="losers" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    headerBar: {
        width: 4,
        height: 24,
        borderRadius: 2,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
    },
    loadingRow: {
        gap: 12,
        marginTop: 20,
    },
    skeleton: {
        height: 120,
        borderRadius: 12,
    },
    moversCard: {
        borderRadius: 14,
        borderWidth: 1,
        padding: 14,
        marginBottom: 12,
    },
    moversHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    moversTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    emptyText: {
        fontSize: 12,
        textAlign: 'center',
        padding: 16,
    },
    moverItem: {
        paddingVertical: 8,
        borderBottomWidth: 1,
    },
    rank: {
        fontSize: 10,
        fontWeight: '700',
        fontFamily: 'monospace',
        marginBottom: 4,
    },
    moverInfo: {
        marginBottom: 4,
    },
    ticker: {
        fontSize: 12,
        fontWeight: '600',
    },
    weight: {
        fontSize: 10,
        marginTop: 1,
    },
    moverStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    returnPct: {
        fontSize: 12,
        fontWeight: '700',
        fontFamily: 'monospace',
    },
    contribution: {
        fontSize: 11,
        fontFamily: 'monospace',
    },
    barBg: {
        height: 3,
        borderRadius: 2,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 2,
    },
});

export default Attribution;
