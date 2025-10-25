import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyMobilesAdsListScreen from '../screens/MobileScreens/MyMobilesAdsListScreen';
import ProductDetailsScreen from '../screens/MobileScreens/ProductDetailsScreen';
import UpdateMobileScreen from '../screens/MobileScreens/UpdateMobileScreen';

export type MyMobileAdsStackParamList = {
  MyMobilesAdsList: undefined;
  ProductDetails: { mobileId: number };
  UpdateMobile: { mobileId: number };
};

const Stack = createNativeStackNavigator<MyMobileAdsStackParamList>();

export default function MyMobileAdsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MyMobilesAdsList"
        component={MyMobilesAdsListScreen}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
      />
      <Stack.Screen
        name="UpdateMobile"
        component={UpdateMobileScreen}
      />
    </Stack.Navigator>
  );
}
