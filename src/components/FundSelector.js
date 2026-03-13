import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import api from '../api';
import { useTheme } from '../context/ThemeContext';

const FundSelector = ({ selectedFundId, onSelect }) => {
    const { colors } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: funds, isLoading } = useQuery({
        queryKey: ['funds'],
        queryFn: api.getFunds,
    });

    const filteredFunds = funds?.filter(fund =>
        fund.scheme_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fund.scheme_code?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const selectedFund = funds?.find(f => f.id === selectedFundId);

    const handleSelect = (fund) => {
        onSelect(fund.id);
        setIsOpen(false);
        setSearchQuery('');
    };

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity
                style={[styles.selector, { backgroundColor: colors.card, borderColor: colors.borderPrimary }]}
                onPress={() => setIsOpen(true)}
                activeOpacity={0.7}
            >
                <View style={styles.selectorContent}>
                    {selectedFund ? (
                        <>
                            <Text style={[styles.fundName, { color: colors.textPrimary }]} numberOfLines={1}>
                                {selectedFund.scheme_name}
                            </Text>
                            <Text style={[styles.fundCode, { color: colors.textMuted }]}>
                                {selectedFund.scheme_code}
                            </Text>
                        </>
                    ) : (
                        <Text style={[styles.placeholder, { color: colors.textMuted }]}>
                            Select a mutual fund...
                        </Text>
                    )}
                </View>
                <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            <Modal visible={isOpen} animationType="slide" transparent={false}>
                <SafeAreaView style={[styles.modal, { backgroundColor: colors.background }]}>
                    <View style={[styles.modalHeader, { borderBottomColor: colors.borderPrimary }]}>
                        <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select Fund</Text>
                        <TouchableOpacity onPress={() => { setIsOpen(false); setSearchQuery(''); }}>
                            <Ionicons name="close" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.searchBox, { backgroundColor: colors.bgSecondary, borderColor: colors.borderPrimary }]}>
                        <Ionicons name="search" size={18} color={colors.textMuted} />
                        <TextInput
                            style={[styles.searchInput, { color: colors.textPrimary }]}
                            placeholder="Search funds..."
                            placeholderTextColor={colors.textMuted}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus
                        />
                    </View>

                    {isLoading ? (
                        <View style={styles.loadingState}>
                            <Text style={{ color: colors.textMuted }}>Loading funds...</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredFunds}
                            keyExtractor={(item) => String(item.id)}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.fundOption,
                                        { borderBottomColor: colors.borderSubtle },
                                        item.id === selectedFundId && { backgroundColor: colors.primaryDim }
                                    ]}
                                    onPress={() => handleSelect(item)}
                                >
                                    <View style={styles.fundInfo}>
                                        <Text style={[styles.optionName, { color: colors.textPrimary }]} numberOfLines={2}>
                                            {item.scheme_name}
                                        </Text>
                                        {item.scheme_code && (
                                            <Text style={[styles.optionCode, { color: colors.textMuted }]}>
                                                {item.scheme_code}
                                            </Text>
                                        )}
                                    </View>
                                    {item.id === selectedFundId && (
                                        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                                    )}
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <View style={styles.emptyList}>
                                    <Text style={{ color: colors.textMuted }}>No funds found</Text>
                                </View>
                            }
                        />
                    )}
                </SafeAreaView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginVertical: 12,
    },
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
    },
    selectorContent: {
        flex: 1,
        marginRight: 8,
    },
    fundName: {
        fontSize: 14,
        fontWeight: '600',
    },
    fundCode: {
        fontSize: 11,
        marginTop: 2,
        fontFamily: 'monospace',
    },
    placeholder: {
        fontSize: 14,
    },
    modal: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 12,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
    },
    loadingState: {
        alignItems: 'center',
        padding: 40,
    },
    fundOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    fundInfo: {
        flex: 1,
        marginRight: 12,
    },
    optionName: {
        fontSize: 13,
        fontWeight: '500',
    },
    optionCode: {
        fontSize: 10,
        fontFamily: 'monospace',
        marginTop: 2,
    },
    emptyList: {
        alignItems: 'center',
        padding: 40,
    },
});

export default FundSelector;
