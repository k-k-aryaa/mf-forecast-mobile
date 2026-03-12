import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import api from '../api';
import { useTheme } from '../context/ThemeContext';

const HolidayCalendar = () => {
    const { colors } = useTheme();
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await api.getHolidays();
                setHolidays(data.holidays || []);
            } catch (err) {
                console.error('Failed to fetch holidays:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextHoliday = holidays.find(h => new Date(h.date) >= today);
    const getDaysUntil = (dateStr) => Math.ceil((new Date(dateStr).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (loading) {
        return (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <View style={styles.header}>
                    <Text style={{ fontSize: 16 }}>📅</Text>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>Trading Holidays</Text>
                </View>
                <Text style={{ color: colors.textMuted, padding: 16 }}>Loading holidays...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.header}>
                <Text style={{ fontSize: 16 }}>📅</Text>
                <Text style={[styles.title, { color: colors.textPrimary }]}>Trading Holidays 2026</Text>
            </View>

            {nextHoliday && (
                <View style={[styles.nextBanner, { backgroundColor: colors.primaryDim, borderColor: colors.primary + '30' }]}>
                    <Text style={[styles.nextLabel, { color: colors.primary }]}>Next Holiday</Text>
                    <Text style={[styles.nextName, { color: colors.textPrimary }]}>{nextHoliday.name}</Text>
                    <Text style={[styles.nextDate, { color: colors.textMuted }]}>
                        {new Date(nextHoliday.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                        {' · '}
                        <Text style={{ color: colors.primary }}>
                            {getDaysUntil(nextHoliday.date) === 0 ? 'Today!' :
                             getDaysUntil(nextHoliday.date) === 1 ? 'Tomorrow' :
                             `in ${getDaysUntil(nextHoliday.date)} days`}
                        </Text>
                    </Text>
                </View>
            )}

            <ScrollView style={styles.list} nestedScrollEnabled>
                {holidays.map((holiday, index) => {
                    const hDate = new Date(holiday.date);
                    const isPast = hDate < today;
                    return (
                        <View key={index} style={[styles.holidayItem, { borderBottomColor: colors.borderSecondary, opacity: isPast ? 0.5 : 1 }]}>
                            <View style={[styles.dateBox, { backgroundColor: colors.primaryDim }]}>
                                <Text style={[styles.dateDay, { color: colors.primary }]}>{hDate.getDate()}</Text>
                                <Text style={[styles.dateMonth, { color: colors.primary }]}>
                                    {hDate.toLocaleDateString('en-IN', { month: 'short' })}
                                </Text>
                            </View>
                            <View style={styles.holidayInfo}>
                                <Text style={[styles.holidayName, { color: colors.textPrimary }]}>{holiday.name}</Text>
                                <Text style={[styles.weekday, { color: colors.textMuted }]}>
                                    {hDate.toLocaleDateString('en-IN', { weekday: 'long' })}
                                </Text>
                            </View>
                            {isPast && <Text style={[styles.pastBadge, { color: colors.textMuted }]}>Passed</Text>}
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    card: { borderRadius: 14, borderWidth: 1, padding: 14, maxHeight: 400 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    title: { fontSize: 14, fontWeight: '700' },
    nextBanner: { padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 12 },
    nextLabel: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
    nextName: { fontSize: 15, fontWeight: '700', marginVertical: 2 },
    nextDate: { fontSize: 11 },
    list: { maxHeight: 250 },
    holidayItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1 },
    dateBox: { width: 44, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    dateDay: { fontSize: 16, fontWeight: '800' },
    dateMonth: { fontSize: 9, fontWeight: '600', textTransform: 'uppercase' },
    holidayInfo: { flex: 1 },
    holidayName: { fontSize: 12, fontWeight: '600' },
    weekday: { fontSize: 10, marginTop: 1 },
    pastBadge: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
});

export default HolidayCalendar;
