import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const features = [
    { icon: '⚡', title: 'Real-Time NAV Prediction', desc: "Don't wait for 9 PM. Get instant, accurate estimated NAVs throughout the trading day." },
    { icon: '🧠', title: 'AI-Driven Intelligence', desc: 'Using advanced AI trained with past data to give you accurate live NAV and change percent.' },
    { icon: '📊', title: 'Dynamic Heatmaps', desc: 'Visualize sector-wise performance and portfolio allocations instantly.' },
    { icon: '🔍', title: 'Previous Day Prediction', desc: 'Track our prediction accuracy against official NAVs daily. Data you can trust.' },
];

const AboutScreen = ({ navigation }) => {
    const { colors } = useTheme();

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
            <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.borderPrimary }]}>
                <Text style={[styles.heroTitle, { color: colors.primary }]}>
                    AI-Powered Real-Time Mutual Fund Navigator
                </Text>
                <Text style={[styles.introText, { color: colors.textSecondary }]}>
                    Experience the future of mutual fund tracking. Our AI engine bridges the gap between market movements and official NAVs, giving you live insights when they matter most.
                </Text>

                <View style={styles.featuresGrid}>
                    {features.map((f, i) => (
                        <View key={i} style={[styles.featureCard, { backgroundColor: colors.surface, borderColor: colors.borderPrimary }]}>
                            <Text style={styles.featureIcon}>{f.icon}</Text>
                            <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>{f.title}</Text>
                            <Text style={[styles.featureDesc, { color: colors.textMuted }]}>{f.desc}</Text>
                        </View>
                    ))}
                </View>

                <View style={[styles.whySection, { borderTopColor: colors.borderPrimary }]}>
                    <Text style={[styles.whyTitle, { color: colors.textPrimary }]}>Why Use Us?</Text>
                    <Text style={[styles.whyDesc, { color: colors.textMuted }]}>
                        Traditional platforms update once a day. We update every second. Make informed decisions with the power of live data.
                    </Text>
                </View>

                <View style={[styles.devSection, { borderTopColor: colors.borderPrimary }]}>
                    <Text style={[styles.devTitle, { color: colors.textPrimary }]}>Meet the Developer</Text>
                    <TouchableOpacity
                        style={[styles.devLink, { backgroundColor: colors.primaryDim, borderColor: colors.borderGlow }]}
                        onPress={() => Linking.openURL('https://k-k-aryaa.github.io/')}
                    >
                        <Ionicons name="open-outline" size={16} color={colors.primary} />
                        <Text style={[styles.devLinkText, { color: colors.primary }]}>Visit Developer Website</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.ctaBtn, { backgroundColor: colors.primary }]}
                    onPress={() => navigation.navigate('Dashboard')}
                >
                    <Text style={styles.ctaText}>Explore Dashboard</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16 },
    heroCard: { borderRadius: 16, borderWidth: 1, padding: 20 },
    heroTitle: { fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
    introText: { fontSize: 13, lineHeight: 20, textAlign: 'center', marginBottom: 20 },
    featuresGrid: { gap: 10 },
    featureCard: { borderRadius: 12, borderWidth: 1, padding: 16 },
    featureIcon: { fontSize: 24, marginBottom: 8 },
    featureTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
    featureDesc: { fontSize: 12, lineHeight: 17 },
    whySection: { borderTopWidth: 1, paddingTop: 20, marginTop: 20 },
    whyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
    whyDesc: { fontSize: 13, lineHeight: 19 },
    devSection: { borderTopWidth: 1, paddingTop: 20, marginTop: 20 },
    devTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
    devLink: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 10, borderWidth: 1 },
    devLinkText: { fontSize: 13, fontWeight: '600' },
    ctaBtn: { marginTop: 24, padding: 14, borderRadius: 12, alignItems: 'center' },
    ctaText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});

export default AboutScreen;
