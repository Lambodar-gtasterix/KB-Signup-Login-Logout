// src/components/form/ReadonlyPickerInput.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';

import FormField from './FormField';
import { colors, radii, spacing } from '../../theme/tokens';

interface ReadonlyPickerInputProps {
  label: string;
  value?: string | number | null;
  placeholder?: string;
  onPress: () => void;
  required?: boolean;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const ReadonlyPickerInput: React.FC<ReadonlyPickerInputProps> = ({
  label,
  value,
  placeholder = 'Select',
  onPress,
  required,
  error,
  containerStyle,
}) => {
  const displayValue = value != null && value !== '' ? String(value) : '';

  return (
    <FormField label={label} required={required} error={error} containerStyle={containerStyle}>
      <TouchableOpacity
        style={[styles.input, error && styles.inputError]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.text, !displayValue && styles.placeholder]}>
          {displayValue || placeholder}
        </Text>
      </TouchableOpacity>
    </FormField>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 1.5,
  },
  text: {
    fontSize: 16,
    color: colors.text,
  },
  placeholder: {
    color: colors.textMuted,
  },
});

export default ReadonlyPickerInput;
