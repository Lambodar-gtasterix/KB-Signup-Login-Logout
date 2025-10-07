import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddMobileDetailsScreen from '../screens/MobileScreens/AddMobileDetailsScreen';
import SelectMobilePhotoScreen from '../screens/MobileScreens/SelectMobilePhotoScreen';
import ConfirmDetailsScreen from '../screens/MobileScreens/ConfirmDetailsScreen';

export type MobileStackParamList = {
  AddMobileDetails: undefined;
  SelectPhoto: { mobileId: number };
  ConfirmDetails: { mobileId: number; images?: string[] };
};

const Stack = createNativeStackNavigator<MobileStackParamList>();

export default function MobileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AddMobileDetails" component={AddMobileDetailsScreen} />
      <Stack.Screen name="SelectPhoto" component={SelectMobilePhotoScreen} />
      <Stack.Screen name="ConfirmDetails" component={ConfirmDetailsScreen} />
    </Stack.Navigator>
  );
}
