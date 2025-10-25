// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
//
// import { SellLaptopStackParamList } from '../../navigation/SellLaptopStack';
// // ⬇️ make sure this path matches your API file name; adjust if your file is named differently
// import { uploadLaptopImages } from '../../api/LaptopsApi/uploadLaptopImages';
//
// type SelectLaptopPhotoNav = NativeStackNavigationProp<SellLaptopStackParamList, 'SelectLaptopPhotoScreen'>;
// type SelectLaptopPhotoRoute = RouteProp<SellLaptopStackParamList, 'SelectLaptopPhotoScreen'>;
//
// const SelectLaptopPhotoScreen: React.FC = () => {
//   const navigation = useNavigation<SelectLaptopPhotoNav>();
//   const route = useRoute<SelectLaptopPhotoRoute>();
//   const { laptopId } = route.params;
//
//   const [uploading, setUploading] = useState(false);
//
//   const uploadFromAssets = async (assets: Asset[]) => {
//     if (!laptopId) {
//       Alert.alert('Error', 'Missing laptop id');
//       return;
//     }
//     const valid = (assets || []).filter(a => !!a?.uri);
//     if (valid.length === 0) {
//       Alert.alert('Error', 'No photo selected');
//       return;
//     }
//
//     setUploading(true);
//     try {
//       const files = valid.map((a, i) => ({
//         uri: a.uri!,
//         name: a.fileName ?? `photo_${i}.jpg`,
//         type: a.type ?? 'image/jpeg',
//       }));
//
//       // Expecting an array of URLs like mobile; if your API returns a response object, adapt here
//       const res = await uploadLaptopImages(laptopId, files) as unknown;
//       const urls =
//         Array.isArray(res)
//           ? res
//           : (res as any)?.imageUrls && Array.isArray((res as any).imageUrls)
//             ? (res as any).imageUrls
//             : [];
//
//       Alert.alert('Success', 'Images uploaded');
//
//       // ✅ Go to Confirm step (replace for smooth step flow)
//       navigation.replace('ConfirmLaptopDetails', { laptopId });
//
//       // ❌ Removed: this was preventing navigation to Confirm
//       // navigation.goBack();
//     } catch (err: any) {
//       console.log('[UPLOAD LAPTOP IMAGES ERR]', err?.response?.data || err?.message);
//       Alert.alert('Upload failed', err?.message || 'Something went wrong');
//     } finally {
//       setUploading(false);
//     }
//   };
//
//   const handleTakePhoto = async () => {
//     const res = await launchCamera({ mediaType: 'photo' });
//     if (res.assets?.length) await uploadFromAssets(res.assets);
//   };
//
//   const handlePickGallery = async () => {
//     const res = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 10 });
//     if (res.assets?.length) await uploadFromAssets(res.assets);
//   };
//
//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//           <Icon name="arrow-left" size={24} color="#333" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Upload Photos</Text>
//         <View style={styles.placeholder} />
//       </View>
//
//       {/* Progress (Step 2 active) */}
//       <View style={styles.progressContainer}>
//         <View style={styles.progressStep}>
//           <View style={styles.progressCircle}>
//             <Text style={styles.progressText}>1</Text>
//           </View>
//         </View>
//         <View style={styles.progressLine} />
//         <View style={styles.progressStep}>
//           <View style={[styles.progressCircle, styles.activeStep]}>
//             <Text style={styles.progressText}>2</Text>
//           </View>
//         </View>
//         <View style={styles.progressLine} />
//         <View style={styles.progressStep}>
//           <View style={styles.progressCircle}>
//             <Text style={styles.progressText}>3</Text>
//           </View>
//         </View>
//       </View>
//
//       {/* Actions only — pick/capture = auto upload */}
//       <View style={styles.actions}>
//         <TouchableOpacity style={styles.actionBtn} onPress={handleTakePhoto} disabled={uploading}>
//           <Icon name="camera" size={24} color="#fff" />
//           <Text style={styles.actionText}>Take Photo</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.actionBtn} onPress={handlePickGallery} disabled={uploading}>
//           <Icon name="folder" size={24} color="#fff" />
//           <Text style={styles.actionText}>Pick Gallery</Text>
//         </TouchableOpacity>
//       </View>
//
//       {/* Full-screen loader */}
//       {uploading && (
//         <View style={styles.loaderOverlay}>
//           <ActivityIndicator size="large" color="#fff" />
//           <Text style={styles.loaderText}>Uploading...</Text>
//         </View>
//       )}
//     </View>
//   );
// };
//
// export default SelectLaptopPhotoScreen;
//
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f5f5f5' },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingTop: 50,
//     paddingBottom: 20,
//     backgroundColor: '#fff',
//   },
//   backButton: { padding: 5 },
//   headerTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
//   placeholder: { width: 34 },
//
//   progressContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 20,
//     backgroundColor: '#fff',
//     marginBottom: 20,
//   },
//   progressStep: { alignItems: 'center' },
//   progressCircle: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: '#E0E0E0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   activeStep: { backgroundColor: '#4A90E2' },
//   progressText: { fontSize: 14, fontWeight: '600', color: '#fff' },
//   progressLine: { width: 40, height: 2, backgroundColor: '#E0E0E0', marginHorizontal: 5 },
//
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginHorizontal: 20,
//     marginTop: 16,
//   },
//   actionBtn: {
//     flex: 1,
//     backgroundColor: '#4A90E2',
//     borderRadius: 10,
//     padding: 16,
//     marginHorizontal: 6,
//     alignItems: 'center',
//   },
//   actionText: { color: '#fff', fontWeight: '600', marginTop: 6 },
//
//   loaderOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.35)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   loaderText: { color: '#fff', marginTop: 8, fontWeight: '600' },
// });


