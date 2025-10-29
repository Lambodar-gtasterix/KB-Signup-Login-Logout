import React from 'react';
import {
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import {
  listingUpdateStyles as styles,
  LISTING_UPDATE_COLORS as COLORS,
} from '../../theme/listingUpdate';

interface ListingFormInputProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

const ListingFormInput: React.FC<ListingFormInputProps> = ({
  label,
  error,
  required = false,
  containerStyle,
  inputStyle,
  multiline,
  style,
  placeholderTextColor = COLORS.textMuted,
  ...textInputProps
}) => {
  const combinedInputStyle: StyleProp<TextStyle> = [
    styles.input,
    multiline ? styles.textArea : null,
    inputStyle,
    style,
  ];

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={[styles.inputContainer, error && styles.inputError, containerStyle]}>
        <TextInput
          {...textInputProps}
          multiline={multiline}
          style={combinedInputStyle}
          placeholderTextColor={placeholderTextColor}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default ListingFormInput;
