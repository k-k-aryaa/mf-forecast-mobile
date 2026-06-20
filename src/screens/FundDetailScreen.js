import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Flag } from 'lucide-react-native';
import { useColors, spacing, radii, fontSizes, useResponsive } from '../theme';
import Header from '../components/Header';
import MarketTicker from '../components/MarketTicker';
import FundSelector from '../components/FundSelector';
import EstimateCard from '../components/EstimateCard';
import NavChart from '../components/NavChart';
import Attribution from '../components/Attribution';
import TruthLens from '../components/TruthLens';
import ReportIssueModal from '../components/ReportIssueModal';

export default function FundDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const colors = useColors();
  const { fundId } = route.params;
  const { isTablet, scale, maxContentWidth } = useResponsive();
  const [reportOpen, setReportOpen] = useState(false);

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

          {/* Report Issue Button — aligned right, matching frontend */}
          <View style={styles.reportRow}>
            <TouchableOpacity
              style={[
                styles.reportBtn,
                {
                  backgroundColor: `${colors.accentCyan}12`,
                  borderColor: `${colors.accentCyan}40`,
                },
              ]}
              onPress={() => setReportOpen(true)}
              activeOpacity={0.7}
            >
              <Flag size={scale(12)} color={colors.accentCyan} />
              <Text
                style={[
                  styles.reportBtnText,
                  { color: colors.accentCyan, fontSize: scale(fontSizes.xs) },
                ]}
              >
                Report Issue
              </Text>
            </TouchableOpacity>
          </View>

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

      {/* Report Issue Modal */}
      <ReportIssueModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        fundId={fundId}
        mode="issue"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
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
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  reportBtnText: {
    fontWeight: '600',
  },
});
