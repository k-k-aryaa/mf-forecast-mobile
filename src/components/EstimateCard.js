import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, RefreshCw } from 'lucide-react-native';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useColors, spacing, radii, fontSizes, useResponsive } from '../theme';
import ProcessingState from './ProcessingState';

export default function EstimateCard({ fundId }) {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['detailedEstimate', fundId],
    queryFn: () => api.getDetailedEstimate(fundId),
    enabled: !!fundId,
    refetchInterval: 30000,
  });

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const colors = useColors();
  const { scale } = useResponsive();

  const { data: favorites } = useQuery({
    queryKey: ['favorites'],
    queryFn: api.getFavorites,
    enabled: !!user,
    staleTime: 60000,
  });

  const isFavorited = favorites?.some((f) => f.id === fundId);

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
    const delayPromise = new Promise((resolve) => setTimeout(resolve, delay));
    try {
      await Promise.all([refetch(), delayPromise]);
    } catch (err) {}
    setAiThinking(false);
  };

  if (isLoading || aiThinking) return <ProcessingState />;

  if (error) {
    return (
      <View style={[styles.card, { backgroundColor: colors.accentRedDim, borderColor: colors.accentRed }]}>
        <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 8 }}>⚠️</Text>
        <Text style={[styles.errorText, { color: colors.accentRed }]}>Signal Lost</Text>
      </View>
    );
  }

  if (!data) return <ProcessingState />;

  const isPositive = data.estimated_return_pct >= 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          {user && (
            <TouchableOpacity onPress={toggleFavorite} style={styles.favBtn}>
              <Heart
                size={scale(16)}
                color={isFavorited ? colors.accentRed : colors.textMuted}
                fill={isFavorited ? colors.accentRed : 'transparent'}
              />
            </TouchableOpacity>
          )}
          <View style={styles.liveRow}>
            <Text style={[styles.liveLabel, { color: colors.textMuted }]}>LIVE FORECAST</Text>
            <View style={[styles.dotLive, { backgroundColor: colors.accentNeonGreen }]} />
          </View>
        </View>
        <TouchableOpacity
          onPress={handleRefresh}
          disabled={isFetching}
          style={[styles.refreshBtn, { backgroundColor: colors.accentCyan }]}
        >
          <Text style={styles.refreshText}>{isFetching ? 'Syncing...' : 'Refresh'}</Text>
        </TouchableOpacity>
      </View>

      {/* Fund Name */}
      <Text style={[styles.fundName, { color: colors.textPrimary }]} numberOfLines={2}>
        {data.scheme_name}
      </Text>

      {/* Hero Percentage */}
      <View style={styles.heroSection}>
        <Text
          style={[
            styles.heroPercent,
            { color: isPositive ? colors.accentNeonGreen : colors.accentRed },
          ]}
        >
          {isPositive ? '+' : ''}
          {data.estimated_return_pct?.toFixed(2) ?? '0.00'}%
        </Text>
      </View>

      {/* NAV Grid */}
      <View style={styles.navGrid}>
        <View style={[styles.navBoxHighlight, { backgroundColor: colors.surfaceActive, borderColor: colors.borderGlow }]}>
          <Text style={[styles.navLabel, { color: colors.textMuted, fontSize: scale(fontSizes['2xs']) }]}>Predicted NAV</Text>
          <Text style={[styles.navValue, { color: colors.accentCyan, fontSize: scale(fontSizes.lg) }]}>
            ₹{data.estimated_nav?.toFixed(2) ?? '-'}
          </Text>
        </View>
        <View style={[styles.navBoxSecondary, { backgroundColor: colors.surfaceHover, borderColor: colors.borderSubtle }]}>
          <Text style={[styles.navLabel, { color: colors.textMuted, fontSize: scale(fontSizes['2xs']) }]}>Previous</Text>
          <Text style={[styles.navValue, { color: colors.textSecondary, fontSize: scale(fontSizes.lg) }]}>
            ₹{data.previous_nav?.toFixed(2) ?? '-'}
          </Text>
        </View>
      </View>

      {/* Confidence & Coverage */}
      <View style={[styles.metricsRow, { borderTopColor: colors.borderSubtle }]}>
        <View style={styles.metricBox}>
          <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Confidence</Text>
          <View style={styles.confidenceRow}>
            <View style={[styles.progressBg, { backgroundColor: colors.surfaceHover }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.accentCyan,
                    width: `${data.confidence?.price_coverage_pct ?? 0}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.confidenceScore, { color: colors.accentCyan }]}>
              {data.confidence?.score ?? 'N/A'}
            </Text>
          </View>
        </View>
        <View style={styles.metricBox}>
          <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Market Coverage</Text>
          <Text style={[styles.metricValue, { color: colors.textSecondary }]}>
            {data.confidence?.price_coverage_pct?.toFixed(0) ?? '-'}% Assets Live
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing['2xl'],
    overflow: 'hidden',
  },
  errorText: {
    textAlign: 'center',
    fontFamily: 'monospace',
    fontSize: fontSizes.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  favBtn: {
    padding: spacing.xs,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  liveLabel: {
    fontSize: fontSizes['2xs'],
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  dotLive: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  refreshBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.md,
  },
  refreshText: {
    color: '#fff',
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  fundName: {
    fontSize: fontSizes.sm,
    fontFamily: 'monospace',
    marginBottom: spacing.md,
    fontWeight: '500',
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  heroPercent: {
    fontSize: fontSizes['5xl'],
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: -1,
  },
  navGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  navBoxHighlight: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  navBoxSecondary: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  navLabel: {
    fontSize: fontSizes['2xs'],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  navValue: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  metricsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  metricBox: {
    flex: 1,
  },
  metricLabel: {
    fontSize: fontSizes['2xs'],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressBg: {
    height: 6,
    flex: 1,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  confidenceScore: {
    fontSize: fontSizes.xs,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: fontSizes.sm,
    fontFamily: 'monospace',
  },
});
