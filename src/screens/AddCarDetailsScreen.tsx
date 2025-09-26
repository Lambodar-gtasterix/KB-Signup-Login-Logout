import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SellProductStackParamList } from '../navigation/SellProductStack';

type AddCarDetailsScreenNavigationProp = NativeStackNavigationProp<
  SellProductStackParamList,
  'AddCarDetails'
>;

const AddCarDetailsScreen: React.FC = () => {
  const navigation = useNavigation<AddCarDetailsScreenNavigationProp>();

  const [formData, setFormData] = useState({
    // Seller-entered fields
    area: '',
    variant: '',
    brand: '',
    carInsuranceDate: '',
    carInsuranceType: '',
    carStatus: '',
    city: '',
    color: '',
    description: '',
    fuelType: '',
    kmDriven: '',
    model: '',
    ownerSerial: '',
    price: '',
    registration: '',
    title: '',
    transmission: '',
    year: '',
    carType: '',

    // Features
    airbag: false,
    ABS: false,
    buttonStart: false,
    sunroof: false,
    childSafetyLocks: false,
    acFeature: false,
    musicFeature: false,
    carInsurance: false,
    powerWindowFeature: false,
    rearParkingCameraFeature: false,
  });

  // Handle text input
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle boolean toggle
  const handleBooleanChange = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Text input field
  const renderFormField = (
    placeholder: string,
    field: string,
    keyboardType: 'default' | 'numeric' = 'default'
  ) => (
    <View style={styles.inputContainer} key={field}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={formData[field as keyof typeof formData]?.toString()}
        onChangeText={(value) => handleInputChange(field, value)}
        keyboardType={keyboardType}
      />
    </View>
  );

  // Yes/No boolean field
  const renderBooleanField = (label: string, field: string) => (
    <View style={styles.booleanContainer} key={field}>
      <Text style={styles.booleanLabel}>{label}</Text>
      <View style={styles.booleanButtons}>
        <TouchableOpacity
          style={[
            styles.booleanButton,
            formData[field as keyof typeof formData] === true &&
              styles.booleanSelected,
          ]}
          onPress={() => handleBooleanChange(field, true)}
        >
          <Text
            style={[
              styles.booleanText,
              formData[field as keyof typeof formData] === true &&
                styles.booleanTextSelected,
            ]}
          >
            Yes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.booleanButton,
            formData[field as keyof typeof formData] === false &&
              styles.booleanSelected,
          ]}
          onPress={() => handleBooleanChange(field, false)}
        >
          <Text
            style={[
              styles.booleanText,
              formData[field as keyof typeof formData] === false &&
                styles.booleanTextSelected,
            ]}
          >
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Car Details</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Indicator */}
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

      {/* Form */}
      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* --- Input Fields --- */}
        {renderFormField('Area', 'area')}
        {renderFormField('Variant', 'variant')}
        {renderFormField('Brand', 'brand')}
        {renderFormField('Insurance Date', 'carInsuranceDate')}
        {renderFormField('Insurance Type', 'carInsuranceType')}
        {renderFormField('Car Status', 'carStatus')}
        {renderFormField('City', 'city')}
        {renderFormField('Color', 'color')}
        {renderFormField('Description', 'description')}
        {renderFormField('Fuel Type', 'fuelType')}
        {renderFormField('KM Driven', 'kmDriven', 'numeric')}
        {renderFormField('Model', 'model')}
        {renderFormField('Owner Serial', 'ownerSerial', 'numeric')}
        {renderFormField('Price', 'price', 'numeric')}
        {renderFormField('Registration', 'registration')}
        {renderFormField('Title', 'title')}
        {renderFormField('Transmission', 'transmission')}
        {renderFormField('Year', 'year', 'numeric')}
        {renderFormField('Car Type', 'carType')}

        {/* --- Boolean Fields --- */}
        {renderBooleanField('Airbag', 'airbag')}
        {renderBooleanField('ABS', 'ABS')}
        {renderBooleanField('Button Start', 'buttonStart')}
        {renderBooleanField('Sunroof', 'sunroof')}
        {renderBooleanField('Child Safety Locks', 'childSafetyLocks')}
        {renderBooleanField('AC Feature', 'acFeature')}
        {renderBooleanField('Music Feature', 'musicFeature')}
        {renderBooleanField('Car Insurance', 'carInsurance')}
        {renderBooleanField('Power Window', 'powerWindowFeature')}
        {renderBooleanField('Rear Parking Camera', 'rearParkingCameraFeature')}
      </ScrollView>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate('SelectPhoto')}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddCarDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  // Header (same as SelectPhotoScreen)
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

  // Progress
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
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },

  // Form
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

  // Boolean Fields
  booleanContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  booleanLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  booleanButtons: { flexDirection: 'row', gap: 10 },
  booleanButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  booleanSelected: { backgroundColor: '#4A90E2' },
  booleanText: { fontSize: 14, color: '#333' },
  booleanTextSelected: { color: '#fff', fontWeight: '600' },

  // Next Button (same as SelectPhotoScreen)
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f5f5f5',
  },
  nextButton: {
    backgroundColor: '#2C3E50',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
