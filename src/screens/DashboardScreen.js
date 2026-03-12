import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, RefreshControl } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import MarketTicker from '../components/MarketTicker';
import FundSelector from '../components/FundSelector';
import EstimateCard from '../components/EstimateCard';
import NavChart from '../components/NavChart';
import Attribution from '../components/Attribution';
import TruthLens from '../components/TruthLens';
import Favorites from '../components/Favorites';

const DashboardScreen = ({ navigation }) => {
    const { colors, theme } = useTheme();
    const [selectedFundId, setSelectedFundId] = useState(null);
    const [activeView, setActiveView] = useState('dashboard');
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        // Just a brief delay to give a visual refresh
        await new Promise(r => setTimeout(r, 1000));
        setRefreshing(false);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                style={styles.scroll}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
            >
                <MarketTicker
                    onNavigateToIndices={() => navigation.navigate('AllIndices')}
                    onNavigateToDetail={(symbol) => navigation.navigate('IndexDetail', { symbol })}
                />

                <View style={styles.content}>
                    {/* View Tabs */}
                    <View style={[styles.tabs, { borderColor: colors.borderPrimary }]}>
                        <TouchableOpacity
                            style={[styles.tab, activeView === 'dashboard' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
                            onPress={() => setActiveView('dashboard')}
                        >
                            <Text style={[styles.tabText, { color: activeView === 'dashboard' ? colors.primary : colors.textMuted }]}>
                                Dashboard
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeView === 'favorites' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
                            onPress={() => setActiveView('favorites')}
                        >
                            <Text style={[styles.tabText, { color: activeView === 'favorites' ? colors.primary : colors.textMuted }]}>
                                Favorites
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {activeView === 'dashboard' ? (
                        <>
                            <FundSelector selectedFundId={selectedFundId} onSelect={setSelectedFundId} />

                            {selectedFundId ? (
                                <View style={styles.dashboard}>
                                    <EstimateCard fundId={selectedFundId} />
                                    <View style={{ height: 12 }} />
                                    <NavChart fundId={selectedFundId} />
                                    <Attribution fundId={selectedFundId} />
                                    <TruthLens fundId={selectedFundId} />
                                    <View style={{ height: 100 }} />
                                </View>
                            ) : (
                                <View style={styles.emptyState}>
                                    <Text style={{ fontSize: 64, marginBottom: 16 }}>🚀</Text>
                                    <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Select a Fund to Begin</Text>
                                    <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>
                                        Choose a mutual fund from the dropdown above to view real-time performance estimates.
                                    </Text>
                                </View>
                            )}
                        </>
                    ) : (
                        <Favorites
                            onFundSelect={(id) => {
                                if (id) setSelectedFundId(id);
                                setActiveView('dashboard');
                            }}
                            onLogin={() => navigation.navigate('Login')}
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scroll: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    tabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        marginBottom: 4,
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginRight: 4,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '700',
    },
    dashboard: {},
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    emptyDesc: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 20,
    },
});

export default DashboardScreen;
