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
    <Stack.Navigator>
      <Stack.Screen
        name="MyMobilesAdsList"
        component={MyMobilesAdsListScreen}
        options={{ title: 'My Mobile Ads', headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Product Details', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="UpdateMobile"
        component={UpdateMobileScreen}
        options={{ title: 'Update Mobile', headerShown: false }}
      />
    </Stack.Navigator>
  );
}
