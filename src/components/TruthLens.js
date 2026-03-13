import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../context/ThemeContext';
import api from '../api/api';
import { useColors, spacing, radii, fontSizes } from '../theme';

export default function TruthLens({ fundId }) {
  const { isDark } = useTheme();
  const colors = useColors();

  const lensIcon = isDark
    ? require('../assets/lens.png')
    : require('../assets/lens_light.png');
  const targetIcon = isDark
    ? require('../assets/target.png')
    : require('../assets/target_light.png');

  const { data, isLoading, error } = useQuery({
    queryKey: ['truthLens', fundId],
    queryFn: () => api.getTruthLens(fundId),
    enabled: !!fundId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: 1000,
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
      case 'MEDIUM': return '#f59e0b';
      case 'HIGH': return colors.accentRed;
      default: return colors.textMuted;
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}>
        <View style={[styles.skeleton, { backgroundColor: colors.surfaceHover }]} />
      </View>
    );
  }

  if (error || !data || !data.date) {
    return (
      <View style={[styles.card, styles.emptyCard, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}>
        <Image source={lensIcon} style={styles.emptyIcon} resizeMode="contain" />
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Previous Day Prediction data not available yet
        </Text>
        <Text style={[styles.emptyHint, { color: colors.textMuted }]}>
          Predictions are captured daily at market close
        </Text>
      </View>
    );
  }

  const prediction = data;
  const streak = data.streak || 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerTitle}>
          <Image source={lensIcon} style={styles.titleIcon} resizeMode="contain" />
          <Text style={[styles.title, { color: colors.textPrimary }]}>Previous Day Prediction</Text>
        </View>
        <View style={[styles.streakBadge, { backgroundColor: colors.surfaceHover }]}>
          <Image source={targetIcon} style={styles.streakIcon} resizeMode="contain" />
          <Text style={[styles.streakText, { color: colors.textSecondary }]}>
            {streak} day streak
          </Text>
        </View>
      </View>

      {/* Comparison Grid */}
      <View style={styles.comparisonGrid}>
        <View style={styles.comparisonItem}>
          <Text style={[styles.compLabel, { color: colors.textMuted }]}>Predicted</Text>
          <Text
            style={[
              styles.compValue,
              {
                color:
                  prediction.predicted_return_pct >= 0
                    ? colors.accentGreen
                    : colors.accentRed,
              },
            ]}
          >
            {formatPct(prediction.predicted_return_pct) || 'N/A'}
          </Text>
        </View>

        <View style={styles.divider}>
          <Text style={[styles.vsText, { color: colors.textMuted }]}>vs</Text>
        </View>

        <View style={styles.comparisonItem}>
          <Text style={[styles.compLabel, { color: colors.textMuted }]}>Actual</Text>
          <Text
            style={[
              styles.compValue,
              {
                color:
                  prediction.actual_return_pct != null
                    ? prediction.actual_return_pct >= 0
                      ? colors.accentGreen
                      : colors.accentRed
                    : colors.textMuted,
              },
            ]}
          >
            {formatPct(prediction.actual_return_pct) || '-'}
          </Text>
        </View>
      </View>

      {/* Error Display */}
      <View style={styles.errorRow}>
        <View>
          <Text style={[styles.errorLabel, { color: colors.textMuted }]}>Deviation</Text>
          <Text
            style={[
              styles.errorValue,
              { color: getMagnitudeColor(data.error_magnitude) },
            ]}
          >
            {formatPct(prediction.error_pct) || 'Pending'}
          </Text>
        </View>
        <View
          style={[
            styles.magnitudeBadge,
            { backgroundColor: `${getMagnitudeColor(data.error_magnitude)}22` },
          ]}
        >
          <Text
            style={[
              styles.magnitudeText,
              { color: getMagnitudeColor(data.error_magnitude) },
            ]}
          >
            {data.error_magnitude || 'N/A'}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: colors.borderSubtle }]}>
        <Text style={[styles.footerDate, { color: colors.textMuted }]}>
          Data from{' '}
          {new Date(prediction.date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing['2xl'],
    marginTop: spacing['2xl'],
  },
  skeleton: {
    height: 150,
    borderRadius: radii.md,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing['4xl'],
  },
  emptyIcon: {
    width: 56,
    height: 56,
    marginBottom: spacing.md,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: fontSizes.sm,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  emptyHint: {
    fontSize: fontSizes.xs,
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  titleIcon: {
    width: 28,
    height: 28,
  },
  title: {
    fontSize: fontSizes.base,
    fontWeight: '700',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
  },
  streakIcon: {
    width: 18,
    height: 18,
  },
  streakText: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  comparisonGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  comparisonItem: {
    flex: 1,
    alignItems: 'center',
  },
  compLabel: {
    fontSize: fontSizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  compValue: {
    fontSize: fontSizes['2xl'],
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  divider: {
    paddingHorizontal: spacing.md,
  },
  vsText: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
  },
  errorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  errorLabel: {
    fontSize: fontSizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  errorValue: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  magnitudeBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
  },
  magnitudeText: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footer: {
    borderTopWidth: 1,
    paddingTop: spacing.md,
  },
  footerDate: {
    fontSize: fontSizes.xs,
  },
});
