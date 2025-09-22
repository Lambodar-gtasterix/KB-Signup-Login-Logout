import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MyAdsStackParamList } from '../navigation/MyAdsStack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AdDetailsScreenRouteProp = RouteProp<
  MyAdsStackParamList,
  'ProductDetailsScreen'
>;

const ProductDetailsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MyAdsStackParamList>>();
  const route = useRoute<AdDetailsScreenRouteProp>();
  const { product } = route.params;

  const [activeTab, setActiveTab] = useState<'Product Details' | 'Owner Details'>('Product Details');

  return (
    <View style={styles.container}>
      {/* Header with car image */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../assets/icons/left-arrow.png')}
            style={styles.iconImage}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => console.log('Send pressed')}
        >
          <Image
            source={require('../assets/icons/send-icon.png')}
            style={styles.iconImage}
          />
        </TouchableOpacity>

        <Image
          source={require('../assets/icons/Hyundai.png')}
          style={styles.carImage}
          resizeMode="cover"
        />

        <View style={styles.timerBadge}>
          <Icon name="clock-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.timerText}>{product.timeLeft}</Text>
        </View>
      </View>

      {/* Toggle Tabs */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === 'Product Details' && styles.activeToggleButton,
          ]}
          onPress={() => setActiveTab('Product Details')}
        >
          <Text
            style={[
              styles.toggleButtonText,
              activeTab === 'Product Details' && styles.activeToggleButtonText,
            ]}
          >
            Product Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === 'Owner Details' && styles.activeToggleButton,
          ]}
          onPress={() => setActiveTab('Owner Details')}
        >
          <Text
            style={[
              styles.toggleButtonText,
              activeTab === 'Owner Details' && styles.activeToggleButtonText,
            ]}
          >
            Owner Details
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main content scroll view */}
      <ScrollView style={styles.content}>
        <View style={styles.priceBox}>
          <View style={styles.priceRow}>
            <Text style={styles.carPrice}>{product.price}</Text>
            <View style={styles.ratingBox}>
              <Text style={styles.ratingText}>{product.rating}</Text>
              <Icon name="star" size={14} color="#FFD700" />
            </View>
          </View>
          <Text style={styles.carTitle}>{product.title}</Text>
          <View style={styles.locationRow}>
            <Icon name="map-marker" size={14} color="#666" />
            <Text style={styles.locationText}>{product.location}</Text>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailsBox}>
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>Brand - {product.brand}</Text>
              <Text style={styles.detailText}>Model - {product.model}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>Year - {product.year}</Text>
              <Text style={styles.detailText}>Fuel - {product.fuel}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>KM driven - {product.km} km</Text>
            </View>
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {product.description}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate('ChatScreen')}> // 👈 added navigation
          <Text style={styles.chatButtonText}>💬 Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bidButton}>
          <Text style={styles.bidButtonText}>Start Bidding</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 300,
    backgroundColor: '#fff',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  sendButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  iconImage: {
    width: 28,
    height: 28,
    tintColor: '#fff',
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  timerBadge: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    backgroundColor: '#FFCB3D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeToggleButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeToggleButtonText: {
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  priceBox: {
    backgroundColor: '#EAF3FA',
    borderRadius: 10,
    padding: 12,
    marginTop: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#333',
    fontWeight: 'bold',
    marginRight: 4,
  },
  carTitle: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  detailsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  detailsBox: {
    backgroundColor: '#EAF3FA',
    borderRadius: 10,
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  descriptionSection: {
    marginTop: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#EAF3FA',
    lineHeight: 20,
    padding: 10,
    borderRadius: 8,
  },
  bottomButtons: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  chatButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: '#143444',
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
    bottom: 10,
    borderWidth: 1,
    borderColor: '#DDE3EB',
  },
  chatButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bidButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: '#143444',
    borderRadius: 12,
    bottom: 10,
    alignItems: 'center',
  },
  bidButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
