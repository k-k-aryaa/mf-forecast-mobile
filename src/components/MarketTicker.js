import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useColors, spacing, radii, fontSizes } from '../theme';
import api from '../api/api';

const VISIBLE_INDICES_COUNT = 5;

export default function MarketTicker() {
  const [indices, setIndices] = useState([]);
  const [loading, setLoading] = useState(true);
  const colors = useColors();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const data = await api.getMarketIndices();
        if (Array.isArray(data)) setIndices(data);
      } catch (err) {
        console.log('Market indices fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchIndices();
    const interval = setInterval(fetchIndices, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.tickerBg, borderBottomColor: colors.borderPrimary }]}>
        <ActivityIndicator size="small" color={colors.accentCyan} />
      </View>
    );
  }

  if (!indices.length) return null;

  const visibleIndices = indices.slice(0, VISIBLE_INDICES_COUNT);
  const hasMore = indices.length > VISIBLE_INDICES_COUNT;
  const remainingCount = indices.length - VISIBLE_INDICES_COUNT;

  return (
    <View style={[styles.container, { backgroundColor: colors.tickerBg, borderBottomColor: colors.borderPrimary }]}>
      <View style={styles.headerRow}>
        <View style={styles.labelRow}>
          <View style={[styles.dotLive, { backgroundColor: colors.accentNeonGreen }]} />
          <Text style={[styles.labelText, { color: colors.textMuted }]}>Market Indices</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {visibleIndices.map((index) => {
          const isPositive = index.change >= 0;
          return (
            <TouchableOpacity
              key={index.symbol}
              style={[styles.card, { backgroundColor: colors.indexCardBg, borderColor: colors.borderSubtle }]}
              onPress={() => navigation.navigate('IndexDetail', { symbol: index.symbol })}
              activeOpacity={0.7}
            >
              <Text style={[styles.indexName, { color: colors.textSecondary }]} numberOfLines={1}>
                {index.name}
              </Text>
              <Text
                style={[
                  styles.indexPrice,
                  { color: isPositive ? colors.accentGreen : colors.accentRed },
                ]}
              >
                {index.price?.toFixed(2) ?? '-'}
              </Text>
              <Text
                style={[
                  styles.indexChange,
                  { color: isPositive ? colors.accentGreen : colors.accentRed },
                ]}
              >
                {isPositive ? '▲' : '▼'} {Math.abs(index.change ?? 0).toFixed(2)} (
                {Math.abs(index.change_pct ?? 0).toFixed(2)}%)
              </Text>
            </TouchableOpacity>
          );
        })}

        {hasMore && (
          <TouchableOpacity
            style={[styles.moreBtn, { backgroundColor: colors.surfaceHover, borderColor: colors.borderPrimary }]}
            onPress={() => navigation.navigate('AllIndices')}
          >
            <Text style={[styles.moreCount, { color: colors.accentCyan }]}>+{remainingCount}</Text>
            <Text style={[styles.moreText, { color: colors.textMuted }]}>More</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dotLive: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  labelText: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  scrollContent: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  card: {
    borderWidth: 1,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minWidth: 130,
  },
  indexName: {
    fontSize: fontSizes.xs,
    fontWeight: '500',
    marginBottom: 2,
  },
  indexPrice: {
    fontSize: fontSizes.base,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  indexChange: {
    fontSize: fontSizes['2xs'],
    fontFamily: 'monospace',
    marginTop: 2,
  },
  moreBtn: {
    borderWidth: 1,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreCount: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
  },
  moreText: {
    fontSize: fontSizes['2xs'],
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
