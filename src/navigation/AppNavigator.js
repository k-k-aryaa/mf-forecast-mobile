import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Home, User, LogOut, Menu } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useColors } from '../theme';

import DashboardScreen from '../screens/DashboardScreen';
import LoginScreen from '../screens/LoginScreen';
import AboutScreen from '../screens/AboutScreen';
import ToolkitScreen from '../screens/ToolkitScreen';
import AllIndicesScreen from '../screens/AllIndicesScreen';
import IndexDetailScreen from '../screens/IndexDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { user, logout } = useAuth();
  const colors = useColors();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bottomBarBg,
          borderTopColor: colors.borderPrimary,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
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
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      {user ? (
        <Tab.Screen
          name="Logout"
          component={DashboardScreen}
          options={{
            tabBarIcon: ({ color, size }) => <LogOut size={size} color={colors.accentRed} />,
            tabBarLabelStyle: { color: colors.accentRed, fontSize: 11, fontWeight: '600' },
            tabBarButton: (props) => {
              const { onPress, ...rest } = props;
              return (
                <props.PressableComponent
                  {...rest}
                  onPress={() => logout()}
                />
              );
            },
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              logout();
            },
          }}
        />
      ) : (
        <Tab.Screen
          name="Login"
          component={LoginScreen}
          options={{
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      )}
      <Tab.Screen
        name="Menu"
        component={ToolkitScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Menu size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const colors = useColors();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bgPrimary },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Toolkit" component={ToolkitScreen} />
        <Stack.Screen name="AllIndices" component={AllIndicesScreen} />
        <Stack.Screen name="IndexDetail" component={IndexDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
