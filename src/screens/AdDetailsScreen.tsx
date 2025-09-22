import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { MyAdsStackParamList } from '../navigation/MyAdsStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AdDetailsRouteProp = RouteProp<MyAdsStackParamList, 'AdDetailsScreen'>;
type NavigationProp = NativeStackNavigationProp<MyAdsStackParamList>;

const AdDetailsScreen: React.FC = () => {
  const route = useRoute<AdDetailsRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { product } = route.params;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ad Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={product.image} style={styles.image} />

        {/* Timer badge */}
        <View style={styles.timerBadge}>
          <Icon name="clock-outline" size={12} color="#fff" />
          <Text style={styles.timerText}>{product.timeLeft}</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <Text style={[styles.tabText, styles.activeTab]}>Product Details</Text>
          <Text style={styles.tabText}>Owner Details</Text>
        </View>

        {/* Price and Title Card */}
        <View style={styles.card}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{product.price}</Text>
            <View style={styles.rating}>
              <Text style={styles.ratingText}>{product.rating}</Text>
              <Icon name="star" size={14} color="#FDC20C" />
            </View>
          </View>
          <Text style={styles.title}>{product.title}</Text>
          <View style={styles.locationRow}>
            <Icon name="map-marker" size={14} color="#888" />
            <Text style={styles.location}>{product.location}</Text>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.detailCard}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Brand:</Text>
            <Text style={styles.detailValue}>{product.brand}</Text>
            <Text style={styles.detailLabel}>Model:</Text>
            <Text style={styles.detailValue}>{product.model}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Year:</Text>
            <Text style={styles.detailValue}>{product.year}</Text>
            <Text style={styles.detailLabel}>Fuel:</Text>
            <Text style={styles.detailValue}>{product.fuel}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>KM driven:</Text>
            <Text style={styles.detailValue}>{product.km}</Text>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.detailCard}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AdDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  image: {
    width: '100%',
    height: 240,
  },
  timerBadge: {
    position: 'absolute',
    right: 16,
    top: 220,
    flexDirection: 'row',
    backgroundColor: '#FDC20C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 12,
    color: '#000',
    marginLeft: 4,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabText: {
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#888',
  },
  activeTab: {
    color: '#216DBD',
    borderBottomWidth: 2,
    borderBottomColor: '#216DBD',
  },
  card: {
    backgroundColor: '#F5F9FD',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 10,
    padding: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#000',
    marginRight: 2,
  },
  title: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  location: {
    marginLeft: 4,
    fontSize: 13,
    color: '#888',
  },
  detailCard: {
    backgroundColor: '#F5F9FD',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 10,
    padding: 16,
    
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  detailLabel: {
    width: '30%',
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    width: '70%',
    fontSize: 14,
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});
