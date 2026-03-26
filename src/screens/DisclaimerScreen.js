import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AlertTriangle, FlaskConical, ShieldAlert, Scale, ArrowLeft } from 'lucide-react-native';
import { useColors, spacing, radii, fontSizes, useResponsive } from '../theme';
import Header from '../components/Header';

export default function DisclaimerScreen() {
  const colors = useColors();
  const navigation = useNavigation();
  const { isTablet, scale, maxContentWidth } = useResponsive();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={maxContentWidth}>
          {/* Back button */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
            <ArrowLeft size={scale(18)} color={colors.textMuted} />
            <Text style={[styles.backText, { color: colors.textMuted, fontSize: scale(fontSizes.sm) }]}>Back</Text>
          </TouchableOpacity>

          <View style={[styles.content, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary, padding: isTablet ? spacing['3xl'] : spacing['2xl'] }]}>

            {/* Hero */}
            <View style={styles.heroSection}>
              <View style={[styles.heroIcon, { backgroundColor: 'rgba(239, 68, 68, 0.12)', width: scale(64), height: scale(64), borderRadius: scale(32) }]}>
                <AlertTriangle size={scale(32)} color={colors.accentRed} />
              </View>
              <Text style={[styles.title, { color: colors.accentRed, fontSize: scale(fontSizes['2xl']) }]}>Disclaimer</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: scale(fontSizes.base) }]}>
                Important information about using MF Forecast.
              </Text>
            </View>

            {/* Experimental Banner */}
            <View style={[styles.banner, { borderColor: 'rgba(245, 158, 11, 0.2)' }]}>
              <FlaskConical size={scale(20)} color="#f59e0b" />
              <Text style={[styles.bannerText, { color: colors.textSecondary, fontSize: scale(fontSizes.sm) }]}>
                MF Forecast is an <Text style={{ color: '#fbbf24', fontWeight: '700' }}>experimental, educational project</Text> — not a certified financial product.
              </Text>
            </View>

            {/* Core Cards */}
            <View style={isTablet ? styles.cardsRowTablet : null}>
              <View style={[styles.card, isTablet && styles.cardTabletHalf, { backgroundColor: colors.surfaceHover, borderColor: colors.borderSubtle }]}>
                <View style={[styles.cardIcon, { backgroundColor: 'rgba(239, 68, 68, 0.12)' }]}>
                  <ShieldAlert size={scale(22)} color={colors.accentRed} />
                </View>
                <Text style={[styles.cardTitle, { color: colors.textPrimary, fontSize: scale(fontSizes.base) }]}>AI Estimates, Not Facts</Text>
                <Text style={[styles.cardText, { color: colors.textSecondary, fontSize: scale(fontSizes.sm) }]}>
                  All NAV values and predictions are <Text style={{ fontWeight: '600', color: colors.textPrimary }}>AI-generated approximations</Text>. They may deviate from actual values. We provide past accuracy metrics for transparency, but no guarantee of correctness.
                </Text>
              </View>

              <View style={[styles.card, isTablet && styles.cardTabletHalf, { backgroundColor: colors.surfaceHover, borderColor: colors.borderSubtle }]}>
                <View style={[styles.cardIcon, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
                  <Scale size={scale(22)} color="#f59e0b" />
                </View>
                <Text style={[styles.cardTitle, { color: colors.textPrimary, fontSize: scale(fontSizes.base) }]}>Not Financial Advice</Text>
                <Text style={[styles.cardText, { color: colors.textSecondary, fontSize: scale(fontSizes.sm) }]}>
                  Nothing on this platform is investment, financial, or legal advice. Content is <Text style={{ fontWeight: '600', color: colors.textPrimary }}>purely informational</Text>. Always consult a qualified financial advisor.
                </Text>
              </View>
            </View>

            {/* Additional Terms */}
            <View style={[styles.termsSection, { backgroundColor: colors.surfaceHover, borderColor: colors.borderSubtle }]}>
              <Text style={[styles.termsTitle, { color: colors.textPrimary, fontSize: scale(fontSizes.base) }]}>Additional Terms</Text>
              {[
                'The developers are not liable for any financial losses arising from use of this application. You use it at your own risk.',
                'Data is sourced from third-party APIs and may be delayed, interrupted, or inaccurate.',
                'This application is under active development. Features and algorithms may change without notice.',
              ].map((text, i) => (
                <View key={i} style={styles.termRow}>
                  <View style={[styles.termDot, { backgroundColor: colors.textMuted }]} />
                  <Text style={[styles.termText, { color: colors.textSecondary, fontSize: scale(fontSizes.sm) }]}>{text}</Text>
                </View>
              ))}
            </View>

            {/* Acceptance */}
            <View style={[styles.acceptance, { borderTopColor: colors.borderSubtle, borderBottomColor: colors.borderSubtle }]}>
              <Text style={[styles.acceptanceText, { color: colors.textMuted, fontSize: scale(fontSizes.sm) }]}>
                By using MF Forecast, you acknowledge that you have read and accepted the terms above, and that your use is <Text style={{ fontWeight: '600', color: colors.textSecondary }}>at your own risk</Text>.
              </Text>
            </View>

            {/* CTA */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Main')}
              style={[styles.ctaBtn, { backgroundColor: colors.accentCyan, paddingVertical: isTablet ? spacing.xl : spacing.lg }]}
            >
              <Text style={[styles.ctaText, { fontSize: scale(fontSizes.base) }]}>I Understand — Go to Dashboard</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: 100 },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  backText: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
  },
  content: {
    borderWidth: 1,
    borderRadius: radii.xl,
    padding: spacing['2xl'],
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSizes['2xl'],
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSizes.base,
    textAlign: 'center',
    lineHeight: 22,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.md,
    borderWidth: 1,
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    marginBottom: spacing.xl,
  },
  bannerText: {
    flex: 1,
    fontSize: fontSizes.sm,
    lineHeight: 20,
  },
  cardsRowTablet: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  card: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTabletHalf: {
    flex: 1,
    marginBottom: spacing.md,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: fontSizes.base,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  cardText: {
    fontSize: fontSizes.sm,
    lineHeight: 20,
  },
  termsSection: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  termsTitle: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  termDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 7,
  },
  termText: {
    flex: 1,
    fontSize: fontSizes.sm,
    lineHeight: 20,
  },
  acceptance: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: spacing.lg,
    marginBottom: spacing.xl,
  },
  acceptanceText: {
    fontSize: fontSizes.sm,
    lineHeight: 20,
    textAlign: 'center',
  },
  ctaBtn: {
    paddingVertical: spacing.lg,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontSize: fontSizes.base,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
