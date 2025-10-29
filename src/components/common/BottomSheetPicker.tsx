// src/components/common/BottomSheetPicker.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { colors, radii, spacing } from '../../theme/tokens';

export interface BottomSheetPickerOption<TValue> {
  label: string;
  value: TValue;
}

interface BottomSheetPickerProps<TValue> {
  visible: boolean;
  title: string;
  options: Array<BottomSheetPickerOption<TValue>>;
  selectedValue?: TValue;
  onSelect: (value: TValue) => void;
  onClose: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const BottomSheetPicker = <TValue,>({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
  confirmLabel = 'Done',
  cancelLabel = 'Cancel',
  contentContainerStyle,
}: BottomSheetPickerProps<TValue>) => {
  const [internalValue, setInternalValue] = useState<TValue | undefined>(selectedValue);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setInternalValue(selectedValue);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeAnim, selectedValue, visible]);

  const handleConfirm = () => {
    if (internalValue !== undefined) {
      onSelect(internalValue);
    }
    onClose();
  };

  const handleDismiss = () => {
    onClose();
  };

  const selectedMap = useMemo(() => {
    const map = new Map<any, boolean>();
    if (internalValue !== undefined) {
      map.set(internalValue, true);
    }
    return map;
  }, [internalValue]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleDismiss}>
      <Pressable style={styles.overlay} onPress={handleDismiss}>
        <Animated.View
          style={[styles.sheet, { opacity: fadeAnim }]}
          onStartShouldSetResponder={() => true}
        >
          <Animated.View style={styles.sheetContent}>
            <Animated.View style={styles.header}>
              <TouchableOpacity onPress={handleDismiss} style={styles.headerButton}>
                <Text style={styles.headerCancel}>{cancelLabel}</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{title}</Text>
              <TouchableOpacity onPress={handleConfirm} style={styles.headerButton}>
                <Text style={styles.headerConfirm}>{confirmLabel}</Text>
              </TouchableOpacity>
            </Animated.View>

            <ScrollView
              style={styles.list}
              contentContainerStyle={[styles.listContent, contentContainerStyle]}
              showsVerticalScrollIndicator
            >
              {options.map((option) => {
                const isSelected = selectedMap.has(option.value);
                return (
                  <TouchableOpacity
                    key={String(option.value)}
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => setInternalValue(option.value)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}
                    >
                      {option.label}
                    </Text>
                    {isSelected && (
                      <Icon name="check-circle" size={24} color={colors.stepActive} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  sheetContent: {
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  headerCancel: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  headerConfirm: {
    fontSize: 16,
    color: colors.stepActive,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  list: {
    maxHeight: 400,
  },
  listContent: {
    paddingVertical: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  optionSelected: {
    backgroundColor: '#F0F7FF',
  },
  optionLabel: {
    fontSize: 17,
    color: colors.text,
    fontWeight: '500',
  },
  optionLabelSelected: {
    color: colors.stepActive,
    fontWeight: '600',
  },
});

export default BottomSheetPicker;
