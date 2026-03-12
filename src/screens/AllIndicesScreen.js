import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api';
import { useTheme } from '../context/ThemeContext';

const AllIndicesScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [indices, setIndices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchIndices = async () => {
            try {
                const data = await api.getMarketIndices();
                if (Array.isArray(data)) setIndices(data);
            } catch (err) {
                setError('Failed to load market data');
            } finally {
                setLoading(false);
            }
        };
        fetchIndices();
        const interval = setInterval(fetchIndices, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={20} color={colors.textSecondary} />
                    <Text style={[styles.backText, { color: colors.textSecondary }]}>Dashboard</Text>
                </TouchableOpacity>
                <View style={styles.titleRow}>
                    <View style={[styles.liveDot, { backgroundColor: colors.accentGreen }]} />
                    <Text style={[styles.title, { color: colors.textPrimary }]}>All Market Indices</Text>
                </View>
                <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                    {indices.length} indices available • Real-time data
                </Text>
            </View>

            {loading ? (
                <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 40 }} />
            ) : error ? (
                <Text style={[styles.errorText, { color: colors.accentRed }]}>{error}</Text>
            ) : (
                <FlatList
                    data={indices}
                    keyExtractor={(item) => item.symbol}
                    numColumns={2}
                    contentContainerStyle={styles.grid}
                    columnWrapperStyle={styles.row}
                    renderItem={({ item }) => {
                        const isPositive = item.change >= 0;
                        return (
                            <TouchableOpacity
                                style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                                onPress={() => navigation.navigate('IndexDetail', { symbol: item.symbol })}
                            >
                                <Text style={[styles.indexName, { color: colors.textSecondary }]} numberOfLines={1}>
                                    {item.name}
                                </Text>
                                <Text style={[styles.price, { color: isPositive ? colors.accentGreen : colors.accentRed }]}>
                                    {item.price?.toFixed(2) ?? '-'}
                                </Text>
                                <Text style={[styles.change, { color: isPositive ? colors.accentGreen : colors.accentRed }]}>
                                    {isPositive ? '▲' : '▼'} {Math.abs(item.change ?? 0).toFixed(2)} ({Math.abs(item.change_pct ?? 0).toFixed(2)}%)
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 16 },
    backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 4 },
    backText: { fontSize: 13 },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    liveDot: { width: 8, height: 8, borderRadius: 4 },
    title: { fontSize: 20, fontWeight: '800' },
    subtitle: { fontSize: 12, marginTop: 4 },
    grid: { paddingHorizontal: 12, paddingBottom: 100 },
    row: { gap: 8, marginBottom: 8 },
    card: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12 },
    indexName: { fontSize: 10, fontWeight: '600', marginBottom: 4 },
    price: { fontSize: 16, fontWeight: '700', fontFamily: 'monospace' },
    change: { fontSize: 10, fontFamily: 'monospace', marginTop: 2 },
    errorText: { textAlign: 'center', padding: 40, fontSize: 14 },
});

export default AllIndicesScreen;
