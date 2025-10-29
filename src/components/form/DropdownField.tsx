// src/components/form/DropdownField.tsx
import React from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import FormField from './FormField';
import { colors, radii, spacing } from '../../theme/tokens';

export interface DropdownOption<TValue = any> {
  label: string;
  value: TValue;
}

interface DropdownFieldProps<TValue = any> {
  label: string;
  data: Array<DropdownOption<TValue>>;
  value: TValue | null;
  onChange: (item: DropdownOption<TValue>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  dropdownStyle?: StyleProp<ViewStyle>;
}

const DropdownField = <TValue,>({
  label,
  data,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  containerStyle,
  dropdownStyle,
}: DropdownFieldProps<TValue>) => {
  return (
    <FormField label={label} required={required} error={error} containerStyle={containerStyle}>
      <Dropdown
        style={[
          styles.dropdownContainer,
          error && styles.dropdownError,
          dropdownStyle,
        ]}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
        data={data}
        labelField="label"
        valueField="value"
        placeholder={placeholder ?? `Select ${label.toLowerCase()}`}
        value={value as any}
        onChange={(item) => onChange(item as DropdownOption<TValue>)}
      />
    </FormField>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 52,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  dropdownError: {
    borderColor: colors.error,
    borderWidth: 1.5,
  },
  placeholder: {
    fontSize: 16,
    color: colors.textMuted,
  },
  selectedText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
});

export default DropdownField;
