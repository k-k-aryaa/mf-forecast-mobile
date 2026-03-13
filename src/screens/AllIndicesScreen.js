import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import api from '../api/api';
import { useColors, spacing, radii, fontSizes } from '../theme';

export default function AllIndicesScreen() {
  const [indices, setIndices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const colors = useColors();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const data = await api.getMarketIndices();
        if (Array.isArray(data)) setIndices(data);
      } catch (err) {
        setError('Failed to load market data');
      } finally {
        setLoading(false);
      }
    };
    fetchIndices();
    const interval = setInterval(fetchIndices, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.borderPrimary }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: colors.surfaceHover }]}
        >
          <ArrowLeft size={18} color={colors.textSecondary} />
          <Text style={[styles.backText, { color: colors.textSecondary }]}>Back</Text>
        </TouchableOpacity>

        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <View style={[styles.dotLive, { backgroundColor: colors.accentNeonGreen }]} />
            <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>All Market Indices</Text>
          </View>
          <Text style={[styles.pageSubtitle, { color: colors.textMuted }]}>
            {indices.length} indices available • Real-time data
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.accentCyan} style={{ marginTop: 40 }} />
        ) : error ? (
          <Text style={[styles.errorText, { color: colors.accentRed }]}>{error}</Text>
        ) : (
          <View style={styles.grid}>
            {indices.map((index) => (
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
                    { color: index.change >= 0 ? colors.accentGreen : colors.accentRed },
                  ]}
                >
                  {index.price?.toFixed(2) ?? '-'}
                </Text>
                <Text
                  style={[
                    styles.indexChange,
                    { color: index.change >= 0 ? colors.accentGreen : colors.accentRed },
                  ]}
                >
                  {index.change >= 0 ? '▲' : '▼'} {Math.abs(index.change ?? 0).toFixed(2)} (
                  {Math.abs(index.change_pct ?? 0).toFixed(2)}%)
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  backText: { fontSize: fontSizes.sm, fontWeight: '600' },
  titleSection: {},
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dotLive: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pageTitle: {
    fontSize: fontSizes.xl,
    fontWeight: '800',
  },
  pageSubtitle: {
    fontSize: fontSizes.sm,
    marginTop: 2,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  errorText: {
    textAlign: 'center',
    fontSize: fontSizes.base,
    marginTop: 40,
  },
  grid: {
    gap: spacing.md,
  },
  card: {
    borderWidth: 1,
    borderRadius: radii.md,
    padding: spacing.lg,
  },
  indexName: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    marginBottom: 4,
  },
  indexPrice: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  indexChange: {
    fontSize: fontSizes.sm,
    fontFamily: 'monospace',
    marginTop: 2,
  },
});
