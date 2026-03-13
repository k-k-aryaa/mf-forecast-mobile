import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { useQuery } from '@tanstack/react-query';
import { Clock, Calendar, ExternalLink, ChevronDown, ChevronUp, BookOpen } from 'lucide-react-native';
import api from '../api/api';
import { useColors, spacing, radii, fontSizes } from '../theme';
import Header from '../components/Header';

// ========= INVESTMENT TIPS =========
function InvestmentTips() {
  const colors = useColors();
  const [cutoff1, setCutoff1] = useState('');
  const [cutoff2, setCutoff2] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const c1 = new Date(); c1.setHours(14, 0, 0, 0);
      const c2 = new Date(); c2.setHours(15, 0, 0, 0);
      const fmt = (ms) => {
        if (ms <= 0) return 'Closed';
        const s = Math.floor(ms / 1000);
        const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const sec = s % 60;
        return `${h}h ${m}m ${sec}s`;
      };
      setCutoff1(fmt(c1 - now));
      setCutoff2(fmt(c2 - now));
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}>
      <View style={styles.cardHeader}>
        <Clock size={20} color={colors.accentCyan} />
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Want Same Day NAV?</Text>
      </View>
      <View style={styles.tipRow}>
        <Text style={[styles.tipLabel, { color: colors.textSecondary }]}>Before 2:00 PM</Text>
        <Text style={[styles.tipValue, { color: colors.accentCyan }]}>{cutoff1}</Text>
        <Text style={[styles.tipPlatforms, { color: colors.textMuted }]}>Groww, Zerodha</Text>
      </View>
      <View style={styles.tipRow}>
        <Text style={[styles.tipLabel, { color: colors.textSecondary }]}>Between 2-3 PM</Text>
        <Text style={[styles.tipValue, { color: colors.accentCyan }]}>{cutoff2}</Text>
        <Text style={[styles.tipPlatforms, { color: colors.textMuted }]}>MFCentral, AMC</Text>
      </View>
    </View>
  );
}

