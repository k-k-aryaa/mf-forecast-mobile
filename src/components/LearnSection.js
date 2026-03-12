import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const LEARN_ITEMS = [
    { id: 'nav', title: 'What is NAV?', icon: '📊', content: 'NAV (Net Asset Value) is the per-unit market value of a mutual fund scheme. It represents the price at which you buy or sell units.\n\nFormula: NAV = (Total Assets - Total Liabilities) / Number of Units Outstanding\n\nNAV is calculated at the end of each trading day, typically published by 9:00 PM IST.' },
    { id: 'sip', title: 'SIP vs Lumpsum', icon: '💰', content: 'SIP (Systematic Investment Plan)\n• Invest fixed amount regularly\n• Benefits from rupee cost averaging\n• Lower risk, best for salaried individuals\n\nLumpsum\n• One-time investment\n• Can be beneficial if market is low\n• Higher risk if timing is wrong' },
    { id: 'pred', title: 'How Our Predictions Work', icon: '🧠', content: 'We utilize advanced AI models trained on historical market data to predict daily NAV fluctuations.\n\nOur system processes real-time stock movements and portfolio compositions to generate accurate estimates ahead of official reporting.' },
    { id: 'exit', title: 'Exit Load Rules', icon: '🚪', content: 'Exit load is a fee charged when you redeem units before a specified period.\n\n• Equity Funds: 1% if redeemed within 1 year\n• Debt Funds: 0.5-1% within 3-6 months\n• ELSS: 3 year lock-in\n• Liquid Funds: Usually nil or graded' },
    { id: 'tax', title: 'Tax Rules (Equity)', icon: '📄', content: 'Short-Term Capital Gains (< 1 year)\n• Tax rate: 15%\n\nLong-Term Capital Gains (≥ 1 year)\n• Tax rate: 10% on gains above ₹1 lakh/year\n• Gains up to ₹1 lakh are tax-free\n\nDividends are taxed at your slab rate.' },
    { id: 'cutoff', title: 'NAV Cutoff Times', icon: '⏰', content: 'Equity & Hybrid Funds\n• Before 3:00 PM: Same day NAV\n• After 3:00 PM: Next business day NAV\n\nLiquid & Overnight Funds\n• Before 1:30 PM: Same day NAV\n• After 1:30 PM: Next business day NAV\n\nBroker platforms may have earlier cutoffs.' },
];

const LearnSection = () => {
    const { colors } = useTheme();
    const [expandedId, setExpandedId] = useState(null);

    return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.header}>
                <Text style={{ fontSize: 16 }}>📖</Text>
                <Text style={[styles.title, { color: colors.textPrimary }]}>Learn</Text>
            </View>

            {LEARN_ITEMS.map(item => (
                <View key={item.id}>
                    <TouchableOpacity
                        style={[styles.itemHeader, { borderBottomColor: colors.borderSecondary }]}
                        onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    >
                        <Text style={{ fontSize: 14 }}>{item.icon}</Text>
                        <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                        <Text style={[styles.chevron, { color: colors.textMuted }]}>
                            {expandedId === item.id ? '▲' : '▼'}
                        </Text>
                    </TouchableOpacity>
                    {expandedId === item.id && (
                        <View style={[styles.itemContent, { backgroundColor: colors.surface }]}>
                            <Text style={[styles.contentText, { color: colors.textSecondary }]}>
                                {item.content}
                            </Text>
                        </View>
                    )}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    card: { borderRadius: 14, borderWidth: 1, padding: 14 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    title: { fontSize: 14, fontWeight: '700' },
    itemHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, gap: 8 },
    itemTitle: { flex: 1, fontSize: 13, fontWeight: '600' },
    chevron: { fontSize: 10 },
    itemContent: { padding: 12, borderRadius: 8, marginVertical: 4 },
    contentText: { fontSize: 12, lineHeight: 18 },
});

export default LearnSection;
