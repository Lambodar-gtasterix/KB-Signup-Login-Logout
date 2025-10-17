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
// ⬇️ make sure this path matches your API file name; adjust if your file is named differently
import { uploadLaptopImages } from '../../api/LaptopsApi/uploadLaptopImages';

type SelectLaptopPhotoNav = NativeStackNavigationProp<SellLaptopStackParamList, 'SelectLaptopPhotoScreen'>;
type SelectLaptopPhotoRoute = RouteProp<SellLaptopStackParamList, 'SelectLaptopPhotoScreen'>;

const SelectLaptopPhotoScreen: React.FC = () => {
  const navigation = useNavigation<SelectLaptopPhotoNav>();
  const route = useRoute<SelectLaptopPhotoRoute>();
  const { laptopId } = route.params;

  const [uploading, setUploading] = useState(false);

  const uploadFromAssets = async (assets: Asset[]) => {
    if (!laptopId) {
      Alert.alert('Error', 'Missing laptop id');
      return;
    }
    const valid = (assets || []).filter(a => !!a?.uri);
    if (valid.length === 0) {
      Alert.alert('Error', 'No photo selected');
      return;
    }

    setUploading(true);
    try {
      const files = valid.map((a, i) => ({
        uri: a.uri!,
        name: a.fileName ?? `photo_${i}.jpg`,
        type: a.type ?? 'image/jpeg',
      }));

      // Expecting an array of URLs like mobile; if your API returns a response object, adapt here
      const res = await uploadLaptopImages(laptopId, files) as unknown;
      const urls =
        Array.isArray(res)
          ? res
          : (res as any)?.imageUrls && Array.isArray((res as any).imageUrls)
            ? (res as any).imageUrls
            : [];

      Alert.alert('Success', 'Images uploaded');

      // ✅ Go to Confirm step (replace for smooth step flow)
      navigation.replace('ConfirmLaptopDetails', { laptopId });

      // ❌ Removed: this was preventing navigation to Confirm
      // navigation.goBack();
    } catch (err: any) {
      console.log('[UPLOAD LAPTOP IMAGES ERR]', err?.response?.data || err?.message);
      Alert.alert('Upload failed', err?.message || 'Something went wrong');
    } finally {
      setUploading(false);
    }
  };

  const handleTakePhoto = async () => {
    const res = await launchCamera({ mediaType: 'photo' });
    if (res.assets?.length) await uploadFromAssets(res.assets);
  };

  const handlePickGallery = async () => {
    const res = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 10 });
    if (res.assets?.length) await uploadFromAssets(res.assets);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Photos</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress (Step 2 active) */}
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

      {/* Actions only — pick/capture = auto upload */}
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

      {/* Full-screen loader */}
      {uploading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loaderText}>Uploading...</Text>
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
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: { color: '#fff', marginTop: 8, fontWeight: '600' },
});
