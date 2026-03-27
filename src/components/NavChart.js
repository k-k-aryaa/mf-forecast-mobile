import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import api from '../api/api';
import { useColors, spacing, radii, fontSizes, shadows, useResponsive } from '../theme';

const CHART_HEIGHT = 200;

export default function NavChart({ fundId }) {
  const [period, setPeriod] = useState('1m');
  const colors = useColors();
  const { scale } = useResponsive();
  const [containerWidth, setContainerWidth] = useState(300);

  const { data, isLoading, error } = useQuery({
    queryKey: ['navHistory', fundId, period],
    queryFn: () => api.getNavHistory(fundId, period),
    enabled: !!fundId,
  });

  const periodLabels = { '1m': '1 Month', '3m': '3 Months', '1y': '1 Year', '3y': '3 Years' };

  if (isLoading) {
    return (
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}>
        <View style={[styles.loadingBox, { backgroundColor: colors.surfaceHover }]} />
      </View>
    );
  }

  if (error || !data?.nav_history?.length) {
    return (
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}>
        <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 8 }}>📊</Text>
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          {error ? 'Unavailable' : 'No Data Stream'}
        </Text>
      </View>
    );
  }

  const chartData = data.nav_history.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    nav: parseFloat(item.nav),
  }));

  const navValues = chartData.map((d) => d.nav);
  const minNav = Math.min(...navValues);
  const maxNav = Math.max(...navValues);
  const range = maxNav - minNav || 1;

  const firstNav = chartData[0]?.nav ?? 0;
  const lastNav = chartData[chartData.length - 1]?.nav ?? 0;
  const periodChange = lastNav - firstNav;
  const periodChangePct = firstNav ? ((lastNav - firstNav) / firstNav) * 100 : 0;
  const isPositive = lastNav >= firstNav;
  const strokeColor = isPositive ? colors.chartGreen : colors.chartRed;

  // Use containerWidth from onLayout instead of Dimensions
  const chartWidth = Math.max(containerWidth - spacing['2xl'] * 2, 200);
  const points = chartData.map((d, i) => {
    const x = (i / (chartData.length - 1)) * chartWidth;
    const y = CHART_HEIGHT - ((d.nav - minNav) / range) * (CHART_HEIGHT - 20) - 10;
    return { x, y };
  });

  let linePath = '';
  let areaPath = '';
  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      linePath += ` L ${points[i].x} ${points[i].y}`;
    }
    areaPath = linePath + ` L ${points[points.length - 1].x} ${CHART_HEIGHT} L ${points[0].x} ${CHART_HEIGHT} Z`;
  }

  return (
    <View
      style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <View style={[styles.titleBar, { backgroundColor: colors.accentCyan }]} />
          <Text style={[styles.title, { color: colors.textMuted, fontSize: scale(fontSizes.xs) }]}>NAV TREND</Text>
        </View>
      </View>

      {/* Period Selector */}
      <View style={[styles.periodBar, { backgroundColor: colors.surfaceHover, borderColor: colors.borderSubtle }]}>
        {['1M', '3M', '1Y', '3Y'].map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.periodBtn,
              period === p.toLowerCase() && { backgroundColor: `${colors.accentCyan}33` },
            ]}
            onPress={() => setPeriod(p.toLowerCase())}
          >
            <Text
              style={[
                styles.periodText,
                {
                  color: period === p.toLowerCase() ? colors.accentCyan : colors.textMuted,
                  fontWeight: period === p.toLowerCase() ? '700' : '400',
                  fontSize: scale(fontSizes.xs),
                },
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
          <Text style={[styles.statsLabel, { color: colors.textMuted, fontSize: scale(fontSizes['2xs']) }]}>
            {periodLabels[period]} Change
          </Text>
          <Text
            style={[
              styles.statsValue,
              { color: periodChange >= 0 ? colors.accentGreen : colors.accentRed, fontSize: scale(fontSizes.xl) },
            ]}
          >
            {periodChange >= 0 ? '+' : ''}
            {periodChange.toFixed(2)}
            <Text style={[styles.statsPct, { fontSize: scale(fontSizes.sm) }]}> ({periodChangePct.toFixed(2)}%)</Text>
          </Text>
        </View>
      )}

      {/* Chart */}
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={CHART_HEIGHT}>
          <Defs>
            <SvgLinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={strokeColor} stopOpacity="0.3" />
              <Stop offset="1" stopColor={strokeColor} stopOpacity="0" />
            </SvgLinearGradient>
          </Defs>
          {areaPath ? <Path d={areaPath} fill="url(#areaGrad)" /> : null}
          {linePath ? (
            <Path d={linePath} stroke={strokeColor} strokeWidth={2.5} fill="none" />
          ) : null}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderRadius: radii.lg,
    padding: spacing['2xl'],
    overflow: 'hidden',
    ...shadows.md,
  },
  loadingBox: {
    height: CHART_HEIGHT,
    borderRadius: radii.md,
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: 'monospace',
    fontSize: fontSizes.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  titleBar: {
    width: 4,
    height: 16,
    borderRadius: 2,
  },
  title: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  periodBar: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: radii.md,
    padding: 3,
    marginBottom: spacing.md,
  },
  periodBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
  },
  periodText: {
    fontSize: fontSizes.xs,
    fontFamily: 'monospace',
  },
  statsRow: {
    marginBottom: spacing.md,
  },
  statsLabel: {
    fontSize: fontSizes['2xs'],
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statsValue: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  statsPct: {
    fontSize: fontSizes.sm,
  },
  chartContainer: {
    overflow: 'hidden',
    borderRadius: radii.sm,
  },
});
