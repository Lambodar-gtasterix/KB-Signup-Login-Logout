// src/navigation/stacks/MyLaptopAdsStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyLaptopAdsListScreen from '../screens/LaptopScreens/MyLaptopAdsListScreen';
import LaptopDetailsScreen from '../screens/LaptopScreens/LaptopDetailsScreen';
import UpdateLaptopScreen from '../screens/LaptopScreens/UpdateLaptopScreen';

export type MyLaptopAdsStackParamList = {
  MyLaptopAdsList: undefined;
  LaptopDetails: { laptopId: number };
  UpdateLaptop: { laptopId: number };
};

const Stack = createNativeStackNavigator<MyLaptopAdsStackParamList>();

export default function MyLaptopAdsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MyLaptopAdsList"
        component={MyLaptopAdsListScreen}
      />
      <Stack.Screen
        name="LaptopDetails"
        component={LaptopDetailsScreen}
      />
      <Stack.Screen
        name="UpdateLaptop"
        component={UpdateLaptopScreen}
      />
    </Stack.Navigator>
  );
}
