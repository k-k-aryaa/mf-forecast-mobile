import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { X, Flag, Send, CheckCircle, BarChart3, MessageSquare } from 'lucide-react-native';
import { useColors, spacing, radii, fontSizes, useResponsive } from '../theme';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const ISSUE_CATEGORIES = [
  { value: 'FUND_MISSING', label: 'Fund Missing' },
  { value: 'NAV_WRONG', label: 'NAV Wrong' },
  { value: 'WRONG_CATEGORY', label: 'Wrong Category' },
  { value: 'WRONG_HOLDINGS', label: 'Wrong Holdings' },
  { value: 'DATA_STALE', label: 'Data Stale' },
  { value: 'OTHER', label: 'Other' },
];

const FEEDBACK_CATEGORIES = [
  { value: 'FEEDBACK', label: 'General Feedback' },
  { value: 'SUGGESTION', label: 'Feature Suggestion' },
  { value: 'OTHER', label: 'Other' },
];

/**
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {function} onClose - Close handler
 * @param {number|null} fundId - Optional fund ID for issue context
 * @param {string|null} fundName - Optional fund name for display
 * @param {string} mode - 'issue' (default) or 'feedback'
 */
export default function ReportIssueModal({
  isOpen,
  onClose,
  fundId = null,
  fundName = null,
  mode = 'issue',
}) {
  const colors = useColors();
  const { user } = useAuth();
  const { scale } = useResponsive();
  const isFeedback = mode === 'feedback';
  const categories = isFeedback ? FEEDBACK_CATEGORIES : ISSUE_CATEGORIES;

  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  // Animated value for success checkmark scale
  const [successAnim] = useState(new Animated.Value(0));

  // Pre-fill email if logged in
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCategory(isFeedback ? 'FEEDBACK' : '');
      setDescription('');
      setError('');
      setSuccess(null);
      successAnim.setValue(0);
      if (user?.email) setEmail(user.email);
    }
  }, [isOpen, user, isFeedback]);

  // Animate success icon
  useEffect(() => {
    if (success) {
      Animated.spring(successAnim, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }).start();
    }
  }, [success]);

  const handleSubmit = async () => {
    if (!category) {
      setError('Please select a category.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const payload = {
        category,
        description: description.trim() || null,
        email: email.trim() || null,
      };

      if (fundId) {
        payload.fund_id = fundId;
      }

      const result = await api.reportIssue(payload);
      setSuccess({ id: result.id, message: result.message });
    } catch (err) {
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const titleIcon = isFeedback
    ? <MessageSquare size={scale(18)} color={colors.accentPurple} />
    : <Flag size={scale(18)} color={colors.accentCyan} />;
  const titleText = isFeedback ? 'Share Feedback' : 'Report an Issue';
  const subtitleText = isFeedback
    ? "We'd love to hear from you. Share your thoughts, ideas, or suggestions."
    : 'Help us improve data quality. Select the issue type and optionally add details.';
  const submitLabel = isFeedback ? 'Submit Feedback' : 'Submit Report';
  const accentColor = isFeedback ? colors.accentPurple : colors.accentCyan;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View
          style={[
            styles.modal,
            {
              backgroundColor: colors.bgElevated,
              borderColor: colors.borderPrimary,
            },
          ]}
        >
          {/* Close Button */}
          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: colors.surfaceHover }]}
            onPress={onClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <X size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            {success ? (
              /* ─── Success State ─── */
              <View style={styles.successContainer}>
                <Animated.View
                  style={[
                    styles.successIconWrap,
                    { backgroundColor: `${colors.accentGreen}18` },
                    {
                      transform: [{ scale: successAnim }],
                    },
                  ]}
                >
                  <CheckCircle size={scale(32)} color={colors.accentGreen} />
                </Animated.View>
                <Text
                  style={[
                    styles.successTitle,
                    { color: colors.textPrimary, fontSize: scale(fontSizes.lg) },
                  ]}
                >
                  {isFeedback ? 'Feedback Submitted' : 'Report Submitted'}
                </Text>
                <Text
                  style={[
                    styles.successMessage,
                    { color: colors.textSecondary, fontSize: scale(fontSizes.sm) },
                  ]}
                >
                  {success.message}
                </Text>
                <View
                  style={[
                    styles.successIdBadge,
                    { backgroundColor: colors.surfaceHover, borderColor: colors.borderSubtle },
                  ]}
                >
                  <Text style={[styles.successIdText, { color: colors.textMuted, fontSize: scale(fontSizes.xs) }]}>
                    #{success.id}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.doneBtn, { backgroundColor: accentColor }]}
                  onPress={onClose}
                >
                  <Text style={[styles.doneBtnText, { fontSize: scale(fontSizes.sm) }]}>Done</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* ─── Form State ─── */
              <>
                {/* Header */}
                <View style={styles.header}>
                  <View style={styles.headerTitleRow}>
                    {titleIcon}
                    <Text
                      style={[
                        styles.headerTitle,
                        { color: colors.textPrimary, fontSize: scale(fontSizes.lg) },
                      ]}
                    >
                      {titleText}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.headerSubtitle,
                      { color: colors.textMuted, fontSize: scale(fontSizes.sm) },
                    ]}
                  >
                    {subtitleText}
                  </Text>
                  {fundName && (
                    <View
                      style={[
                        styles.fundTag,
                        { backgroundColor: `${accentColor}15`, borderColor: `${accentColor}40` },
                      ]}
                    >
                      <BarChart3 size={12} color={accentColor} />
                      <Text
                        style={[
                          styles.fundTagText,
                          { color: accentColor, fontSize: scale(fontSizes.xs) },
                        ]}
                      >
                        {fundName}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Category Chips */}
                <View style={styles.categorySection}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      { color: colors.textSecondary, fontSize: scale(fontSizes.sm) },
                    ]}
                  >
                    {isFeedback ? 'Feedback Type' : 'Issue Type'}
                  </Text>
                  <View style={styles.chipsRow}>
                    {categories.map((cat) => {
                      const isSelected = category === cat.value;
                      return (
                        <TouchableOpacity
                          key={cat.value}
                          style={[
                            styles.chip,
                            {
                              backgroundColor: isSelected
                                ? `${accentColor}20`
                                : colors.surfaceHover,
                              borderColor: isSelected ? accentColor : colors.borderSubtle,
                            },
                          ]}
                          onPress={() => setCategory(cat.value)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              {
                                color: isSelected ? accentColor : colors.textSecondary,
                                fontSize: scale(fontSizes.xs),
                              },
                            ]}
                          >
                            {cat.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Description */}
                <View style={styles.fieldGroup}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      { color: colors.textSecondary, fontSize: scale(fontSizes.sm) },
                    ]}
                  >
                    {isFeedback ? 'Your Feedback' : 'Description (optional)'}
                  </Text>
                  <TextInput
                    style={[
                      styles.textArea,
                      {
                        color: colors.textPrimary,
                        backgroundColor: colors.surfaceHover,
                        borderColor: colors.borderSubtle,
                        fontSize: scale(fontSizes.sm),
                      },
                    ]}
                    placeholder={
                      isFeedback
                        ? 'What would you like to share with us?'
                        : 'Tell us more about the issue...'
                    }
                    placeholderTextColor={colors.textDim}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    maxLength={2000}
                    textAlignVertical="top"
                  />
                </View>

                {/* Email */}
                <View style={styles.fieldGroup}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      { color: colors.textSecondary, fontSize: scale(fontSizes.sm) },
                    ]}
                  >
                    Email (optional, for follow-up)
                  </Text>
                  <TextInput
                    style={[
                      styles.emailInput,
                      {
                        color: colors.textPrimary,
                        backgroundColor: colors.surfaceHover,
                        borderColor: colors.borderSubtle,
                        fontSize: scale(fontSizes.sm),
                      },
                    ]}
                    placeholder="you@example.com"
                    placeholderTextColor={colors.textDim}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {/* Error */}
                {error !== '' && (
                  <View
                    style={[
                      styles.errorBox,
                      { backgroundColor: `${colors.accentRed}12`, borderColor: `${colors.accentRed}40` },
                    ]}
                  >
                    <Text style={[styles.errorText, { color: colors.accentRed, fontSize: scale(fontSizes.xs) }]}>
                      {error}
                    </Text>
                  </View>
                )}

                {/* Submit Button */}
                <TouchableOpacity
                  style={[
                    styles.submitBtn,
                    {
                      backgroundColor: !category ? colors.surfaceActive : accentColor,
                      opacity: submitting ? 0.7 : 1,
                    },
                  ]}
                  onPress={handleSubmit}
                  disabled={submitting || !category}
                  activeOpacity={0.8}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Send size={scale(14)} color="#fff" />
                      <Text style={[styles.submitBtnText, { fontSize: scale(fontSizes.sm) }]}>
                        {submitLabel}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modal: {
    width: '90%',
    maxWidth: 420,
    maxHeight: '85%',
    borderRadius: radii.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: spacing.xl,
  },
  closeBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ─── Header ───
  header: {
    marginBottom: spacing.lg,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  headerTitle: {
    fontWeight: '700',
  },
  headerSubtitle: {
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  fundTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    borderWidth: 1,
    marginTop: spacing.md,
  },
  fundTagText: {
    fontWeight: '600',
  },

  // ─── Categories ───
  categorySection: {
    marginBottom: spacing.lg,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  chipText: {
    fontWeight: '600',
  },

  // ─── Fields ───
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: radii.md,
    padding: spacing.md,
    minHeight: 100,
    lineHeight: 20,
  },
  emailInput: {
    borderWidth: 1,
    borderRadius: radii.md,
    padding: spacing.md,
    height: 44,
  },

  // ─── Error ───
  errorBox: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  errorText: {
    fontWeight: '500',
  },

  // ─── Submit ───
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    marginTop: spacing.xs,
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: '700',
  },

  // ─── Success ───
  successContainer: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
  },
  successIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  successMessage: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  successIdBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    borderWidth: 1,
    marginBottom: spacing['2xl'],
  },
  successIdText: {
    fontWeight: '600',
  },
  doneBtn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing['3xl'],
    borderRadius: radii.md,
  },
  doneBtnText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
});
