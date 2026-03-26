import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useColors, spacing, useResponsive } from '../theme';
import Header from '../components/Header';
import MarketTicker from '../components/MarketTicker';
import FundSelector from '../components/FundSelector';
import EstimateCard from '../components/EstimateCard';
import NavChart from '../components/NavChart';
import Attribution from '../components/Attribution';
import TruthLens from '../components/TruthLens';

export default function FundDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const colors = useColors();
  const { fundId } = route.params;
  const { isTablet, maxContentWidth } = useResponsive();

  const handleFundChange = (newFundId) => {
    navigation.setParams({ fundId: newFundId });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <Header />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <MarketTicker />

        <View style={[styles.content, maxContentWidth]}>
          <FundSelector selectedFundId={fundId} onSelect={handleFundChange} />

          {isTablet ? (
            /* Tablet: side-by-side layout for estimate + truth lens */
            <View style={styles.grid}>
              <View style={styles.tabletTopRow}>
                <View style={styles.tabletTopCard}>
                  <EstimateCard fundId={fundId} />
                </View>
                <View style={styles.tabletTopCard}>
                  <TruthLens fundId={fundId} />
                </View>
              </View>
              <NavChart fundId={fundId} />
              <Attribution fundId={fundId} />
            </View>
          ) : (
            <View style={styles.grid}>
              <EstimateCard fundId={fundId} />
              <NavChart fundId={fundId} />
              <Attribution fundId={fundId} />
              <TruthLens fundId={fundId} />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  grid: {
    gap: spacing.lg,
  },
  tabletTopRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  tabletTopCard: {
    flex: 1,
  },
});
