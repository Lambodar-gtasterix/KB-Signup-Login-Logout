import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyAdsScreen from '../screens/MyAdsScreen';

// Per-entity "manage" stack (mobile)
import MyMobileAdsStack from './MyMobileAdsStack';

export type MyAdsEntryStackParamList = {
  MyAdsScreen: undefined;
  // We mount the full per-entity stack as a nested screen so we can navigate into it
  MyMobileAdsStack: undefined;
  // Later: MyLaptopAdsStack, MyBikeAdsStack, MyCarAdsStack...
};

const Stack = createNativeStackNavigator<MyAdsEntryStackParamList>();

export default function MyAdsEntryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyAdsScreen" component={MyAdsScreen} />
      <Stack.Screen name="MyMobileAdsStack" component={MyMobileAdsStack} />
    </Stack.Navigator>
  );
}
