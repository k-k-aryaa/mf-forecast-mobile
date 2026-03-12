import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const InvestmentTips = () => {
    const { colors } = useTheme();
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        const calc = () => {
            const now = new Date();
            const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
            const cutoffGroww = 14 * 3600;
            const cutoffMF = 15 * 3600;
            const fmt = (s) => {
                if (s <= 0) return null;
                return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
            };
            return { groww: fmt(cutoffGroww - nowSec), mfcentral: fmt(cutoffMF - nowSec) };
        };
        setTimeLeft(calc());
        const interval = setInterval(() => setTimeLeft(calc()), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.header}>
                <Text style={{ fontSize: 16 }}>⏰</Text>
                <Text style={[styles.title, { color: colors.textPrimary }]}>Want Same Day NAV?</Text>
            </View>

            <View style={[styles.tipItem, { borderBottomColor: colors.borderSecondary }]}>
                <View style={styles.tipRow}>
                    <Text style={[styles.tipTime, { color: colors.textPrimary }]}>Before 2:00 PM</Text>
                    {timeLeft?.groww && <Text style={[styles.timeLeft, { color: colors.accentGreen }]}>{timeLeft.groww} left</Text>}
                </View>
                <Text style={[styles.tipAction, { color: colors.textMuted }]}>
                    Apply through Groww, Zerodha, etc.
                </Text>
            </View>

            <View style={styles.tipItem}>
                <View style={styles.tipRow}>
                    <Text style={[styles.tipTime, { color: colors.textPrimary }]}>Between 2:00 - 3:00 PM</Text>
                    {timeLeft?.mfcentral && <Text style={[styles.timeLeft, { color: colors.textSecondary }]}>{timeLeft.mfcentral} left</Text>}
                </View>
                <Text style={[styles.tipAction, { color: colors.textMuted }]}>
                    Invest through MFCentral or AMC portals.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: { borderRadius: 14, borderWidth: 1, padding: 14 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    title: { fontSize: 14, fontWeight: '700' },
    tipItem: { paddingVertical: 8, borderBottomWidth: 1 },
    tipRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    tipTime: { fontSize: 12, fontWeight: '600' },
    timeLeft: { fontSize: 10, fontFamily: 'monospace', fontWeight: '700' },
    tipAction: { fontSize: 11 },
});

export default InvestmentTips;
