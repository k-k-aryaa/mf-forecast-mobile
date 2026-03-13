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
import { Search, ChevronDown, Check } from 'lucide-react-native';
import api from '../api/api';
import { useColors, spacing, radii, fontSizes } from '../theme';

export default function FundSelector({ selectedFundId, onSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const colors = useColors();

  const { data: funds, isLoading } = useQuery({
    queryKey: ['funds'],
    queryFn: api.getFunds,
  });

  const filteredFunds =
    funds?.filter(
      (fund) =>
        fund.scheme_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fund.scheme_code?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const selectedFund = funds?.find((f) => f.id === selectedFundId);

  const handleSelect = (fund) => {
    onSelect(fund.id);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[
          styles.selector,
          {
            backgroundColor: colors.bgCard,
            borderColor: colors.borderPrimary,
          },
        ]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <View style={styles.selectorContent}>
          {selectedFund ? (
            <View>
              <Text style={[styles.fundName, { color: colors.textPrimary }]} numberOfLines={1}>
                {selectedFund.scheme_name}
              </Text>
              <Text style={[styles.fundCode, { color: colors.textMuted }]}>
                {selectedFund.scheme_code}
              </Text>
            </View>
          ) : (
            <Text style={[styles.placeholder, { color: colors.textMuted }]}>
              Select a mutual fund...
            </Text>
          )}
        </View>
        <ChevronDown size={20} color={colors.textMuted} />
      </TouchableOpacity>

      <Modal visible={isOpen} animationType="slide" transparent>
        <View style={[styles.modalOverlay]}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.bgElevated, borderColor: colors.borderPrimary },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Select Fund
              </Text>
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
              <ActivityIndicator
                size="large"
                color={colors.accentCyan}
                style={{ marginTop: 40 }}
              />
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
                          item.id === selectedFundId
                            ? colors.surfaceActive
                            : 'transparent',
                        borderBottomColor: colors.borderSubtle,
                      },
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <View style={styles.fundInfo}>
                      <Text
                        style={[styles.optionName, { color: colors.textPrimary }]}
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
                    {item.id === selectedFundId && (
                      <Check size={18} color={colors.accentCyan} />
                    )}
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                    No funds found
                  </Text>
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
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 52,
  },
  selectorContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  fundName: {
    fontSize: fontSizes.base,
    fontWeight: '600',
  },
  fundCode: {
    fontSize: fontSizes.xs,
    marginTop: 2,
  },
  placeholder: {
    fontSize: fontSizes.base,
  },
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
    borderBottomWidth: 1,
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
