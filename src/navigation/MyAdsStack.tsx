// src/navigation/MyAdsStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyAdsScreen from '../screens/MyAdsScreen';
import MyMobilesAdsListScreen from '../screens/MobileScreens/MyMobilesAdsListScreen';
import ProductDetailsScreen from '../screens/MobileScreens/ProductDetailsScreen';
import ChatScreen from '../screens/ChatScreen'; // keep if you navigate to Chat from details
import UpdateMobileScreen from '../screens/MobileScreens/UpdateMobileScreen'; // ✅ NEW

export type MyAdsStackParamList = {
  MyAdsHome: undefined;
  MyMobilesAdsList: undefined;
  ProductDetails: { mobileId: number };
  UpdateMobile: { mobileId: number }; // ✅ NEW
  ChatScreen: undefined; // remove if Chat is mounted elsewhere
};

const Stack = createNativeStackNavigator<MyAdsStackParamList>();

export default function MyAdsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyAdsHome"
        component={MyAdsScreen}
        options={{ title: 'My Ads', headerShown: false }}
      />
      <Stack.Screen
        name="MyMobilesAdsList"
        component={MyMobilesAdsListScreen}
        options={{ title: 'All Mobiles', headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Product Details', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="UpdateMobile"
        component={UpdateMobileScreen}
        options={{ title: 'Update Mobile', headerBackTitle: 'Back', headerShown: false }} // ✅ NEW
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ title: 'Chat' }}
      />
    </Stack.Navigator>
  );
}
