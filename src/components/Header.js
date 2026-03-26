import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Sun, Moon, LogOut, User } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useColors, spacing, radii, fontSizes, useResponsive } from '../theme';
import { NAV_CUTOFF_HOUR, NAV_CUTOFF_MINUTE, MARKET_STATUS_REFRESH_INTERVAL } from '../api/config';
import api from '../api/api';

function getSecondsUntilCutoff() {
  const now = new Date();
  const cutoff = new Date();
  cutoff.setHours(NAV_CUTOFF_HOUR, NAV_CUTOFF_MINUTE, 0, 0);
  const diff = Math.floor((cutoff - now) / 1000);
  return Math.max(0, diff);
}

function formatCountdown(seconds) {
  if (seconds <= 0) return 'Closed';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

export default function Header() {
  const [countdown, setCountdown] = useState(formatCountdown(getSecondsUntilCutoff()));
  const [marketStatus, setMarketStatus] = useState('CLOSED');
  const [isTradingDay, setIsTradingDay] = useState(true);
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const colors = useColors();
  const navigation = useNavigation();
  const { isTablet, scale } = useResponsive();

  // Poll market status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await api.getMarketStatus();
        if (data) {
          setMarketStatus(data.status);
          setIsTradingDay(data.is_trading_day);
        }
      } catch (e) {}
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, MARKET_STATUS_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Local countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(formatCountdown(getSecondsUntilCutoff()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const statusColor = marketStatus === 'OPEN' ? colors.accentNeonGreen : colors.textMuted;

  const logoDark = require('../assets/logo.png');
  const logoLight = require('../assets/logo_light.png');

  return (
    <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.borderPrimary }]}>
      <View style={styles.headerContent}>
        {/* Logo */}
        <View style={styles.brand}>
          <Image
            source={isDark ? logoDark : logoLight}
            style={[styles.logo, { width: scale(32), height: scale(32) }]}
            resizeMode="contain"
          />
          <Text style={[styles.brandText, { color: colors.accentCyan, fontSize: scale(fontSizes['2xl']) }]}>MF-Forecast</Text>
        </View>

        {/* Status & Controls */}
        <View style={styles.rightSection}>
          {/* Market Status */}
          <View style={styles.statusBlock}>
            <View style={styles.statusRow}>
              {marketStatus === 'OPEN' && (
                <View style={[styles.dotLive, { backgroundColor: colors.accentNeonGreen }]} />
              )}
              <Text style={[styles.statusText, { color: statusColor, fontSize: scale(fontSizes.xs) }]}>
                {marketStatus ? marketStatus.replace('_', ' ') : 'CLOSED'}
              </Text>
            </View>
            <Text style={[styles.cutoffText, { color: colors.textMuted, fontSize: scale(fontSizes['2xs']) }]}>
              {isTradingDay ? countdown : 'Holiday'}
            </Text>
          </View>

          {/* Theme Toggle */}
          <TouchableOpacity onPress={toggleTheme} style={styles.iconBtn}>
            {isDark ? (
              <Sun size={scale(18)} color={colors.textSecondary} />
            ) : (
              <Moon size={scale(18)} color={colors.textSecondary} />
            )}
          </TouchableOpacity>

          {/* Auth */}
          {user ? (
            <View style={styles.userSection}>
              <View style={[styles.avatar, { backgroundColor: colors.accentCyan, width: scale(28), height: scale(28), borderRadius: scale(14) }]}>
                <Text style={[styles.avatarText, { fontSize: scale(fontSizes.sm) }]}>
                  {user.full_name ? user.full_name[0] : 'U'}
                </Text>
              </View>
              <TouchableOpacity onPress={logout} style={styles.iconBtn}>
                <LogOut size={scale(16)} color={colors.accentRed} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('LoginScreen')}
              style={[styles.loginBtn, { backgroundColor: colors.accentCyan }]}
            >
              <Text style={[styles.loginBtnText, { fontSize: scale(fontSizes.sm) }]}>Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingTop: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
  },
  brandText: {
    fontSize: fontSizes['2xl'],
    fontWeight: '800',
    letterSpacing: -0.5,
    textTransform: 'uppercase',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statusBlock: {
    alignItems: 'flex-end',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dotLive: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cutoffText: {
    fontSize: fontSizes['2xs'],
    fontFamily: 'monospace',
    marginTop: 1,
  },
  iconBtn: {
    padding: spacing.xs,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: fontSizes.sm,
  },
  loginBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.md,
  },
  loginBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: fontSizes.sm,
  },
});
