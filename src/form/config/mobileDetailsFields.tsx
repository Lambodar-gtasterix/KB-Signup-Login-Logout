// src/form/config/mobileDetailsFields.tsx
import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { FormFieldConfig } from './types';
import { MobileDetailsFormValues } from '../schemas/mobileDetailsSchema';
import { DropdownOption } from '../../components/form/DropdownField';
import { Condition } from '../../types/listings';
import { colors } from '../../theme/tokens';

interface MobileFieldConfigOptions {
  onOpenYearPicker: () => void;
}

const conditionOptions: DropdownOption<Condition>[] = [
  { label: 'NEW', value: 'NEW' },
  { label: 'USED', value: 'USED' },
];

const negotiableOptions: DropdownOption<boolean>[] = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

export const getMobileDetailsFieldConfig = ({
  onOpenYearPicker,
}: MobileFieldConfigOptions): Array<FormFieldConfig<MobileDetailsFormValues>> => [
  {
    field: 'title',
    label: 'Title',
    component: 'text',
    required: true,
    props: {
      placeholder: 'e.g., iPhone 15 Pro - Excellent Condition',
      autoCapitalize: 'sentences' as const,
      maxLength: 80,
    },
  },
  {
    field: 'description',
    label: 'Description',
    component: 'textarea',
    required: true,
    props: {
      placeholder: "Describe your mobile's condition, features, and accessories...",
      autoCapitalize: 'sentences' as const,
      maxLength: 400,
    },
    getLabelAccessory: ({ values }) => (
      <Text style={styles.charCount}>{values.description.length}/400</Text>
    ),
  },
  {
    field: 'price',
    label: 'Price',
    component: 'text',
    required: true,
    props: {
      placeholder: 'Enter price in ₹',
      keyboardType: 'numeric' as const,
      maxLength: 10,
    },
    transform: (value: string) => value.replace(/[^0-9]/g, ''),
  },
  {
    field: 'condition',
    label: 'Condition',
    component: 'dropdown',
    required: true,
    props: {
      data: conditionOptions,
    },
  },
  {
    field: 'brand',
    label: 'Brand',
    component: 'text',
    required: true,
    props: {
      placeholder: 'e.g., Apple, Samsung, OnePlus',
      autoCapitalize: 'words' as const,
      autoCorrect: false,
      maxLength: 40,
    },
  },
  {
    field: 'model',
    label: 'Model',
    component: 'text',
    required: true,
    props: {
      placeholder: 'e.g., 15 Pro Max, Galaxy S24',
      autoCapitalize: 'words' as const,
      autoCorrect: false,
      maxLength: 40,
    },
  },
  {
    field: 'color',
    label: 'Color',
    component: 'text',
    required: true,
    props: {
      placeholder: 'e.g., Midnight Blue, Space Gray',
      autoCapitalize: 'words' as const,
      maxLength: 40,
    },
  },
  {
    field: 'yearOfPurchase',
    label: 'Year of Purchase',
    component: 'readonlyPicker',
    required: true,
    props: {
      placeholder: 'Select year',
      onPress: onOpenYearPicker,
    },
  },
  {
    field: 'negotiable',
    label: 'Negotiable',
    component: 'dropdown',
    required: true,
    props: {
      data: negotiableOptions,
    },
  },
];

const styles = StyleSheet.create({
  charCount: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
