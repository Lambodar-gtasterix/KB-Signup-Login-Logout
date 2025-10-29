import React, { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  listingUpdateStyles as styles,
  LISTING_UPDATE_COLORS as COLORS,
  LISTING_UPDATE_SPACING as SPACING,
} from '../../theme/listingUpdate';

interface ListingYearPickerFieldProps {
  label: string;
  value?: string;
  years: string[];
  onChange: (year: string) => void;
  required?: boolean;
  error?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  placeholder?: string;
}

const ListingYearPickerField: React.FC<ListingYearPickerFieldProps> = ({
  label,
  value,
  years,
  onChange,
  required = false,
  error,
  confirmLabel = 'Apply',
  cancelLabel = 'Cancel',
  placeholder = 'Select year',
}) => {
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const [visible, setVisible] = useState(false);
  const [pendingYear, setPendingYear] = useState<string>(value ?? years[0] ?? '');

  useEffect(() => {
    if (!visible) return;
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, visible]);

  useEffect(() => {
    if (!visible) {
      setPendingYear(value ?? years[0] ?? '');
    }
  }, [value, visible, years]);

  const openPicker = () => {
    setPendingYear(value ?? years[0] ?? '');
    setVisible(true);
  };

  const closePicker = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const confirmSelection = () => {
    onChange(pendingYear);
    closePicker();
  };

  return (
    <>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
        <TouchableOpacity
          style={[
            styles.inputContainer,
            styles.readonlyInput,
            error && styles.inputError,
          ]}
          onPress={openPicker}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.readonlyText,
              !value && localStyles.placeholderText,
            ]}
          >
            {value || placeholder}
          </Text>
          <Icon name="chevron-down" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <Modal transparent visible={visible} animationType="fade" onRequestClose={closePicker}>
        <Animated.View style={[localStyles.modalOverlay, { opacity: fadeAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closePicker} />
          <View style={localStyles.modalContent}>
            <View style={localStyles.modalHeader}>
              <TouchableOpacity style={localStyles.modalButton} onPress={closePicker}>
                <Text style={localStyles.modalCancelText}>{cancelLabel}</Text>
              </TouchableOpacity>
              <Text style={localStyles.modalTitle}>Select Year</Text>
              <TouchableOpacity style={localStyles.modalButton} onPress={confirmSelection}>
                <Text style={localStyles.modalConfirmText}>{confirmLabel}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={localStyles.yearList} contentContainerStyle={localStyles.yearListContent}>
              {years.map((year) => {
                const selected = pendingYear === year;
                return (
                  <TouchableOpacity
                    key={year}
                    style={[localStyles.yearItem, selected && localStyles.yearItemSelected]}
                    onPress={() => setPendingYear(year)}
                  >
                    <Text style={[localStyles.yearText, selected && localStyles.yearTextSelected]}>
                      {year}
                    </Text>
                    {selected ? <Icon name="check" size={18} color={COLORS.stepActive} /> : null}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </Animated.View>
      </Modal>
    </>
  );
};

export default ListingYearPickerField;

const localStyles = StyleSheet.create({
  placeholderText: {
    color: COLORS.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SPACING.xl,
    borderTopRightRadius: SPACING.xl,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  modalCancelText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  modalConfirmText: {
    fontSize: 16,
    color: COLORS.stepActive,
    fontWeight: '600',
  },
  yearList: {
    maxHeight: 400,
  },
  yearListContent: {
    paddingVertical: SPACING.sm,
  },
  yearItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  yearItemSelected: {
    backgroundColor: '#F0F7FF',
  },
  yearText: {
    fontSize: 17,
    color: COLORS.text,
    fontWeight: '500',
  },
  yearTextSelected: {
    color: COLORS.stepActive,
    fontWeight: '600',
  },
});
