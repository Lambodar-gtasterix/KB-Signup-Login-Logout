import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SellProductStackParamList } from '../../navigation/SellProductStack';
import { addMobile } from '../../api/MobilesApi/addMobile';
import { useAuth } from '../../context/AuthContext';

type AddMobileDetailsScreenNavigationProp = NativeStackNavigationProp<
  SellProductStackParamList,
  'AddMobileDetails'
>;

const conditionOptions = [
  { label: 'NEW', value: 'NEW' },
  { label: 'USED', value: 'USED' },
];

const negotiableOptions = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

const AddMobileDetailsScreen: React.FC = () => {
  const navigation = useNavigation<AddMobileDetailsScreenNavigationProp>();
  const { sellerId } = useAuth();

  const [formData, setFormData] = useState({
    title: 'iPhone 17 - Well condition dd',
    description: 'Well maintained, minor scratches',
    price: '30000',
    negotiable: null as boolean | null,
    condition: null as string | null, // "NEW" | "USED"
    brand: 'Apple',
    model: '16 pro ',
    color: 'orange',
    yearOfPurchase: '2020',
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
        condition: formData.condition, // "NEW" | "USED"
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        color: formData.color.trim(),
        yearOfPurchase: year,
        sellerId,
      };

      const res = await addMobile(payload);

      // Robust success check: JSON code can be "200"; require mobileId
      const success = (res.code === '200' || res.code === '201') && typeof res.mobileId === 'number';
      if (!success) {
        Alert.alert('Failed', res?.message || 'Something went wrong');
        return; // prevent fallthrough
      }

      Alert.alert('Success', res.message);
      navigation.navigate('SelectPhoto', { mobileId: res.mobileId });
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to add mobile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mobile Details</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress */}
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
      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {renderFormField('Title', 'title')}
        {renderFormField('Description', 'description')}
        {renderFormField('Price', 'price', 'numeric')}

        {/* Condition */}
        <View style={styles.inputContainer}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={conditionOptions}
            labelField="label"
            valueField="value"
            placeholder="Condition"
            value={formData.condition}
            onChange={(item) => handleInputChange('condition', item.value)}
          />
        </View>

        {renderFormField('Brand', 'brand')}
        {renderFormField('Model', 'model')}
        {renderFormField('Color', 'color')}
        {renderFormField('Year of Purchase', 'yearOfPurchase', 'numeric')}

        {/* Negotiable */}
        <View style={styles.inputContainer}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={negotiableOptions}
            labelField="label"
            valueField="value"
            placeholder="Negotiable"
            value={formData.negotiable}
            onChange={(item) => handleInputChange('negotiable', item.value)}
          />
        </View>
      </ScrollView>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.nextButton, loading && { opacity: 0.7 }]}
          onPress={handleNext}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.nextButtonText}>Next</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );

  function renderFormField(
    placeholder: string,
    field: string,
    keyboardType: 'default' | 'numeric' = 'default'
  ) {
    return (
      <View style={styles.inputContainer} key={field}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={(formData as any)[field]?.toString()}
          onChangeText={(value) => handleInputChange(field, value)}
          keyboardType={keyboardType}
        />
      </View>
    );
  }
};

export default AddMobileDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
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
  progressLine: { width: 40, height: 2, backgroundColor: '#E0E0E0', marginHorizontal: 5 },
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
  nextButton: {
    backgroundColor: '#2C3E50',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});