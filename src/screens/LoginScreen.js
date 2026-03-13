import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const LoginScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const { login, register, requestOTP, forgotPassword, resetPassword } = useAuth();

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

    const clearErrors = () => { setError(null); setSuccessMsg(null); };

    const switchView = (v) => { clearErrors(); setView(v); };

    const handleSubmit = async () => {
        clearErrors();
        setLoading(true);
        try {
            if (view === 'LOGIN') {
                const res = await login(email, password);
                if (res.success) navigation.goBack();
                else setError(res.error || 'Authentication failed');
            } else if (view === 'REGISTER') {
                if (registerStep === 'EMAIL') {
                    const res = await requestOTP(email);
                    if (res.success) setRegisterStep('DETAILS');
                    else setError(res.error || 'Failed to send OTP');
                } else {
                    const res = await register(email, password, fullName, otp);
                    if (res.success) navigation.goBack();
                    else setError(res.error || 'Registration failed');
                }
            } else if (view === 'FORGOT_EMAIL') {
                const res = await forgotPassword(email);
                if (res.success) { switchView('FORGOT_OTP'); setSuccessMsg(`OTP sent to ${email}`); }
                else setError(res.error || 'Failed to send reset OTP');
            } else if (view === 'FORGOT_OTP') {
                const res = await resetPassword(email, otp, newPassword);
                if (res.success) { switchView('LOGIN'); setSuccessMsg('Password reset successful.'); }
                else setError(res.error || 'Failed to reset password');
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
        if (view === 'REGISTER') return registerStep === 'EMAIL' ? 'Enter email to verify' : 'Complete your profile';
        if (view === 'FORGOT_EMAIL') return 'Enter email to receive OTP';
        return 'Set your new password';
    };

    const getButtonLabel = () => {
        if (loading) return 'Processing...';
        if (view === 'LOGIN') return 'Sign In';
        if (view === 'REGISTER') return registerStep === 'EMAIL' ? 'Send Verification Code' : 'Create Account';
        if (view === 'FORGOT_EMAIL') return 'Send Reset Code';
        return 'Reset Password';
    };

    return (
        <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Home Button */}
                <TouchableOpacity style={[styles.homeBtn, { backgroundColor: colors.card, borderColor: colors.borderPrimary }]} onPress={() => navigation.goBack()}>
                    <Ionicons name="home" size={16} color={colors.textSecondary} />
                    <Text style={[styles.homeBtnText, { color: colors.textSecondary }]}>Home</Text>
                </TouchableOpacity>

                {/* Branding */}
                <View style={styles.branding}>
                    <Text style={[styles.brandTitle, { color: colors.primary }]}>MF-Forecast</Text>
                    <Text style={[styles.tagline, { color: colors.textPrimary }]}>Master Your Portfolio</Text>
                    <Text style={[styles.brandDesc, { color: colors.textMuted }]}>
                        Get real-time NAV predictions and AI-powered insights.
                    </Text>
                    <View style={styles.statsRow}>
                        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.borderPrimary }]}>
                            <Text style={[styles.statValue, { color: colors.primary }]}>98%</Text>
                            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Accuracy</Text>
                        </View>
                        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.borderPrimary }]}>
                            <Text style={[styles.statValue, { color: colors.accentGreen }]}>Live</Text>
                            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Updates</Text>
                        </View>
                    </View>
                </View>

                {/* Form Card */}
                <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.borderPrimary }]}>
                    <Text style={[styles.formTitle, { color: colors.primary }]}>{getTitle()}</Text>
                    <Text style={[styles.formSubtitle, { color: colors.textMuted }]}>{getSubtitle()}</Text>

                    {successMsg && (
                        <View style={[styles.successBanner, { backgroundColor: colors.accentGreenDim }]}>
                            <Text style={{ color: colors.accentGreen, fontSize: 12 }}>{successMsg}</Text>
                        </View>
                    )}

                    {error && (
                        <View style={[styles.errorBanner, { backgroundColor: colors.accentRedDim }]}>
                            <Text style={{ color: colors.accentRed, fontSize: 12 }}>{error}</Text>
                        </View>
                    )}

                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
                        <View style={[styles.inputWrapper, { borderColor: colors.borderPrimary, backgroundColor: colors.bgSecondary }]}>
                            <Ionicons name="mail" size={16} color={colors.textMuted} />
                            <TextInput
                                style={[styles.input, { color: colors.textPrimary }]}
                                placeholder="name@example.com"
                                placeholderTextColor={colors.textMuted}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!(view === 'FORGOT_OTP' || (view === 'REGISTER' && registerStep === 'DETAILS'))}
                            />
                        </View>
                    </View>

                    {/* Register Step 2: OTP + Name */}
                    {view === 'REGISTER' && registerStep === 'DETAILS' && (
                        <>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Verification Code</Text>
                                <View style={[styles.inputWrapper, { borderColor: colors.borderPrimary, backgroundColor: colors.surface }]}>
                                    <Ionicons name="key" size={16} color={colors.textMuted} />
                                    <TextInput style={[styles.input, { color: colors.textPrimary }]} placeholder="6-digit code" placeholderTextColor={colors.textMuted} value={otp} onChangeText={setOtp} maxLength={6} keyboardType="number-pad" />
                                </View>
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
                                <View style={[styles.inputWrapper, { borderColor: colors.borderPrimary, backgroundColor: colors.surface }]}>
                                    <Ionicons name="person" size={16} color={colors.textMuted} />
                                    <TextInput style={[styles.input, { color: colors.textPrimary }]} placeholder="John Doe" placeholderTextColor={colors.textMuted} value={fullName} onChangeText={setFullName} />
                                </View>
                            </View>
                        </>
                    )}

                    {/* Forgot OTP Fields */}
                    {view === 'FORGOT_OTP' && (
                        <>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Reset OTP</Text>
                                <View style={[styles.inputWrapper, { borderColor: colors.borderPrimary, backgroundColor: colors.surface }]}>
                                    <Ionicons name="key" size={16} color={colors.textMuted} />
                                    <TextInput style={[styles.input, { color: colors.textPrimary }]} placeholder="6-digit code" placeholderTextColor={colors.textMuted} value={otp} onChangeText={setOtp} maxLength={6} keyboardType="number-pad" />
                                </View>
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>New Password</Text>
                                <View style={[styles.inputWrapper, { borderColor: colors.borderPrimary, backgroundColor: colors.surface }]}>
                                    <Ionicons name="lock-closed" size={16} color={colors.textMuted} />
                                    <TextInput style={[styles.input, { color: colors.textPrimary }]} placeholder="New Password" placeholderTextColor={colors.textMuted} value={newPassword} onChangeText={setNewPassword} secureTextEntry />
                                </View>
                            </View>
                        </>
                    )}

                    {/* Password */}
                    {(view === 'LOGIN' || (view === 'REGISTER' && registerStep === 'DETAILS')) && (
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Password</Text>
                            <View style={[styles.inputWrapper, { borderColor: colors.borderPrimary, backgroundColor: colors.surface }]}>
                                <Ionicons name="lock-closed" size={16} color={colors.textMuted} />
                                <TextInput style={[styles.input, { color: colors.textPrimary }]} placeholder="••••••••" placeholderTextColor={colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry />
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
                        style={[styles.submitBtn, { backgroundColor: colors.primary, opacity: loading ? 0.6 : 1 }]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text style={styles.submitText}>{getButtonLabel()}</Text>
                        {!loading && <Ionicons name="arrow-forward" size={16} color="#fff" />}
                    </TouchableOpacity>

                    {/* Footer Links */}
                    <TouchableOpacity onPress={() => switchView(view === 'LOGIN' ? 'REGISTER' : 'LOGIN')} style={styles.toggleBtn}>
                        <Text style={[styles.toggleText, { color: colors.primary }]}>
                            {view === 'LOGIN' ? "Don't have an account? Sign up" : 'Back to Sign In'}
                        </Text>
                    </TouchableOpacity>

                    {/* Guest Demo */}
                    <TouchableOpacity
                        style={[styles.guestBtn, { backgroundColor: colors.surface, borderColor: colors.borderPrimary }]}
                        onPress={async () => {
                            const res = await login('guest@example.com', 'guest123');
                            if (res.success) navigation.goBack();
                        }}
                    >
                        <Text style={[styles.guestText, { color: colors.textSecondary }]}>Try Guest Demo</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 40 },
    homeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginBottom: 24 },
    homeBtnText: { fontSize: 12, fontWeight: '600' },
    branding: { alignItems: 'center', marginBottom: 24 },
    brandTitle: { fontSize: 28, fontWeight: '900', textTransform: 'uppercase', letterSpacing: -1, marginBottom: 4 },
    tagline: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
    brandDesc: { fontSize: 13, textAlign: 'center', lineHeight: 19, marginBottom: 16, paddingHorizontal: 20 },
    statsRow: { flexDirection: 'row', gap: 12 },
    statCard: { borderRadius: 10, borderWidth: 1, padding: 12, alignItems: 'center', minWidth: 90 },
    statValue: { fontSize: 18, fontWeight: '800' },
    statLabel: { fontSize: 10, marginTop: 2 },
    formCard: { borderRadius: 16, borderWidth: 1, padding: 20 },
    formTitle: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
    formSubtitle: { fontSize: 12, marginBottom: 16 },
    successBanner: { padding: 10, borderRadius: 8, marginBottom: 12 },
    errorBanner: { padding: 10, borderRadius: 8, marginBottom: 12 },
    inputGroup: { marginBottom: 14 },
    label: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, gap: 8 },
    input: { flex: 1, paddingVertical: 10, fontSize: 14 },
    forgotLink: { alignSelf: 'flex-end', marginTop: 4 },
    forgotText: { fontSize: 11 },
    submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12, marginTop: 8 },
    submitText: { color: '#fff', fontSize: 15, fontWeight: '700' },
    toggleBtn: { alignItems: 'center', marginTop: 16 },
    toggleText: { fontSize: 13, fontWeight: '600' },
    guestBtn: { alignItems: 'center', marginTop: 12, padding: 12, borderRadius: 10, borderWidth: 1 },
    guestText: { fontSize: 13, fontWeight: '600' },
});

export default LoginScreen;
