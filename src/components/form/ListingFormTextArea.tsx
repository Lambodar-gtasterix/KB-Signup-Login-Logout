import React, { useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleProp,
  Text,
  TextInput,
  TextInputContentSizeChangeEventData,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import {
  listingUpdateStyles as styles,
  LISTING_UPDATE_COLORS as COLORS,
} from '../../theme/listingUpdate';

interface ListingFormTextAreaProps extends Omit<TextInputProps, 'style'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  required?: boolean;
  error?: string;
  maxLength?: number;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  minHeight?: number;
  showCounter?: boolean;
}

const ListingFormTextArea: React.FC<ListingFormTextAreaProps> = ({
  label,
  value,
  onChangeText,
  required = false,
  error,
  maxLength,
  containerStyle,
  inputStyle,
  minHeight = 80,
  showCounter = true,
  onContentSizeChange,
  ...textInputProps
}) => {
  const [dynamicHeight, setDynamicHeight] = useState<number>(minHeight);

  const handleContentSizeChange = (
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) => {
    const { height } = event.nativeEvent.contentSize;
    setDynamicHeight(Math.max(minHeight, height));
    if (onContentSizeChange) {
      onContentSizeChange(event);
    }
  };

  return (
    <View style={styles.inputWrapper}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
        {showCounter && typeof maxLength === 'number' ? (
          <Text style={styles.charCount}>
            {value.length}/{maxLength}
          </Text>
        ) : null}
      </View>
      <View style={[styles.inputContainer, error && styles.inputError, containerStyle]}>
        <TextInput
          {...textInputProps}
          value={value}
          onChangeText={onChangeText}
          style={[styles.textArea, { height: dynamicHeight }, inputStyle]}
          multiline
          textAlignVertical="top"
          placeholderTextColor={COLORS.textMuted}
          maxLength={maxLength}
          onContentSizeChange={handleContentSizeChange}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default ListingFormTextArea;
