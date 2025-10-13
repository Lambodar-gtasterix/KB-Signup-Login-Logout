import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MyAdsStackParamList } from '../../navigation/MyAdsStack';
import { getMobileById } from '../../api/MobilesApi/productDetails';
import { updateMobile } from '../../api/MobilesApi/updateMobile';

type UpdateRouteProp = RouteProp<MyAdsStackParamList, 'UpdateMobile'>;
type UpdateNavProp = NativeStackNavigationProp<MyAdsStackParamList, 'UpdateMobile'>;

const conditionOptions = [
  { label: 'NEW', value: 'NEW' },
  { label: 'USED', value: 'USED' },
];

const negotiableOptions = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

const UpdateMobileScreen: React.FC = () => {
  const navigation = useNavigation<UpdateNavProp>();
  const { params } = useRoute<UpdateRouteProp>();
  const { mobileId } = params;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    negotiable: null as boolean | null,
    condition: null as string | null, // "NEW" | "USED"
    brand: '',
    model: '',
    color: '',
    yearOfPurchase: '',
  });

  const [loading, setLoading] = useState(true);    // initial fetch loader
  const [saving, setSaving] = useState(false);     // update button loader

  // Prefill form
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getMobileById(mobileId);
        setFormData({
          title: data?.title ?? '',
          description: data?.description ?? '',
          price: data?.price != null ? String(data.price) : '',
          negotiable: data?.negotiable ?? null,
          condition: (data?.condition as string) ?? null,
          brand: data?.brand ?? '',
          model: data?.model ?? '',
          color: data?.color ?? '',
          yearOfPurchase: data?.yearOfPurchase ? String(data.yearOfPurchase) : '',
        });
      } catch (e: any) {
        Alert.alert('Error', e?.message || 'Failed to load mobile details');
      } finally {
        setLoading(false);
      }
    })();
  }, [mobileId]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onUpdate = async () => {
    // Basic validation aligned with Add screen
    const priceNum = parseFloat(formData.price);
    const yearNum = parseInt(formData.yearOfPurchase || '', 10);

    if (!formData.title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Error', 'Please enter valid Price');
      return;
    }
    if (formData.yearOfPurchase && Number.isNaN(yearNum)) {
      Alert.alert('Error', 'Please enter valid Year of Purchase');
      return;
    }
    if (!formData.condition || formData.negotiable === null) {
      Alert.alert('Error', 'Please select Condition and Negotiable');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: priceNum,
        negotiable: formData.negotiable === true,
        condition: formData.condition, // "NEW" | "USED"
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        color: formData.color.trim(),
        yearOfPurchase: formData.yearOfPurchase ? yearNum : undefined,
      };

      await updateMobile(mobileId, payload);
      Alert.alert('Success', 'Mobile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to update mobile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8, color: '#666' }}>Loading…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header (same design as Add screen) */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Mobile</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress (copied visuals) */}
      <View style={styles.progressContainer}>
        <View style={styles.progressStep}>
          <View style={[styles.progressCircle, styles.activeStep]}>
            <Text style={styles.progressText}>1</Text>
          </View>
        </View>
        <View style={styles.progressLine} />
        <View style={styles.progressStep}>
          <View style={styles.progressCircle}>
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

      {/* Form (same layout as Add) */}
      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {renderFormField('Title', 'title')}
        {renderFormField('Description', 'description')}
        {renderFormField('Price', 'price', 'numeric')}

        {/* Condition */}
        <View style={styles.inputContainer}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={conditionOptions}
            labelField="label"
            valueField="value"
            placeholder="Condition"
            value={formData.condition}
            onChange={(item) => handleInputChange('condition', item.value)}
          />
        </View>

        {renderFormField('Brand', 'brand')}
        {renderFormField('Model', 'model')}
        {renderFormField('Color', 'color')}
        {renderFormField('Year of Purchase', 'yearOfPurchase', 'numeric')}

        {/* Negotiable */}
        <View style={styles.inputContainer}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={negotiableOptions}
            labelField="label"
            valueField="value"
            placeholder="Negotiable"
            value={formData.negotiable}
            onChange={(item) => handleInputChange('negotiable', item.value)}
          />
        </View>
      </ScrollView>

      {/* Update Button (same look as Add/Next) */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.nextButton, saving && { opacity: 0.7 }]}
          onPress={onUpdate}
          disabled={saving}
        >
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.nextButtonText}>Update</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );

  function renderFormField(
    placeholder: string,
    field: string,
    keyboardType: 'default' | 'numeric' = 'default'
  ) {
    return (
      <View style={styles.inputContainer} key={field}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={(formData as any)[field]?.toString() ?? ''}
          onChangeText={(value) => handleInputChange(field, value)}
          keyboardType={keyboardType}
        />
      </View>
    );
  }
};

export default UpdateMobileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  // Header (same as Add)
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

  // Progress (same visuals)
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

  // Form (same visuals)
  formContainer: { flex: 1, paddingHorizontal: 20 },
  inputContainer: { marginBottom: 16 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dropdown: {
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
  },
  placeholderStyle: { fontSize: 16, color: '#999' },
  selectedTextStyle: { fontSize: 16, color: '#333' },

  // Button (same visuals)
  buttonContainer: { paddingHorizontal: 20, paddingVertical: 20, backgroundColor: '#f5f5f5' },
  nextButton: {
    backgroundColor: '#2C3E50',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
