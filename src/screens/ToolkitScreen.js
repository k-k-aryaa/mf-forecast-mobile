import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { useQuery } from '@tanstack/react-query';
import { Clock, Calendar, ExternalLink, ChevronDown, ChevronUp, BookOpen } from 'lucide-react-native';
import api from '../api/api';
import { useColors, spacing, radii, fontSizes, useResponsive } from '../theme';
import Header from '../components/Header';

// ========= INVESTMENT TIPS =========
function InvestmentTips() {
  const colors = useColors();
  const { scale } = useResponsive();
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
        <Clock size={scale(20)} color={colors.accentCyan} />
        <Text style={[styles.cardTitle, { color: colors.textPrimary, fontSize: scale(fontSizes.base) }]}>Want Same Day NAV?</Text>
      </View>
      <View style={styles.tipRow}>
        <Text style={[styles.tipLabel, { color: colors.textSecondary, fontSize: scale(fontSizes.sm) }]}>Before 2:00 PM</Text>
        <Text style={[styles.tipValue, { color: colors.accentCyan, fontSize: scale(fontSizes.lg) }]}>{cutoff1}</Text>
        <Text style={[styles.tipPlatforms, { color: colors.textMuted, fontSize: scale(fontSizes.xs) }]}>Groww, Zerodha</Text>
      </View>
      <View style={styles.tipRow}>
        <Text style={[styles.tipLabel, { color: colors.textSecondary, fontSize: scale(fontSizes.sm) }]}>Between 2-3 PM</Text>
        <Text style={[styles.tipValue, { color: colors.accentCyan, fontSize: scale(fontSizes.lg) }]}>{cutoff2}</Text>
        <Text style={[styles.tipPlatforms, { color: colors.textMuted, fontSize: scale(fontSizes.xs) }]}>MFCentral, AMC</Text>
      </View>
    </View>
  );
}

