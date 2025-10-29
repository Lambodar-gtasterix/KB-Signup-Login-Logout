import React from 'react';
import {
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import {
  listingUpdateStyles as styles,
  LISTING_UPDATE_COLORS as COLORS,
} from '../../theme/listingUpdate';

interface ListingFormDropdownProps<TItem> {
  label: string;
  data: TItem[];
  value: any;
  onChange: (item: TItem) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelField?: keyof TItem extends string ? keyof TItem : string;
  valueField?: keyof TItem extends string ? keyof TItem : string;
}

const ListingFormDropdown = <TItem extends Record<string, any>>({
  label,
  data,
  value,
  onChange,
  required = false,
  error,
  placeholder,
  containerStyle,
  labelField = 'label',
  valueField = 'value',
}: ListingFormDropdownProps<TItem>) => {
  const resolvedPlaceholder =
    placeholder ?? `Select ${label.trim().toLowerCase()}`;

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={[styles.inputContainer, error && styles.inputError, containerStyle]}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.dropdownPlaceholder}
          selectedTextStyle={styles.dropdownSelected}
          data={data}
          labelField={String(labelField)}
          valueField={String(valueField)}
          placeholder={resolvedPlaceholder}
          value={value}
          onChange={onChange}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default ListingFormDropdown;
