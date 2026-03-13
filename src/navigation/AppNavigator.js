import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import LoginScreen from '../screens/LoginScreen';
import ToolkitScreen from '../screens/ToolkitScreen';
import AboutScreen from '../screens/AboutScreen';
import AllIndicesScreen from '../screens/AllIndicesScreen';
import IndexDetailScreen from '../screens/IndexDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

const HomeStackScreen = () => {
    const { colors } = useTheme();

    return (
        <HomeStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <HomeStack.Screen name="Dashboard" component={DashboardScreen} />
            <HomeStack.Screen name="AllIndices" component={AllIndicesScreen} />
            <HomeStack.Screen name="IndexDetail" component={IndexDetailScreen} />
        </HomeStack.Navigator>
    );
};

const MainTabs = () => {
    const { colors } = useTheme();
    const { user } = useAuth();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Toolkit') iconName = focused ? 'construct' : 'construct-outline';
                    else if (route.name === 'About') iconName = focused ? 'information-circle' : 'information-circle-outline';
                    else if (route.name === 'Account') iconName = focused ? 'person' : 'person-outline';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.tabActive,
                tabBarInactiveTintColor: colors.tabInactive,
                tabBarStyle: {
                    backgroundColor: colors.bottomBar,
                    borderTopColor: colors.borderPrimary,
                    borderTopWidth: 1,
                    paddingBottom: 4,
                    height: 56,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                },
                header: ({ navigation }) => <Header navigation={navigation} />,
            })}
        >
            <Tab.Screen name="Home" component={HomeStackScreen} />
            <Tab.Screen name="Toolkit" component={ToolkitScreen} />
            <Tab.Screen name="About" component={AboutScreen} />
            <Tab.Screen
                name="Account"
                component={LoginScreen}
                options={{
                    tabBarLabel: user ? 'Profile' : 'Login',
                }}
            />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    const { colors, theme } = useTheme();
    const navigationTheme = theme === 'dark' ? DarkTheme : DefaultTheme;

    return (
        <NavigationContainer
            theme={{
                ...navigationTheme,
                colors: {
                    ...navigationTheme.colors,
                    primary: colors.primary,
                    background: colors.background,
                    card: colors.surface,
                    text: colors.textPrimary,
                    border: colors.borderPrimary,
                    notification: colors.accentRed,
                },
            }}
        >
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen name="Login" component={LoginScreen} options={{ presentation: 'modal' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
