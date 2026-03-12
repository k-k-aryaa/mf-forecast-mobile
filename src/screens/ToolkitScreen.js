import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import InvestmentTips from '../components/InvestmentTips';
import HolidayCalendar from '../components/HolidayCalendar';
import UsefulLinks from '../components/UsefulLinks';
import LearnSection from '../components/LearnSection';

const ToolkitScreen = () => {
    const { colors } = useTheme();

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Investor Toolkit</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                Smart tools and insights for better investment decisions.
            </Text>

            <View style={styles.grid}>
                <InvestmentTips />
                <HolidayCalendar />
                <UsefulLinks />
                <LearnSection />
            </View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16 },
    title: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
    subtitle: { fontSize: 13, marginBottom: 20 },
    grid: { gap: 14 },
});

export default ToolkitScreen;
