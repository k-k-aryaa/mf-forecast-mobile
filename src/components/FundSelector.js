import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Search, ChevronDown, Check, Sparkles } from 'lucide-react-native';
import api from '../api/api';
import { useColors, spacing, radii, fontSizes, useResponsive } from '../theme';

export default function FundSelector({ selectedFundId, onSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const colors = useColors();
  const { isTablet, scale } = useResponsive();

  const { data: funds, isLoading } = useQuery({
    queryKey: ['funds'],
    queryFn: api.getFunds,
  });

  const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);
  const filteredFunds =
    funds?.filter((fund) => {
      if (searchTerms.length === 0 || searchQuery.trim() === '') return true;
      const name = fund.scheme_name.toLowerCase();
      const code = fund.scheme_code?.toLowerCase() || '';
      return searchTerms.every((term) => name.includes(term) || code.includes(term));
    }) || [];

  const selectedFund = funds?.find((f) => f.id === selectedFundId);

  const handleSelect = (fund) => {
    onSelect(fund.id);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <View style={styles.wrapper}>
      {/* Label */}
      <View style={styles.labelRow}>
        <Sparkles size={14} color={colors.accentCyan} />
        <Text style={[styles.labelText, { color: colors.accentCyan }]}>
          Search & Select a Mutual Fund
        </Text>
      </View>

      {/* Selected fund chip OR search bar trigger */}
      {selectedFund ? (
        <TouchableOpacity
          style={[styles.chipBar, { borderColor: `${colors.accentCyan}40` }]}
          onPress={() => setIsOpen(true)}
          activeOpacity={0.7}
        >
          <View style={[styles.chipDot, { backgroundColor: colors.accentCyan }]} />
          <View style={styles.chipTextWrap}>
            <Text style={[styles.chipName, { color: colors.textPrimary }]} numberOfLines={1}>
              {selectedFund.scheme_name}
            </Text>
            {selectedFund.scheme_code && (
              <View style={[styles.chipCodeBadge, { backgroundColor: `${colors.accentCyan}18` }]}>
                <Text style={[styles.chipCodeText, { color: colors.accentCyan }]}>
                  {selectedFund.scheme_code}
                </Text>
              </View>
            )}
          </View>
          <ChevronDown size={18} color={colors.textMuted} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.searchBar, { borderColor: colors.borderPrimary, backgroundColor: colors.bgCard }]}
          onPress={() => setIsOpen(true)}
          activeOpacity={0.7}
        >
          <Search size={18} color={colors.textMuted} />
          <Text style={[styles.searchPlaceholder, { color: colors.textMuted }]}>
            Type to search mutual funds...
          </Text>
          <View style={[styles.divider, { backgroundColor: colors.borderPrimary }]} />
          <ChevronDown size={18} color={colors.textMuted} />
        </TouchableOpacity>
      )}

      {/* Fund picker modal */}
      <Modal visible={isOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.bgElevated, borderColor: colors.borderPrimary },
              isTablet && styles.modalContentTablet,
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select Fund</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Text style={[styles.closeBtn, { color: colors.accentCyan }]}>Close</Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.searchBox,
                { backgroundColor: colors.surfaceHover, borderColor: colors.borderSubtle },
              ]}
            >
              <Search size={16} color={colors.textMuted} />
              <TextInput
                placeholder="Search funds..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={[styles.searchInput, { color: colors.textPrimary }]}
                autoFocus
              />
            </View>

            {isLoading ? (
              <ActivityIndicator size="large" color={colors.accentCyan} style={{ marginTop: 40 }} />
            ) : (
              <FlatList
                data={filteredFunds}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.fundOption,
                      {
                        backgroundColor:
                          item.id === selectedFundId ? `${colors.accentCyan}12` : 'transparent',
                        borderBottomColor: colors.borderSubtle,
                      },
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <View style={styles.fundInfo}>
                      <Text
                        style={[
                          styles.optionName,
                          {
                            color: item.id === selectedFundId ? colors.accentCyan : colors.textPrimary,
                          },
                        ]}
                        numberOfLines={2}
                      >
                        {item.scheme_name}
                      </Text>
                      {item.scheme_code && (
                        <Text style={[styles.optionCode, { color: colors.textMuted }]}>
                          {item.scheme_code}
                        </Text>
                      )}
                    </View>
                    {item.id === selectedFundId && <Check size={18} color={colors.accentCyan} />}
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={[styles.emptyText, { color: colors.textMuted }]}>No funds found</Text>
                }
                style={styles.list}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: spacing.md,
  },

  // Label
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: spacing.md,
  },
  labelText: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Search bar (no selection)
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1.5,
    borderRadius: 9999,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: fontSizes.base,
  },
  divider: {
    width: 1,
    height: 24,
  },

  // Selected fund chip
  chipBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1.5,
    borderRadius: 9999,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 52,
    backgroundColor: 'rgba(6, 182, 212, 0.04)',
  },
  chipDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  chipTextWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  chipName: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    flex: 1,
  },
  chipCodeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  chipCodeText: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    maxHeight: '80%',
    paddingTop: spacing.lg,
  },
  modalContentTablet: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
    borderBottomWidth: 1,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
  },
  closeBtn: {
    fontSize: fontSizes.base,
    fontWeight: '600',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSizes.base,
    paddingVertical: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.lg,
  },
  fundOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderRadius: radii.md,
  },
  fundInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  optionName: {
    fontSize: fontSizes.base,
    fontWeight: '500',
  },
  optionCode: {
    fontSize: fontSizes.xs,
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 40,
    fontSize: fontSizes.base,
  },
});
