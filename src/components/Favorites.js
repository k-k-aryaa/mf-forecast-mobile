import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  HeartOff,
  Lock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Sparkles,
} from 'lucide-react-native';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useColors, spacing, radii, fontSizes } from '../theme';

export default function Favorites({ onFundSelect, onLogin }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const colors = useColors();

  const { data: favorites, isLoading, error } = useQuery({
    queryKey: ['favorites'],
    queryFn: api.getFavorites,
    enabled: !!user,
  });

  const removeMutation = useMutation({
    mutationFn: api.removeFavorite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });

  if (!user) {
    return (
      <View style={styles.wrapper}>
        <Text style={[styles.title, { color: colors.accentCyan }]}>Watchlist</Text>
        <View style={[styles.emptyState, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}>
          <View style={[styles.lockCircle, { backgroundColor: colors.surfaceHover }]}>
            <Lock size={28} color={colors.accentCyan} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Login Required</Text>
          <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>
            Please login to view and manage your favorite funds.
          </Text>
          <TouchableOpacity
            onPress={onLogin}
            style={[styles.loginBtn, { backgroundColor: colors.accentCyan }]}
          >
            <Text style={styles.loginBtnText}>Login to Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.wrapper}>
        <ActivityIndicator size="large" color={colors.accentCyan} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.wrapper}>
        <Text style={{ color: colors.accentRed }}>Error loading favorites</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: colors.accentCyan }]}>Watchlist</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Track your favorite funds
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.analyzeBtn, { backgroundColor: colors.surfaceHover, borderColor: colors.borderPrimary }]}
            disabled
          >
            <Sparkles size={14} color={colors.accentPurple} />
            <Text style={[styles.analyzeBtnText, { color: colors.textMuted }]}>Analyze</Text>
            <View style={[styles.soonBadge, { backgroundColor: colors.accentPurple }]}>
              <Text style={styles.soonText}>Soon</Text>
            </View>
          </TouchableOpacity>
          <Text style={[styles.countText, { color: colors.textMuted }]}>
            {favorites?.length || 0} ITEMS
          </Text>
        </View>
      </View>

      {!favorites?.length ? (
        <View style={[styles.emptyState, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}>
          <HeartOff size={32} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Favorites Yet</Text>
          <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>
            Start adding mutual funds to your watchlist.
          </Text>
          <TouchableOpacity
            onPress={() => onFundSelect(null)}
            style={[styles.browseBtn, { backgroundColor: colors.accentCyan }]}
          >
            <Text style={styles.browseBtnText}>Browse Funds</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.grid}>
          {favorites.map((fund) => {
            const isPositive = (fund.day_change_pct || 0) >= 0;
            return (
              <View
                key={fund.id}
                style={[styles.favCard, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}
              >
                <View style={styles.favHeader}>
                  <TouchableOpacity
                    onPress={() => onFundSelect(fund.id)}
                    style={{ flex: 1 }}
                  >
                    <Text
                      style={[styles.favName, { color: colors.textPrimary }]}
                      numberOfLines={2}
                    >
                      {fund.scheme_name}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.favActions}>
                    <TouchableOpacity
                      onPress={() => onFundSelect(fund.id)}
                      style={[styles.actionBtn, { backgroundColor: colors.surfaceHover }]}
                    >
                      <BarChart3 size={14} color={colors.accentCyan} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert('Remove', 'Remove from favorites?', [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Remove',
                            style: 'destructive',
                            onPress: () => removeMutation.mutate(fund.id),
                          },
                        ]);
                      }}
                      style={[styles.actionBtn, { backgroundColor: colors.accentRedDim }]}
                    >
                      <HeartOff size={14} color={colors.accentRed} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.favStats}>
                  <Text style={[styles.statLabel, { color: colors.textMuted }]}>Day Change</Text>
                  <View style={styles.statRow}>
                    {isPositive ? (
                      <TrendingUp size={14} color={colors.accentGreen} />
                    ) : (
                      <TrendingDown size={14} color={colors.accentRed} />
                    )}
                    <Text
                      style={[
                        styles.statValue,
                        { color: isPositive ? colors.accentGreen : colors.accentRed },
                      ]}
                    >
                      {isPositive ? '+' : ''}
                      {fund.day_change_pct ? fund.day_change_pct.toFixed(2) : '0.00'}%
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: spacing['4xl'],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSizes['2xl'],
    fontWeight: '700',
  },
  subtitle: {
    fontSize: fontSizes.sm,
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  analyzeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.md,
    borderWidth: 1,
    opacity: 0.8,
  },
  analyzeBtnText: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  soonBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radii.full,
  },
  soonText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '700',
  },
  countText: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    letterSpacing: 1,
  },
  emptyState: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing['3xl'],
    alignItems: 'center',
  },
  lockCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyDesc: {
    fontSize: fontSizes.sm,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  loginBtn: {
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.md,
    borderRadius: radii.md,
  },
  loginBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: fontSizes.base,
  },
  browseBtn: {
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.md,
    borderRadius: radii.md,
  },
  browseBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: fontSizes.base,
  },
  grid: {
    gap: spacing.md,
  },
  favCard: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  favHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  favName: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    lineHeight: 18,
    marginRight: spacing.sm,
  },
  favActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: radii.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: fontSizes.xs,
    fontWeight: '500',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
});
