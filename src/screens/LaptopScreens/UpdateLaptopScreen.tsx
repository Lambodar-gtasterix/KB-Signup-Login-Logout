import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import {
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

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

const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 };
const RADII = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 };
const COLORS = {
  bg: '#F5F5F5',
  white: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  textMuted: '#999999',
  border: '#E0E0E0',
  primary: '#2C3E50',
  primaryLight: '#34495E',
  stepActive: '#4A90E2',
  stepInactive: '#E0E0E0',
  error: '#E74C3C',
  success: '#27AE60',
  overlay: 'rgba(0, 0, 0, 0.4)',
};

const UpdateLaptopScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const {
    params: { laptopId },
  } = useRoute<UpdateRouteProp>();

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

        const allowedWarranty =
          data.warrantyInYear != null && warrantyOptions.some((option) => option.value === data.warrantyInYear)
            ? data.warrantyInYear
            : DEFAULT_FORM.warrantyInYear;

        setInitialData(data);
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

  const handleFieldChange = (field: keyof FormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const trimmed = (value: string) => {
    const next = value.trim();
    return next.length > 0 ? next : undefined;
  };

  const handleSave = async () => {
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

  type FieldOptions = {
    placeholder?: string;
    keyboardType?: 'default' | 'numeric';
    required?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoCorrect?: boolean;
  };

  const renderField = (
    label: string,
    field: Exclude<keyof FormState, 'warrantyInYear'>,
    options: FieldOptions = {},
  ) => {
    const {
      placeholder = label,
      keyboardType = 'default',
      required = false,
      autoCapitalize = 'sentences',
      autoCorrect = true,
    } = options;

    return (
      <View style={styles.inputWrapper} key={field}>
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={COLORS.textMuted}
            value={form[field]}
            onChangeText={(text) => handleFieldChange(field, text)}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
          />
        </View>
      </View>
    );
  };

  const renderDropdown = (
    label: string,
    field: 'warrantyInYear',
    data: Array<{ label: string; value: number }>,
    options: { placeholder?: string; required?: boolean } = {},
  ) => {
    const { placeholder = `Select ${label.toLowerCase()}`, required = false } = options;

    return (
      <View style={styles.inputWrapper} key={field}>
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
        <View style={styles.inputContainer}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.dropdownPlaceholder}
            selectedTextStyle={styles.dropdownSelected}
            data={data}
            labelField="label"
            valueField="value"
            placeholder={placeholder}
            value={form[field]}
            onChange={(item) =>
              handleFieldChange(
                field,
                Number(item.value) || DEFAULT_FORM.warrantyInYear,
              )
            }
          />
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading laptop...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              disabled={saving}
            >
              <Icon name="arrow-left" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Laptop Details</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.progressContainer} />

          <ScrollView
            style={styles.form}
            contentContainerStyle={styles.formContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {renderField('Serial Number', 'serialNumber', {
              placeholder: 'Enter laptop serial number',
              required: true,
              autoCapitalize: 'characters',
              autoCorrect: false,
            })}
            {renderField('Dealer', 'dealer', {
              placeholder: 'Enter dealer name',
              autoCapitalize: 'words',
            })}
            {renderField('Brand', 'brand', {
              placeholder: 'e.g., HP, Dell, Apple',
              required: true,
              autoCapitalize: 'words',
            })}
            {renderField('Model', 'model', {
              placeholder: 'e.g., 15s-fq5009TU',
              required: true,
              autoCapitalize: 'characters',
              autoCorrect: false,
            })}
            {renderField('Price', 'price', {
              placeholder: 'Enter price',
              keyboardType: 'numeric',
              required: true,
              autoCapitalize: 'none',
              autoCorrect: false,
            })}
            {renderDropdown('Warranty (Years)', 'warrantyInYear', warrantyOptions, {
              placeholder: 'Select warranty duration',
            })}

            {renderField('Processor', 'processor', {
              placeholder: 'e.g., Intel Core i5-1335U',
              autoCapitalize: 'words',
            })}
            {renderField('Processor Brand', 'processorBrand', {
              placeholder: 'e.g., Intel, AMD',
              autoCapitalize: 'words',
            })}
            {renderField('RAM', 'ram', {
              placeholder: 'e.g., 16 GB',
              autoCapitalize: 'characters',
              autoCorrect: false,
            })}
            {renderField('Storage', 'storage', {
              placeholder: 'e.g., 512 GB SSD',
              autoCapitalize: 'characters',
              autoCorrect: false,
            })}
            {renderField('Colour', 'colour', {
              placeholder: 'e.g., Silver',
              autoCapitalize: 'words',
            })}
            {renderField('Screen Size', 'screenSize', {
              placeholder: 'e.g., 15.6 inch',
              autoCapitalize: 'none',
              autoCorrect: false,
            })}

            {renderField('Memory Type', 'memoryType', {
              placeholder: 'e.g., DDR4',
              autoCapitalize: 'characters',
              autoCorrect: false,
            })}
            {renderField('Battery', 'battery', {
              placeholder: 'e.g., 41 Wh Li-ion',
              autoCapitalize: 'words',
            })}
            {renderField('Battery Life', 'batteryLife', {
              placeholder: 'e.g., Up to 8 hours',
              autoCapitalize: 'sentences',
            })}
            {renderField('Graphics Card', 'graphicsCard', {
              placeholder: 'e.g., Intel Iris Xe',
              autoCapitalize: 'words',
            })}
            {renderField('Graphic Brand', 'graphicBrand', {
              placeholder: 'e.g., Intel',
              autoCapitalize: 'words',
            })}
            {renderField('Weight', 'weight', {
              placeholder: 'e.g., 1.59 kg',
              autoCapitalize: 'none',
              autoCorrect: false,
            })}
            {renderField('Manufacturer', 'manufacturer', {
              placeholder: 'e.g., HP India Pvt Ltd',
              autoCapitalize: 'words',
            })}
            {renderField('USB Ports', 'usbPorts', {
              placeholder: 'Number of USB ports',
              keyboardType: 'numeric',
              autoCapitalize: 'none',
              autoCorrect: false,
            })}

            <View style={{ height: SPACING.xxxl }} />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.nextButton, saving && styles.nextButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.8}
            >
              {saving ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <>
                  <Text style={styles.nextButtonText}>Update</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UpdateLaptopScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textSecondary,
    fontSize: 16,
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
  form: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxxl,
  },
  inputWrapper: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  required: {
    color: COLORS.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    minHeight: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: SPACING.md,
  },
  dropdown: {
    flex: 1,
    height: 40,
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
  dropdownSelected: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  footer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: RADII.md,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonDisabled: {
    opacity: 0.7,
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginRight: SPACING.sm,
  },
});
