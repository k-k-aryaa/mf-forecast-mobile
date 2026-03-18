import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Zap, Brain, BarChart3, ShieldCheck, TrendingUp, Eye, ExternalLink, HelpCircle, Target, Clock, Timer, Search, LayoutDashboard, Code2, AlertTriangle } from 'lucide-react-native';
import * as Linking from 'expo-linking';
import { useColors, spacing, radii, fontSizes } from '../theme';
import Header from '../components/Header';

export default function AboutScreen() {
  const colors = useColors();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.content, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}>

          {/* Hero */}
          <Text style={[styles.intro, { color: colors.textSecondary }]}>
            The only platform that gives you{' '}
            <Text style={{ color: colors.accentCyan, fontWeight: '700' }}>real-time AI-estimated NAVs</Text>
            {' '}for mutual funds during market hours.
          </Text>

          {/* The Problem */}
          <View style={[styles.problemSection, { borderColor: 'rgba(239, 68, 68, 0.15)' }]}>
            <HelpCircle size={28} color="#f59e0b" />
            <Text style={[styles.sectionTitle, { color: '#fbbf24' }]}>The Problem: You're Flying Blind</Text>
            <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
              With stocks and ETFs, you can watch prices change every second. But with{' '}
              <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>mutual funds</Text>? You invest your money and then… wait.
            </Text>
            <View style={[styles.highlightBox, { borderLeftColor: colors.accentRed, backgroundColor: 'rgba(239, 68, 68, 0.06)' }]}>
              <Clock size={16} color={colors.accentRed} />
              <Text style={[styles.highlightText, { color: colors.textSecondary }]}>
                Official NAVs are published only <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>once a day, after 9 PM</Text> — during the trading day, you have zero visibility.
              </Text>
            </View>
            <Text style={[styles.sectionText, { color: colors.textSecondary, marginTop: spacing.sm }]}>
              Is your fund up 2% or down 1%? You don't know until the day is over.{' '}
              <Text style={{ color: colors.accentCyan, fontWeight: '700' }}>That changes now.</Text>
            </Text>
          </View>

          {/* The Solution */}
          <View style={[styles.solutionSection, { borderColor: 'rgba(6, 182, 212, 0.15)' }]}>
            <Brain size={30} color={colors.accentCyan} />
            <Text style={[styles.sectionTitle, { color: colors.accentCyan }]}>Our Solution: AI That Watches For You</Text>
            <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
              We analyze the <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>live stock prices</Text> of every holding inside your mutual fund and use <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>AI models</Text> to calculate the estimated NAV in real-time.
            </Text>
            {[
              'We know every stock your mutual fund holds',
              'We track those stocks live during market hours',
              'Our AI calculates estimated NAV and change %',
            ].map((text, i) => (
              <View key={i} style={[styles.stepRow, { backgroundColor: colors.surfaceHover, borderColor: colors.borderSubtle }]}>
                <View style={[styles.stepNumber, { backgroundColor: colors.accentPurple }]}>
                  <Text style={styles.stepNumberText}>{i + 1}</Text>
                </View>
                <Text style={[styles.stepText, { color: colors.textSecondary }]}>{text}</Text>
              </View>
            ))}
          </View>

          {/* Built on Transparency */}
          <View style={[styles.trustSection, { borderColor: 'rgba(16, 185, 129, 0.15)' }]}>
            <Eye size={26} color="#10b981" />
            <Text style={[styles.sectionTitle, { color: '#10b981' }]}>Built on Transparency</Text>
            <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
              We built <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>TruthLens</Text> — our transparency engine that compares yesterday's predictions against the actual official NAVs published by AMCs.
            </Text>
            <View style={[styles.highlightBox, { borderLeftColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.06)' }]}>
              <Target size={16} color="#10b981" />
              <Text style={[styles.highlightText, { color: colors.textSecondary }]}>
                Check our track record before you trust our numbers. If yesterday was 99.7% accurate, you know today's estimate is reliable.
              </Text>
            </View>
          </View>

          {/* Features */}
          <Text style={[styles.featureHeading, { color: colors.textPrimary }]}>What You Get</Text>
          {[
            { icon: Zap, title: 'Live NAV Estimates', desc: "See your fund's estimated NAV and daily change % updating in real-time throughout the trading day.", color: colors.accentCyan },
            { icon: BarChart3, title: 'Portfolio Heatmap', desc: 'See sector-wise and stock-wise attribution — know exactly which holdings are driving returns.', color: colors.accentGreen },
            { icon: TrendingUp, title: 'NAV History Charts', desc: "Track how your fund's NAV has moved over time with interactive charts.", color: colors.accentPurple },
            { icon: ShieldCheck, title: 'Prediction Accuracy Proof', desc: "Every day, we show yesterday's prediction vs. actual NAV — judge our accuracy yourself.", color: '#fbbf24' },
          ].map((f, i) => (
            <View key={i} style={[styles.featureCard, { backgroundColor: colors.surfaceHover, borderColor: colors.borderSubtle }]}>
              <View style={[styles.iconCircle, { backgroundColor: `${f.color}22` }]}>
                <f.icon size={22} color={f.color} />
              </View>
              <View style={styles.featureTextWrap}>
                <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>{f.title}</Text>
                <Text style={[styles.featureDesc, { color: colors.textMuted }]}>{f.desc}</Text>
              </View>
            </View>
          ))}

          {/* Why MF Forecast */}
          <Text style={[styles.featureHeading, { color: colors.textPrimary, marginTop: spacing['2xl'] }]}>Why MF Forecast?</Text>
          {[
            { icon: Timer, text: 'Traditional platforms show NAV once a day. We estimate it every second.', color: colors.accentCyan },
            { icon: Brain, text: 'Powered by AI models trained on real historical data.', color: colors.accentPurple },
            { icon: Search, text: 'Full transparency — past accuracy as proof, not promises.', color: '#10b981' },
            { icon: LayoutDashboard, text: 'Deep portfolio insights with heatmaps and attribution.', color: '#fbbf24' },
          ].map((item, i) => (
            <View key={i} style={styles.whyRow}>
              <View style={[styles.whyIconWrap, { backgroundColor: `${item.color}1A` }]}>
                <item.icon size={18} color={item.color} />
              </View>
              <Text style={[styles.whyText, { color: colors.textSecondary }]}>{item.text}</Text>
            </View>
          ))}

          {/* Redesigned Disclaimer Banner (Now above Dev section) */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Disclaimer')}
            style={[styles.disclaimerBanner, { backgroundColor: `${colors.accentRed}12`, borderColor: `${colors.accentRed}40` }]}
          >
            <AlertTriangle size={20} color={colors.accentRed} />
            <View style={styles.disclaimerBannerTextWrap}>
              <Text style={[styles.disclaimerBannerTitle, { color: colors.accentRed }]}>Important Disclaimer</Text>
              <Text style={[styles.disclaimerBannerSubtitle, { color: colors.textSecondary }]}>
                Read our technical & financial risks before using. <Text style={{ color: colors.accentCyan, fontWeight: '600' }}>View Details »</Text>
              </Text>
            </View>
          </TouchableOpacity>

          {/* Developer Section */}
          <View style={[styles.devSection, { borderTopColor: colors.borderSubtle }]}>
            <Text style={[styles.devTitle, { color: colors.textPrimary }]}>Crafted With Passion</Text>
            <Text style={[styles.devDesc, { color: colors.textMuted }]}>
              Curious about the mind behind this project?
            </Text>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://k-k-aryaa.github.io/')}
              style={[styles.devLink, { borderColor: colors.accentPurple }]}
            >
              <Code2 size={16} color={colors.accentPurple} />
              <Text style={[styles.devLinkText, { color: colors.accentPurple }]}>Developer Portfolio</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, paddingBottom: 100 },
  content: {
    borderWidth: 1,
    borderRadius: radii.xl,
    padding: spacing['2xl'],
  },
  heroTitle: {
    fontSize: fontSizes['2xl'],
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  intro: { fontSize: fontSizes.base, lineHeight: 22, textAlign: 'center', marginBottom: spacing['2xl'] },

  // Problem section
  problemSection: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    backgroundColor: 'rgba(239, 68, 68, 0.03)',
  },
  solutionSection: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    backgroundColor: 'rgba(6, 182, 212, 0.03)',
  },
  trustSection: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing['2xl'],
    backgroundColor: 'rgba(16, 185, 129, 0.03)',
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

  // Steps
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    marginTop: spacing.sm,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontSize: fontSizes.sm,
    fontWeight: '700',
  },
  stepText: {
    fontSize: fontSizes.sm,
    flex: 1,
    lineHeight: 18,
  },

  // Features
  featureHeading: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.lg,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextWrap: { flex: 1 },
  featureTitle: { fontSize: fontSizes.base, fontWeight: '700', marginBottom: spacing.xs },
  featureDesc: { fontSize: fontSizes.sm, lineHeight: 18 },

  // Why section
  whyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
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

  // Developer
  devSection: {
    marginTop: spacing['2xl'],
    paddingTop: spacing['2xl'],
    borderTopWidth: 1,
    alignItems: 'center',
  },
  devTitle: { fontSize: fontSizes.lg, fontWeight: '700', marginBottom: spacing.xs },
  devDesc: { fontSize: fontSizes.sm, marginBottom: spacing.md },
  devLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderRadius: radii.md,
  },
  devLinkText: { fontSize: fontSizes.sm, fontWeight: '600' },

  // Disclaimer banner
  disclaimerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    borderStyle: 'dashed',
  },
  disclaimerBannerTextWrap: {
    flex: 1,
  },
  disclaimerBannerTitle: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    marginBottom: 2,
  },
  disclaimerBannerSubtitle: {
    fontSize: fontSizes.xs,
    lineHeight: 16,
  },
});
