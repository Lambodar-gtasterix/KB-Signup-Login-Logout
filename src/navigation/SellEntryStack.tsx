import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SellProductScreen from '../screens/SellProductScreen';
import SellMobileStack from './SellMobileStack';
import SellLaptopStack from './SellLaptopStack';

export type SellEntryStackParamList = {
  SellProduct: undefined;
  SellMobileStack: undefined;
  SellLaptopStack: undefined;
};

const Stack = createNativeStackNavigator<SellEntryStackParamList>();

export default function SellEntryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SellProduct" component={SellProductScreen} />
      <Stack.Screen name="SellMobileStack" component={SellMobileStack} />
      <Stack.Screen name="SellLaptopStack" component={SellLaptopStack} />
    </Stack.Navigator>
  );
}