import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';

import { SellLaptopStackParamList } from '../../navigation/SellLaptopStack';
import { uploadLaptopImages, UploadProgress } from '../../api/LaptopsApi/uploadLaptopImages';

type SelectLaptopPhotoNav = NativeStackNavigationProp<SellLaptopStackParamList, 'SelectLaptopPhotoScreen'>;
type SelectLaptopPhotoRoute = RouteProp<SellLaptopStackParamList, 'SelectLaptopPhotoScreen'>;

const SelectLaptopPhotoScreen: React.FC = () => {
  const navigation = useNavigation<SelectLaptopPhotoNav>();
  const route = useRoute<SelectLaptopPhotoRoute>();
  const { laptopId } = route.params;

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);

  const uploadFromAssets = async (assets: Asset[]) => {
    if (!laptopId) {
      Alert.alert('Error', 'Missing laptop ID');
      return;
    }

    const valid = (assets || []).filter(a => !!a?.uri);
    if (valid.length === 0) {
      Alert.alert('Error', 'No photos selected');
      return;
    }

    setUploading(true);
    setUploadProgress({ total: valid.length, uploaded: 0, current: 'Starting...' });

    try {
      const files = valid.map((a, i) => ({
        uri: a.uri!,
        name: a.fileName ?? `photo_${Date.now()}_${i}.jpg`,
        type: a.type ?? 'image/jpeg',
      }));

      console.log(`[SCREEN] Starting upload of ${files.length} images`);

      // Upload with progress tracking
      const result = await uploadLaptopImages(
        laptopId,
        files,
        (progress) => {
          console.log(`[PROGRESS] ${progress.uploaded}/${progress.total} - ${progress.current}`);
          setUploadProgress(progress);
        }
      );

      const successCount = result.imageUrls?.length || 0;
      const failCount = (result as any).failedCount || 0;

      console.log(`[SCREEN] Upload complete: ${successCount} success, ${failCount} failed`);

      // Show result
      if (failCount > 0) {
        Alert.alert(
          'Partial Success',
          `${successCount} of ${valid.length} images uploaded successfully.\n${failCount} failed.`,
          [
            {
              text: 'Continue Anyway',
              onPress: () => navigation.replace('ConfirmLaptopDetails', { laptopId }),
            },
            { text: 'Retry Failed', style: 'cancel' },
          ]
        );
      } else {
        Alert.alert('Success', `All ${successCount} images uploaded successfully!`);
        navigation.replace('ConfirmLaptopDetails', { laptopId });
      }

    } catch (err: any) {
      console.error('[SCREEN ERROR]', err?.response?.data || err?.message);

      Alert.alert(
        'Upload Failed',
        err?.message || 'Network error. Please check your connection and try again.',
        [
          { text: 'Retry', onPress: () => uploadFromAssets(assets) },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const res = await launchCamera({
        mediaType: 'photo',
        quality: 0.8, // Compress to reduce file size
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
    try {
      const res = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 10,
        quality: 0.8, // Compress to reduce file size
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

      {/* Progress Steps */}
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

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleTakePhoto}
          disabled={uploading}
        >
          <Icon name="camera" size={24} color="#fff" />
          <Text style={styles.actionText}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handlePickGallery}
          disabled={uploading}
        >
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

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${(uploadProgress.uploaded / uploadProgress.total) * 100}%` }
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

export default SelectLaptopPhotoScreen;

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