import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Zap, Brain, BarChart3, Search, ExternalLink, ArrowLeft } from 'lucide-react-native';
import * as Linking from 'expo-linking';
import { useColors, spacing, radii, fontSizes } from '../theme';
import Header from '../components/Header';

export default function AboutScreen() {
  const colors = useColors();
  const navigation = useNavigation();

  const features = [
    { icon: Zap, title: 'Real-Time NAV Prediction', desc: "Don't wait for 9 PM. Get instant, accurate estimated NAVs using advanced AI." },
    { icon: Brain, title: 'AI-Driven Intelligence', desc: 'We trained our AI model with past data to give you accurate live NAV and change percent.' },
    { icon: BarChart3, title: 'Dynamic Heatmaps', desc: "Visualize sector-wise performance and portfolio allocations instantly." },
    { icon: Search, title: 'Previous Day Prediction', desc: 'Track our prediction accuracy against official NAVs daily.' },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.content, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}>
          <Text style={[styles.heroTitle, { color: colors.accentCyan }]}>
            AI-Powered Real-Time Mutual Fund Navigator
          </Text>

          <Text style={[styles.intro, { color: colors.textSecondary }]}>
            Experience the future of mutual fund tracking. Our advanced AI-driven engine bridges the gap between market movements and official end-of-day NAVs.
          </Text>

          <View style={styles.featuresGrid}>
            {features.map((f, i) => (
              <View key={i} style={[styles.featureCard, { backgroundColor: colors.surfaceHover, borderColor: colors.borderSubtle }]}>
                <View style={[styles.iconCircle, { backgroundColor: `${colors.accentCyan}22` }]}>
                  <f.icon size={24} color={colors.accentCyan} />
                </View>
                <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>{f.title}</Text>
                <Text style={[styles.featureDesc, { color: colors.textMuted }]}>{f.desc}</Text>
              </View>
            ))}
          </View>

          <View style={styles.whySection}>
            <Text style={[styles.whyTitle, { color: colors.textPrimary }]}>Why Use Us?</Text>
            <Text style={[styles.whyDesc, { color: colors.textMuted }]}>
              Traditional platforms update once a day. We update every second. Make informed decisions with the power of live data.
            </Text>
          </View>

          <View style={styles.devSection}>
            <Text style={[styles.devTitle, { color: colors.textPrimary }]}>Meet the Developer</Text>
            <Text style={[styles.devDesc, { color: colors.textMuted }]}>
              Want to know more about the developer behind this project?
            </Text>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://k-k-aryaa.github.io/')}
              style={[styles.devLink, { borderColor: colors.accentCyan }]}
            >
              <ExternalLink size={16} color={colors.accentCyan} />
              <Text style={[styles.devLinkText, { color: colors.accentCyan }]}>Visit Developer Website</Text>
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
    marginBottom: spacing.lg,
    letterSpacing: -0.5,
  },
  intro: { fontSize: fontSizes.base, lineHeight: 22, textAlign: 'center', marginBottom: spacing['2xl'] },
  featuresGrid: { gap: spacing.md },
  featureCard: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featureTitle: { fontSize: fontSizes.base, fontWeight: '700', marginBottom: spacing.xs },
  featureDesc: { fontSize: fontSizes.sm, lineHeight: 18 },
  whySection: { marginTop: spacing['2xl'], marginBottom: spacing['2xl'] },
  whyTitle: { fontSize: fontSizes.xl, fontWeight: '700', marginBottom: spacing.sm },
  whyDesc: { fontSize: fontSizes.base, lineHeight: 22 },
  devSection: { marginBottom: spacing['2xl'] },
  devTitle: { fontSize: fontSizes.xl, fontWeight: '700', marginBottom: spacing.sm },
  devDesc: { fontSize: fontSizes.base, lineHeight: 22, marginBottom: spacing.md },
  devLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderRadius: radii.md,
    alignSelf: 'flex-start',
  },
  devLinkText: { fontSize: fontSizes.sm, fontWeight: '600' },
  ctaBtn: {
    paddingVertical: spacing.lg,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  ctaText: { color: '#fff', fontSize: fontSizes.base, fontWeight: '700' },
});
