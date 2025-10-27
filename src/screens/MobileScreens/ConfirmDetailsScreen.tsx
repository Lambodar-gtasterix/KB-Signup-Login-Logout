import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SellProductStackParamList } from '../../navigation/SellProductStack';
import { useAuth } from '../../context/AuthContext';
import { getConfirmDetailsCombined, ConfirmDetailsDTO } from '../../api/MobilesApi/confirmDetails';

type ConfirmDetailsScreenNavigationProp = NativeStackNavigationProp<
  SellProductStackParamList,
  'ConfirmDetails'
>;
type RouteProps = RouteProp<SellProductStackParamList, 'ConfirmDetails'>;

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
};

const ConfirmDetailsScreen: React.FC = () => {
  const navigation = useNavigation<ConfirmDetailsScreenNavigationProp>();
  const route = useRoute<RouteProps>();
  const { mobileId } = (route.params || {}) as { mobileId: number };

  const { userId } = useAuth();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ConfirmDetailsDTO>({
    price: '',
    name: '',
    phoneNumber: '',
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!mobileId) throw new Error('Missing mobile id');
        if (!userId) throw new Error('Missing user id');

        const data = await getConfirmDetailsCombined({ mobileId, userId });
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
  }, [mobileId, userId]);

  const handleInputChange = (field: keyof ConfirmDetailsDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePostNow = () => {
    Alert.alert('Success', 'Your ad has been posted!');

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      }),
    );
  };

  const renderFormField = (
    label: string,
    placeholder: string,
    field: keyof ConfirmDetailsDTO,
    keyboardType: 'default' | 'numeric' | 'phone-pad' = 'default',
  ) => (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          value={formData[field]}
          onChangeText={(v) => handleInputChange(field, v)}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Confirm Details</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Progress */}
          <View style={styles.progressContainer}>
            <View style={styles.progressStep}>
              <View style={[styles.progressCircle, styles.completedStep]}>
                <Icon name="check" size={16} color={COLORS.white} />
              </View>
              <Text style={[styles.stepLabel, styles.completedStepLabel]}>Details</Text>
            </View>
            <View style={[styles.progressLine, styles.activeProgressLine]} />
            <View style={styles.progressStep}>
              <View style={[styles.progressCircle, styles.completedStep]}>
                <Icon name="check" size={16} color={COLORS.white} />
              </View>
              <Text style={[styles.stepLabel, styles.completedStepLabel]}>Photos</Text>
            </View>
            <View style={[styles.progressLine, styles.activeProgressLine]} />
            <View style={styles.progressStep}>
              <View style={[styles.progressCircle, styles.activeStep]}>
                <Text style={styles.progressNumber}>3</Text>
              </View>
              <Text style={[styles.stepLabel, styles.activeStepLabel]}>Confirm</Text>
            </View>
          </View>

          {/* Form */}
          <ScrollView
            style={styles.form}
            contentContainerStyle={styles.formContent}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            {renderFormField('Price', 'e.g., Rs 15000', 'price', 'numeric')}
            {renderFormField('Name', 'Your name', 'name')}
            {renderFormField('Verify Phone Number', 'Your mobile number', 'phoneNumber', 'phone-pad')}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.postButton, loading && styles.postButtonDisabled]}
              onPress={handlePostNow}
              disabled={loading}
            >
              <Text style={styles.postButtonText}>{loading ? 'Loading...' : 'Post Now'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ConfirmDetailsScreen;

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
  progressStep: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.stepInactive,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedStep: {
    backgroundColor: COLORS.stepActive,
  },
  activeStep: {
    backgroundColor: COLORS.stepActive,
  },
  progressNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
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
  completedStepLabel: {
    color: COLORS.stepActive,
    fontWeight: '600',
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    minHeight: 52,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: SPACING.md,
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
  postButton: {
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
  postButtonDisabled: {
    opacity: 0.7,
  },
  postButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
