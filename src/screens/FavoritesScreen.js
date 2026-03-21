import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useColors, spacing } from '../theme';
import Header from '../components/Header';
import Favorites from '../components/Favorites';

export default function FavoritesScreen() {
  const colors = useColors();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <Header />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Favorites
            onFundSelect={(id) => navigation.navigate('FundDetail', { fundId: id })}
            onLogin={() => navigation.navigate('LoginScreen')}
          />
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
});
