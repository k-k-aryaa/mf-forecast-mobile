import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useTheme } from '../context/ThemeContext';

const AMC_LINKS = {
    "360 ONE": "https://www.360.one/asset-management/mutualfund/downloads/factsheets",
    "Aditya Birla SL": "https://mutualfund.adityabirlacapital.com/forms-and-downloads/factsheets",
    "Axis": "https://www.axismf.com/downloads",
    "Bajaj Finserv": "https://www.bajajamc.com/downloads",
    "Bandhan": "https://bandhanmutual.com/downloads/factsheets",
    "Baroda BNP": "https://www.barodabnpparibasmf.in/downloads/monthly-factsheet",
    "Canara Robeco": "https://www.canararobeco.com/documents/forms-downloads/",
    "DSP": "https://www.dspim.com/downloads",
    "Edelweiss": "https://www.edelweissmf.com/downloads/factsheets",
    "Franklin Templeton": "https://www.franklintempletonindia.com/downloads/fund-literature",
    "Groww MF": "https://www.growwmf.in/downloads/fact-sheet",
    "HDFC": "http://hdfcfund.com/downloads/monthly-fact-sheet",
    "HSBC": "https://www.assetmanagement.hsbc.co.in/en/mutual-funds/investor-resources",
    "ICICI Prudential": "https://www.icicipruamc.com/news-and-media/downloads",
    "Invesco": "https://invescomutualfund.com/literature-and-form?tab=Factsheets",
    "Kotak Mahindra": "https://www.kotakmf.com/Information/forms-and-downloads/Information",
    "Mirae Asset": "https://www.miraeassetmf.co.in/downloads/factsheet",
    "Motilal Oswal": "http://www.mostshares.com/downloads/mutualfund/Factsheet",
    "Nippon India": "https://mf.nipponindiaim.com/investor-service/downloads/factsheet-portfolio-and-other-disclosures",
    "PPFAS": "http://amc.ppfas.com/schemes/factsheet/index.php",
    "SBI": "https://www.sbimf.com/en-us/factsheets",
    "Sundaram": "https://www.sundarammutual.com/Fundwise-Factsheet",
    "Tata": "https://www.tatamutualfund.com/information-documents",
    "UTI": "https://www.utimf.com/downloads/fact-sheet",
    "WhiteOak Capital": "https://mf.whiteoakamc.com/download#Factsheet",
};

const OFFICIAL = [
    { name: "MFCentral", url: "https://www.mfcentral.com/", desc: "Consolidated MF portfolio view" },
    { name: "AMFI India", url: "https://www.amfiindia.com/", desc: "Official NAV data & scheme info" },
    { name: "SEBI", url: "https://www.sebi.gov.in/", desc: "MF regulations & circulars" },
];

const PLATFORMS = [
    { name: "Groww", url: "https://groww.in/mutual-funds", desc: "Popular investment platform" },
    { name: "Zerodha Coin", url: "https://coin.zerodha.com/", desc: "Direct MF investing" },
    { name: "Kuvera", url: "https://kuvera.in/", desc: "Free direct MF platform" },
    { name: "Paytm Money", url: "https://www.paytmmoney.com/mutual-funds", desc: "Commission-free investing" },
];

const UsefulLinks = () => {
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState('official');
    const [search, setSearch] = useState('');

    const openLink = async (url) => {
        try {
            await WebBrowser.openBrowserAsync(url);
        } catch {
            Linking.openURL(url);
        }
    };

    const filteredAMCs = Object.entries(AMC_LINKS)
        .filter(([name]) => name.toLowerCase().includes(search.toLowerCase()));

    const LinkItem = ({ name, url, desc }) => (
        <TouchableOpacity style={[styles.linkItem, { borderBottomColor: colors.borderSecondary }]} onPress={() => openLink(url)}>
            <View style={styles.linkInfo}>
                <Text style={[styles.linkName, { color: colors.textPrimary }]}>{name}</Text>
                {desc && <Text style={[styles.linkDesc, { color: colors.textMuted }]}>{desc}</Text>}
            </View>
            <Ionicons name="open-outline" size={14} color={colors.textMuted} />
        </TouchableOpacity>
    );

    const tabs = ['official', 'platforms', 'amc'];

    return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.header}>
                <Text style={{ fontSize: 16 }}>🔗</Text>
                <Text style={[styles.title, { color: colors.textPrimary }]}>Useful Links</Text>
            </View>

            <View style={styles.tabs}>
                {tabs.map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && { backgroundColor: colors.primaryDim }]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, { color: activeTab === tab ? colors.primary : colors.textMuted }]}>
                            {tab === 'official' ? 'Official' : tab === 'platforms' ? 'Platforms' : 'AMC'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.content}>
                {activeTab === 'official' && OFFICIAL.map(l => <LinkItem key={l.name} {...l} />)}
                {activeTab === 'platforms' && PLATFORMS.map(l => <LinkItem key={l.name} {...l} />)}
                {activeTab === 'amc' && (
                    <>
                        <TextInput
                            style={[styles.searchInput, { color: colors.textPrimary, borderColor: colors.borderPrimary, backgroundColor: colors.surface }]}
                            placeholder="Search AMC..."
                            placeholderTextColor={colors.textMuted}
                            value={search}
                            onChangeText={setSearch}
                        />
                        <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                            {filteredAMCs.map(([name, url]) => (
                                <TouchableOpacity
                                    key={name}
                                    style={[styles.amcItem, { borderBottomColor: colors.borderSecondary }]}
                                    onPress={() => openLink(url)}
                                >
                                    <Text style={[styles.amcName, { color: colors.textPrimary }]}>{name}</Text>
                                    <Ionicons name="open-outline" size={12} color={colors.textMuted} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: { borderRadius: 14, borderWidth: 1, padding: 14 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    title: { fontSize: 14, fontWeight: '700' },
    tabs: { flexDirection: 'row', gap: 4, marginBottom: 12 },
    tab: { flex: 1, paddingVertical: 6, borderRadius: 8, alignItems: 'center' },
    tabText: { fontSize: 11, fontWeight: '700' },
    content: {},
    linkItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 },
    linkInfo: { flex: 1 },
    linkName: { fontSize: 13, fontWeight: '600' },
    linkDesc: { fontSize: 10, marginTop: 1 },
    searchInput: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginBottom: 8, fontSize: 13 },
    amcItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1 },
    amcName: { fontSize: 12, fontWeight: '500' },
});

export default UsefulLinks;
