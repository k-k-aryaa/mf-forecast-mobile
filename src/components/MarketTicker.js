import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import api from '../api';

const VISIBLE_COUNT = 5;

const MarketTicker = ({ onNavigateToIndices, onNavigateToDetail }) => {
    const { colors } = useTheme();
    const [indices, setIndices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIndices = async () => {
            try {
                const data = await api.getMarketIndices();
                if (Array.isArray(data)) setIndices(data);
            } catch (err) {
                console.error('Failed to fetch market indices:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchIndices();
        const interval = setInterval(fetchIndices, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading || indices.length === 0) return null;

    const visible = indices.slice(0, VISIBLE_COUNT);
    const hasMore = indices.length > VISIBLE_COUNT;

    const renderCard = ({ item }) => {
        const isPositive = item.change >= 0;
        return (
            <TouchableOpacity
                style={[styles.card, { backgroundColor: colors.indexCardBg, borderColor: colors.borderSubtle }]}
                onPress={() => onNavigateToDetail?.(item.symbol)}
                activeOpacity={0.7}
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
    };

    return (
        <View style={[styles.container, { borderBottomColor: colors.borderPrimary, backgroundColor: colors.tickerBg }]}>
            <View style={styles.header}>
                <View style={[styles.liveDot, {
                    backgroundColor: colors.accentNeonGreen,
                    shadowColor: colors.accentNeonGreen,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 4,
                    elevation: 4,
                }]} />
                <Text style={[styles.label, { color: colors.textMuted }]}>Market Indices</Text>
            </View>
            <FlatList
                data={visible}
                renderItem={renderCard}
                keyExtractor={(item) => item.symbol}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListFooterComponent={hasMore ? (
                    <TouchableOpacity
                        style={[styles.moreBtn, { backgroundColor: colors.primaryDim, borderColor: colors.borderGlow }]}
                        onPress={onNavigateToIndices}
                    >
                        <Text style={[styles.moreCount, { color: colors.primary }]}>+{indices.length - VISIBLE_COUNT}</Text>
                        <Text style={[styles.moreText, { color: colors.primary }]}>More</Text>
                    </TouchableOpacity>
                ) : null}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 8,
        gap: 6,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    label: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    listContent: {
        paddingHorizontal: 12,
        gap: 8,
    },
    card: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        minWidth: 130,
    },
    indexName: {
        fontSize: 10,
        fontWeight: '600',
        marginBottom: 4,
    },
    price: {
        fontSize: 15,
        fontWeight: '700',
        fontFamily: 'monospace',
    },
    change: {
        fontSize: 10,
        fontFamily: 'monospace',
        marginTop: 2,
    },
    moreBtn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 70,
    },
    moreCount: {
        fontSize: 16,
        fontWeight: '800',
    },
    moreText: {
        fontSize: 9,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
});

export default MarketTicker;
