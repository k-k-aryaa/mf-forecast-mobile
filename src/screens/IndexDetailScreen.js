import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { LineChart } from 'react-native-chart-kit';
import api from '../api';
import { useTheme } from '../context/ThemeContext';

const screenWidth = Dimensions.get('window').width;

const IndexDetailScreen = ({ route, navigation }) => {
    const { symbol } = route.params;
    const { colors } = useTheme();
    const [period, setPeriod] = useState('1m');

    const { data: indicesData } = useQuery({
        queryKey: ['marketIndices'],
        queryFn: api.getMarketIndices,
        staleTime: 60000,
    });

    const indexInfo = indicesData?.find(i => i.symbol === symbol);

    const { data, isLoading, error } = useQuery({
        queryKey: ['indexHistory', symbol, period],
        queryFn: () => api.getIndexHistory(symbol, period),
        enabled: !!symbol,
    });

    const periodLabels = { '1m': '1 Month', '3m': '3 Months', '1y': '1 Year', '3y': '3 Years' };
    const periods = ['1M', '3M', '1Y', '3Y'];

    let chartData = [];
    if (data?.history?.length) {
        chartData = data.history.map(item => ({
            date: new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
            price: parseFloat(item.price),
        }));
    }

    const values = chartData.map(d => d.price);
    const isPositive = values.length > 0 && values[values.length - 1] >= values[0];
    const periodChange = values.length > 0 ? values[values.length - 1] - values[0] : 0;
    const periodChangePct = values.length > 0 ? ((values[values.length - 1] - values[0]) / values[0]) * 100 : 0;
    const chartColor = isPositive ? colors.accentGreen : colors.accentRed;

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                {/* Header Card */}
                <View style={[styles.headerCard, { backgroundColor: colors.card, borderColor: colors.borderPrimary }]}>
                    <View style={styles.headerTop}>
                        <View>
                            <View style={styles.labelRow}>
                                <Text style={[styles.indexLabel, { color: colors.textMuted }]}>INDEX</Text>
                                <View style={[styles.liveDot, {
                                    backgroundColor: colors.accentNeonGreen,
                                    shadowColor: colors.accentNeonGreen,
                                    shadowOffset: { width: 0, height: 0 },
                                    shadowOpacity: 0.8,
                                    shadowRadius: 4,
                                    elevation: 4,
                                }]} />
                            </View>
                            <Text style={[styles.indexName, { color: colors.textPrimary }]}>
                                {indexInfo?.name || decodeURIComponent(symbol)}
                            </Text>
                        </View>
                        {indexInfo && (
                            <View style={styles.changeBlock}>
                                <Text style={[styles.dailyChange, { color: indexInfo.change >= 0 ? colors.accentGreen : colors.accentRed }]}>
                                    {indexInfo.change >= 0 ? '+' : ''}{indexInfo.change?.toFixed(2)} ({indexInfo.change_pct?.toFixed(2)}%)
                                </Text>
                                <Text style={[styles.dayLabel, { color: colors.textMuted }]}>1 Day</Text>
                            </View>
                        )}
                    </View>

                    {indexInfo && (
                        <Text style={[styles.currentPrice, { color: colors.textPrimary }]}>
                            {indexInfo.price?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </Text>
                    )}

                    {/* Period Selector */}
                    <View style={[styles.periodRow, { borderTopColor: colors.borderPrimary }]}>
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
                                <Text style={[styles.periodText, { color: period === p.toLowerCase() ? colors.primary : colors.textMuted }]}>
                                    {p}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {values.length > 0 && (
                        <View style={styles.statsBlock}>
                            <Text style={[styles.statsLabel, { color: colors.textMuted }]}>{periodLabels[period]} Change</Text>
                            <Text style={[styles.statsValue, { color: isPositive ? colors.accentGreen : colors.accentRed }]}>
                                {isPositive ? '+' : ''}{periodChange.toFixed(2)} ({periodChangePct.toFixed(2)}%)
                            </Text>
                        </View>
                    )}
                </View>

                {/* Chart Card */}
                <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.borderPrimary }]}>
                    {isLoading ? (
                        <View style={styles.loadingChart}>
                            <ActivityIndicator color={colors.primary} size="large" />
                            <Text style={[styles.loadingText, { color: colors.textMuted }]}>Loading Chart Data...</Text>
                        </View>
                    ) : error ? (
                        <View style={styles.errorChart}>
                            <Text style={{ fontSize: 32, marginBottom: 8 }}>⚠️</Text>
                            <Text style={{ color: colors.accentRed, fontSize: 14, fontWeight: '700' }}>Unavailable</Text>
                        </View>
                    ) : values.length > 0 ? (
                        <LineChart
                            data={{
                                labels: [],
                                datasets: [{ data: values }],
                            }}
                            width={screenWidth - 48}
                            height={300}
                            withDots={false}
                            withInnerLines={false}
                            withOuterLines={false}
                            withHorizontalLabels={true}
                            withVerticalLabels={false}
                            chartConfig={{
                                backgroundColor: 'transparent',
                                backgroundGradientFrom: colors.card,
                                backgroundGradientTo: colors.card,
                                color: () => chartColor,
                                fillShadowGradientFrom: chartColor,
                                fillShadowGradientFromOpacity: 0.2,
                                fillShadowGradientTo: chartColor,
                                fillShadowGradientToOpacity: 0,
                                strokeWidth: 2.5,
                                propsForBackgroundLines: { stroke: colors.borderSubtle },
                                labelColor: () => colors.textMuted,
                                decimalPlaces: 0,
                            }}
                            bezier
                            style={styles.chart}
                        />
                    ) : (
                        <View style={styles.emptyChart}>
                            <Text style={{ fontSize: 32, marginBottom: 8 }}>📉</Text>
                            <Text style={{ color: colors.textMuted }}>No data for this period</Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16, gap: 12 },
    headerCard: { borderRadius: 16, borderWidth: 1, padding: 16 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
    labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
    indexLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase' },
    liveDot: { width: 6, height: 6, borderRadius: 3 },
    indexName: { fontSize: 18, fontWeight: '700' },
    changeBlock: { alignItems: 'flex-end' },
    dailyChange: { fontSize: 12, fontWeight: '700', fontFamily: 'monospace' },
    dayLabel: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', marginTop: 2 },
    currentPrice: { fontSize: 28, fontWeight: '800', fontFamily: 'monospace', marginBottom: 12 },
    periodRow: { flexDirection: 'row', gap: 4, borderTopWidth: 1, paddingTop: 12, marginBottom: 8 },
    periodBtn: { flex: 1, paddingVertical: 6, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
    periodText: { fontSize: 12, fontWeight: '700', fontFamily: 'monospace' },
    statsBlock: { marginTop: 4 },
    statsLabel: { fontSize: 9, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 1 },
    statsValue: { fontSize: 20, fontWeight: '800', fontFamily: 'monospace', marginTop: 2 },
    chartCard: { borderRadius: 16, borderWidth: 1, padding: 8, overflow: 'hidden' },
    chart: { borderRadius: 12 },
    loadingChart: { height: 300, alignItems: 'center', justifyContent: 'center' },
    loadingText: { fontSize: 12, fontFamily: 'monospace', marginTop: 12 },
    errorChart: { height: 300, alignItems: 'center', justifyContent: 'center' },
    emptyChart: { height: 300, alignItems: 'center', justifyContent: 'center' },
});

export default IndexDetailScreen;
