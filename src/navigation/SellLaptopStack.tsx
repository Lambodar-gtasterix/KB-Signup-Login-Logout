import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddLaptopDetailsScreen from '../screens/LaptopScreens/AddLaptopDetailsScreen';
import SelectLaptopPhotoScreen from '../screens/LaptopScreens/SelectLaptopPhotoScreen';
// 👇 NEW
import ConfirmLaptopDetailsScreen from '../screens/LaptopScreens/ConfirmLaptopDetailsScreen';

export type SellLaptopStackParamList = {
  AddLaptopDetails: undefined;
  SelectLaptopPhotoScreen: { laptopId: number };
  // 👇 NEW
  ConfirmLaptopDetails: { laptopId: number };
};

const Stack = createNativeStackNavigator<SellLaptopStackParamList>();

export default function SellLaptopStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AddLaptopDetails" component={AddLaptopDetailsScreen} />
      <Stack.Screen name="SelectLaptopPhotoScreen" component={SelectLaptopPhotoScreen} />
      {/* 👇 NEW */}
      <Stack.Screen name="ConfirmLaptopDetails" component={ConfirmLaptopDetailsScreen} />
    </Stack.Navigator>
  );
}
