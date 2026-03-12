import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const LOADING_MESSAGES = [
    "AI Engine Analyzing Live Ticks...",
    "Aggregating 45 Underlying Assets...",
    "Calculating Weighted Impact...",
    "Syncing Real-Time Market Feed...",
    "Optimizing Prediction Confidence...",
];

const ProcessingState = () => {
    const { colors } = useTheme();
    const [messageIndex, setMessageIndex] = useState(0);
    const pulseAnim = React.useRef(new Animated.Value(0.4)).current;
    const spinAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Pulsing animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 0.4, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            ])
        ).start();

        // Spinning animation
        Animated.loop(
            Animated.timing(spinAnim, { toValue: 1, duration: 3000, easing: Easing.linear, useNativeDriver: true })
        ).start();
    }, []);

    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.primary + '30' }]}>
            <View style={styles.animContainer}>
                <Animated.View style={[styles.nodeRing, { borderColor: colors.primary, opacity: pulseAnim, transform: [{ rotate: spin }] }]} />
                <View style={[styles.nodeCore, { backgroundColor: colors.primary }]} />
            </View>
            <Text style={[styles.message, { color: colors.primary }]}>{LOADING_MESSAGES[messageIndex]}</Text>
            <View style={styles.dots}>
                {[0, 1, 2].map(i => (
                    <View key={i} style={[styles.dot, { backgroundColor: colors.primary }]} />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        borderRadius: 16,
        borderWidth: 1,
        minHeight: 200,
    },
    animContainer: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    nodeCore: {
        width: 16,
        height: 16,
        borderRadius: 8,
        position: 'absolute',
    },
    nodeRing: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderStyle: 'dashed',
    },
    message: {
        fontSize: 11,
        fontFamily: 'monospace',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        textAlign: 'center',
    },
    dots: {
        flexDirection: 'row',
        gap: 4,
        marginTop: 12,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
    },
});

export default ProcessingState;
