// src/screens/LaptopScreens/UpdateLaptopScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MyLaptopAdsStackParamList } from '../../navigation/MyLaptopAdsStack';
import { getLaptopById, LaptopDetail } from '../../api/LaptopsApi/getLaptopById';
import { updateLaptop } from '../../api/LaptopsApi/updateLaptop';

type UpdateRouteProp = RouteProp<MyLaptopAdsStackParamList, 'UpdateLaptop'>;
type NavProp = NativeStackNavigationProp<MyLaptopAdsStackParamList, 'UpdateLaptop'>;

type FormState = {
  serialNumber: string;
  dealer: string;
  brand: string;
  model: string;
  price: string;
  warrantyInYear: number;
  processor: string;
  processorBrand: string;
  memoryType: string;
  ram: string;
  storage: string;
  colour: string;
  screenSize: string;
  battery: string;
  batteryLife: string;
  graphicsCard: string;
  graphicBrand: string;
  weight: string;
  manufacturer: string;
  usbPorts: string;
};

const DEFAULT_FORM: FormState = {
  serialNumber: '',
  dealer: '',
  brand: '',
  model: '',
  price: '',
  warrantyInYear: 1,
  processor: '',
  processorBrand: '',
  memoryType: '',
  ram: '',
  storage: '',
  colour: '',
  screenSize: '',
  battery: '',
  batteryLife: '',
  graphicsCard: '',
  graphicBrand: '',
  weight: '',
  manufacturer: '',
  usbPorts: '',
};

const warrantyOptions = [
  { label: '1 Year', value: 1 },
  { label: '2 Years', value: 2 },
  { label: '3 Years', value: 3 },
];

const UpdateLaptopScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { params } = useRoute<UpdateRouteProp>();
  const { laptopId } = params;

  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialData, setInitialData] = useState<LaptopDetail | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getLaptopById(laptopId);
        if (!mounted) return;
        setInitialData(data);
        const allowedWarranty =
          data.warrantyInYear != null && warrantyOptions.some((option) => option.value === data.warrantyInYear)
            ? data.warrantyInYear
            : DEFAULT_FORM.warrantyInYear;
        setForm({
          serialNumber: data.serialNumber ?? '',
          dealer: data.dealer ?? '',
          brand: data.brand ?? '',
          model: data.model ?? '',
          price: data.price != null ? String(data.price) : '',
          warrantyInYear: allowedWarranty,
          processor: data.processor ?? '',
          processorBrand: data.processorBrand ?? '',
          memoryType: data.memoryType ?? '',
          ram: data.ram ?? '',
          storage: data.storage ?? '',
          colour: data.colour ?? '',
          screenSize: data.screenSize ?? '',
          battery: data.battery ?? '',
          batteryLife: data.batteryLife ?? '',
          graphicsCard: data.graphicsCard ?? '',
          graphicBrand: data.graphicBrand ?? '',
          weight: data.weight ?? '',
          manufacturer: data.manufacturer ?? '',
          usbPorts: data.usbPorts != null ? String(data.usbPorts) : '',
        });
      } catch (e: any) {
        if (mounted) {
          Alert.alert('Error', e?.response?.data?.message || e?.message || 'Failed to load laptop');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [laptopId]);

  const handleTextChange = (key: Exclude<keyof FormState, 'warrantyInYear'>, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const trimmed = (value: string) => {
    const next = value.trim();
    return next.length > 0 ? next : undefined;
  };

  const onSave = async () => {
    if (saving) return;

    if (!form.serialNumber.trim() || !form.brand.trim() || !form.model.trim() || !form.price.trim()) {
      Alert.alert('Validation', 'Please enter Serial Number, Brand, Model, and Price');
      return;
    }

    const priceNum = Number(form.price);
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Validation', 'Please enter a valid numeric price');
      return;
    }

    const usbPortsNum = form.usbPorts.trim().length ? Number(form.usbPorts) : undefined;
    if (form.usbPorts.trim().length && (Number.isNaN(usbPortsNum!) || usbPortsNum! < 0)) {
      Alert.alert('Validation', 'Please enter a valid number of USB ports');
      return;
    }

    const payload = {
      serialNumber: form.serialNumber.trim(),
      dealer: trimmed(form.dealer),
      brand: form.brand.trim(),
      model: form.model.trim(),
      price: priceNum,
      warrantyInYear: Number(form.warrantyInYear) || DEFAULT_FORM.warrantyInYear,
      processor: trimmed(form.processor),
      processorBrand: trimmed(form.processorBrand),
      memoryType: trimmed(form.memoryType),
      ram: trimmed(form.ram),
      storage: trimmed(form.storage),
      colour: trimmed(form.colour),
      screenSize: trimmed(form.screenSize),
      battery: trimmed(form.battery),
      batteryLife: trimmed(form.batteryLife),
      graphicsCard: trimmed(form.graphicsCard),
      graphicBrand: trimmed(form.graphicBrand),
      weight: trimmed(form.weight),
      manufacturer: trimmed(form.manufacturer),
      usbPorts: usbPortsNum,
      status: initialData?.status,
      sellerId: initialData?.sellerId,
    };

    try {
      setSaving(true);
      await updateLaptop(laptopId, payload);
      Alert.alert('Success', 'Laptop updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || e?.message || 'Failed to update laptop');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading laptop...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} disabled={saving}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Laptop Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {renderField('Serial Number', 'serialNumber')}
        {renderField('Dealer', 'dealer')}
        {renderField('Brand', 'brand')}
        {renderField('Model', 'model')}
        {renderField('Price', 'price', 'numeric')}

        <View style={styles.inputContainer}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={warrantyOptions}
            labelField="label"
            valueField="value"
            placeholder="Warranty (Years)"
            value={form.warrantyInYear}
            onChange={(item) =>
              setForm((prev) => ({ ...prev, warrantyInYear: Number(item.value) || DEFAULT_FORM.warrantyInYear }))
            }
          />
        </View>

        {renderField('Processor', 'processor')}
        {renderField('Processor Brand', 'processorBrand')}
        {renderField('RAM', 'ram')}
        {renderField('Storage', 'storage')}
        {renderField('Colour', 'colour')}
        {renderField('Screen Size', 'screenSize')}
        {renderField('Memory Type', 'memoryType')}
        {renderField('Battery', 'battery')}
        {renderField('Battery Life', 'batteryLife')}
        {renderField('Graphics Card', 'graphicsCard')}
        {renderField('Graphic Brand', 'graphicBrand')}
        {renderField('Weight', 'weight')}
        {renderField('Manufacturer', 'manufacturer')}
        {renderField('USB Ports', 'usbPorts', 'numeric')}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.7 }]}
          onPress={onSave}
          disabled={saving}
        >
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Save Changes</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );

  function renderField(
    placeholder: string,
    field: Exclude<keyof FormState, 'warrantyInYear'>,
    keyboardType: 'default' | 'numeric' = 'default'
  ) {
    return (
      <View style={styles.inputContainer} key={String(field)}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={form[field]}
          onChangeText={(text) => handleTextChange(field, text)}
          keyboardType={keyboardType}
        />
      </View>
    );
  }
};

export default UpdateLaptopScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 8, color: '#666' },
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
  formContainer: { flex: 1, paddingHorizontal: 20, marginTop:20},
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
  saveButton: {
    backgroundColor: '#2C3E50',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
