// src/components/form/TextField.tsx
import React from 'react';
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import FormField from './FormField';
import { colors, radii, spacing } from '../../theme/tokens';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  required?: boolean;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelAccessory?: React.ReactNode;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  required = false,
  error,
  containerStyle,
  inputContainerStyle,
  inputStyle,
  labelAccessory,
  multiline,
  ...textInputProps
}) => {
  return (
    <FormField
      label={label}
      required={required}
      error={error}
      containerStyle={containerStyle}
      labelAccessory={labelAccessory}
      contentStyle={[
        styles.inputContainer,
        error && styles.inputError,
        inputContainerStyle,
        multiline && styles.multilineContainer,
      ]}
    >
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          inputStyle,
        ]}
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : undefined}
        {...textInputProps}
      />
    </FormField>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },
  multilineContainer: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  multilineInput: {
    minHeight: 80,
  },
});

export default TextField;
