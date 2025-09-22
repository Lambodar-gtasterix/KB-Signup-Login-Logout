// navigation/MyAdsStack.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyAdsScreen from '../screens/MyAdsScreen';
import MyAdsListScreen from '../screens/MyAdsListScreen';
import AdDetailsScreen from '../screens/AdDetailsScreen';
import { ImageSourcePropType } from 'react-native';
import CarListScreen from '../screens/CarListScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import ChatScreen from '../screens/ChatScreen';

// 1. Define the Product type for passing to AdDetailsScreen
export type Product = {
  image: ImageSourcePropType;
  price: string;
  title: string;
  km: string;
  location: string;
  timeLeft: string;
  description: string;
  brand: string;
  model: string;
  fuel: string;
  year: string;
  rating: number;
};

// 2. Define the stack param list
export type MyAdsStackParamList = {
  MyAdsScreen: undefined;
  MyAdsListScreen: { category: string };
  AdDetailsScreen: { product: Product };
  CarListScreen: { category: string };
  ProductDetailsScreen: { product: Product };
  ChatScreen: undefined; // 👈 add this

};

// 3. Create the navigator with types
const Stack = createNativeStackNavigator<MyAdsStackParamList>();

const MyAdsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyAdsScreen" component={MyAdsScreen} />
      <Stack.Screen name="MyAdsListScreen" component={MyAdsListScreen} />
      <Stack.Screen name="AdDetailsScreen" component={AdDetailsScreen} />
      <Stack.Screen name="CarListScreen" component={CarListScreen} />
      <Stack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />

    </Stack.Navigator>
  );
};

export default MyAdsStack;
