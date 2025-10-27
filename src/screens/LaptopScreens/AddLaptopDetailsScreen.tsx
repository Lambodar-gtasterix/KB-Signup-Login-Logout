// src/screens/laptopscreens/AddLaptopDetailsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

// NOTE: use the SellLaptopStack so we can navigate to SelectLaptopPhotoScreen
import { SellLaptopStackParamList } from '../../navigation/SellLaptopStack';
import { addLaptop } from '../../api/LaptopsApi/addLaptop';
import { useAuth } from '../../context/AuthContext';

// NOTE: navigation type is now based on SellLaptopStackParamList
type AddLaptopNav = NativeStackNavigationProp<SellLaptopStackParamList, 'AddLaptopDetails'>;

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

const toFiniteNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};

const extractNumberFromMessage = (message?: string): number | null => {
  if (typeof message !== 'string') return null;
  const match = message.match(/(\d+)/);
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
};

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

        const idCandidates = [
          res?.laptopId,
          (res as any)?.data?.laptopId,
          (res as any)?.data?.id,
          (res as any)?.id,
        ];

        let newId: number | null = null;
        for (const candidate of idCandidates) {
          const numeric = toFiniteNumber(candidate);
          if (numeric !== null) {
            newId = numeric;
            break;
          }
        }

        if (newId === null) {
          const messageCandidates = [res?.message, (res as any)?.data?.message];
          for (const message of messageCandidates) {
            const numeric = extractNumberFromMessage(message);
            if (numeric !== null) {
              newId = numeric;
              break;
            }
          }
        }

        const created =
          newId !== null ||
          res?.code?.toUpperCase?.() === 'CREATED' ||
          res?.statusCode === 200 ||
          res?.statusCode === 201 ||
          res?.status?.toUpperCase?.() === 'SUCCESS';

      if (!created) {
        return Alert.alert('Failed', res?.message || 'Laptop could not be created');
        }

        const rawMessage = (res?.message || 'Laptop created successfully').trim();
        const displayMessage =
          rawMessage
            .replace(/with id.*$/i, '')
            .replace(/\b(id|ID)[:\s#-]*\d+\b/g, '')
            .trim() || 'Laptop created successfully';

        if (newId === null) {
          Alert.alert(
            'Success',
            `${displayMessage}. Unable to determine the new listing id automatically. Please upload photos from My Laptop Ads.`,
          );
          return;
        }

        Alert.alert('Success', displayMessage);
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

  const renderField = (
    label: string,
    field: keyof typeof formData,
    options: {
      placeholder?: string;
      keyboardType?: 'default' | 'numeric';
      required?: boolean;
      autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
      autoCorrect?: boolean;
    } = {}
  ) => {
    const {
      placeholder = label,
      keyboardType = 'default',
      required = false,
      autoCapitalize = 'sentences',
      autoCorrect = true,
    } = options;

    return (
      <View style={styles.inputWrapper} key={String(field)}>
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={COLORS.textMuted}
            value={(formData as any)[field]?.toString() ?? ''}
            onChangeText={(v) => handleInputChange(field, v)}
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
    field: keyof typeof formData,
    data: Array<{ label: string; value: any }>,
    options: { placeholder?: string; required?: boolean } = {}
  ) => {
    const { placeholder = `Select ${label.toLowerCase()}`, required = false } = options;

    return (
      <View style={styles.inputWrapper} key={String(field)}>
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
            value={(formData as any)[field]}
            onChange={(item) => handleInputChange(field, item.value)}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Icon name="arrow-left" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
              Laptop Details
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Progress Stepper */}
          <View style={styles.progressContainer}>
            <View style={styles.progressStep}>
              <View style={[styles.progressCircle, styles.activeStep]}>
                <Icon name="check" size={16} color={COLORS.white} />
              </View>
              <Text style={[styles.stepLabel, styles.activeStepLabel]}>Details</Text>
            </View>
            <View style={[styles.progressLine, styles.activeProgressLine]} />
            <View style={styles.progressStep}>
              <View style={styles.progressCircle}>
                <Text style={styles.progressNumber}>2</Text>
              </View>
              <Text style={styles.stepLabel}>Photos</Text>
            </View>
            <View style={styles.progressLine} />
            <View style={styles.progressStep}>
              <View style={styles.progressCircle}>
                <Text style={styles.progressNumber}>3</Text>
              </View>
              <Text style={styles.stepLabel}>Confirm</Text>
            </View>
          </View>

          {/* Form */}
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

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.nextButton, loading && styles.nextButtonDisabled]}
              onPress={handleNext}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <>
                  <Text style={styles.nextButtonText}>Next</Text>
                  <Icon name="arrow-right" size={20} color={COLORS.white} />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddLaptopDetailsScreen;

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

  // Header
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

  // Progress Stepper
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.stepInactive,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.stepInactive,
  },
  activeStep: {
    backgroundColor: COLORS.stepActive,
    borderColor: COLORS.stepActive,
  },
  progressNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
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

  // Form
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

  // Dropdown
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

  // Footer
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
