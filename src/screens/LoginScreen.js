import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Mail, Lock, User, ArrowRight, AlertCircle, Home } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useColors, spacing, radii, fontSizes } from '../theme';

export default function LoginScreen() {
  const [view, setView] = useState('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registerStep, setRegisterStep] = useState('EMAIL');

  const { login, register, requestOTP, forgotPassword, resetPassword } = useAuth();
  const { isDark } = useTheme();
  const colors = useColors();
  const navigation = useNavigation();

  const logoDark = require('../assets/logo.png');
  const logoLight = require('../assets/logo_light.png');

  const clearErrors = () => { setError(null); setSuccessMsg(null); };

  const switchView = (newView) => {
    clearErrors();
    setView(newView);
  };

  const handleSubmit = async () => {
    clearErrors();
    setLoading(true);

    try {
      if (view === 'LOGIN') {
        const res = await login(email, password);
        if (res.success) navigation.navigate('Main');
        else setError(res.error || 'Authentication failed');
      } else if (view === 'REGISTER') {
        if (registerStep === 'EMAIL') {
          const res = await requestOTP(email);
          if (res.success) setRegisterStep('DETAILS');
          else setError(res.error || 'Failed to send OTP');
        } else {
          const res = await register(email, password, fullName, otp);
          if (res.success) navigation.navigate('Main');
          else setError(res.error || 'Registration failed');
        }
      } else if (view === 'FORGOT_EMAIL') {
        const res = await forgotPassword(email);
        if (res.success) {
          switchView('FORGOT_OTP');
          setSuccessMsg(`OTP sent to ${email}`);
        } else setError(res.error || 'Failed to send reset OTP');
      } else if (view === 'FORGOT_OTP') {
        const res = await resetPassword(email, otp, newPassword);
        if (res.success) {
          switchView('LOGIN');
          setSuccessMsg('Password reset successful. Please login.');
          setPassword(''); setNewPassword(''); setOtp('');
        } else setError(res.error || 'Failed to reset password');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (view === 'LOGIN') return 'Welcome Back';
    if (view === 'REGISTER') return 'Create Account';
    return 'Reset Password';
  };

  const getSubtitle = () => {
    if (view === 'LOGIN') return 'Sign in to access your dashboard';
    if (view === 'REGISTER') return registerStep === 'EMAIL' ? 'Enter your email to verify' : 'Complete your profile';
    if (view === 'FORGOT_EMAIL') return 'Enter email to receive OTP';
    return 'Set your new password';
  };

  const getButtonText = () => {
    if (loading) return 'Processing...';
    if (view === 'LOGIN') return 'Sign In';
    if (view === 'REGISTER') return registerStep === 'EMAIL' ? 'Send Verification Code' : 'Create Account';
    if (view === 'FORGOT_EMAIL') return 'Send Reset Code';
    return 'Reset Password';
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        {/* Home Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Main')}
          style={[styles.homeBtn, { backgroundColor: colors.surfaceHover, borderColor: colors.borderPrimary }]}
        >
          <Home size={16} color={colors.textSecondary} />
          <Text style={[styles.homeBtnText, { color: colors.textSecondary }]}>Home</Text>
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Branding */}
          <View style={styles.branding}>
            <Image
              source={isDark ? logoDark : logoLight}
              style={styles.brandLogo}
              resizeMode="contain"
            />
            <Text style={[styles.brandTitle, { color: colors.accentCyan }]}>MF-Forecast</Text>
            <Text style={[styles.brandTagline, { color: colors.textPrimary }]}>
              Master Your Portfolio
            </Text>
            <Text style={[styles.brandDesc, { color: colors.textMuted }]}>
              Get real-time NAV predictions and AI-powered insights for your mutual funds.
            </Text>

            <View style={styles.statsRow}>
              <View style={[styles.statCard, { backgroundColor: colors.surfaceHover, borderColor: colors.borderSubtle }]}>
                <Text style={[styles.statValue, { color: colors.accentCyan }]}>98%</Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>Prediction Accuracy</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.surfaceHover, borderColor: colors.borderSubtle }]}>
                <Text style={[styles.statValue, { color: colors.accentBlue }]}>Live</Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>Market Updates</Text>
              </View>
            </View>
          </View>

          {/* Form Card */}
          <View style={[styles.formCard, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}>
            <Text style={[styles.formTitle, { color: colors.accentCyan }]}>{getTitle()}</Text>
            <Text style={[styles.formSubtitle, { color: colors.textMuted }]}>{getSubtitle()}</Text>

            {successMsg && (
              <View style={[styles.successBanner, { backgroundColor: colors.accentNeonGreenDim }]}>
                <AlertCircle size={14} color={colors.accentGreen} />
                <Text style={[styles.successText, { color: colors.accentGreen }]}>{successMsg}</Text>
              </View>
            )}

            {error && (
              <View style={[styles.errorBanner, { backgroundColor: colors.accentRedDim }]}>
                <AlertCircle size={14} color={colors.accentRed} />
                <Text style={[styles.errorText, { color: colors.accentRed }]}>{error}</Text>
              </View>
            )}

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surfaceHover, borderColor: colors.borderSubtle }]}>
                <Mail size={16} color={colors.textMuted} />
                <TextInput
                  placeholder="name@example.com"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  style={[styles.input, { color: colors.textPrimary }]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={view !== 'FORGOT_OTP' && !(view === 'REGISTER' && registerStep === 'DETAILS')}
                />
              </View>
            </View>

            {/* Register Step 2 */}
            {view === 'REGISTER' && registerStep === 'DETAILS' && (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Verification Code (OTP)</Text>
                  <View style={[styles.inputWrapper, { backgroundColor: colors.surfaceHover, borderColor: colors.borderSubtle }]}>
                    <Lock size={16} color={colors.textMuted} />
                    <TextInput
                      placeholder="Enter 6-digit code"
                      placeholderTextColor={colors.textMuted}
                      value={otp}
                      onChangeText={setOtp}
                      style={[styles.input, { color: colors.textPrimary }]}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                  </View>
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
                  <View style={[styles.inputWrapper, { backgroundColor: colors.surfaceHover, borderColor: colors.borderSubtle }]}>
                    <User size={16} color={colors.textMuted} />
                    <TextInput
                      placeholder="John Doe"
                      placeholderTextColor={colors.textMuted}
                      value={fullName}
                      onChangeText={setFullName}
                      style={[styles.input, { color: colors.textPrimary }]}
                    />
                  </View>
                </View>
              </>
            )}

            {/* Forgot OTP fields */}
            {view === 'FORGOT_OTP' && (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Reset OTP</Text>
                  <View style={[styles.inputWrapper, { backgroundColor: colors.surfaceHover, borderColor: colors.borderSubtle }]}>
                    <Lock size={16} color={colors.textMuted} />
                    <TextInput
                      placeholder="Enter 6-digit code"
                      placeholderTextColor={colors.textMuted}
                      value={otp}
                      onChangeText={setOtp}
                      style={[styles.input, { color: colors.textPrimary }]}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                  </View>
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>New Password</Text>
                  <View style={[styles.inputWrapper, { backgroundColor: colors.surfaceHover, borderColor: colors.borderSubtle }]}>
                    <Lock size={16} color={colors.textMuted} />
                    <TextInput
                      placeholder="New Password"
                      placeholderTextColor={colors.textMuted}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      style={[styles.input, { color: colors.textPrimary }]}
                      secureTextEntry
                    />
                  </View>
                </View>
              </>
            )}

            {/* Password */}
            {(view === 'LOGIN' || (view === 'REGISTER' && registerStep === 'DETAILS')) && (
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Password</Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.surfaceHover, borderColor: colors.borderSubtle }]}>
                  <Lock size={16} color={colors.textMuted} />
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor={colors.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    style={[styles.input, { color: colors.textPrimary }]}
                    secureTextEntry
                  />
                </View>
                {view === 'LOGIN' && (
                  <TouchableOpacity onPress={() => switchView('FORGOT_EMAIL')} style={styles.forgotLink}>
                    <Text style={[styles.forgotText, { color: colors.textMuted }]}>Forgot password?</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={[styles.submitBtn, { backgroundColor: colors.accentCyan, opacity: loading ? 0.6 : 1 }]}
            >
              <Text style={styles.submitText}>{getButtonText()}</Text>
              {!loading && <ArrowRight size={18} color="#fff" />}
            </TouchableOpacity>

            {/* Toggle Auth */}
            <TouchableOpacity
              onPress={() => switchView(view === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
              style={styles.toggleBtn}
            >
              <Text style={[styles.toggleText, { color: colors.textMuted }]}>
                {view === 'LOGIN' ? "Don't have an account? Sign up" : 'Back to Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: colors.borderSubtle }]} />
              <Text style={[styles.dividerText, { color: colors.textMuted }]}>Or continue with</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.borderSubtle }]} />
            </View>

            {/* Guest Demo */}
            <TouchableOpacity
              onPress={() => {
                login('guest@example.com', 'guest123').then((res) => {
                  if (res.success) navigation.navigate('Main');
                  else {
                    setEmail('guest@example.com');
                    setPassword('password123');
                    switchView('LOGIN');
                  }
                });
              }}
              style={[styles.guestBtn, { backgroundColor: colors.surfaceHover, borderColor: colors.borderPrimary }]}
            >
              <Text style={[styles.guestText, { color: colors.textSecondary }]}>Try Guest Demo</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  homeBtn: {
    position: 'absolute',
    top: 50,
    left: spacing.lg,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  homeBtnText: { fontSize: fontSizes.sm, fontWeight: '600' },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: 80,
    paddingBottom: 40,
  },
  branding: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  brandLogo: { width: 72, height: 72, borderRadius: radii.lg, marginBottom: spacing.md },
  brandTitle: {
    fontSize: fontSizes['3xl'],
    fontWeight: '800',
    letterSpacing: -0.5,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  brandTagline: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  brandDesc: {
    fontSize: fontSizes.sm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  statValue: { fontSize: fontSizes.xl, fontWeight: '800' },
  statLabel: { fontSize: fontSizes.xs, marginTop: 2 },
  formCard: {
    borderWidth: 1,
    borderRadius: radii.xl,
    padding: spacing['2xl'],
  },
  formTitle: { fontSize: fontSizes['2xl'], fontWeight: '700', marginBottom: spacing.xs },
  formSubtitle: { fontSize: fontSizes.sm, marginBottom: spacing.lg },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.md,
  },
  successText: { fontSize: fontSizes.sm, flex: 1 },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.md,
  },
  errorText: { fontSize: fontSizes.sm, flex: 1 },
  fieldGroup: { marginBottom: spacing.lg },
  label: { fontSize: fontSizes.sm, fontWeight: '600', marginBottom: spacing.sm },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: fontSizes.base,
    paddingVertical: spacing.md,
  },
  forgotLink: { alignItems: 'flex-end', marginTop: spacing.xs },
  forgotText: { fontSize: fontSizes.xs },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: radii.md,
    marginBottom: spacing.lg,
  },
  submitText: {
    color: '#fff',
    fontSize: fontSizes.base,
    fontWeight: '700',
  },
  toggleBtn: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  toggleText: { fontSize: fontSizes.sm, fontWeight: '500' },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: fontSizes.xs },
  guestBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  guestText: { fontSize: fontSizes.base, fontWeight: '600' },
});
