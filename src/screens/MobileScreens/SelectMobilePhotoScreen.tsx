import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  InteractionManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';

import { uploadMobileImages } from '../../api/MobilesApi/uploadImages';
import { MobileStackParamList } from '../../navigation/MobileStack';

type SelectPhotoNavProp = NativeStackNavigationProp<MobileStackParamList, 'SelectPhoto'>;
type RouteProps = RouteProp<MobileStackParamList, 'SelectPhoto'>;

type UploadProgress = {
  total: number;
  uploaded: number;
  current: string;
};

const { width } = Dimensions.get('window'); // kept if you use it later

const SelectMobilePhotoScreen: React.FC = () => {
  const navigation = useNavigation<SelectPhotoNavProp>();
  const route = useRoute<RouteProps>();
  const { mobileId } = route.params;

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);

  // Unmount safety: avoid setting state if user navigates away mid-upload
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const safeSetUploading = (v: boolean) => {
    if (isMounted.current) setUploading(v);
  };
  const safeSetUploadProgress = (updater: UploadProgress | null | ((prev: UploadProgress | null) => UploadProgress | null)) => {
    if (isMounted.current) setUploadProgress(updater as any);
  };

  const uploadFromAssets = async (assets: Asset[]) => {
    // Re-entry guard to prevent double-trigger while overlay is up
    if (uploading) return;

    if (!mobileId) {
      Alert.alert('Error', 'Missing mobile id');
      return;
    }
    const valid = (assets || []).filter(a => !!a?.uri);
    if (valid.length === 0) {
      Alert.alert('Error', 'No photo selected');
      return;
    }

    safeSetUploading(true);
    safeSetUploadProgress({ total: valid.length, uploaded: 0, current: 'Starting...' });

    try {
      // ✅ Let the overlay paint BEFORE heavy work starts
      await new Promise<void>(resolve => {
        InteractionManager.runAfterInteractions(() => resolve());
        // Alternative options if ever needed:
        // requestAnimationFrame(() => resolve());
        // setTimeout(resolve, 0);
      });

      const files = valid.map((a, i) => ({
        uri: a.uri!,
        name: a.fileName ?? `mobile_${Date.now()}_${i}.jpg`,
        type: a.type ?? 'image/jpeg',
      }));

      const uploadedUrls: string[] = [];
      const seenUrls = new Set<string>();
      const failedFiles: { name: string; error: string }[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        safeSetUploadProgress({
          total: files.length,
          uploaded: i,
          current: file.name || `Image ${i + 1}`,
        });

        try {
          // 🔁 keep your original per-file API logic unchanged
          const urls = await uploadMobileImages(mobileId, [file]);

          if (!Array.isArray(urls)) {
            throw new Error('Invalid response from server');
          }

          urls.forEach(url => {
            if (typeof url === 'string' && url.trim().length && !seenUrls.has(url)) {
              seenUrls.add(url);
              uploadedUrls.push(url);
            }
          });
        } catch (error: any) {
          console.error('[MOBILE UPLOAD ERROR]', error?.message || error);
          failedFiles.push({
            name: file.name || `Image ${i + 1}`,
            error: error?.message || 'Upload failed',
          });
        }
      }

      safeSetUploadProgress({
        total: files.length,
        uploaded: files.length,
        current: 'Complete',
      });

      if (uploadedUrls.length === 0) {
        const firstError = failedFiles[0]?.error || 'All uploads failed';
        throw new Error(firstError);
      }

      const successCount = uploadedUrls.length;
      const failCount = failedFiles.length;

      if (failCount > 0) {
        Alert.alert(
          'Partial Success',
          `${successCount} of ${files.length} images uploaded successfully.\n${failCount} failed.`,
          [
            {
              text: 'Continue Anyway',
              onPress: () => navigation.navigate('ConfirmDetails', { mobileId, images: uploadedUrls }),
            },
            { text: 'Retry Failed', style: 'cancel' },
          ]
        );
      } else {
        Alert.alert('Success', `All ${successCount} images uploaded successfully!`);
        navigation.navigate('ConfirmDetails', { mobileId, images: uploadedUrls });
      }
    } catch (err: any) {
      console.error('[UPLOAD FAILED]', err?.response?.data || err?.message || err);
      Alert.alert(
        'Upload Failed',
        err?.message || 'Network error. Please try again.',
        [
          { text: 'Retry', onPress: () => uploadFromAssets(assets) },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } finally {
      safeSetUploading(false);
      safeSetUploadProgress(null);
    }
  };

  const handleTakePhoto = async () => {
    if (uploading) return; // guard
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
    if (uploading) return; // guard
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={uploading}
        >
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Photos</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressStep}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>1</Text>
          </View>
        </View>
        <View style={styles.progressLine} />
        <View style={styles.progressStep}>
          <View style={[styles.progressCircle, styles.activeStep]}>
            <Text style={styles.progressText}>2</Text>
          </View>
        </View>
        <View style={styles.progressLine} />
        <View style={styles.progressStep}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>3</Text>
          </View>
        </View>
      </View>

      {/* Actions only — pick = auto upload */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleTakePhoto} disabled={uploading}>
          <Icon name="camera" size={24} color="#fff" />
          <Text style={styles.actionText}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handlePickGallery} disabled={uploading}>
          <Icon name="folder" size={24} color="#fff" />
          <Text style={styles.actionText}>Pick Gallery</Text>
        </TouchableOpacity>
      </View>

      {/* Upload Progress Overlay */}
      {uploading && uploadProgress && (
        <View style={styles.loaderOverlay}>
          <View style={styles.progressCard}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.progressTitle}>Uploading Images</Text>
            <Text style={styles.progressDetail}>
              {uploadProgress.uploaded} of {uploadProgress.total}
            </Text>
            <Text style={styles.progressCurrent}>{uploadProgress.current}</Text>

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
  );
};

export default SelectMobilePhotoScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  placeholder: { width: 34 },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  progressStep: { alignItems: 'center' },
  progressCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: { backgroundColor: '#4A90E2' },
  progressText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  progressLine: { width: 40, height: 2, backgroundColor: '#E0E0E0', marginHorizontal: 5 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginTop: 16,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  actionText: { color: '#fff', fontWeight: '600', marginTop: 6 },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '90%',
    maxWidth: 320,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
  },
  progressDetail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
    marginTop: 8,
  },
  progressCurrent: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  progressHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 12,
  },
});
