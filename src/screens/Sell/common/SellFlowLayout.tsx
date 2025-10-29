// src/screens/Sell/common/SellFlowLayout.tsx
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleProp, StyleSheet, View, ViewStyle, ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../../components/common/ScreenHeader';
import ProgressStepper, { StepConfig } from '../../../components/common/ProgressStepper';
import { colors, shadows, spacing } from '../../../theme/tokens';

interface SellFlowLayoutProps {
  title: string;
  onBack?: () => void;
  steps: StepConfig[];
  footer: React.ReactNode;
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollProps?: Omit<ScrollViewProps, 'contentContainerStyle'>;
}

const SellFlowLayout: React.FC<SellFlowLayoutProps> = ({
  title,
  onBack,
  steps,
  footer,
  children,
  contentContainerStyle,
  scrollProps,
}) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.container}>
          <ScreenHeader title={title} onBack={onBack} />
          <ProgressStepper steps={steps} />
          <ScrollView
            style={styles.form}
            contentContainerStyle={[styles.formContent, contentContainerStyle]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            {...scrollProps}
          >
            {children}
          </ScrollView>
          <View style={styles.footer}>{footer}</View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  form: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  footer: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.soft,
  },
});

export default SellFlowLayout;
