import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AlertTriangle, FlaskConical, ShieldAlert, Scale, ArrowLeft } from 'lucide-react-native';
import { useColors, spacing, radii, fontSizes } from '../theme';
import Header from '../components/Header';

export default function DisclaimerScreen() {
  const colors = useColors();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Back button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
          <ArrowLeft size={18} color={colors.textMuted} />
          <Text style={[styles.backText, { color: colors.textMuted }]}>Back</Text>
        </TouchableOpacity>

        <View style={[styles.content, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}>

          {/* Hero */}
          <View style={styles.heroSection}>
            <View style={[styles.heroIcon, { backgroundColor: 'rgba(239, 68, 68, 0.12)' }]}>
              <AlertTriangle size={32} color={colors.accentRed} />
            </View>
            <Text style={[styles.title, { color: colors.accentRed }]}>Disclaimer</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Important information about using MF Forecast.
            </Text>
          </View>

          {/* Experimental Banner */}
          <View style={[styles.banner, { borderColor: 'rgba(245, 158, 11, 0.2)' }]}>
            <FlaskConical size={20} color="#f59e0b" />
            <Text style={[styles.bannerText, { color: colors.textSecondary }]}>
              MF Forecast is an <Text style={{ color: '#fbbf24', fontWeight: '700' }}>experimental, educational project</Text> — not a certified financial product.
            </Text>
          </View>

          {/* Core Cards */}
          <View style={[styles.card, { backgroundColor: colors.surfaceHover, borderColor: colors.borderSubtle }]}>
            <View style={[styles.cardIcon, { backgroundColor: 'rgba(239, 68, 68, 0.12)' }]}>
              <ShieldAlert size={22} color={colors.accentRed} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>AI Estimates, Not Facts</Text>
            <Text style={[styles.cardText, { color: colors.textSecondary }]}>
              All NAV values and predictions are <Text style={{ fontWeight: '600', color: colors.textPrimary }}>AI-generated approximations</Text>. They may deviate from actual values. We provide past accuracy metrics for transparency, but no guarantee of correctness.
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.surfaceHover, borderColor: colors.borderSubtle }]}>
            <View style={[styles.cardIcon, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
              <Scale size={22} color="#f59e0b" />
            </View>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Not Financial Advice</Text>
            <Text style={[styles.cardText, { color: colors.textSecondary }]}>
              Nothing on this platform is investment, financial, or legal advice. Content is <Text style={{ fontWeight: '600', color: colors.textPrimary }}>purely informational</Text>. Always consult a qualified financial advisor.
            </Text>
          </View>

          {/* Additional Terms */}
          <View style={[styles.termsSection, { backgroundColor: colors.surfaceHover, borderColor: colors.borderSubtle }]}>
            <Text style={[styles.termsTitle, { color: colors.textPrimary }]}>Additional Terms</Text>
            {[
              'The developers are not liable for any financial losses arising from use of this application. You use it at your own risk.',
              'Data is sourced from third-party APIs and may be delayed, interrupted, or inaccurate.',
              'This application is under active development. Features and algorithms may change without notice.',
            ].map((text, i) => (
              <View key={i} style={styles.termRow}>
                <View style={[styles.termDot, { backgroundColor: colors.textMuted }]} />
                <Text style={[styles.termText, { color: colors.textSecondary }]}>{text}</Text>
              </View>
            ))}
          </View>

          {/* Acceptance */}
          <View style={[styles.acceptance, { borderTopColor: colors.borderSubtle, borderBottomColor: colors.borderSubtle }]}>
            <Text style={[styles.acceptanceText, { color: colors.textMuted }]}>
              By using MF Forecast, you acknowledge that you have read and accepted the terms above, and that your use is <Text style={{ fontWeight: '600', color: colors.textSecondary }}>at your own risk</Text>.
            </Text>
          </View>

          {/* CTA */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Main')}
            style={[styles.ctaBtn, { backgroundColor: colors.accentCyan }]}
          >
            <Text style={styles.ctaText}>I Understand — Go to Dashboard</Text>
          </TouchableOpacity>

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
  card: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.lg,
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
