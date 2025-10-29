// src/components/common/ScreenHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing } from '../../theme/tokens';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  rightAccessory?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, onBack, rightAccessory, containerStyle }) => (
  <View style={[styles.header, containerStyle]}>
    <TouchableOpacity
      style={[styles.backButton, !onBack && styles.backButtonDisabled]}
      onPress={onBack}
      disabled={!onBack}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      accessibilityRole="button"
      accessibilityLabel={onBack ? 'Go back' : undefined}
    >
      <Icon name="arrow-left" size={24} color={colors.text} />
    </TouchableOpacity>
    <Text style={styles.title} numberOfLines={1}>
      {title}
    </Text>
    <View style={styles.placeholder}>{rightAccessory}</View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
  },
  backButton: {
    padding: spacing.sm,
    marginLeft: -spacing.sm,
  },
  backButtonDisabled: {
    opacity: 0.4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    minWidth: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default ScreenHeader;
