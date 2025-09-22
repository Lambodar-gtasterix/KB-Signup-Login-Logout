import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import LiveBiddingScreen from '../screens/LiveBiddingScreen';
import SellProductScreen from '../screens/SellProductScreen';
import MyAdsScreen from '../screens/MyAdsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CustomTabBar from '../components/CustomTabBar';
export type RootTabParamList = {
   Home: undefined;
  'Live Bidding': undefined;
  'Sell Product': undefined;
  'My Ads': undefined;
   Profile: undefined;
}; 
const Tab = createBottomTabNavigator<RootTabParamList>();
export default function BottomTabNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Live Bidding" component={LiveBiddingScreen} />
      <Tab.Screen name="Sell Product" component={SellProductScreen} />
      <Tab.Screen name="My Ads" component={MyAdsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
