import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SellProductStackParamList } from '../navigation/SellProductStack';

/**
 * Type for navigation prop of AddMobileDetails screen.
 */
type AddMobileDetailsScreenNavigationProp = NativeStackNavigationProp<SellProductStackParamList, 'AddMobileDetails'>;

/**
 * AddMobileDetailsScreen
 *
 * Screen for entering details about a mobile product to sell.
 * Provides a form with multiple input fields (brand, model, variant, etc.),
 * along with a header, progress steps, and a button to navigate to the next step.
 *
 * @returns {JSX.Element} The rendered AddMobileDetailsScreen component.
 */
const AddMobileDetailsScreen: React.FC = () => {
  const navigation = useNavigation<AddMobileDetailsScreenNavigationProp>();

  /**
   * Local state to manage all form fields for product details.
   */
  const [formData, setFormData] = useState({
    mobileId: '',
    title: '',
    description: '',
    price: '',
    negotiable : '',
    condition: '',
    brand: '',
    model: '',
    color: '',
    yearOfPurchase: '',
    status : '',
    createdAt: '',
    updatedAt: '',
    seller: '',
    deletedAt: '',
  });

  /**
   * Handles updating form field values.
   *
   * @param {string} field - The field key to update in formData.
   * @param {string} value - The new value for the field.
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Renders a single form input field.
   *
   * @param {string} placeholder - Placeholder text for the input.
   * @param {string} field - The key from formData to bind the input.
   * @param {'default' | 'numeric'} [keyboardType='default'] - Type of keyboard to display.
   * @returns {JSX.Element} A styled TextInput wrapped in a container.
   */
  const renderFormField = (
    placeholder: string,
    field: string,
    keyboardType: 'default' | 'numeric' = 'default'
  ) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={formData[field as keyof typeof formData]}
        onChangeText={(value) => handleInputChange(field, value)}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header with back button and title */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fill the details</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress steps indicator */}
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

      {/* Form fields */}
      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {renderFormField('Mobile ID', 'mobileId')}
        {renderFormField('Title', 'title')}
        {renderFormField('Description', 'description')}
        {renderFormField('Price', 'price')}
        {renderFormField('Negotiable', 'negotiable')}
        {renderFormField('Condition', 'condition')}
        {renderFormField('Brand', 'brand')}
        {renderFormField('Model', 'model')}
        {renderFormField('Color', 'color')}
        {renderFormField('Year Of Purchase', 'yearOfPurchase', 'numeric')}
        {renderFormField('Status', 'status')}
        {renderFormField('Created At', 'createdAt')}
        {renderFormField('Updated At', 'updatedAt')}
        {renderFormField('Seller', 'seller')}
        {renderFormField('Deleted At', 'deletedAt')}

      </ScrollView>

      {/* Next button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate('SelectPhoto')}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddMobileDetailsScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flexShrink: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 34,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  progressStep: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: '#4A90E2',
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  progressLine: {
    width: 30,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 14,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f5f5f5',
  },
  nextButton: {
    backgroundColor: '#2C3E50',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});