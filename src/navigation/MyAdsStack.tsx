// src/navigation/MyAdsStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import MyAdsScreen from '../screens/MyAdsScreen';
import MyMobilesAdsListScreen from '../screens/MobileScreens/MyMobilesAdsListScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';

// --- Types (adjust if you already have central nav types) ---
export type MyAdsStackParamList = {
  MyAdsHome: undefined;
  MyMobilesAdsList: undefined;
  ProductDetails: { mobileId: number };
};

const Stack = createNativeStackNavigator<MyAdsStackParamList>();

export default function MyAdsStack() {
  return (
    <Stack.Navigator
      initialRouteName="MyAdsHome"
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen
        name="MyAdsHome"
        component={MyAdsScreen}
        options={{ title: 'My Ads' }}
      />
      <Stack.Screen
        name="MyMobilesAdsList"
        component={MyMobilesAdsListScreen}
        options={{ title: 'All Mobiles' }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Product Details' }}
      />
    </Stack.Navigator>
  );
}
