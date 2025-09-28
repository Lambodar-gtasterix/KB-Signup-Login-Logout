import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SellProductStackParamList } from '../navigation/SellProductStack';

type ConfirmDetailsScreenNavigationProp = NativeStackNavigationProp<SellProductStackParamList, 'ConfirmDetails'>;

const ConfirmDetailsScreen: React.FC = () => {
  const navigation = useNavigation<ConfirmDetailsScreenNavigationProp>();
  
  const [formData, setFormData] = useState({
    price: '',
    name: '',
    phoneNumber: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePostNow = () => {
    // Handle post functionality
    console.log('Post Now pressed', formData);
    // Here you would typically submit the data to your backend
  };

  const renderFormField = (
    label: string,
    placeholder: string,
    field: string,
    keyboardType: 'default' | 'numeric' | 'phone-pad' = 'default',
    isDropdown = false
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={formData[field as keyof typeof formData]}
          onChangeText={(value) => handleInputChange(field, value)}
          keyboardType={keyboardType}
        />
        {isDropdown && (
          <Icon name="chevron-down" size={20} color="#999" style={styles.dropdownIcon} />
        )}
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
        <Text style={styles.headerTitle}>Confirm details</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressStep}>
          <View style={styles.progressCircle}>
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
          <View style={[styles.progressCircle, styles.activeStep]}>
            <Text style={styles.progressText}>3</Text>
          </View>
        </View>
      </View>

      {/* Form */}
      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {renderFormField('Price', 'eg. Rs 15000', 'price', 'numeric')}
        {renderFormField('Name', 'eg. Rs 15000', 'name')}
        {renderFormField('Verify Phone Number', 'eg. Rs 15000', 'phoneNumber', 'phone-pad')}
      </ScrollView>

      {/* Post Now Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.postButton}
          onPress={handlePostNow}
        >
          <Text style={styles.postButtonText}>Post Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConfirmDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  progressStep: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: '#4A90E2',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
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
  dropdownIcon: {
    position: 'absolute',
    right: 16,
    top: 18,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f5f5f5',
  },
  postButton: {
    backgroundColor: '#2C3E50',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
