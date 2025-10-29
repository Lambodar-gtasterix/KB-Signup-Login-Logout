import React from 'react';
import { StyleSheet, View } from 'react-native';

import TextField from '../form/TextField';
import { spacing } from '../../theme/tokens';

export type ConfirmContactFormValues = {
  price: string;
  name: string;
  phoneNumber: string;
};

type ConfirmContactFormProps<TValues extends ConfirmContactFormValues> = {
  values: TValues;
  onChange: <TKey extends keyof TValues>(
    field: TKey,
    value: TValues[TKey],
  ) => void;
  editable?: boolean;
  pricePlaceholder: string;
  phonePlaceholder?: string;
};

const ConfirmContactForm = <TValues extends ConfirmContactFormValues>({
  values,
  onChange,
  editable = true,
  pricePlaceholder,
  phonePlaceholder = 'Your mobile number',
}: ConfirmContactFormProps<TValues>) => {
  return (
    <View>
      <TextField
        label="Price"
        keyboardType="numeric"
        placeholder={pricePlaceholder}
        value={values.price}
        onChangeText={(text) => onChange('price', text)}
        editable={editable}
        containerStyle={styles.field}
      />
      <TextField
        label="Name"
        placeholder="Your name"
        value={values.name}
        onChangeText={(text) => onChange('name', text)}
        editable={editable}
        containerStyle={styles.field}
      />
      <TextField
        label="Verify Phone Number"
        placeholder={phonePlaceholder}
        value={values.phoneNumber}
        onChangeText={(text) => onChange('phoneNumber', text)}
        keyboardType="phone-pad"
        editable={editable}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    marginBottom: spacing.xl,
  },
});

export default ConfirmContactForm;
