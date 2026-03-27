import React, { useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Home, Heart, Wrench, Info } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useColors, shadows } from '../theme';

import DashboardScreen from '../screens/DashboardScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import LoginScreen from '../screens/LoginScreen';
import AboutScreen from '../screens/AboutScreen';
import ToolkitScreen from '../screens/ToolkitScreen';
import FundDetailScreen from '../screens/FundDetailScreen';
import AllIndicesScreen from '../screens/AllIndicesScreen';
import IndexDetailScreen from '../screens/IndexDetailScreen';
import DisclaimerScreen from '../screens/DisclaimerScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  const colors = useColors();

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bgPrimary },
        animation: 'slide_from_right',
      }}
    >
      <HomeStack.Screen name="Dashboard" component={DashboardScreen} />
      <HomeStack.Screen name="FundDetail" component={FundDetailScreen} />
    </HomeStack.Navigator>
  );
}

function MainTabs() {
  const colors = useColors();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bottomBarBg,
          borderTopColor: colors.borderPrimary,
          borderTopWidth: 1.5,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
          ...shadows.sm,
        },
        tabBarActiveTintColor: colors.accentCyan,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Toolkit"
        component={ToolkitScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Wrench size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Info size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const colors = useColors();
  const { isDark } = useTheme();

  const navigationTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.accentCyan,
        background: colors.bgPrimary,
        card: colors.bgCard,
        text: colors.textPrimary,
        border: colors.borderPrimary,
        notification: colors.accentRed,
      },
    };
  }, [isDark, colors]);

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bgPrimary },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="AllIndices" component={AllIndicesScreen} />
        <Stack.Screen name="IndexDetail" component={IndexDetailScreen} />
        <Stack.Screen name="Disclaimer" component={DisclaimerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

