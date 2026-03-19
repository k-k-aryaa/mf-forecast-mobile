import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../context/ThemeContext';
import api from '../api/api';
import { useColors, spacing, radii, fontSizes } from '../theme';

export default function Attribution({ fundId }) {
  const { isDark } = useTheme();
  const colors = useColors();

  const trendUp = isDark
    ? require('../assets/trend_up.png')
    : require('../assets/trend_up_light.png');
  const trendDown = isDark
    ? require('../assets/trend_down.png')
    : require('../assets/trend_down_light.png');

  const { data, isLoading } = useQuery({
    queryKey: ['detailedEstimate', fundId],
    queryFn: () => api.getDetailedEstimate(fundId),
    enabled: !!fundId,
  });

  if (isLoading || !data) {
    return (
      <View style={styles.loadingRow}>
        <View style={[styles.loadingBox, { backgroundColor: colors.surfaceHover }]} />
        <View style={[styles.loadingBox, { backgroundColor: colors.surfaceHover }]} />
      </View>
    );
  }

  const { top_gainers = [], top_losers = [] } = data?.breakdown || {};

  const MoversList = ({ title, items, type }) => (
    <View style={[styles.moversCard, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}>
      <View style={styles.cardHeader}>
        <Image
          source={type === 'gainers' ? trendUp : trendDown}
          style={styles.cardIcon}
          resizeMode="contain"
        />
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{title}</Text>
      </View>

      {items.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>No significant movers</Text>
      ) : (
        items.map((item, index) => {
          const intensity = Math.min(Math.abs(item.contribution_pct ?? 0) * 2000, 100);
          return (
            <View key={index} style={[styles.item, { borderBottomColor: colors.borderSubtle }]}>
              <View style={styles.itemLeft}>
                <View style={[styles.rank, { backgroundColor: colors.surfaceHover }]}>
                  <Text style={[styles.rankText, { color: colors.textMuted }]}>{index + 1}</Text>
                </View>
                <View style={styles.itemInfo}>
                  <Text style={[styles.ticker, { color: colors.textPrimary }]} numberOfLines={1}>
                    {item.name || item.ticker}
                  </Text>
                  <Text style={[styles.weight, { color: colors.textMuted }]}>
                    {item.weight?.toFixed(1) ?? '0.0'}% portfolio
                  </Text>
                </View>
              </View>
              <View style={styles.itemRight}>
                <Text
                  style={[
                    styles.returnPct,
                    { color: type === 'gainers' ? colors.accentGreen : colors.accentRed },
                  ]}
                >
                  {type === 'gainers' ? '+' : ''}
                  {item.return_pct?.toFixed(2) ?? '0.00'}%
                </Text>
                <Text
                  style={[
                    styles.contribution,
                    { color: type === 'gainers' ? colors.accentGreen : colors.accentRed },
                  ]}
                >
                  {(item.contribution_pct ?? 0).toFixed(2)}%
                </Text>
              </View>

              {/* Impact bar */}
              <View style={[styles.barBg, { backgroundColor: colors.surfaceHover }]}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${intensity}%`,
                      backgroundColor: type === 'gainers' ? colors.accentGreen : colors.accentRed,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })
      )}
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.titleRow}>
        <View style={[styles.titleBar, { backgroundColor: colors.accentPurple }]} />
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Market Drivers</Text>
      </View>
      <MoversList title="Top Gainers" items={top_gainers} type="gainers" />
      <MoversList title="Top Losers" items={top_losers} type="losers" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: spacing['2xl'],
    gap: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  titleBar: {
    width: 4,
    height: 24,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
  },
  loadingRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing['2xl'],
  },
  loadingBox: {
    flex: 1,
    height: 150,
    borderRadius: radii.lg,
  },
  moversCard: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  cardIcon: {
    width: 28,
    height: 28,
  },
  cardTitle: {
    fontSize: fontSizes.base,
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: fontSizes.sm,
    paddingVertical: spacing.lg,
  },
  item: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  rank: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
  },
  itemInfo: {
    flex: 1,
  },
  ticker: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  weight: {
    fontSize: fontSizes['2xs'],
    marginTop: 1,
  },
  itemRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 34,
    marginBottom: spacing.xs,
  },
  returnPct: {
    fontSize: fontSizes.sm,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  contribution: {
    fontSize: fontSizes.sm,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  barBg: {
    height: 3,
    borderRadius: 2,
    marginLeft: 34,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
});
