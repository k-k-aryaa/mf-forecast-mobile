import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useColors, spacing, radii, fontSizes } from '../theme';
import Header from '../components/Header';
import MarketTicker from '../components/MarketTicker';
import FundSelector from '../components/FundSelector';
import EstimateCard from '../components/EstimateCard';
import NavChart from '../components/NavChart';
import Attribution from '../components/Attribution';
import TruthLens from '../components/TruthLens';
import Favorites from '../components/Favorites';

export default function DashboardScreen() {
  const [selectedFundId, setSelectedFundId] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const { isDark } = useTheme();
  const colors = useColors();
  const navigation = useNavigation();

  const rocketDark = require('../assets/rocket.png');
  const rocketLight = require('../assets/rocket_light.png');

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <Header />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <MarketTicker />

        {/* View Tabs */}
        <View style={[styles.tabRow, { borderBottomColor: colors.borderSubtle }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeView === 'dashboard' && [styles.tabActive, { borderBottomColor: colors.accentCyan }],
            ]}
            onPress={() => setActiveView('dashboard')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeView === 'dashboard' ? colors.accentCyan : colors.textMuted },
              ]}
            >
              Dashboard
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeView === 'favorites' && [styles.tabActive, { borderBottomColor: colors.accentCyan }],
            ]}
            onPress={() => setActiveView('favorites')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeView === 'favorites' ? colors.accentCyan : colors.textMuted },
              ]}
            >
              Favorites
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {activeView === 'dashboard' ? (
            <>
              <FundSelector selectedFundId={selectedFundId} onSelect={setSelectedFundId} />

              {selectedFundId ? (
                <View style={styles.grid}>
                  <EstimateCard fundId={selectedFundId} />
                  <NavChart fundId={selectedFundId} />
                  <Attribution fundId={selectedFundId} />
                  <TruthLens fundId={selectedFundId} />
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Image
                    source={isDark ? rocketDark : rocketLight}
                    style={styles.emptyImage}
                    resizeMode="contain"
                  />
                  <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                    Select a Fund to Begin
                  </Text>
                  <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>
                    Choose a mutual fund from the dropdown above to view real-time performance estimates.
                  </Text>
                </View>
              )}
            </>
          ) : (
            <Favorites
              onFundSelect={(id) => {
                setSelectedFundId(id);
                setActiveView('dashboard');
              }}
              onLogin={() => navigation.navigate('LoginScreen')}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  tab: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: fontSizes.base,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  grid: {
    gap: spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['4xl'],
    paddingHorizontal: spacing.lg,
  },
  emptyImage: {
    width: 180,
    height: 180,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSizes['2xl'],
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptyDesc: {
    fontSize: fontSizes.base,
    textAlign: 'center',
    lineHeight: 22,
  },
});
