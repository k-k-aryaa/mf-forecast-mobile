import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import api from '../api/api';
import { useColors, spacing, radii, fontSizes, useResponsive } from '../theme';

const CHART_HEIGHT = 250;

export default function IndexDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { symbol } = route.params;
  const colors = useColors();
  const { scale, maxContentWidth } = useResponsive();

  const [index, setIndex] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('1m');
  const [chartWidth, setChartWidth] = useState(300);

  const periodLabels = { '1m': '1 Month', '3m': '3 Months', '1y': '1 Year', '3y': '3 Years' };

  // Fetch index metadata
  useEffect(() => {
    const fetch = async () => {
      try {
        const indices = await api.getMarketIndices();
        const found = indices?.find((i) => i.symbol === symbol);
        if (found) setIndex(found);
      } catch (e) {}
    };
    fetch();
  }, [symbol]);

  // Fetch history
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await api.getIndexHistory(symbol, period);
        setHistory(data?.history || []);
      } catch (e) {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [symbol, period]);

  const chartData = history.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    price: parseFloat(item.price),
  }));

  const priceValues = chartData.map((d) => d.price);
  const minPrice = priceValues.length ? Math.min(...priceValues) : 0;
  const maxPrice = priceValues.length ? Math.max(...priceValues) : 1;
  const range = maxPrice - minPrice || 1;

  const firstPrice = chartData[0]?.price ?? 0;
  const lastPrice = chartData[chartData.length - 1]?.price ?? 0;
  const periodChange = lastPrice - firstPrice;
  const periodChangePct = firstPrice ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0;
  const isPositive = lastPrice >= firstPrice;
  const strokeColor = isPositive ? colors.chartGreen : colors.chartRed;

  const effectiveChartWidth = Math.max(chartWidth, 200);
  const points = chartData.map((d, i) => ({
    x: (i / Math.max(chartData.length - 1, 1)) * effectiveChartWidth,
    y: CHART_HEIGHT - ((d.price - minPrice) / range) * (CHART_HEIGHT - 20) - 10,
  }));

  let linePath = '';
  let areaPath = '';
  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) linePath += ` L ${points[i].x} ${points[i].y}`;
    areaPath = linePath + ` L ${points[points.length - 1].x} ${CHART_HEIGHT} L ${points[0].x} ${CHART_HEIGHT} Z`;
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={maxContentWidth}>
          {/* Back */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backBtn, { backgroundColor: colors.surfaceHover }]}
          >
            <ArrowLeft size={scale(18)} color={colors.textSecondary} />
            <Text style={[styles.backText, { color: colors.textSecondary, fontSize: scale(fontSizes.sm) }]}>Back</Text>
          </TouchableOpacity>

          {/* Header Card */}
          <View style={[styles.headerCard, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}>
            <View style={styles.headerRow}>
              <View>
                <View style={styles.indexLabel}>
                  <View style={[styles.dotLive, { backgroundColor: colors.accentNeonGreen }]} />
                  <Text style={[styles.indexLabelText, { color: colors.textMuted, fontSize: scale(fontSizes.xs) }]}>Index</Text>
                </View>
                <Text style={[styles.indexName, { color: colors.textPrimary, fontSize: scale(fontSizes.xl) }]}>
                  {index?.name || decodeURIComponent(symbol)}
                </Text>
              </View>
              {index && (
                <View style={{ alignItems: 'flex-end' }}>
                  <Text
                    style={[
                      styles.indexPrice,
                      { color: (index.change ?? 0) >= 0 ? colors.accentGreen : colors.accentRed, fontSize: scale(fontSizes['2xl']) },
                    ]}
                  >
                    {index.price?.toFixed(2) ?? '-'}
                  </Text>
                  <Text
                    style={[
                      styles.indexChange,
                      { color: (index.change ?? 0) >= 0 ? colors.accentGreen : colors.accentRed, fontSize: scale(fontSizes.sm) },
                    ]}
                  >
                    {(index.change ?? 0) >= 0 ? '▲' : '▼'} {Math.abs(index.change ?? 0).toFixed(2)} (
                    {Math.abs(index.change_pct ?? 0).toFixed(2)}%)
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Period Selector */}
          <View style={[styles.periodBar, { backgroundColor: colors.surfaceHover, borderColor: colors.borderSubtle }]}>
            {['1M', '3M', '1Y', '3Y'].map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.periodBtn, period === p.toLowerCase() && { backgroundColor: `${colors.accentCyan}33` }]}
                onPress={() => setPeriod(p.toLowerCase())}
              >
                <Text
                  style={[
                    styles.periodText,
                    { color: period === p.toLowerCase() ? colors.accentCyan : colors.textMuted, fontWeight: period === p.toLowerCase() ? '700' : '400', fontSize: scale(fontSizes.sm) },
                  ]}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Stats */}
          {chartData.length > 0 && (
            <View style={styles.statsRow}>
              <Text style={[styles.statsLabel, { color: colors.textMuted, fontSize: scale(fontSizes.xs) }]}>{periodLabels[period]} Change</Text>
              <Text style={[styles.statsValue, { color: periodChange >= 0 ? colors.accentGreen : colors.accentRed, fontSize: scale(fontSizes['2xl']) }]}>
                {periodChange >= 0 ? '+' : ''}{periodChange.toFixed(2)}
                <Text style={[styles.statsPct, { fontSize: scale(fontSizes.sm) }]}> ({periodChangePct.toFixed(2)}%)</Text>
              </Text>
            </View>
          )}

          {/* Chart */}
          {loading ? (
            <ActivityIndicator size="large" color={colors.accentCyan} style={{ marginTop: 40 }} />
          ) : chartData.length === 0 ? (
            <View style={styles.emptyChart}>
              <Text style={{ fontSize: 24, marginBottom: 8 }}>📊</Text>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No historical data</Text>
            </View>
          ) : (
            <View
              style={[styles.chartCard, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}
              onLayout={(e) => setChartWidth(e.nativeEvent.layout.width - spacing.lg * 2)}
            >
              <Svg width={effectiveChartWidth} height={CHART_HEIGHT}>
                <Defs>
                  <SvgLinearGradient id="indexGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={strokeColor} stopOpacity="0.3" />
                    <Stop offset="1" stopColor={strokeColor} stopOpacity="0" />
                  </SvgLinearGradient>
                </Defs>
                {areaPath && <Path d={areaPath} fill="url(#indexGrad)" />}
                {linePath && <Path d={linePath} stroke={strokeColor} strokeWidth={2.5} fill="none" />}
              </Svg>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: 100 },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
  },
  backText: { fontSize: fontSizes.sm, fontWeight: '600' },
  headerCard: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing['2xl'],
    marginBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  indexLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  dotLive: { width: 6, height: 6, borderRadius: 3 },
  indexLabelText: { fontSize: fontSizes.xs, textTransform: 'uppercase', fontWeight: '600', letterSpacing: 0.5 },
  indexName: { fontSize: fontSizes.xl, fontWeight: '700' },
  indexPrice: { fontSize: fontSizes['2xl'], fontWeight: '800', fontFamily: 'monospace' },
  indexChange: { fontSize: fontSizes.sm, fontFamily: 'monospace', marginTop: 2 },
  periodBar: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: radii.md,
    padding: 3,
    marginBottom: spacing.lg,
  },
  periodBtn: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: radii.sm },
  periodText: { fontSize: fontSizes.sm, fontFamily: 'monospace' },
  statsRow: { marginBottom: spacing.lg },
  statsLabel: { fontSize: fontSizes.xs, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  statsValue: { fontSize: fontSizes['2xl'], fontWeight: '700', fontFamily: 'monospace' },
  statsPct: { fontSize: fontSizes.sm },
  chartCard: { borderWidth: 1, borderRadius: radii.lg, padding: spacing.lg, overflow: 'hidden' },
  emptyChart: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontFamily: 'monospace', fontSize: fontSizes.sm },
});
