import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Brain, HelpCircle, Clock, Timer, Search, LayoutDashboard, Sparkles } from 'lucide-react-native';
import { useColors, spacing, radii, fontSizes, useResponsive } from '../theme';
import Header from '../components/Header';
import FundSelector from '../components/FundSelector';

export default function DashboardScreen() {
  const colors = useColors();
  const navigation = useNavigation();
  const scrollRef = useRef(null);
  const { isTablet, scale, maxContentWidth } = useResponsive();

  const handleFundSelect = (fundId) => {
    if (fundId) {
      navigation.navigate('FundDetail', { fundId });
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <Header />
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.content, maxContentWidth]}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={[styles.heroTitle, { color: colors.accentCyan, fontSize: scale(fontSizes['2xl']) }]}>
              See Your Mutual Fund Move — Live.
            </Text>
            <Text style={[styles.heroSubtitle, { color: colors.textSecondary, fontSize: scale(fontSizes.base), maxWidth: isTablet ? 500 : 340 }]}>
              The only platform that gives you{' '}
              <Text style={{ color: colors.accentCyan, fontWeight: '700' }}>real-time AI-estimated NAVs</Text>
              {' '}for mutual funds during market hours.
            </Text>
          </View>

          {/* Fund Selector */}
          <FundSelector selectedFundId={null} onSelect={handleFundSelect} />

          {/* Problem Section */}
          <View style={[styles.problemSection, { borderColor: 'rgba(239, 68, 68, 0.15)' }]}>
            <HelpCircle size={scale(28)} color="#f59e0b" />
            <Text style={[styles.sectionTitle, { color: '#fbbf24', fontSize: scale(fontSizes.lg) }]}>The Problem: You're Flying Blind</Text>
            <Text style={[styles.sectionText, { color: colors.textSecondary, fontSize: scale(fontSizes.sm) }]}>
              With stocks and ETFs, you can watch prices change every second. But with{' '}
              <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>mutual funds</Text>? You invest your money and then… wait.
            </Text>
            <View style={[styles.highlightBox, { borderLeftColor: colors.accentRed, backgroundColor: 'rgba(239, 68, 68, 0.06)' }]}>
              <Clock size={scale(16)} color={colors.accentRed} />
              <Text style={[styles.highlightText, { color: colors.textSecondary, fontSize: scale(fontSizes.sm) }]}>
                Official NAVs are published only <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>once a day, after 9 PM</Text> — during the trading day, you have zero visibility.
              </Text>
            </View>
            <Text style={[styles.sectionText, { color: colors.textSecondary, marginTop: spacing.sm, fontSize: scale(fontSizes.sm) }]}>
              Is your fund up 2% or down 1%? You don't know until the day is over.{' '}
              <Text style={{ color: colors.accentCyan, fontWeight: '700' }}>That changes now.</Text>
            </Text>
          </View>

          {/* Why MF Forecast */}
          <Text style={[styles.whyHeading, { color: colors.textPrimary, fontSize: scale(fontSizes.lg) }]}>Why MF Forecast?</Text>
          <View style={isTablet ? styles.whyGridTablet : null}>
            {[
              { icon: Timer, text: 'Traditional platforms show NAV once a day. We estimate it every minute.', color: colors.accentCyan },
              { icon: Brain, text: 'Powered by AI models trained on real historical data.', color: colors.accentPurple },
              { icon: Search, text: 'Full transparency — past accuracy as proof, not promises.', color: '#10b981' },
              { icon: LayoutDashboard, text: 'Deep portfolio insights with heatmaps and attribution.', color: '#fbbf24' },
            ].map((item, i) => (
              <View key={i} style={[styles.whyRow, isTablet && styles.whyRowTablet]}>
                <View style={[styles.whyIconWrap, { backgroundColor: `${item.color}1A`, width: scale(36), height: scale(36) }]}>
                  <item.icon size={scale(18)} color={item.color} />
                </View>
                <Text style={[styles.whyText, { color: colors.textSecondary, fontSize: scale(fontSizes.sm) }]}>{item.text}</Text>
              </View>
            ))}
          </View>

          {/* CTA */}
          <TouchableOpacity 
            style={styles.ctaSection}
            onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
            activeOpacity={0.7}
          >
            <Text style={[styles.ctaText, { color: colors.textMuted, fontSize: scale(fontSizes.sm) }]}>
              Ready to see your fund's real-time performance?
            </Text>
            <Text style={[styles.ctaHint, { color: colors.accentCyan, fontSize: scale(fontSizes.base) }]}>
              🚀 Select a Fund Above to Get Started
            </Text>
          </TouchableOpacity>
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

  // Hero
  heroSection: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
  },
  heroTitle: {
    fontSize: fontSizes['2xl'],
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: fontSizes.base,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 340,
  },

  // Problem
  problemSection: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    backgroundColor: 'rgba(239, 68, 68, 0.03)',
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionText: {
    fontSize: fontSizes.sm,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  highlightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderRadius: radii.sm,
    marginTop: spacing.sm,
  },
  highlightText: {
    fontSize: fontSizes.sm,
    lineHeight: 20,
    flex: 1,
  },

  // Why section
  whyHeading: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.lg,
  },
  whyGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  whyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  whyRowTablet: {
    width: '47%',
  },
  whyIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whyText: {
    fontSize: fontSizes.sm,
    flex: 1,
    lineHeight: 18,
  },

  // CTA
  ctaSection: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
  },
  ctaText: {
    fontSize: fontSizes.sm,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  ctaHint: {
    fontSize: fontSizes.base,
    fontWeight: '700',
    textAlign: 'center',
  },
});
