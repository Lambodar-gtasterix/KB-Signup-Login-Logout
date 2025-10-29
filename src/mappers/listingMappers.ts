// src/mappers/listingMappers.ts
import { MobileDetailsFormValues } from '../form/schemas/mobileDetailsSchema';
import { LaptopDetailsFormValues } from '../form/schemas/laptopDetailsSchema';
import { Condition, ListingStatus } from '../types/listings';

export interface MobileCreateDTO {
  title: string;
  description: string;
  price: number;
  negotiable: boolean;
  condition: Condition;
  brand: string;
  model: string;
  color: string;
  yearOfPurchase: number;
  sellerId: number;
}

export interface LaptopCreateDTO {
  serialNumber: string;
  dealer?: string;
  brand: string;
  model: string;
  price: number;
  warrantyInYear: number;
  processor?: string;
  processorBrand?: string;
  memoryType?: string;
  screenSize?: string;
  colour?: string;
  ram?: string;
  storage?: string;
  battery?: string;
  batteryLife?: string;
  graphicsCard?: string;
  graphicBrand?: string;
  weight?: string;
  manufacturer?: string;
  usbPorts?: number;
  status: ListingStatus;
  sellerId: number;
}

const trimOrUndefined = (value?: string | null) => {
  if (value == null) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const toMobileCreateDTO = (
  values: MobileDetailsFormValues,
  sellerId: number,
): MobileCreateDTO => {
  const price = Number(values.price);
  const year = Number(values.yearOfPurchase);

  return {
    title: values.title.trim(),
    description: values.description.trim(),
    price: Number.isFinite(price) ? price : 0,
    negotiable: values.negotiable === true,
    condition: values.condition as Condition,
    brand: values.brand.trim(),
    model: values.model.trim(),
    color: values.color.trim(),
    yearOfPurchase: Number.isFinite(year) ? year : new Date().getFullYear(),
    sellerId,
  };
};

export const toLaptopCreateDTO = (
  values: LaptopDetailsFormValues,
  sellerId: number,
): LaptopCreateDTO => {
  const price = Number(values.price);
  const warranty = Number(values.warrantyInYear);
  const usbPortsValue =
    values.usbPorts !== undefined && values.usbPorts !== null && `${values.usbPorts}`.trim().length > 0
      ? Number(values.usbPorts)
      : undefined;

  return {
    serialNumber: values.serialNumber.trim(),
    dealer: trimOrUndefined(values.dealer),
    model: values.model.trim(),
    brand: values.brand.trim(),
    price: Number.isFinite(price) ? price : 0,
    warrantyInYear: Number.isFinite(warranty) ? warranty : 0,
    processor: trimOrUndefined(values.processor),
    processorBrand: trimOrUndefined(values.processorBrand),
    memoryType: trimOrUndefined(values.memoryType),
    screenSize: trimOrUndefined(values.screenSize),
    colour: trimOrUndefined(values.colour),
    ram: trimOrUndefined(values.ram),
    storage: trimOrUndefined(values.storage),
    battery: trimOrUndefined(values.battery),
    batteryLife: trimOrUndefined(values.batteryLife),
    graphicsCard: trimOrUndefined(values.graphicsCard),
    graphicBrand: trimOrUndefined(values.graphicBrand),
    weight: trimOrUndefined(values.weight),
    manufacturer: trimOrUndefined(values.manufacturer),
    usbPorts: Number.isFinite(usbPortsValue ?? NaN) ? usbPortsValue : undefined,
    status: 'ACTIVE',
    sellerId,
  };
};
