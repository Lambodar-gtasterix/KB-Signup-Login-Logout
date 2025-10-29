// src/components/form/Textarea.tsx
import React, { useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextInputContentSizeChangeEventData,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

import FormField from './FormField';
import { colors, radii, spacing } from '../../theme/tokens';

interface TextareaProps extends Omit<TextInputProps, 'style' | 'multiline'> {
  label: string;
  required?: boolean;
  error?: string;
  initialHeight?: number;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelAccessory?: React.ReactNode;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  required,
  error,
  initialHeight = 80,
  containerStyle,
  inputStyle,
  labelAccessory,
  onContentSizeChange,
  ...textInputProps
}) => {
  const [height, setHeight] = useState(initialHeight);

  const handleContentSizeChange = (
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
  ) => {
    setHeight(Math.max(initialHeight, event.nativeEvent.contentSize.height));
    onContentSizeChange?.(event);
  };

  return (
    <FormField
      label={label}
      required={required}
      error={error}
      containerStyle={containerStyle}
      labelAccessory={labelAccessory}
      contentStyle={[styles.container, error && styles.containerError]}
    >
      <TextInput
        style={[styles.textarea, { height }, inputStyle]}
        placeholderTextColor={colors.textMuted}
        multiline
        textAlignVertical="top"
        onContentSizeChange={handleContentSizeChange}
        {...textInputProps}
      />
    </FormField>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  containerError: {
    borderColor: colors.error,
    borderWidth: 1.5,
  },
  textarea: {
    fontSize: 16,
    color: colors.text,
  },
});

export default Textarea;
