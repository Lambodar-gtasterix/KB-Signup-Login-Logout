// src/navigation/MyAdsStack.ts
import { MyMobileAdsStackParamList } from './MyMobileAdsStack';
import { MyLaptopAdsStackParamList } from './MyLaptopAdsStack';

export type MyAdsStackParamList = MyMobileAdsStackParamList & MyLaptopAdsStackParamList;
