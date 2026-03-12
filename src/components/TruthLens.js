import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { useTheme } from '../context/ThemeContext';

const TruthLens = ({ fundId }) => {
    const { colors, theme } = useTheme();

    const { data, isLoading, error } = useQuery({
        queryKey: ['truthLens', fundId],
        queryFn: () => api.getTruthLens(fundId),
        enabled: !!fundId,
        staleTime: 1000 * 60 * 5,
        retry: 2,
    });

    const formatPct = (value) => {
        if (value == null) return null;
        const absVal = Math.abs(value);
        const decimals = absVal < 0.01 ? 4 : 2;
        const sign = value >= 0 ? '+' : '';
        return sign + value.toFixed(decimals) + '%';
    };

    const getMagnitudeColor = (magnitude) => {
        switch (magnitude) {
            case 'LOW': return colors.accentGreen;
            case 'MEDIUM': return '#eab308';
            case 'HIGH': return colors.accentRed;
            default: return colors.textMuted;
        }
    };

    if (isLoading) {
        return <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder, height: 120 }]} />;
    }

    if (error || !data || !data.date) {
        return (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <Text style={{ fontSize: 28, textAlign: 'center', marginBottom: 8 }}>🔍</Text>
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>Previous Day Prediction data not available yet</Text>
                <Text style={[styles.emptyHint, { color: colors.textMuted }]}>Predictions are captured daily at market close</Text>
            </View>
        );
    }

    const prediction = data;
    const streak = data.streak || 0;

    return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.header}>
                <View style={styles.headerTitle}>
                    <Text style={{ fontSize: 18 }}>🔍</Text>
                    <Text style={[styles.titleText, { color: colors.textPrimary }]}>Previous Day Prediction</Text>
                </View>
                <View style={[styles.streakBadge, { backgroundColor: colors.primaryDim }]}>
                    <Text style={{ fontSize: 12 }}>🎯</Text>
                    <Text style={[styles.streakText, { color: colors.primary }]}>{streak} day streak</Text>
                </View>
            </View>

            <View style={styles.comparisonGrid}>
                <View style={styles.comparisonItem}>
                    <Text style={[styles.compLabel, { color: colors.textMuted }]}>Predicted</Text>
                    <Text style={[styles.compValue, {
                        color: prediction.predicted_return_pct >= 0 ? colors.accentGreen : colors.accentRed
                    }]}>
                        {formatPct(prediction.predicted_return_pct) || 'N/A'}
                    </Text>
                </View>

                <View style={styles.divider}>
                    <Text style={[styles.vsText, { color: colors.textMuted }]}>vs</Text>
                </View>

                <View style={styles.comparisonItem}>
                    <Text style={[styles.compLabel, { color: colors.textMuted }]}>Actual</Text>
                    <Text style={[styles.compValue, {
                        color: prediction.actual_return_pct != null
                            ? (prediction.actual_return_pct >= 0 ? colors.accentGreen : colors.accentRed)
                            : colors.textMuted
                    }]}>
                        {formatPct(prediction.actual_return_pct) || '-'}
                    </Text>
                </View>
            </View>

            <View style={[styles.errorDisplay, { borderTopColor: colors.borderPrimary }]}>
                <View>
                    <Text style={[styles.errorLabel, { color: colors.textMuted }]}>Deviation</Text>
                    <Text style={[styles.errorValue, { color: getMagnitudeColor(data.error_magnitude) }]}>
                        {formatPct(prediction.error_pct) || 'Pending'}
                    </Text>
                </View>
                <View style={[styles.magnitudeBadge, { backgroundColor: getMagnitudeColor(data.error_magnitude) + '20' }]}>
                    <Text style={[styles.magnitudeText, { color: getMagnitudeColor(data.error_magnitude) }]}>
                        {data.error_magnitude || 'N/A'}
                    </Text>
                </View>
            </View>

            <Text style={[styles.footerDate, { color: colors.textMuted }]}>
                Data from {new Date(prediction.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        marginTop: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    titleText: {
        fontSize: 13,
        fontWeight: '700',
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
    },
    streakText: {
        fontSize: 11,
        fontWeight: '700',
    },
    comparisonGrid: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    comparisonItem: {
        flex: 1,
        alignItems: 'center',
    },
    compLabel: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    compValue: {
        fontSize: 20,
        fontWeight: '800',
        fontFamily: 'monospace',
    },
    divider: {
        paddingHorizontal: 12,
    },
    vsText: {
        fontSize: 12,
        fontWeight: '700',
    },
    errorDisplay: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        paddingTop: 12,
        marginBottom: 8,
    },
    errorLabel: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    errorValue: {
        fontSize: 14,
        fontWeight: '700',
        fontFamily: 'monospace',
        marginTop: 2,
    },
    magnitudeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    magnitudeText: {
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    footerDate: {
        fontSize: 10,
        marginTop: 4,
    },
    emptyText: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 4,
    },
    emptyHint: {
        fontSize: 11,
        textAlign: 'center',
    },
});

export default TruthLens;
