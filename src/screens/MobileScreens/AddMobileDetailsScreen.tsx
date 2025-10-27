import React, { useMemo, useState, useCallback } from 'react';
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
  Modal,
  Pressable,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SellProductStackParamList } from '../../navigation/SellProductStack';
import { addMobile } from '../../api/MobilesApi/addMobile';
import { useAuth } from '../../context/AuthContext';

type AddMobileDetailsScreenNavigationProp = NativeStackNavigationProp<
  SellProductStackParamList,
  'AddMobileDetails'
>;

// Form validation types
interface FormErrors {
  title?: string;
  description?: string;
  price?: string;
  brand?: string;
  model?: string;
  color?: string;
  yearOfPurchase?: string;
  condition?: string;
  negotiable?: string;
}

const conditionOptions = [
  { label: 'NEW', value: 'NEW' },
  { label: 'USED', value: 'USED' },
];

const negotiableOptions = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

// Design tokens
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
  success: '#27AE60',
  overlay: 'rgba(0, 0, 0, 0.4)',
};

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1990;

const AddMobileDetailsScreen: React.FC = () => {
  const navigation = useNavigation<AddMobileDetailsScreenNavigationProp>();
  const { sellerId } = useAuth();

  const [formData, setFormData] = useState({
    title: 'iPhone 13 Pro',
    description: 'Used for 1 year, excellent condition',
    price: '58000',
    negotiable:  null as boolean | null,
    condition:  null as boolean | null,
    brand: 'Apple',
    model: 'iPhone 13 Pro',
    color: 'Sierra Blue',
    yearOfPurchase: '2022',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [descHeight, setDescHeight] = useState(80);

  // Year picker state
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>(formData.yearOfPurchase);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Generate year options
  const yearOptions = useMemo(() => {
    const years = [];
    for (let year = CURRENT_YEAR; year >= MIN_YEAR; year--) {
      years.push(year.toString());
    }
    return years;
  }, []);

  // Validation rules
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
      case 'price':
        const price = parseFloat(value);
        if (!value || isNaN(price)) return 'Please enter a valid price';
        if (price <= 0) return 'Price must be greater than 0';
        if (price > 10000000) return 'Price seems too high';
        break;
      case 'brand':
        if (!value || value.trim().length < 2) return 'Brand name is required';
        break;
      case 'model':
        if (!value || value.trim().length < 1) return 'Model name is required';
        break;
      case 'color':
        if (!value || value.trim().length < 2) return 'Color is required';
        break;
      case 'yearOfPurchase':
        const year = parseInt(value, 10);
        if (!value || isNaN(year)) return 'Please select year of purchase';
        if (year < MIN_YEAR || year > CURRENT_YEAR) return 'Please select a valid year';
        break;
      case 'condition':
        if (!value) return 'Please select condition';
        break;
      case 'negotiable':
        if (value === null) return 'Please select negotiable option';
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
    return isValid;
  }, [formData, validateField]);

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing/selecting
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((field: string, value?: any) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const valueToValidate = value !== undefined ? value : formData[field];
    const error = validateField(field, valueToValidate);
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, [formData, validateField]);

  // Year picker handlers
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

  // ORIGINAL API LOGIC - UNCHANGED
  const handleNext = async () => {
    if (!sellerId) {
      Alert.alert('Error', 'Seller account not found');
      return;
    }

    const price = parseFloat(formData.price);
    const year = parseInt(formData.yearOfPurchase, 10);

    if (isNaN(price) || isNaN(year)) {
      Alert.alert('Error', 'Please enter valid Price and Year of Purchase');
      return;
    }

    if (!formData.condition || formData.negotiable === null) {
      Alert.alert('Error', 'Please select Condition and Negotiable');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price,
        negotiable: formData.negotiable === true,
        condition: formData.condition,
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        color: formData.color.trim(),
        yearOfPurchase: year,
        sellerId,
      };

      const res = await addMobile(payload);

      const success =
        (res.code === '200' || res.code === '201') && typeof res.mobileId === 'number';
      if (!success) {
        Alert.alert('Failed', res?.message || 'Something went wrong');
        return;
      }

      Alert.alert('Success', res.message);
      navigation.navigate('SelectPhoto', { mobileId: res.mobileId });
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to add mobile');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = useMemo(() => {
    return Object.values(formData).every((value) => {
      if (typeof value === 'boolean') return true;
      return value !== null && value !== '';
    });
  }, [formData]);

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
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Icon name="arrow-left" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
              Mobile Details
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
              <View style={[styles.inputContainer, touched.description && errors.description && styles.inputError]}>
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
              placeholder="Enter price in ₹"
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

            {/* Year Picker */}
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

          {/* Sticky Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.nextButton,
                loading && styles.nextButtonDisabled,
              ]}
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

      {/* Year Picker Modal */}
      <Modal
        visible={yearModalVisible}
        animationType="none"
        transparent
        onRequestClose={closeYearModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeYearModal}>
          <Animated.View
            style={[styles.modalContent, { opacity: fadeAnim }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closeYearModal} style={styles.modalButton}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select Year</Text>
              <TouchableOpacity onPress={confirmYear} style={styles.modalButton}>
                <Text style={styles.modalConfirmText}>Done</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.yearList}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.yearListContent}
            >
              {yearOptions.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.yearItem,
                    selectedYear === year && styles.yearItemSelected,
                  ]}
                  onPress={() => setSelectedYear(year)}
                  activeOpacity={0.6}
                >
                  <Text
                    style={[
                      styles.yearText,
                      selectedYear === year && styles.yearTextSelected,
                    ]}
                  >
                    {year}
                  </Text>
                  {selectedYear === year && (
                    <Icon name="check-circle" size={24} color={COLORS.stepActive} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

// Reusable Input Component
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

// Reusable Dropdown Component
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

export default AddMobileDetailsScreen;

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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.textMuted,
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
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
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
    minHeight: 80,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  readonlyInput: {
    justifyContent: 'space-between',
  },
  readonlyText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  placeholderText: {
    color: COLORS.textMuted,
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

  // Year Modal
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
