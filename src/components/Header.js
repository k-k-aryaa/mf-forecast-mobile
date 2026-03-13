import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Header = ({ navigation }) => {
    const { theme, toggleTheme, colors } = useTheme();
    const { user, logout } = useAuth();

    const [countdown, setCountdown] = React.useState('');
    const [marketStatus, setMarketStatus] = React.useState('CLOSED');

    React.useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const cutoff = new Date();
            cutoff.setHours(15, 0, 0, 0);
            const diff = Math.floor((cutoff - now) / 1000);

            if (diff <= 0) {
                setCountdown('Closed');
            } else {
                const h = Math.floor(diff / 3600);
                const m = Math.floor((diff % 3600) / 60);
                const s = diff % 60;
                setCountdown(`${h}h ${m}m ${s}s`);
            }

            // Local market status
            const day = now.getDay();
            const time = now.getHours() * 60 + now.getMinutes();
            if (day === 0 || day === 6) setMarketStatus('CLOSED');
            else if (time < 555) setMarketStatus('PRE_MARKET');
            else if (time > 930) setMarketStatus('POST_MARKET');
            else setMarketStatus('OPEN');
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = () => {
        if (marketStatus === 'OPEN') return colors.accentNeonGreen;
        if (marketStatus === 'PRE_MARKET') return colors.statusPre;
        if (marketStatus === 'POST_MARKET') return colors.textSecondary;
        return colors.textMuted;
    };

    const logoSource = theme === 'dark'
        ? require('../../assets/logo.png')
        : require('../../assets/logo_light.png');

    return (
        <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.borderPrimary }]}>
            <View style={styles.left}>
                <Image source={logoSource} style={styles.logoImage} resizeMode="contain" />
                <Text style={[styles.logoText, { color: colors.primary }]}>MF-Forecast</Text>
            </View>

            <View style={styles.center}>
                <View style={styles.statusBlock}>
                    {marketStatus === 'OPEN' && (
                        <View style={[styles.liveDot, {
                            backgroundColor: colors.accentNeonGreen,
                            shadowColor: colors.accentNeonGreen,
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.8,
                            shadowRadius: 4,
                            elevation: 4,
                        }]} />
                    )}
                    <Text style={[styles.statusText, { color: getStatusColor() }]}>
                        {marketStatus.replace('_', ' ')}
                    </Text>
                </View>
                <Text style={[styles.cutoffText, { color: colors.textMuted }]}>{countdown}</Text>
            </View>

            <View style={styles.right}>
                <TouchableOpacity onPress={toggleTheme} style={styles.iconBtn}>
                    <Ionicons name={theme === 'dark' ? 'sunny' : 'moon'} size={20} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
    left: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logoImage: {
        width: 28,
        height: 28,
        borderRadius: 6,
    },
    logoText: {
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: -0.5,
        textTransform: 'uppercase',
    },
    center: {
        flex: 1,
        alignItems: 'center',
    },
    statusBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
        fontFamily: 'monospace',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    cutoffText: {
        fontSize: 9,
        fontFamily: 'monospace',
        marginTop: 2,
    },
    right: {
        flex: 1,
        alignItems: 'flex-end',
    },
    iconBtn: {
        padding: 6,
    },
});

export default Header;
