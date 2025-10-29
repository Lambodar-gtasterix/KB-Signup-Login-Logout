// src/navigation/SellProductStack.ts
import { SellMobileStackParamList } from './SellMobileStack';
import { SellLaptopStackParamList } from './SellLaptopStack';

type MobileRoutes = SellMobileStackParamList;
type LaptopRoutes = SellLaptopStackParamList;

export type SellProductStackParamList = MobileRoutes &
  LaptopRoutes & {
    AddCarDetails: undefined;
  };
