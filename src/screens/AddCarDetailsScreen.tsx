import React, { useState } from 'react';
import { View,Text,StyleSheet,TextInput,ScrollView,TouchableOpacity,} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SellProductStackParamList } from '../navigation/SellProductStack';
type AddCarDetailsScreenNavigationProp = NativeStackNavigationProp<SellProductStackParamList, 'AddCarDetails'>;
const AddCarDetailsScreen: React.FC = () => {
  const navigation = useNavigation<AddCarDetailsScreenNavigationProp>();
  const [formData, setFormData] = useState({
    carName: '',
    brand: '',
    model: '',
    variant: '',
    fuelType: '',
    transmission: '',
    registrationYear: '',
    kmDriven: '',
    color: '',
    engineCapacity: '',
    mileage: '',
    noOfOwners: '',
    insuranceStatus: '',
    price: '',
    carStatus: '',
    negotiableDiscount: '',
    dealerId: '',
    uploadedBy: '',
    mainImageUrl: '',
    carImageUrl: '',
    rcDocumentUrl: '',
    insuranceUrl: '',
  });
const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };
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
    <View style={styles.container}>
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
      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {renderFormField('Car Name', 'carName')}
        {renderFormField('Brand', 'brand')}
        {renderFormField('Model', 'model')}
        {renderFormField('Variant', 'variant')}
        {renderFormField('Fuel Type', 'fuelType')}
        {renderFormField('Transmission', 'transmission')}
        {renderFormField('Registration Year', 'registrationYear', 'numeric')}
        {renderFormField('KM Driven', 'kmDriven', 'numeric')}
        {renderFormField('Color', 'color')}
        {renderFormField('Engine Capacity', 'engineCapacity')}
        {renderFormField('Mileage', 'mileage', 'numeric')}
        {renderFormField('No. of Owners', 'noOfOwners', 'numeric')}
        {renderFormField('Insurance Status', 'insuranceStatus')}
        {renderFormField('Price', 'price', 'numeric')}
        {renderFormField('Car Status', 'carStatus')}
        {renderFormField('Negotiable Discount', 'negotiableDiscount')}
        {renderFormField('Dealer ID', 'dealerId')}
        {renderFormField('Uploaded By', 'uploadedBy')}
        {renderFormField('Main Image URL', 'mainImageUrl')}
        {renderFormField('Car Image URL', 'carImageUrl')}
        {renderFormField('RC Document URL', 'rcDocumentUrl')}
        {renderFormField('Insurance URL', 'insuranceUrl')}
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
    marginBottom: 16,
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
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
