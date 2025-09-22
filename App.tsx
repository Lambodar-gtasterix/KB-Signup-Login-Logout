// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens / stacks
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import CarListScreen from './src/screens/CarListScreen';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import ChatScreen from './src/screens/ChatScreen';
import LiveBiddingScreen from './src/screens/LiveBiddingScreen';
import SellProductStack from './src/navigation/SellProductStack';
import MyAdsStack from './src/navigation/MyAdsStack';
import ProfileScreen from './src/screens/ProfileScreen';

import CustomTabBar from './src/components/CustomTabBar';
import { AuthProvider, useAuth } from './src/context/AuthContext';

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStackNav = createNativeStackNavigator();

// ✅ Restore HomeStack so Home tab has its own stack (like your original)
function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={{ headerShown: false }}>
      <HomeStackNav.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStackNav.Screen name="CarListScreen" component={CarListScreen} />
      <HomeStackNav.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} />
      <HomeStackNav.Screen name="ChatScreen" component={ChatScreen} />
    </HomeStackNav.Navigator>
  );
}

function AuthStackScreen() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {/* 👇 Use HomeStack (not just HomeScreen) */}
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Live Bidding" component={LiveBiddingScreen} />
      <Tab.Screen name="Sell Product" component={SellProductStack} />
      <Tab.Screen name="My Ads" component={MyAdsStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isSignedIn, isLoading } = useAuth();

  if (isLoading) return null; // or a splash screen

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isSignedIn ? (
          <RootStack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthStackScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
