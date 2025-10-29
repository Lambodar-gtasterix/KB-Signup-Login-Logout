import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import PrimaryButton from '../common/PrimaryButton';
import ProgressStepper, {
  type StepConfig,
  type StepStatus,
} from '../common/ProgressStepper';
import ScreenHeader from '../common/ScreenHeader';
import { colors, radii, spacing } from '../../theme/tokens';

export type PhotoUploadStepState = 'complete' | 'active' | 'upcoming';

export type PhotoUploadStep = {
  label: string;
  state: PhotoUploadStepState;
  stepNumber: number;
};

export type PhotoUploadAction = {
  label: string;
  iconName: string;
  onPress: () => void;
  disabled?: boolean;
};

export type PhotoUploadProgressState = {
  total: number;
  uploaded: number;
  current?: string | null;
};

type PhotoUploadLayoutProps = {
  title: string;
  onBackPress: () => void;
  backDisabled?: boolean;
  steps: PhotoUploadStep[];
  actions: PhotoUploadAction[];
  uploading: boolean;
  progress: PhotoUploadProgressState | null;
  progressHint?: string;
};

const OVERLAY_COLOR = 'rgba(0, 0, 0, 0.65)';

const PhotoUploadLayout: React.FC<PhotoUploadLayoutProps> = ({
  title,
  onBackPress,
  backDisabled,
  steps,
  actions,
  uploading,
  progress,
  progressHint = 'Please wait...',
}) => {
  const mapStepState: Record<PhotoUploadStepState, StepStatus> = {
    complete: 'completed',
    active: 'current',
    upcoming: 'upcoming',
  };

  const stepperSteps: StepConfig[] = steps.map((step) => ({
    label: step.label,
    status: mapStepState[step.state],
  }));

  const percent =
    progress && progress.total > 0
      ? Math.min((progress.uploaded / progress.total) * 100, 100)
      : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScreenHeader
          title={title}
          onBack={!backDisabled ? onBackPress : undefined}
        />

        <ProgressStepper steps={stepperSteps} />

        <View style={styles.content}>
          <View style={styles.actionRow}>
            {actions.map((action) => (
              <PrimaryButton
                key={action.label}
                label={action.label}
                onPress={action.onPress}
                disabled={action.disabled || uploading}
                containerStyle={[
                  styles.actionBtn,
                  (action.disabled || uploading) && styles.actionBtnDisabled,
                ]}
                icon={
                  <Icon
                    name={action.iconName}
                    size={24}
                    color={colors.white}
                    style={styles.actionIcon}
                  />
                }
              />
            ))}
          </View>
        </View>

        {uploading && progress && (
          <View style={styles.loaderOverlay}>
            <View style={styles.progressCard}>
              <ActivityIndicator size="large" color={colors.stepActive} />
              <Text style={styles.progressTitle}>Uploading Images</Text>
              <Text style={styles.progressDetail}>
                {progress.uploaded} of {progress.total}
              </Text>
              {progress.current ? (
                <Text style={styles.progressCurrent}>{progress.current}</Text>
              ) : null}

              <View style={styles.progressBarContainer}>
                <View
                  style={[styles.progressBarFill, { width: `${percent}%` }]}
                />
              </View>

              <Text style={styles.progressHint}>{progressHint}</Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default PhotoUploadLayout;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -spacing.sm,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: colors.stepActive,
    flexDirection: 'column-reverse',
    paddingVertical: spacing.xl,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.sm,
  },
  actionBtnDisabled: {
    opacity: 0.6,
  },
  actionIcon: {
    marginBottom: spacing.xs,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: OVERLAY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    zIndex: 10,
  },
  progressCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    width: '85%',
    maxWidth: 360,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
  },
  progressDetail: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.stepActive,
    marginTop: spacing.sm,
  },
  progressCurrent: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: colors.stepInactive,
    borderRadius: radii.xs,
    marginTop: spacing.lg,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.stepActive,
  },
  progressHint: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
});