// ========= HOLIDAY CALENDAR =========
function HolidayCalendar() {
  const colors = useColors();
  const { scale } = useResponsive();
  const { data } = useQuery({ queryKey: ['holidays'], queryFn: api.getHolidays });
  const holidays = data?.holidays || [];

  const now = new Date();
  const upcomingIdx = holidays.findIndex(h => new Date(h.date) >= now);
  const nextHoliday = upcomingIdx >= 0 ? holidays[upcomingIdx] : null;

  const daysUntil = nextHoliday ? Math.ceil((new Date(nextHoliday.date) - now) / (1000 * 60 * 60 * 24)) : null;

  return (
    <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}>
      <View style={styles.cardHeader}>
        <Calendar size={scale(20)} color={colors.accentPurple} />
        <Text style={[styles.cardTitle, { color: colors.textPrimary, fontSize: scale(fontSizes.base) }]}>Trading Holidays 2026</Text>
      </View>
      {nextHoliday && (
        <View style={[styles.nextHoliday, { backgroundColor: colors.surfaceHover, borderColor: colors.borderGlow }]}>
          <Text style={[styles.nextLabel, { color: colors.accentCyan, fontSize: scale(fontSizes.xs) }]}>Next Holiday</Text>
          <Text style={[styles.nextName, { color: colors.textPrimary, fontSize: scale(fontSizes.base) }]}>{nextHoliday.name}</Text>
          <Text style={[styles.nextDate, { color: colors.textMuted, fontSize: scale(fontSizes.xs) }]}>
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
                <Text style={[styles.dateDay, { color: colors.textPrimary, fontSize: scale(fontSizes.base) }]}>{d.getDate()}</Text>
                <Text style={[styles.dateMonth, { color: colors.textMuted }]}>
                  {d.toLocaleDateString('en-IN', { month: 'short' })}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.holidayName, { color: colors.textPrimary, fontSize: scale(fontSizes.sm) }]}>{h.name}</Text>
                <Text style={[styles.holidayDay, { color: colors.textMuted, fontSize: scale(fontSizes.xs) }]}>
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
const AMC_LINKS = {
  '360 ONE Mutual Fund': 'https://www.360.one/asset-management/mutualfund/downloads/factsheets',
  'Aditya Birla Sun Life Mutual Fund': 'https://mutualfund.adityabirlacapital.com/forms-and-downloads/factsheets',
  'Axis Mutual Fund': 'https://www.axismf.com/downloads',
  'Bajaj Finserv Mutual Fund': 'https://www.bajajamc.com/downloads?statutory-disclosures=',
  'Bandhan Mutual Fund': 'https://bandhanmutual.com/downloads/factsheets',
  'Baroda BNP Paribas Mutual Fund': 'https://www.barodabnpparibasmf.in/downloads/monthly-factsheet',
  'Canara Robeco Mutual Fund': 'https://www.canararobeco.com/documents/forms-downloads/forms-information-documents/information-documents/factsheets/',
  'DSP Mutual Fund': 'https://www.dspim.com/downloads?category=Information%20Documents&sub_category=Factsheets',
  'Edelweiss Mutual Fund': 'https://www.edelweissmf.com/downloads/factsheets',
  'Franklin Templeton Mutual Fund': 'https://www.franklintempletonindia.com/downloads/fund-literature',
  'Groww Mutual Fund': 'https://www.growwmf.in/downloads/fact-sheet',
  'HDFC Mutual Fund': 'http://hdfcfund.com/downloads/monthly-fact-sheet',
  'HSBC Mutual Fund': 'https://www.assetmanagement.hsbc.co.in/en/mutual-funds/investor-resources',
  'ICICI Prudential Mutual Fund': 'https://www.icicipruamc.com/news-and-media/downloads?currentTabFilter=Historical Factsheets',
  'Invesco Mutual Fund': 'https://invescomutualfund.com/literature-and-form?tab=Factsheets',
  'Kotak Mahindra Mutual Fund': 'https://www.kotakmf.com/Information/forms-and-downloads/Information',
  'Mirae Asset Mutual Fund': 'https://www.miraeassetmf.co.in/downloads/factsheet',
  'Motilal Oswal Mutual Fund': 'http://www.mostshares.com/downloads/mutualfund/Factsheet',
  'Nippon India Mutual Fund': 'https://mf.nipponindiaim.com/investor-service/downloads/factsheet-portfolio-and-other-disclosures',
  'PPFAS Mutual Fund': 'http://amc.ppfas.com/schemes/factsheet/index.php',
  'SBI Mutual Fund': 'https://www.sbimf.com/en-us/factsheets',
  'Sundaram Mutual Fund': 'https://www.sundarammutual.com/Fundwise-Factsheet',
  'Tata Mutual Fund': 'https://www.tatamutualfund.com/information-documents',
  'UTI Mutual Fund': 'https://www.utimf.com/downloads/fact-sheet',
  'WhiteOak Capital Mutual Fund': 'https://mf.whiteoakamc.com/download#Factsheet',
};

function UsefulLinks() {
  const colors = useColors();
  const { scale } = useResponsive();
  const [activeTab, setActiveTab] = useState('official');
  const [searchTerm, setSearchTerm] = useState('');

  const officialLinks = [
    { name: 'MFCentral', url: 'https://www.mfcentral.com', desc: 'Consolidated MF portfolio view' },
    { name: 'AMFI India', url: 'https://www.amfiindia.com', desc: 'Official NAV data & scheme info' },
    { name: 'SEBI', url: 'https://www.sebi.gov.in', desc: 'MF regulations & circulars' },
  ];

  const platformLinks = [
    { name: 'Groww', url: 'https://groww.in', desc: 'Popular investment platform' },
    { name: 'Zerodha Coin', url: 'https://coin.zerodha.com', desc: 'Direct MF investing' },
    { name: 'Kuvera', url: 'https://kuvera.in', desc: 'Free direct MF platform' },
    { name: 'Paytm Money', url: 'https://www.paytmmoney.com', desc: 'Commission-free investing' },
  ];

  const filteredAMCs = Object.entries(AMC_LINKS)
    .filter(([name]) => name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a[0].localeCompare(b[0]));

  const tabLabels = { official: 'Official', platforms: 'Platforms', amc: 'AMC Portals' };

  return (
    <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}>
      <View style={styles.cardHeader}>
        <ExternalLink size={scale(20)} color={colors.accentGreen} />
        <Text style={[styles.cardTitle, { color: colors.textPrimary, fontSize: scale(fontSizes.base) }]}>Useful Links</Text>
      </View>
      <View style={[styles.tabBar, { backgroundColor: colors.surfaceHover }]}>
        {['official', 'platforms', 'amc'].map(t => (
          <TouchableOpacity key={t} onPress={() => setActiveTab(t)}
            style={[styles.tabBtn, activeTab === t && { backgroundColor: `${colors.accentCyan}33` }]}>
            <Text style={[styles.tabBtnText, { color: activeTab === t ? colors.accentCyan : colors.textMuted, fontSize: scale(fontSizes.xs) }]}>
              {tabLabels[t]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {activeTab === 'official' && officialLinks.map((link, i) => (
        <TouchableOpacity key={i} onPress={() => Linking.openURL(link.url)}
          style={[styles.linkItem, { borderBottomColor: colors.borderSubtle }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.linkName, { color: colors.textPrimary, fontSize: scale(fontSizes.base) }]}>{link.name}</Text>
            <Text style={[styles.linkDesc, { color: colors.textMuted, fontSize: scale(fontSizes.xs) }]}>{link.desc}</Text>
          </View>
          <ExternalLink size={scale(14)} color={colors.textMuted} />
        </TouchableOpacity>
      ))}
      {activeTab === 'platforms' && platformLinks.map((link, i) => (
        <TouchableOpacity key={i} onPress={() => Linking.openURL(link.url)}
          style={[styles.linkItem, { borderBottomColor: colors.borderSubtle }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.linkName, { color: colors.textPrimary, fontSize: scale(fontSizes.base) }]}>{link.name}</Text>
            <Text style={[styles.linkDesc, { color: colors.textMuted, fontSize: scale(fontSizes.xs) }]}>{link.desc}</Text>
          </View>
          <ExternalLink size={scale(14)} color={colors.textMuted} />
        </TouchableOpacity>
      ))}
      {activeTab === 'amc' && (
        <>
          <TextInput
            placeholder="Search AMC..."
            placeholderTextColor={colors.textMuted}
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={[styles.amcSearchInput, {
              backgroundColor: colors.surfaceHover,
              color: colors.textPrimary,
              borderColor: colors.borderSubtle,
              fontSize: scale(fontSizes.sm),
            }]}
          />
          {filteredAMCs.map(([name, url], i) => (
            <TouchableOpacity key={i} onPress={() => Linking.openURL(url)}
              style={[styles.linkItem, { borderBottomColor: colors.borderSubtle }]}>
              <Text style={[styles.linkName, { color: colors.textPrimary, flex: 1, fontSize: scale(fontSizes.base) }]}>
                {name.replace(' Mutual Fund', '')}
              </Text>
              <ExternalLink size={scale(14)} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </>
      )}
    </View>
  );
}

// ========= LEARN SECTION =========
function LearnSection() {
  const colors = useColors();
  const { scale } = useResponsive();
  const [expanded, setExpanded] = useState(null);

  const items = [
    {
      title: 'What is NAV?',
      content: 'NAV (Net Asset Value) is the per-unit market value of a mutual fund scheme. It represents the price at which you buy or sell units.\n\nFormula: NAV = (Total Assets - Total Liabilities) / Number of Units Outstanding\n\nNAV is calculated at the end of each trading day after market close, typically published by 9:00 PM IST.',
    },
    {
      title: 'SIP vs Lumpsum',
      content: 'SIP (Systematic Investment Plan)\n• Invest fixed amount regularly (monthly/weekly)\n• Benefits from rupee cost averaging\n• Lower risk due to time diversification\n• Best for salaried individuals\n\nLumpsum\n• One-time investment of a larger amount\n• Can be beneficial if market is low\n• Higher risk if market timing is wrong\n• Best when you have surplus funds',
    },
    {
      title: 'How Our Predictions Work',
      content: 'We utilize advanced AI models trained on vast amounts of historical market data to predict daily NAV fluctuations.\n\nAI-Driven Analysis: Our system processes real-time stock movements and portfolio compositions to generate highly accurate estimates.\n\nSmart Forecasting: Our proprietary AI engine continuously synthesizes complex market signals to forecast outcomes with precision, delivering insights ahead of official reporting.',
    },
    {
      title: 'Exit Load Rules',
      content: 'Exit load is a fee charged when you redeem (sell) your mutual fund units before a specified period.\n\nCommon Exit Load Periods:\n• Equity Funds: 1% if redeemed within 1 year\n• Debt Funds: 0.5-1% if redeemed within 3-6 months\n• ELSS: Lock-in of 3 years (no exit load after)\n• Liquid Funds: Usually nil or graded\n\nTip: Always check the scheme\'s SID for exact exit load terms.',
    },
    {
      title: 'Tax Rules (Equity Funds)',
      content: 'Short-Term Capital Gains (STCG)\n• Holding period: Less than 1 year\n• Tax rate: 15% on gains\n\nLong-Term Capital Gains (LTCG)\n• Holding period: 1 year or more\n• Tax rate: 10% on gains above ₹1 lakh/year\n• Gains up to ₹1 lakh are tax-free\n\nDividend Taxation\n• Dividends are added to your income and taxed at your slab rate\n• TDS of 10% if dividend exceeds ₹5,000/year',
    },
    {
      title: 'NAV Cutoff Times',
      content: 'The cutoff time determines which day\'s NAV applies to your investment:\n\nEquity & Hybrid Funds\n• Before 3:00 PM: Same day NAV\n• After 3:00 PM: Next business day NAV\n\nLiquid & Overnight Funds\n• Before 1:30 PM: Same day NAV\n• After 1:30 PM: Next business day NAV\n\nTip: Broker platforms may have earlier cutoffs (e.g., 2:00 PM) for processing.',
    },
  ];

  return (
    <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}>
      <View style={styles.cardHeader}>
        <BookOpen size={scale(20)} color={colors.accentPurple} />
        <Text style={[styles.cardTitle, { color: colors.textPrimary, fontSize: scale(fontSizes.base) }]}>Learn</Text>
      </View>
      {items.map((item, i) => (
        <TouchableOpacity key={i} onPress={() => setExpanded(expanded === i ? null : i)}
          style={[styles.learnItem, { borderBottomColor: colors.borderSubtle }]}>
          <View style={styles.learnHeader}>
            <Text style={[styles.learnTitle, { color: colors.textPrimary, fontSize: scale(fontSizes.base) }]}>{item.title}</Text>
            {expanded === i ? <ChevronUp size={scale(16)} color={colors.textMuted} /> : <ChevronDown size={scale(16)} color={colors.textMuted} />}
          </View>
          {expanded === i && (
            <Text style={[styles.learnContent, { color: colors.textSecondary, fontSize: scale(fontSizes.sm) }]}>{item.content}</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ========= TOOLKIT SCREEN =========
export default function ToolkitScreen() {
  const colors = useColors();
  const { isTablet, scale, maxContentWidth } = useResponsive();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={maxContentWidth}>
          <Text style={[styles.pageTitle, { color: colors.textPrimary, fontSize: scale(fontSizes['2xl']) }]}>Investor Toolkit</Text>
          <Text style={[styles.pageSubtitle, { color: colors.textMuted, fontSize: scale(fontSizes.sm) }]}>
            Smart tools and insights for better investment decisions.
          </Text>
          {isTablet ? (
            <>
              <View style={styles.tabletRow}>
                <View style={styles.tabletHalf}><InvestmentTips /></View>
                <View style={styles.tabletHalf}><HolidayCalendar /></View>
              </View>
              <UsefulLinks />
              <LearnSection />
            </>
          ) : (
            <>
              <InvestmentTips />
              <HolidayCalendar />
              <UsefulLinks />
              <LearnSection />
            </>
          )}
        </View>
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
  tabBtnText: { fontSize: fontSizes.xs, fontWeight: '600' },
  linkItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md, borderBottomWidth: 1 },
  linkName: { fontSize: fontSizes.base, fontWeight: '500' },
  linkDesc: { fontSize: fontSizes.xs, marginTop: 2 },
  amcSearchInput: {
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSizes.sm,
    marginBottom: spacing.md,
  },
  // Learn
  learnItem: { paddingVertical: spacing.md, borderBottomWidth: 1 },
  learnHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  learnTitle: { fontSize: fontSizes.base, fontWeight: '600', flex: 1 },
  learnContent: { fontSize: fontSizes.sm, lineHeight: 20, marginTop: spacing.sm },
  // Tablet layout
  tabletRow: { flexDirection: 'row', gap: spacing.lg },
  tabletHalf: { flex: 1 },
});
