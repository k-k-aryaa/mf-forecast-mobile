import React, { useState, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useColors, spacing, radii, fontSizes } from '../theme';

const MESSAGES = [
  'AI Engine Analyzing Live Ticks...',
  'Processing Market Data Streams...',
  'Aggregating 45 Underlying Assets...',
  'Computing Real-Time Correlations...',
  'Neural Network Processing...',
  'Calibrating Prediction Model...',
  'Synthesizing Market Signals...',
];

export default function ProcessingState() {
  const [messageIndex, setMessageIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const colors = useColors();

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Pulsing dot animation
  const pulseAnim = useState(new Animated.Value(0.4))[0];
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }]}>
      <View style={styles.dotsRow}>
        {[0, 1, 2].map((i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i === 0 ? colors.accentCyan : i === 1 ? colors.accentPurple : colors.accentCyan,
                opacity: pulseAnim,
              },
            ]}
          />
        ))}
      </View>
      <Animated.Text
        style={[styles.message, { color: colors.textSecondary, opacity: fadeAnim }]}
      >
        {MESSAGES[messageIndex]}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  message: {
    fontSize: fontSizes.sm,
    fontFamily: 'monospace',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
