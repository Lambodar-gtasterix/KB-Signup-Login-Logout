import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SellLaptopStackParamList } from '../../navigation/SellLaptopStack';
import { CommonActions } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { getLaptopConfirmDetailsCombined, LaptopConfirmDetailsDTO } from '../../api/LaptopsApi/confirmDetails';

type Nav = NativeStackNavigationProp<SellLaptopStackParamList, 'ConfirmLaptopDetails'>;
type RouteProps = RouteProp<SellLaptopStackParamList, 'ConfirmLaptopDetails'>;

const ConfirmLaptopDetailsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const { laptopId } = (route.params || {}) as { laptopId: number };

  const { userId } = useAuth();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<LaptopConfirmDetailsDTO>({
    price: '',
    name: '',
    phoneNumber: '',
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!laptopId) throw new Error('Missing laptop id');
        if (!userId) throw new Error('Missing user id');

        const data = await getLaptopConfirmDetailsCombined({ laptopId, userId });
        if (!mounted) return;
        setFormData(data);
      } catch (e: any) {
        Alert.alert('Error', e?.response?.data?.message || e?.message || 'Failed to load details');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [laptopId, userId]);

  const handleInputChange = (field: keyof LaptopConfirmDetailsDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePostNow = () => {
    Alert.alert('Success', 'Your laptop ad has been posted!');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }], // <- adjust if your Home route key differs
      })
    );
  };

  const renderFormField = (
    label: string,
    placeholder: string,
    field: keyof LaptopConfirmDetailsDTO,
    keyboardType: 'default' | 'numeric' | 'phone-pad' = 'default'
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={formData[field]}
          onChangeText={(v) => handleInputChange(field, v)}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm details</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressStep}>
          <View style={styles.progressCircle}><Text style={styles.progressText}>1</Text></View>
        </View>
        <View style={styles.progressLine} />
        <View style={styles.progressStep}>
          <View style={styles.progressCircle}><Text style={styles.progressText}>2</Text></View>
        </View>
        <View style={styles.progressLine} />
        <View style={styles.progressStep}>
          <View style={[styles.progressCircle, styles.activeStep]}>
            <Text style={styles.progressText}>3</Text>
          </View>
        </View>
      </View>

      {/* Form */}
      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {renderFormField('Price', 'eg. Rs 58999', 'price', 'numeric')}
        {renderFormField('Name', 'Your name', 'name')}
        {renderFormField('Verify Phone Number', 'Your mobile number', 'phoneNumber', 'phone-pad')}
      </ScrollView>

      {/* Post Now */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.postButton} onPress={handlePostNow} disabled={loading}>
          <Text style={styles.postButtonText}>{loading ? 'Loading...' : 'Post Now'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConfirmLaptopDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, backgroundColor: '#fff',
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  placeholder: { width: 34 },
  progressContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 20, backgroundColor: '#fff', marginBottom: 20,
  },
  progressStep: { alignItems: 'center' },
  progressCircle: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#E0E0E0',
    justifyContent: 'center', alignItems: 'center',
  },
  activeStep: { backgroundColor: '#4A90E2' },
  progressText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  progressLine: { width: 40, height: 2, backgroundColor: '#E0E0E0', marginHorizontal: 5 },
  formContainer: { flex: 1, paddingHorizontal: 20 },
  inputContainer: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 8 },
  inputWrapper: { position: 'relative' },
  input: {
    backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 16,
    fontSize: 16, color: '#333', borderWidth: 1, borderColor: '#E0E0E0',
  },
  buttonContainer: { paddingHorizontal: 20, paddingVertical: 20, backgroundColor: '#f5f5f5' },
  postButton: {
    backgroundColor: '#2C3E50', borderRadius: 8, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  postButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
