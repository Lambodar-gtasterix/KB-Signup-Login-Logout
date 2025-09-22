import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SellProductStackParamList } from '../navigation/SellProductStack';

type SelectPhotoScreenNavigationProp = NativeStackNavigationProp<SellProductStackParamList, 'SelectPhoto'>;

const SelectPhotoScreen: React.FC = () => {
  const navigation = useNavigation<SelectPhotoScreenNavigationProp>();

  const handleTakePhoto = () => {
    // Handle camera functionality
    console.log('Take a picture pressed');
  };

  const handleUpload = () => {
    // Handle file upload functionality
    console.log('Upload pressed');
  };

  const handleNext = () => {
    // Navigate to next screen
    navigation.navigate('ConfirmDetails');
  };

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
        <Text style={styles.headerTitle}>Select Photo</Text>
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
          <View style={[styles.progressCircle, styles.activeStep]}>
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

      {/* Photo Options */}
      <View style={styles.contentContainer}>
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.option}
            onPress={handleTakePhoto}
          >
            <Icon name="camera" size={40} color="white" />
            <Text style={styles.optionText}>Take a picture</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.option}
            onPress={handleUpload}
          >
            <Icon name="folder" size={40} color="white" />
            <Text style={styles.optionText}>Upload</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectPhotoScreen;

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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    width: '48%',
    height: 120,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    color: 'white',
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
