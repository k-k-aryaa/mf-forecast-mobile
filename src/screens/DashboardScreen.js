import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Brain, HelpCircle, Clock, Timer, Search, LayoutDashboard, Sparkles, Rocket, Play } from 'lucide-react-native';
import { useColors, spacing, radii, fontSizes, shadows, useResponsive } from '../theme';
import Header from '../components/Header';
import FundSelector from '../components/FundSelector';

export default function DashboardScreen() {
  const colors = useColors();
  const navigation = useNavigation();
  const scrollRef = useRef(null);
  const videoY = useRef(0);
  const { isTablet, scale, maxContentWidth } = useResponsive();

  const handleWatchDemo = () => {
    scrollRef.current?.scrollTo({ y: videoY.current - 20, animated: true });
  };

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

          {/* Watch Demo Chip */}
          <View style={styles.demoChipRow}>
            <TouchableOpacity
              style={[styles.demoChip, { borderColor: `${colors.accentCyan}40` }]}
              onPress={handleWatchDemo}
              activeOpacity={0.7}
            >
              <Play size={scale(13)} color={colors.accentCyan} />
              <Text style={[styles.demoChipText, { color: colors.accentCyan, fontSize: scale(fontSizes.xs) }]}>Watch Demo</Text>
            </TouchableOpacity>
          </View>

          {/* Problem Section */}
          <View style={[styles.problemSection, { borderColor: colors.accentRedDim, backgroundColor: colors.accentRedDim }]}>
            <HelpCircle size={scale(28)} color={colors.accentAmber} />
            <Text style={[styles.sectionTitle, { color: colors.accentYellow, fontSize: scale(fontSizes.lg) }]}>The Problem: You're Flying Blind</Text>
            <Text style={[styles.sectionText, { color: colors.textSecondary, fontSize: scale(fontSizes.sm) }]}>
              With stocks and ETFs, you can watch prices change every second. But with{' '}
              <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>mutual funds</Text>? You invest your money and then… wait.
            </Text>
            <View style={[styles.highlightBox, { borderLeftColor: colors.accentRed, backgroundColor: colors.surfaceHover }]}>
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

          {/* Video Demo Section */}
          <View onLayout={(e) => { videoY.current = e.nativeEvent.layout.y; }} style={[styles.videoSection, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}>
            <View style={[styles.videoAccentLine, { backgroundColor: colors.accentCyan }]} />
            <View style={styles.videoHeader}>
              <Text style={[styles.videoTitle, { color: colors.textPrimary, fontSize: scale(fontSizes.lg) }]}>See It In Action</Text>
              <Text style={[styles.videoSubtitle, { color: colors.textSecondary, fontSize: scale(fontSizes.xs) }]}>
                Watch a quick walkthrough of how MF Forecast tracks your funds in real-time
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.videoThumbnail, { borderColor: `${colors.accentCyan}40` }]}
              onPress={() => Linking.openURL('https://www.youtube.com/watch?v=lTnvXDMOPrA')}
              activeOpacity={0.8}
            >
              <View style={styles.videoGradientBorder}>
                <View style={[styles.videoBlackBg, { backgroundColor: colors.bgPrimary }]}>
                  <View style={styles.videoPlayOverlay}>
                    <View style={styles.videoPlayCircle}>
                      <Play size={scale(28)} color="#fff" fill="#fff" />
                    </View>
                    <Text style={[styles.videoPlayLabel, { color: colors.textSecondary, fontSize: scale(fontSizes.xs) }]}>Tap to play on YouTube</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Why MF Forecast */}
          <Text style={[styles.whyHeading, { color: colors.textPrimary, fontSize: scale(fontSizes.lg) }]}>Why MF Forecast?</Text>
          <View style={isTablet ? styles.whyGridTablet : null}>
            {[
              { icon: Timer, text: 'Traditional platforms show NAV once a day. We estimate it every minute.', color: colors.accentCyan },
              { icon: Brain, text: 'Powered by AI models trained on real historical data.', color: colors.accentPurple },
              { icon: Search, text: 'Full transparency — past accuracy as proof, not promises.', color: colors.accentGreen },
              { icon: LayoutDashboard, text: 'Deep portfolio insights with heatmaps and attribution.', color: colors.accentYellow },
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
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: scale(6) }}>
              <Rocket size={scale(20)} color={colors.accentCyan} />
              <Text style={[styles.ctaHint, { color: colors.accentCyan, fontSize: scale(fontSizes.base) }]}>
                Select a Fund Above to Get Started
              </Text>
            </View>
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
    borderWidth: 1.5,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    // backgroundColor set dynamically via inline style
    ...shadows.md,
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
    borderLeftWidth: 4,
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

  // Demo Chip
  demoChipRow: {
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  demoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: 'rgba(6, 182, 212, 0.08)',
  },
  demoChipText: {
    fontWeight: '600',
  },

  // Video Section
  videoSection: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  videoAccentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  videoHeader: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  videoIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoTitle: {
    fontWeight: '700',
  },
  videoSubtitle: {
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 300,
  },
  videoThumbnail: {
    borderRadius: radii.md + 3,
    overflow: 'hidden',
  },
  videoGradientBorder: {
    padding: 2.5,
    borderRadius: radii.md + 3,
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
  },
  videoBlackBg: {
    borderRadius: radii.md,
    aspectRatio: 16 / 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayOverlay: {
    alignItems: 'center',
    gap: spacing.md,
  },
  videoPlayCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(6, 182, 212, 0.25)',
    borderWidth: 2,
    borderColor: 'rgba(6, 182, 212, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayLabel: {
    fontWeight: '500',
  },
});
