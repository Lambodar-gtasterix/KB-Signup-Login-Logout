import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SellProductScreen from '../screens/SellProductScreen';
import AddCarDetailsScreen from '../screens/AddCarDetailsScreen';
import SelectPhotoScreen from '../screens/SelectPhotoScreen';
import ConfirmDetailsScreen from '../screens/ConfirmDetailsScreen';
export type SellProductStackParamList = {
  SellProduct: undefined;
  AddCarDetails: undefined;
  SelectPhoto: undefined;
  ConfirmDetails: undefined;
};
const Stack = createNativeStackNavigator<SellProductStackParamList>();
export default function SellProductStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SellProduct" component={SellProductScreen} />
      <Stack.Screen name="AddCarDetails" component={AddCarDetailsScreen} />
      <Stack.Screen name="SelectPhoto" component={SelectPhotoScreen} />
      <Stack.Screen name="ConfirmDetails" component={ConfirmDetailsScreen} />
    </Stack.Navigator>
  );
}