// ========= HOLIDAY CALENDAR =========
function HolidayCalendar() {
  const colors = useColors();
  const { data } = useQuery({ queryKey: ['holidays'], queryFn: api.getHolidays });
  const holidays = data?.holidays || [];

  const now = new Date();
  const upcomingIdx = holidays.findIndex(h => new Date(h.date) >= now);
  const nextHoliday = upcomingIdx >= 0 ? holidays[upcomingIdx] : null;

  const daysUntil = nextHoliday ? Math.ceil((new Date(nextHoliday.date) - now) / (1000 * 60 * 60 * 24)) : null;

  return (
    <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}>
      <View style={styles.cardHeader}>
        <Calendar size={20} color={colors.accentPurple} />
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Trading Holidays 2026</Text>
      </View>
      {nextHoliday && (
        <View style={[styles.nextHoliday, { backgroundColor: colors.surfaceHover, borderColor: colors.borderGlow }]}>
          <Text style={[styles.nextLabel, { color: colors.accentCyan }]}>Next Holiday</Text>
          <Text style={[styles.nextName, { color: colors.textPrimary }]}>{nextHoliday.name}</Text>
          <Text style={[styles.nextDate, { color: colors.textMuted }]}>
            {new Date(nextHoliday.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            {daysUntil != null && ` • in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`}
          </Text>
        </View>
      )}
      <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
        {holidays.map((h, i) => {
          const d = new Date(h.date);
          const isPast = d < now;
          return (
            <View key={i} style={[styles.holidayItem, { borderBottomColor: colors.borderSubtle, opacity: isPast ? 0.5 : 1 }]}>
              <View style={[styles.dateBox, { backgroundColor: colors.surfaceHover }]}>
                <Text style={[styles.dateDay, { color: colors.textPrimary }]}>{d.getDate()}</Text>
                <Text style={[styles.dateMonth, { color: colors.textMuted }]}>
                  {d.toLocaleDateString('en-IN', { month: 'short' })}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.holidayName, { color: colors.textPrimary }]}>{h.name}</Text>
                <Text style={[styles.holidayDay, { color: colors.textMuted }]}>
                  {d.toLocaleDateString('en-IN', { weekday: 'long' })}
                  {isPast && ' • Passed'}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ========= USEFUL LINKS =========
function UsefulLinks() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState('official');

  const tabs = {
    official: [
      { name: 'MFCentral', url: 'https://www.mfcentral.com' },
      { name: 'AMFI', url: 'https://www.amfiindia.com' },
      { name: 'SEBI', url: 'https://www.sebi.gov.in' },
    ],
    platforms: [
      { name: 'Groww', url: 'https://groww.in' },
      { name: 'Zerodha Coin', url: 'https://coin.zerodha.com' },
      { name: 'Kuvera', url: 'https://kuvera.in' },
      { name: 'Paytm Money', url: 'https://www.paytmmoney.com' },
    ],
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}>
      <View style={styles.cardHeader}>
        <ExternalLink size={20} color={colors.accentGreen} />
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Useful Links</Text>
      </View>
      <View style={[styles.tabBar, { backgroundColor: colors.surfaceHover }]}>
        {['official', 'platforms'].map(t => (
          <TouchableOpacity key={t} onPress={() => setActiveTab(t)}
            style={[styles.tabBtn, activeTab === t && { backgroundColor: `${colors.accentCyan}33` }]}>
            <Text style={[styles.tabBtnText, { color: activeTab === t ? colors.accentCyan : colors.textMuted }]}>
              {t === 'official' ? 'Official' : 'Platforms'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {tabs[activeTab]?.map((link, i) => (
        <TouchableOpacity key={i} onPress={() => Linking.openURL(link.url)}
          style={[styles.linkItem, { borderBottomColor: colors.borderSubtle }]}>
          <Text style={[styles.linkName, { color: colors.textPrimary }]}>{link.name}</Text>
          <ExternalLink size={14} color={colors.textMuted} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ========= LEARN SECTION =========
function LearnSection() {
  const colors = useColors();
  const [expanded, setExpanded] = useState(null);

  const items = [
    { title: 'What is NAV?', content: 'NAV (Net Asset Value) is the per-unit value of a mutual fund, calculated daily after market close.' },
    { title: 'SIP vs Lumpsum', content: 'SIP allows regular fixed investments, averaging out cost over time. Lumpsum is a one-time investment.' },
    { title: 'How Predictions Work', content: 'Our AI analyzes real-time stock prices of fund holdings to estimate NAV before official publication.' },
    { title: 'Exit Load Rules', content: 'Most equity funds charge 1% exit load if redeemed within 1 year. Liquid funds may have graded exit loads.' },
    { title: 'Tax Rules', content: 'Equity funds: STCG 15% (< 1yr), LTCG 10% (> 1yr, above ₹1L). Debt funds taxed at slab rate.' },
    { title: 'NAV Cutoff Times', content: 'For same-day NAV: invest before 3 PM for equity/debt, before 2 PM on some platforms.' },
  ];

  return (
    <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}>
      <View style={styles.cardHeader}>
        <BookOpen size={20} color={colors.accentPurple} />
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Learn</Text>
      </View>
      {items.map((item, i) => (
        <TouchableOpacity key={i} onPress={() => setExpanded(expanded === i ? null : i)}
          style={[styles.learnItem, { borderBottomColor: colors.borderSubtle }]}>
          <View style={styles.learnHeader}>
            <Text style={[styles.learnTitle, { color: colors.textPrimary }]}>{item.title}</Text>
            {expanded === i ? <ChevronUp size={16} color={colors.textMuted} /> : <ChevronDown size={16} color={colors.textMuted} />}
          </View>
          {expanded === i && (
            <Text style={[styles.learnContent, { color: colors.textSecondary }]}>{item.content}</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ========= TOOLKIT SCREEN =========
export default function ToolkitScreen() {
  const colors = useColors();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>Investor Toolkit</Text>
        <Text style={[styles.pageSubtitle, { color: colors.textMuted }]}>
          Smart tools and insights for better investment decisions.
        </Text>
        <InvestmentTips />
        <HolidayCalendar />
        <UsefulLinks />
        <LearnSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: 100, gap: spacing.lg },
  pageTitle: { fontSize: fontSizes['2xl'], fontWeight: '800', letterSpacing: -0.5 },
  pageSubtitle: { fontSize: fontSizes.sm, marginBottom: spacing.sm },
  card: { borderWidth: 1, borderRadius: radii.lg, padding: spacing.lg },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  cardTitle: { fontSize: fontSizes.base, fontWeight: '700' },
  // Tips
  tipRow: { marginBottom: spacing.md },
  tipLabel: { fontSize: fontSizes.sm, fontWeight: '600', marginBottom: 2 },
  tipValue: { fontSize: fontSizes.lg, fontWeight: '700', fontFamily: 'monospace' },
  tipPlatforms: { fontSize: fontSizes.xs, marginTop: 2 },
  // Holiday
  nextHoliday: { borderWidth: 1, borderRadius: radii.md, padding: spacing.md, marginBottom: spacing.md },
  nextLabel: { fontSize: fontSizes.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  nextName: { fontSize: fontSizes.base, fontWeight: '600', marginTop: 2 },
  nextDate: { fontSize: fontSizes.xs, marginTop: 2 },
  holidayItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1 },
  dateBox: { width: 44, height: 44, borderRadius: radii.sm, justifyContent: 'center', alignItems: 'center' },
  dateDay: { fontSize: fontSizes.base, fontWeight: '700' },
  dateMonth: { fontSize: fontSizes['2xs'], textTransform: 'uppercase' },
  holidayName: { fontSize: fontSizes.sm, fontWeight: '500' },
  holidayDay: { fontSize: fontSizes.xs, marginTop: 1 },
  // Links
  tabBar: { flexDirection: 'row', borderRadius: radii.md, padding: 3, marginBottom: spacing.md },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: radii.sm },
  tabBtnText: { fontSize: fontSizes.sm, fontWeight: '600' },
  linkItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md, borderBottomWidth: 1 },
  linkName: { fontSize: fontSizes.base, fontWeight: '500' },
  // Learn
  learnItem: { paddingVertical: spacing.md, borderBottomWidth: 1 },
  learnHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  learnTitle: { fontSize: fontSizes.base, fontWeight: '600', flex: 1 },
  learnContent: { fontSize: fontSizes.sm, lineHeight: 20, marginTop: spacing.sm },
});
