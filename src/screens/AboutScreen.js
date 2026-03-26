import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Zap, Brain, BarChart3, ShieldCheck, TrendingUp, Eye, Target, Code2, AlertTriangle, Trash2 } from 'lucide-react-native';
import * as Linking from 'expo-linking';
import { useColors, spacing, radii, fontSizes, useResponsive } from '../theme';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function AboutScreen() {
  const colors = useColors();
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const { isTablet, scale, maxContentWidth } = useResponsive();

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you absolutely sure you want to permanently delete your account and all associated data? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);
              await api.deleteAccount();
              logout();
            } catch (e) {
              Alert.alert("Error", "Failed to delete account. Please try again later.");
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.content, maxContentWidth, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}>

          {/* Hero */}
          <Text style={[styles.intro, { color: colors.textSecondary, fontSize: scale(fontSizes.base) }]}>
            Transparent, AI-powered mutual fund NAV estimates — built with accuracy you can verify.
          </Text>

          {/* How It Works (combined Solution + Features) */}
          <View style={[styles.howSection, { borderColor: 'rgba(6, 182, 212, 0.15)' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm }}>
              <View style={[styles.sectionIconWrap, { backgroundColor: 'rgba(6, 182, 212, 0.15)' }]}>
                <Brain size={scale(24)} color={colors.accentCyan} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.accentCyan, marginTop: 0, marginBottom: 0, fontSize: scale(fontSizes.lg) }]}>How It Works</Text>
            </View>
            <Text style={[styles.sectionText, { color: colors.textSecondary, fontSize: scale(fontSizes.sm) }]}>
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
                <Text style={[styles.stepText, { color: colors.textSecondary, fontSize: scale(fontSizes.sm) }]}>{text}</Text>
              </View>
            ))}

            {/* Feature cards inside How It Works */}
            <View style={[styles.featuresWrap, isTablet && styles.featuresWrapTablet]}>
              {[
                { icon: Zap, title: 'Live NAV Estimates', desc: "See your fund's estimated NAV updating in real-time throughout the trading day.", color: colors.accentCyan },
                { icon: BarChart3, title: 'Portfolio Heatmap', desc: 'See sector-wise and stock-wise attribution — know exactly which holdings are driving returns.', color: colors.accentGreen },
                { icon: TrendingUp, title: 'NAV History Charts', desc: "Track how your fund's NAV has moved over time with interactive charts.", color: colors.accentPurple },
                { icon: ShieldCheck, title: 'Prediction Accuracy', desc: "Every day, we show yesterday's prediction vs. actual NAV — judge our accuracy yourself.", color: '#fbbf24' },
              ].map((f, i) => (
                <View key={i} style={[styles.featureCard, isTablet && styles.featureCardTablet, { backgroundColor: colors.surfaceHover, borderColor: colors.borderSubtle }]}>
                  <View style={[styles.iconCircle, { backgroundColor: `${f.color}22` }]}>
                    <f.icon size={scale(22)} color={f.color} />
                  </View>
                  <View style={styles.featureTextWrap}>
                    <Text style={[styles.featureTitle, { color: colors.textPrimary, fontSize: scale(fontSizes.base) }]}>{f.title}</Text>
                    <Text style={[styles.featureDesc, { color: colors.textMuted, fontSize: scale(fontSizes.sm) }]}>{f.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Built on Transparency */}
          <View style={[styles.trustSection, { borderColor: 'rgba(16, 185, 129, 0.15)' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm }}>
              <View style={[styles.sectionIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <Eye size={scale(24)} color="#10b981" />
              </View>
              <Text style={[styles.sectionTitle, { color: '#10b981', marginTop: 0, marginBottom: 0, fontSize: scale(fontSizes.lg) }]}>Built on Transparency</Text>
            </View>
            <Text style={[styles.sectionText, { color: colors.textSecondary, fontSize: scale(fontSizes.sm) }]}>
              We built <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>TruthLens</Text> — our transparency engine that compares yesterday's predictions against the actual official NAVs published by AMCs.
            </Text>
            <View style={[styles.highlightBox, { borderLeftColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.06)' }]}>
              <Target size={scale(16)} color="#10b981" />
              <Text style={[styles.highlightText, { color: colors.textSecondary, fontSize: scale(fontSizes.sm) }]}>
                Check our track record before you trust our numbers. If yesterday was 99.7% accurate, you know today's estimate is reliable.
              </Text>
            </View>
          </View>

          {/* Disclaimer Banner */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Disclaimer')}
            style={[styles.disclaimerBanner, { backgroundColor: `${colors.accentRed}12`, borderColor: `${colors.accentRed}40` }]}
          >
            <AlertTriangle size={scale(20)} color={colors.accentRed} />
            <View style={styles.disclaimerBannerTextWrap}>
              <Text style={[styles.disclaimerBannerTitle, { color: colors.accentRed, fontSize: scale(fontSizes.sm) }]}>Important Disclaimer</Text>
              <Text style={[styles.disclaimerBannerSubtitle, { color: colors.textSecondary, fontSize: scale(fontSizes.xs) }]}>
                Read our technical & financial risks before using. <Text style={{ color: colors.accentCyan, fontWeight: '600' }}>View Details »</Text>
              </Text>
            </View>
          </TouchableOpacity>

          {/* Developer Section */}
          <View style={[styles.devSection, { borderTopColor: colors.borderSubtle }]}>
            <Text style={[styles.devTitle, { color: colors.textPrimary, fontSize: scale(fontSizes.lg) }]}>Crafted With Passion</Text>
            <Text style={[styles.devDesc, { color: colors.textMuted, fontSize: scale(fontSizes.sm) }]}>
              Curious about the mind behind this project?
            </Text>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://k-k-aryaa.github.io/')}
              style={[styles.devLink, { borderColor: colors.accentPurple }]}
            >
              <Code2 size={scale(16)} color={colors.accentPurple} />
              <Text style={[styles.devLinkText, { color: colors.accentPurple, fontSize: scale(fontSizes.sm) }]}>Developer Portfolio</Text>
            </TouchableOpacity>
          </View>

          {/* Account Management Section (Only visible if logged in) */}
          {user && (
            <View style={[styles.accountSection, { borderTopColor: colors.borderSubtle }]}>
              <Text style={[styles.devTitle, { color: colors.accentRed, fontSize: scale(fontSizes.lg) }]}>Account Management</Text>
              <Text style={[styles.devDesc, { color: colors.textSecondary, fontSize: scale(fontSizes.sm) }]}>
                Permanently delete your account and all saved favorites.
              </Text>
              <TouchableOpacity
                onPress={handleDeleteAccount}
                disabled={isDeleting}
                style={[styles.deleteLink, { borderColor: colors.accentRed, backgroundColor: `${colors.accentRed}15` }]}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color={colors.accentRed} />
                ) : (
                  <>
                    <Trash2 size={scale(16)} color={colors.accentRed} />
                    <Text style={[styles.devLinkText, { color: colors.accentRed, fontSize: scale(fontSizes.sm) }]}>Delete My Account</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

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
  intro: { fontSize: fontSizes.base, lineHeight: 22, textAlign: 'center', marginBottom: spacing['2xl'] },

  // How It Works (combined)
  howSection: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    backgroundColor: 'rgba(6, 182, 212, 0.03)',
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

  // Features inside How It Works
  featuresWrap: {
    marginTop: spacing.xl,
  },
  featuresWrapTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
  },
  featureCardTablet: {
    width: '48%',
    marginBottom: 0,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  sectionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextWrap: { flex: 1 },
  featureTitle: { fontSize: fontSizes.base, fontWeight: '700', marginBottom: spacing.xs },
  featureDesc: { fontSize: fontSizes.sm, lineHeight: 18 },

  // Trust section
  trustSection: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing['2xl'],
    backgroundColor: 'rgba(16, 185, 129, 0.03)',
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

  // Disclaimer banner
  disclaimerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginBottom: spacing.xl,
    borderStyle: 'dashed',
  },
  disclaimerBannerTextWrap: { flex: 1 },
  disclaimerBannerTitle: { fontSize: fontSizes.sm, fontWeight: '700', marginBottom: 2 },
  disclaimerBannerSubtitle: { fontSize: fontSizes.xs, lineHeight: 16 },

  // Developer
  devSection: {
    marginTop: spacing.lg,
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
  
  // Account
  accountSection: {
    marginTop: spacing.lg,
    paddingTop: spacing['2xl'],
    borderTopWidth: 1,
    alignItems: 'center',
  },
  deleteLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderRadius: radii.md,
    minWidth: 200,
  },
});
