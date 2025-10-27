import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  InteractionManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';

import { SellLaptopStackParamList } from '../../navigation/SellLaptopStack';
import {
  uploadLaptopImages,
  UploadProgress,
  RNFile,
} from '../../api/LaptopsApi/uploadLaptopImages';

type SelectLaptopPhotoNav = NativeStackNavigationProp<
  SellLaptopStackParamList,
  'SelectLaptopPhotoScreen'
>;
type SelectLaptopPhotoRoute = RouteProp<SellLaptopStackParamList, 'SelectLaptopPhotoScreen'>;

type ProgressUpdater =
  | UploadProgress
  | null
  | ((prev: UploadProgress | null) => UploadProgress | null);

const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 };
const RADII = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 };
const COLORS = {
  bg: '#F5F5F5',
  white: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  textMuted: '#999999',
  border: '#E0E0E0',
  primary: '#4A90E2',
  primaryLight: '#34495E',
  stepActive: '#4A90E2',
  stepInactive: '#E0E0E0',
  overlay: 'rgba(0, 0, 0, 0.65)',
};

const SelectLaptopPhotoScreen: React.FC = () => {
  const navigation = useNavigation<SelectLaptopPhotoNav>();
  const route = useRoute<SelectLaptopPhotoRoute>();
  const { laptopId } = route.params;

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);

  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const safeSetUploading = (value: boolean) => {
    if (isMounted.current) {
      setUploading(value);
    }
  };

  const safeSetUploadProgress = (updater: ProgressUpdater) => {
    if (!isMounted.current) return;
    setUploadProgress((prev) => (typeof updater === 'function' ? (updater as any)(prev) : updater));
  };

  const ensureOverlayReady = () =>
    new Promise<void>((resolve) => {
      InteractionManager.runAfterInteractions(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });
    });

  const uploadFromAssets = async (assets: Asset[]) => {
    if (uploading) return;

    if (!laptopId) {
      Alert.alert('Error', 'Missing laptop ID');
      return;
    }

    const valid = (assets || []).filter((a) => !!a?.uri);
    if (valid.length === 0) {
      Alert.alert('Error', 'No photos selected');
      return;
    }

    safeSetUploading(true);
    safeSetUploadProgress({ total: valid.length, uploaded: 0, current: 'Starting...' });

    try {
      await ensureOverlayReady();

      const files: RNFile[] = valid.map((a, i) => ({
        uri: a.uri!,
        name: a.fileName ?? `laptop_${Date.now()}_${i}.jpg`,
        type: a.type ?? 'image/jpeg',
      }));

      console.log(`[LAPTOP PHOTOS] Uploading ${files.length} image(s)`);

      const result = await uploadLaptopImages(laptopId, files, (progress) => {
        safeSetUploadProgress(progress);
      });

      const uploadedUrls = Array.isArray(result?.imageUrls)
        ? result.imageUrls.filter((url) => typeof url === 'string' && url.trim().length > 0)
        : [];

      const total = files.length;
      const successCount = uploadedUrls.length;
      const rawFailed = Number((result as any)?.failedCount);
      const failCount = Number.isFinite(rawFailed)
        ? Math.max(rawFailed, 0)
        : Math.max(total - successCount, 0);

      safeSetUploadProgress({ total, uploaded: total, current: 'Complete' });

      if (successCount === 0) {
        const firstError =
          (result as any)?.failedFiles?.[0]?.error ||
          (result as any)?.message ||
          'All uploads failed';
        throw new Error(firstError);
      }

      const navigateToConfirm = () => navigation.replace('ConfirmLaptopDetails', { laptopId });

      if (failCount > 0) {
        Alert.alert(
          'Partial Success',
          `${successCount} of ${total} images uploaded successfully.\n${failCount} failed.`,
          [
            { text: 'Continue Anyway', onPress: navigateToConfirm },
            { text: 'Retry Failed', style: 'cancel' },
          ],
        );
      } else {
        Alert.alert('Success', `All ${successCount} images uploaded successfully!`);
        navigateToConfirm();
      }
    } catch (err: any) {
      console.error('[LAPTOP PHOTO UPLOAD ERROR]', err?.response?.data || err?.message || err);
      Alert.alert(
        'Upload Failed',
        err?.message || 'Network error. Please try again.',
        [
          { text: 'Retry', onPress: () => uploadFromAssets(assets) },
          { text: 'Cancel', style: 'cancel' },
        ],
      );
    } finally {
      safeSetUploading(false);
      safeSetUploadProgress(null);
    }
  };

  const handleTakePhoto = async () => {
    if (uploading) return;
    try {
      const res = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1920,
      });

      if (res.assets?.length) {
        await uploadFromAssets(res.assets);
      }
    } catch (error) {
      console.error('[CAMERA ERROR]', error);
      Alert.alert('Camera Error', 'Failed to open camera');
    }
  };

  const handlePickGallery = async () => {
    if (uploading) return;
    try {
      const res = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 10,
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1920,
      });

      if (res.assets?.length) {
        await uploadFromAssets(res.assets);
      }
    } catch (error) {
      console.error('[GALLERY ERROR]', error);
      Alert.alert('Gallery Error', 'Failed to open gallery');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            disabled={uploading}
          >
            <Icon name="arrow-left" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Upload Photos</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Progress Stepper */}
        <View style={styles.progressContainer}>
          <View style={styles.progressStep}>
            <View style={[styles.progressCircle, styles.completedStep]}>
              <Icon name="check" size={16} color={COLORS.white} />
            </View>
            <Text style={[styles.stepLabel, styles.completedStepLabel]}>Details</Text>
          </View>
          <View style={[styles.progressLine, styles.activeProgressLine]} />
          <View style={styles.progressStep}>
            <View style={[styles.progressCircle, styles.activeStep]}>
              <Text style={styles.progressNumber}>2</Text>
            </View>
            <Text style={[styles.stepLabel, styles.activeStepLabel]}>Photos</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.progressStep}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressNumber}>3</Text>
            </View>
            <Text style={styles.stepLabel}>Confirm</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.content}>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, uploading && styles.actionBtnDisabled]}
              onPress={handleTakePhoto}
              disabled={uploading}
            >
              <Icon name="camera" size={24} color={COLORS.white} />
              <Text style={styles.actionText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, uploading && styles.actionBtnDisabled]}
              onPress={handlePickGallery}
              disabled={uploading}
            >
              <Icon name="folder" size={24} color={COLORS.white} />
              <Text style={styles.actionText}>Pick Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upload Progress Overlay */}
        {uploading && uploadProgress && (
          <View style={styles.loaderOverlay}>
            <View style={styles.progressCard}>
              <ActivityIndicator size="large" color={COLORS.stepActive} />
              <Text style={styles.progressTitle}>Uploading Images</Text>
              <Text style={styles.progressDetail}>
                {uploadProgress.uploaded} of {uploadProgress.total}
              </Text>

              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${
                        uploadProgress.total > 0
                          ? (uploadProgress.uploaded / uploadProgress.total) * 100
                          : 0
                      }%`,
                    },
                  ]}
                />
              </View>

              <Text style={styles.progressHint}>Please wait...</Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SelectLaptopPhotoScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  backButton: {
    padding: SPACING.sm,
    marginLeft: -SPACING.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.md,
  },
  progressStep: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.stepInactive,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedStep: {
    backgroundColor: COLORS.stepActive,
  },
  activeStep: {
    backgroundColor: COLORS.stepActive,
  },
  progressNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  stepLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
    fontWeight: '500',
  },
  activeStepLabel: {
    color: COLORS.stepActive,
    fontWeight: '600',
  },
  completedStepLabel: {
    color: COLORS.stepActive,
    fontWeight: '600',
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.stepInactive,
    marginHorizontal: SPACING.sm,
  },
  activeProgressLine: {
    backgroundColor: COLORS.stepActive,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -SPACING.sm,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: RADII.md,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  actionBtnDisabled: {
    opacity: 0.6,
  },
  actionText: {
    color: COLORS.white,
    fontWeight: '600',
    marginTop: SPACING.sm,
    fontSize: 15,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    zIndex: 10,
  },
  progressCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.xl,
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    width: '85%',
    maxWidth: 360,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  progressDetail: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.stepActive,
    marginTop: SPACING.sm,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.stepInactive,
    borderRadius: RADII.xs,
    marginTop: SPACING.lg,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.stepActive,
  },
  progressHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
  },
});
