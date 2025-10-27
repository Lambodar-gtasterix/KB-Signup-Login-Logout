import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
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
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MyAdsStackParamList } from '../../navigation/MyAdsStack';
import { getMobileById } from '../../api/MobilesApi/productDetails';
import { updateMobile } from '../../api/MobilesApi/updateMobile';

type UpdateRouteProp = RouteProp<MyAdsStackParamList, 'UpdateMobile'>;
type UpdateNavProp = NativeStackNavigationProp<MyAdsStackParamList, 'UpdateMobile'>;

type FormErrors = {
  title?: string;
  description?: string;
  price?: string;
  brand?: string;
  model?: string;
  color?: string;
  yearOfPurchase?: string;
  condition?: string;
  negotiable?: string;
};

const conditionOptions = [
  { label: 'NEW', value: 'NEW' },
  { label: 'USED', value: 'USED' },
];

const negotiableOptions = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
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
  borderFocus: '#4A90E2',
  primary: '#2C3E50',
  primaryLight: '#34495E',
  stepActive: '#4A90E2',
  stepInactive: '#E0E0E0',
  error: '#E74C3C',
  overlay: 'rgba(0, 0, 0, 0.4)',
};

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1990;

const UpdateMobileScreen: React.FC = () => {
  const navigation = useNavigation<UpdateNavProp>();
  const { params } = useRoute<UpdateRouteProp>();
  const { mobileId } = params;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    negotiable: null as boolean | null,
    condition: null as string | null,
    brand: '',
    model: '',
    color: '',
    yearOfPurchase: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [descHeight, setDescHeight] = useState(80);

  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [fadeAnim] = useState(new Animated.Value(0));

  const yearOptions = useMemo(() => {
    const years: string[] = [];
    for (let year = CURRENT_YEAR; year >= MIN_YEAR; year--) {
      years.push(year.toString());
    }
    return years;
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getMobileById(mobileId);
        if (!isMounted) return;

        setFormData({
          title: data?.title ?? '',
          description: data?.description ?? '',
          price: data?.price != null ? String(data.price) : '',
          negotiable: typeof data?.negotiable === 'boolean' ? data.negotiable : null,
          condition: (data?.condition as string) ?? null,
          brand: data?.brand ?? '',
          model: data?.model ?? '',
          color: data?.color ?? '',
          yearOfPurchase: data?.yearOfPurchase ? String(data.yearOfPurchase) : '',
        });
        setSelectedYear(data?.yearOfPurchase ? String(data.yearOfPurchase) : String(CURRENT_YEAR));
      } catch (e: any) {
        if (isMounted) {
          Alert.alert('Error', e?.message || 'Failed to load mobile details');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [mobileId]);

  const validateField = useCallback((field: string, value: any): string | undefined => {
    switch (field) {
      case 'title':
        if (!value || value.trim().length < 5) return 'Title must be at least 5 characters';
        if (value.length > 80) return 'Title must not exceed 80 characters';
        break;
      case 'description':
        if (!value || value.trim().length < 20) return 'Description must be at least 20 characters';
        if (value.length > 400) return 'Description must not exceed 400 characters';
        break;
      case 'price': {
        const price = parseFloat(value);
        if (!value || Number.isNaN(price)) return 'Please enter a valid price';
        if (price <= 0) return 'Price must be greater than 0';
        if (price > 10000000) return 'Price seems too high';
        break;
      }
      case 'brand':
      case 'model':
      case 'color':
        if (!value || value.trim().length === 0) return 'This field is required';
        break;
      case 'yearOfPurchase': {
        if (!value) return 'Please select year of purchase';
        const year = parseInt(value, 10);
        if (Number.isNaN(year) || year < MIN_YEAR || year > CURRENT_YEAR) {
          return `Year must be between ${MIN_YEAR} and ${CURRENT_YEAR}`;
        }
        break;
      }
      case 'condition':
        if (!value) return 'Please select condition';
        break;
      case 'negotiable':
        if (value === null || value === undefined) return 'Please select negotiable';
        break;
      default:
        break;
    }
    return undefined;
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof typeof formData>).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched((prev) => {
      const updated: Record<string, boolean> = { ...prev };
      (Object.keys(formData) as Array<keyof typeof formData>).forEach((field) => {
        updated[field] = true;
      });
      return updated;
    });
    return isValid;
  }, [formData, validateField]);

  const handleInputChange = useCallback(
    (field: string, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (touched[field]) {
        const error = validateField(field, value);
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    },
    [touched, validateField],
  );

  const handleBlur = useCallback(
    (field: string, value?: any) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const valueToValidate = value !== undefined ? value : formData[field];
      const error = validateField(field, valueToValidate);
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [formData, validateField],
  );

  const openYearModal = useCallback(() => {
    setSelectedYear(formData.yearOfPurchase || String(CURRENT_YEAR));
    setYearModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [formData.yearOfPurchase, fadeAnim]);

  const closeYearModal = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setYearModalVisible(false));
  }, [fadeAnim]);

  const confirmYear = useCallback(() => {
    handleInputChange('yearOfPurchase', selectedYear);
    setTouched((prev) => ({ ...prev, yearOfPurchase: true }));
    const error = validateField('yearOfPurchase', selectedYear);
    setErrors((prev) => ({ ...prev, yearOfPurchase: error }));
    closeYearModal();
  }, [selectedYear, handleInputChange, validateField, closeYearModal]);

  const handleUpdate = useCallback(async () => {
    if (!validateForm()) {
      Alert.alert('Please review the form', 'Correct highlighted fields before saving.');
      return;
    }

    const priceNum = parseFloat(formData.price);
    const yearNum = parseInt(formData.yearOfPurchase, 10);

    try {
      setSaving(true);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: priceNum,
        negotiable: formData.negotiable === true,
        condition: formData.condition,
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        color: formData.color.trim(),
        yearOfPurchase: yearNum,
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
  }, [formData, mobileId, navigation, validateForm]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading mobile details...</Text>
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
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Mobile Details</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.progressContainer} />

          <ScrollView
            style={styles.form}
            contentContainerStyle={styles.formContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <FormInput
              label="Title"
              placeholder="e.g., iPhone 15 Pro - Excellent Condition"
              value={formData.title}
              onChangeText={(v) => handleInputChange('title', v)}
              onBlur={() => handleBlur('title')}
              error={touched.title ? errors.title : undefined}
              autoCapitalize="sentences"
              maxLength={80}
              required
            />

            <View style={styles.inputWrapper}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>
                  Description <Text style={styles.required}>*</Text>
                </Text>
                <Text style={styles.charCount}>
                  {formData.description.length}/400
                </Text>
              </View>
              <View
                style={[
                  styles.inputContainer,
                  touched.description && errors.description && styles.inputError,
                ]}
              >
                <TextInput
                  style={[styles.textArea, { height: Math.max(80, descHeight) }]}
                  placeholder="Describe your mobile's condition, features, and accessories..."
                  placeholderTextColor={COLORS.textMuted}
                  value={formData.description}
                  onChangeText={(v) => handleInputChange('description', v)}
                  onBlur={() => handleBlur('description')}
                  onContentSizeChange={(e) => setDescHeight(e.nativeEvent.contentSize.height)}
                  multiline
                  textAlignVertical="top"
                  autoCapitalize="sentences"
                  maxLength={400}
                />
              </View>
              {touched.description && errors.description && (
                <Text style={styles.errorText}>{errors.description}</Text>
              )}
            </View>

            <FormInput
              label="Price"
              placeholder="Enter price"
              value={formData.price}
              onChangeText={(v) => handleInputChange('price', v.replace(/[^0-9]/g, ''))}
              onBlur={() => handleBlur('price')}
              error={touched.price ? errors.price : undefined}
              keyboardType="numeric"
              maxLength={10}
              required
            />

            <FormDropdown
              label="Condition"
              data={conditionOptions}
              value={formData.condition}
              onChange={(item) => {
                handleInputChange('condition', item.value);
                handleBlur('condition', item.value);
              }}
              error={touched.condition ? errors.condition : undefined}
              required
            />

            <FormInput
              label="Brand"
              placeholder="e.g., Apple, Samsung, OnePlus"
              value={formData.brand}
              onChangeText={(v) => handleInputChange('brand', v)}
              onBlur={() => handleBlur('brand')}
              error={touched.brand ? errors.brand : undefined}
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={40}
              required
            />

            <FormInput
              label="Model"
              placeholder="e.g., 15 Pro Max, Galaxy S24"
              value={formData.model}
              onChangeText={(v) => handleInputChange('model', v)}
              onBlur={() => handleBlur('model')}
              error={touched.model ? errors.model : undefined}
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={40}
              required
            />

            <FormInput
              label="Color"
              placeholder="e.g., Midnight Blue, Space Gray"
              value={formData.color}
              onChangeText={(v) => handleInputChange('color', v)}
              onBlur={() => handleBlur('color')}
              error={touched.color ? errors.color : undefined}
              autoCapitalize="words"
              maxLength={40}
              required
            />

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>
                Year of Purchase <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={[
                  styles.inputContainer,
                  styles.readonlyInput,
                  touched.yearOfPurchase && errors.yearOfPurchase && styles.inputError,
                ]}
                onPress={openYearModal}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.readonlyText,
                    !formData.yearOfPurchase && styles.placeholderText,
                  ]}
                >
                  {formData.yearOfPurchase || 'Select year'}
                </Text>
                <Icon name="chevron-down" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
              {touched.yearOfPurchase && errors.yearOfPurchase && (
                <Text style={styles.errorText}>{errors.yearOfPurchase}</Text>
              )}
            </View>

            <FormDropdown
              label="Negotiable"
              data={negotiableOptions}
              value={formData.negotiable}
              onChange={(item) => {
                handleInputChange('negotiable', item.value);
                handleBlur('negotiable', item.value);
              }}
              error={touched.negotiable ? errors.negotiable : undefined}
              required
            />

            <View style={{ height: SPACING.xxxl }} />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.nextButton, saving && styles.nextButtonDisabled]}
              onPress={handleUpdate}
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

      <Modal transparent visible={yearModalVisible} animationType="fade" onRequestClose={closeYearModal}>
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeYearModal} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity style={styles.modalButton} onPress={closeYearModal}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select Year</Text>
              <TouchableOpacity style={styles.modalButton} onPress={confirmYear}>
                <Text style={styles.modalConfirmText}>Apply</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.yearList} contentContainerStyle={styles.yearListContent}>
              {yearOptions.map((year) => {
                const isSelected = selectedYear === year;
                return (
                  <TouchableOpacity
                    key={year}
                    style={[styles.yearItem, isSelected && styles.yearItemSelected]}
                    onPress={() => setSelectedYear(year)}
                  >
                    <Text style={[styles.yearText, isSelected && styles.yearTextSelected]}>
                      {year}
                    </Text>
                    {isSelected && <Icon name="check" size={18} color={COLORS.stepActive} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

export default UpdateMobileScreen;

const FormInput: React.FC<{
  label: string;
  placeholder: string;
  value?: string;
  onChangeText: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  keyboardType?: 'default' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  maxLength?: number;
  required?: boolean;
}> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = true,
  maxLength,
  required = false,
}) => {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          maxLength={maxLength}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const FormDropdown: React.FC<{
  label: string;
  data: any[];
  value: any;
  onChange: (item: any) => void;
  error?: string;
  required?: boolean;
}> = ({ label, data, value, onChange, error, required = false }) => {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.dropdownPlaceholder}
          selectedTextStyle={styles.dropdownSelected}
          data={data}
          labelField="label"
          valueField="value"
          placeholder={`Select ${label.toLowerCase()}`}
          value={value}
          onChange={onChange}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.md,
  },
  form: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  inputWrapper: {
    marginBottom: SPACING.xl,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    backgroundColor: COLORS.white,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    minHeight: 52,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: SPACING.md,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: SPACING.md,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    marginTop: SPACING.xs,
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '500',
  },
  charCount: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  readonlyInput: {
    paddingRight: SPACING.md,
  },
  readonlyText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  placeholderText: {
    color: COLORS.textMuted,
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
    gap: SPACING.sm,
  },
  nextButtonDisabled: {
    opacity: 0.7,
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADII.xl,
    borderTopRightRadius: RADII.xl,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  modalButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  modalCancelText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  modalConfirmText: {
    fontSize: 16,
    color: COLORS.stepActive,
    fontWeight: '600',
  },
  yearList: {
    maxHeight: 400,
  },
  yearListContent: {
    paddingVertical: SPACING.sm,
  },
  yearItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  yearItemSelected: {
    backgroundColor: '#F0F7FF',
  },
  yearText: {
    fontSize: 17,
    color: COLORS.text,
    fontWeight: '500',
  },
  yearTextSelected: {
    color: COLORS.stepActive,
    fontWeight: '600',
  },
});
