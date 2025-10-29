// src/form/config/laptopDetailsFields.ts
import { FormFieldConfig } from './types';
import { LaptopDetailsFormValues } from '../schemas/laptopDetailsSchema';

const warrantyOptions = [
  { label: '1 Year', value: 1 },
  { label: '2 Years', value: 2 },
  { label: '3 Years', value: 3 },
];

export const laptopDetailsFieldConfig: Array<FormFieldConfig<LaptopDetailsFormValues>> = [
  {
    field: 'serialNumber',
    label: 'Serial Number',
    component: 'text',
    required: true,
    props: {
      placeholder: 'Enter laptop serial number',
      autoCapitalize: 'characters' as const,
      autoCorrect: false,
    },
  },
  {
    field: 'dealer',
    label: 'Dealer',
    component: 'text',
    props: {
      placeholder: 'Enter dealer name',
      autoCapitalize: 'words' as const,
    },
  },
  {
    field: 'brand',
    label: 'Brand',
    component: 'text',
    required: true,
    props: {
      placeholder: 'e.g., HP, Dell, Apple',
      autoCapitalize: 'words' as const,
    },
  },
  {
    field: 'model',
    label: 'Model',
    component: 'text',
    required: true,
    props: {
      placeholder: 'e.g., 15s-fq5009TU',
      autoCapitalize: 'characters' as const,
      autoCorrect: false,
    },
  },
  {
    field: 'price',
    label: 'Price',
    component: 'text',
    required: true,
    props: {
      placeholder: 'Enter price',
      keyboardType: 'numeric' as const,
      autoCapitalize: 'none' as const,
      autoCorrect: false,
    },
    transform: (value: string) => value.replace(/[^0-9]/g, ''),
  },
  {
    field: 'warrantyInYear',
    label: 'Warranty (Years)',
    component: 'dropdown',
    props: {
      data: warrantyOptions,
      placeholder: 'Select warranty duration',
    },
  },
  {
    field: 'processor',
    label: 'Processor',
    component: 'text',
    props: {
      placeholder: 'e.g., Intel Core i5-1335U',
      autoCapitalize: 'words' as const,
    },
  },
  {
    field: 'processorBrand',
    label: 'Processor Brand',
    component: 'text',
    props: {
      placeholder: 'e.g., Intel, AMD',
      autoCapitalize: 'words' as const,
    },
  },
  {
    field: 'ram',
    label: 'RAM',
    component: 'text',
    props: {
      placeholder: 'e.g., 16 GB',
      autoCapitalize: 'characters' as const,
      autoCorrect: false,
    },
  },
  {
    field: 'storage',
    label: 'Storage',
    component: 'text',
    props: {
      placeholder: 'e.g., 512 GB SSD',
      autoCapitalize: 'characters' as const,
      autoCorrect: false,
    },
  },
  {
    field: 'colour',
    label: 'Colour',
    component: 'text',
    props: {
      placeholder: 'e.g., Silver',
      autoCapitalize: 'words' as const,
    },
  },
  {
    field: 'screenSize',
    label: 'Screen Size',
    component: 'text',
    props: {
      placeholder: 'e.g., 15.6 inch',
      autoCapitalize: 'none' as const,
      autoCorrect: false,
    },
  },
  {
    field: 'memoryType',
    label: 'Memory Type',
    component: 'text',
    props: {
      placeholder: 'e.g., DDR4',
      autoCapitalize: 'characters' as const,
      autoCorrect: false,
    },
  },
  {
    field: 'battery',
    label: 'Battery',
    component: 'text',
    props: {
      placeholder: 'e.g., 41 Wh Li-ion',
      autoCapitalize: 'words' as const,
    },
  },
  {
    field: 'batteryLife',
    label: 'Battery Life',
    component: 'text',
    props: {
      placeholder: 'e.g., Up to 8 hours',
      autoCapitalize: 'sentences' as const,
    },
  },
  {
    field: 'graphicsCard',
    label: 'Graphics Card',
    component: 'text',
    props: {
      placeholder: 'e.g., Intel Iris Xe',
      autoCapitalize: 'words' as const,
    },
  },
  {
    field: 'graphicBrand',
    label: 'Graphic Brand',
    component: 'text',
    props: {
      placeholder: 'e.g., Intel',
      autoCapitalize: 'words' as const,
    },
  },
  {
    field: 'weight',
    label: 'Weight',
    component: 'text',
    props: {
      placeholder: 'e.g., 1.59 kg',
      autoCapitalize: 'none' as const,
      autoCorrect: false,
    },
  },
  {
    field: 'manufacturer',
    label: 'Manufacturer',
    component: 'text',
    props: {
      placeholder: 'e.g., HP India Pvt Ltd',
      autoCapitalize: 'words' as const,
    },
  },
  {
    field: 'usbPorts',
    label: 'USB Ports',
    component: 'text',
    props: {
      placeholder: 'Number of USB ports',
      keyboardType: 'numeric' as const,
      autoCapitalize: 'none' as const,
      autoCorrect: false,
    },
    transform: (value: string) => value.replace(/[^0-9]/g, ''),
  },
];
