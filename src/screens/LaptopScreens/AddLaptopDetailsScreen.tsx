// src/screens/laptopscreens/AddLaptopDetailsScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// 🔁 CHANGED: use the SellLaptopStack (so we can navigate to SelectLaptopPhotoScreen)
import { SellLaptopStackParamList } from '../../navigation/SellLaptopStack';
import { addLaptop } from '../../api/LaptopsApi/addLaptop';
import { useAuth } from '../../context/AuthContext';

// 🔁 CHANGED: navigation type is now based on SellLaptopStackParamList
type AddLaptopNav = NativeStackNavigationProp<SellLaptopStackParamList, 'AddLaptopDetails'>;

const warrantyOptions = [
  { label: '1 Year', value: 1 },
  { label: '2 Years', value: 2 },
  { label: '3 Years', value: 3 },
];

const AddLaptopDetailsScreen: React.FC = () => {
  const navigation = useNavigation<AddLaptopNav>();
  const { sellerId } = useAuth();

  // Pre-filled for dev convenience
  const [formData, setFormData] = useState({
    serialNumber: 'CFG-HP-15S-FQ5009TU',
    dealer: 'AK Laptops',
    brand: 'HP',
    model: 'HP 15s-fq5009TU',
    price: '58999',

    warrantyInYear: 1 as number,
    processor: 'Intel Core i5-1335U',
    processorBrand: 'Intel',
    ram: '16 GB',
    storage: '512 GB SSD',
    colour: 'Silver',
    screenSize: '15.6 inch',

    // Optional backend fields (only sent if present)
    memoryType: 'DDR4',
    battery: '3-cell, 41 Wh Li-ion',
    batteryLife: 'Up to 8 hours',
    graphicsCard: 'Intel Iris Xe Graphics',
    graphicBrand: 'Intel',
    weight: '1.59 kg',
    manufacturer: 'HP India Pvt Ltd',
    usbPorts: '3', // keep as string in UI; convert to number when sending
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: any) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const handleNext = async () => {
    if (sellerId == null) {
      return Alert.alert('Error', 'Seller account not found');
    }

    if (!formData.serialNumber.trim() || !formData.brand.trim() || !formData.model.trim() || !formData.price.trim()) {
      return Alert.alert('Error', 'Please enter Serial Number, Brand, Model, and Price');
    }

    const priceNum = Number(formData.price);
    if (Number.isNaN(priceNum)) {
      return Alert.alert('Error', 'Please enter a valid numeric Price');
    }

    try {
      setLoading(true);

      // Build payload aligned to backend sample (send only if present/meaningful)
      const payload = {
        serialNumber: formData.serialNumber.trim(),
        dealer: formData.dealer?.trim() || undefined,
        model: formData.model.trim(),
        brand: formData.brand.trim(),
        price: priceNum,

        warrantyInYear: Number(formData.warrantyInYear) || 1,
        processor: formData.processor?.trim() || undefined,
        processorBrand: formData.processorBrand?.trim() || undefined,
        memoryType: formData.memoryType?.trim() || undefined,
        screenSize: formData.screenSize?.trim() || undefined,
        colour: formData.colour?.trim() || undefined,
        ram: formData.ram?.trim() || undefined,
        storage: formData.storage?.trim() || undefined,
        battery: formData.battery?.trim() || undefined,
        batteryLife: formData.batteryLife?.trim() || undefined,
        graphicsCard: formData.graphicsCard?.trim() || undefined,
        graphicBrand: formData.graphicBrand?.trim() || undefined,
        weight: formData.weight?.trim() || undefined,
        manufacturer: formData.manufacturer?.trim() || undefined,
        usbPorts:
          formData.usbPorts !== undefined && formData.usbPorts !== null && `${formData.usbPorts}`.trim().length > 0
            ? Number(formData.usbPorts)
            : undefined,

        // Backend sample includes status; keep it to satisfy validators
        status: 'ACTIVE' as const,

        // Always numeric
        sellerId: Number(sellerId),
      } as const;

      const res = await addLaptop(payload);
      console.log('[ADD LAPTOP RES]', res);

      const created =
        typeof res?.laptopId === 'number' ||
        res?.code?.toUpperCase?.() === 'CREATED' ||
        res?.statusCode === 200 ||
        res?.statusCode === 201 ||
        res?.status?.toUpperCase?.() === 'SUCCESS';

      if (!created) {
        return Alert.alert('Failed', res?.message || 'Laptop could not be created');
      }

      // ✅ NEW: get the id and go to the Upload Photos step
      const newId =
        typeof res?.laptopId === 'number'
          ? res.laptopId
          : Number((res as any)?.data?.laptopId ?? NaN);

      if (!Number.isFinite(newId)) {
        // Fallback if backend didn't return a clean id
        const msg = (res?.message || 'Laptop created').replace(/with id.*/i, '').trim();
        Alert.alert('Success', msg);
        return;
      }

      // Navigate to image upload with the newly created laptopId
      // (Route is defined in SellLaptopStack)
      navigation.navigate('SelectLaptopPhotoScreen', { laptopId: newId });
      return;
    } catch (err: any) {
      console.log('[ADD LAPTOP ERR]', err?.response?.data || err?.message);
      const apiMsg = err?.response?.data?.message || err?.message || 'Failed to add laptop';
      Alert.alert('Error', apiMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Laptop Details</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress */}
      <View className="progress" style={styles.progressContainer}>
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

      {/* Form */}
      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {renderField('Serial Number', 'serialNumber')}
        {renderField('Dealer', 'dealer')}
        {renderField('Brand', 'brand')}
        {renderField('Model', 'model')}
        {renderField('Price', 'price', 'numeric')}

        {/* Warranty (Dropdown) */}
        <View style={styles.inputContainer}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={warrantyOptions}
            labelField="label"
            valueField="value"
            placeholder="Warranty (Years)"
            value={formData.warrantyInYear}
            onChange={(item) => handleInputChange('warrantyInYear', item.value)}
          />
        </View>

        {renderField('Processor', 'processor')}
        {renderField('Processor Brand', 'processorBrand')}
        {renderField('RAM', 'ram')}
        {renderField('Storage', 'storage')}
        {renderField('Colour', 'colour')}
        {renderField('Screen Size', 'screenSize')}

        {/* Optional fields (keep if you want to send full backend sample) */}
        {renderField('Memory Type', 'memoryType')}
        {renderField('Battery', 'battery')}
        {renderField('Battery Life', 'batteryLife')}
        {renderField('Graphics Card', 'graphicsCard')}
        {renderField('Graphic Brand', 'graphicBrand')}
        {renderField('Weight', 'weight')}
        {renderField('Manufacturer', 'manufacturer')}
        {renderField('USB Ports', 'usbPorts', 'numeric')}
      </ScrollView>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.nextButton, loading && { opacity: 0.7 }]}
          onPress={handleNext}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.nextButtonText}>Next</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );

  function renderField(
    placeholder: string,
    field: keyof typeof formData,
    keyboardType: 'default' | 'numeric' = 'default'
  ) {
    return (
      <View style={styles.inputContainer} key={String(field)}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={(formData as any)[field]?.toString()}
          onChangeText={(v) => handleInputChange(field, v)}
          keyboardType={keyboardType}
        />
      </View>
    );
  }
};

export default AddLaptopDetailsScreen;

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
