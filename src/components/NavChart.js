import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { LineChart } from 'react-native-chart-kit';
import api from '../api';
import { useTheme } from '../context/ThemeContext';

const screenWidth = Dimensions.get('window').width;

const NavChart = ({ fundId }) => {
    const { colors, theme } = useTheme();
    const [period, setPeriod] = useState('1m');

    const { data, isLoading, error } = useQuery({
        queryKey: ['navHistory', fundId, period],
        queryFn: () => api.getNavHistory(fundId, period),
        enabled: !!fundId,
    });

    const periods = ['1M', '3M', '1Y', '3Y'];

    if (isLoading) {
        return (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <View style={[styles.skeleton, { backgroundColor: colors.primaryDim }]} />
            </View>
        );
    }

    if (error || !data?.nav_history?.length) {
        return (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <Text style={{ color: colors.textMuted, textAlign: 'center', padding: 40 }}>
                    {error ? '⚠️ Unavailable' : '📊 No Data'}
                </Text>
            </View>
        );
    }

    const chartData = data.nav_history.map(item => ({
        date: new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        nav: parseFloat(item.nav),
    }));

    const values = chartData.map(d => d.nav);
    const isPositive = values[values.length - 1] >= values[0];
    const periodChange = values[values.length - 1] - values[0];
    const periodChangePct = ((values[values.length - 1] - values[0]) / values[0]) * 100;

    // Downsample labels for chart readability
    const labelStep = Math.max(1, Math.floor(chartData.length / 5));
    const labels = chartData.map((d, i) => i % labelStep === 0 ? d.date : '');

    const chartColor = isPositive ? colors.accentGreen : colors.accentRed;

    return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={[styles.indicator, { backgroundColor: colors.primary }]} />
                    <Text style={[styles.title, { color: colors.textMuted }]}>NAV TREND</Text>
                </View>
            </View>

            <View style={styles.periodRow}>
                {periods.map(p => (
                    <TouchableOpacity
                        key={p}
                        style={[
                            styles.periodBtn,
                            { borderColor: colors.borderPrimary },
                            period === p.toLowerCase() && { backgroundColor: colors.primaryDim }
                        ]}
                        onPress={() => setPeriod(p.toLowerCase())}
                    >
                        <Text style={[
                            styles.periodText,
                            { color: period === p.toLowerCase() ? colors.primary : colors.textMuted }
                        ]}>
                            {p}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.statsRow}>
                <Text style={[styles.statsLabel, { color: colors.textMuted }]}>
                    {period === '1m' ? '1 Month' : period === '3m' ? '3 Months' : period === '1y' ? '1 Year' : '3 Years'} Change
                </Text>
                <Text style={[styles.statsValue, { color: isPositive ? colors.accentGreen : colors.accentRed }]}>
                    {isPositive ? '+' : ''}{periodChange.toFixed(2)} ({periodChangePct.toFixed(2)}%)
                </Text>
            </View>

            <LineChart
                data={{
                    labels: labels,
                    datasets: [{ data: values }],
                }}
                width={screenWidth - 64}
                height={180}
                withDots={false}
                withInnerLines={false}
                withOuterLines={false}
                withHorizontalLabels={false}
                withVerticalLabels={false}
                chartConfig={{
                    backgroundColor: 'transparent',
                    backgroundGradientFrom: colors.card,
                    backgroundGradientTo: colors.card,
                    color: () => chartColor,
                    fillShadowGradientFrom: chartColor,
                    fillShadowGradientFromOpacity: 0.3,
                    fillShadowGradientTo: chartColor,
                    fillShadowGradientToOpacity: 0,
                    strokeWidth: 2,
                    propsForBackgroundLines: { stroke: 'transparent' },
                }}
                bezier
                style={styles.chart}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        overflow: 'hidden',
    },
    skeleton: {
        height: 200,
        borderRadius: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    indicator: {
        width: 3,
        height: 14,
        borderRadius: 2,
    },
    title: {
        fontSize: 10,
        fontWeight: '700',
        fontFamily: 'monospace',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    periodRow: {
        flexDirection: 'row',
        gap: 4,
        marginBottom: 12,
    },
    periodBtn: {
        flex: 1,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
    },
    periodText: {
        fontSize: 11,
        fontWeight: '700',
        fontFamily: 'monospace',
    },
    statsRow: {
        marginBottom: 8,
    },
    statsLabel: {
        fontSize: 9,
        fontFamily: 'monospace',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statsValue: {
        fontSize: 18,
        fontWeight: '800',
        fontFamily: 'monospace',
        marginTop: 2,
    },
    chart: {
        marginLeft: -16,
        marginRight: -8,
        borderRadius: 0,
    },
});

export default NavChart;
