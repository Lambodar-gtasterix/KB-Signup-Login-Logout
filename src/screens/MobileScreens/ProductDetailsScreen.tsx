// src/screens/ProductDetailsScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MyAdsStackParamList } from '../../navigation/MyAdsStack';
import { getMobileById, MobileDetail } from '../../api/MobilesApi/productDetails';

type DetailsRouteProp = RouteProp<MyAdsStackParamList, 'ProductDetails'>;
type NavProp = NativeStackNavigationProp<MyAdsStackParamList>;

const currencyINR = (n?: number) =>
  typeof n === 'number' ? `₹${Math.round(n).toLocaleString('en-IN')}` : '₹—';

const ProductDetailsScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<DetailsRouteProp>();
  const { mobileId } = route.params;

  const [activeTab, setActiveTab] =
    useState<'Product Details' | 'Owner Details'>('Product Details');
  const [data, setData] = useState<MobileDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getMobileById(mobileId);
        if (mounted) {
          setData(res);
          setError(null);
        }
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load details');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [mobileId]);

  const headerImage = useMemo(() => {
    const url = data?.images?.[0];
    if (url) return { uri: url };
    return require('../../assets/icons/Hyundai.png'); // fallback
  }, [data?.images]);

  const titleText =
    data?.title ||
    [data?.brand, data?.model].filter(Boolean).join(' ') ||
    `Mobile #${mobileId}`;

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8, color: '#666' }}>Loading details…</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: '#c00', marginBottom: 10 }}>
          {error || 'Unable to load details.'}
        </Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={async () => {
            try {
              setError(null);
              setLoading(true);
              const res = await getMobileById(mobileId);
              setData(res);
            } catch (e: any) {
              setError(e?.message || 'Failed to load details');
            } finally {
              setLoading(false);
            }
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with image */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../../assets/icons/left-arrow.png')}
            style={styles.iconImage}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => console.log('Share pressed')}
        >
          <Image
            source={require('../../assets/icons/send-icon.png')}
            style={styles.iconImage}
          />
        </TouchableOpacity>

        <Image source={headerImage} style={styles.carImage} resizeMode="cover" />
        {/* Seller view: no timer here */}
      </View>

      {/* Tabs (keep UI consistent, even if Owner Details is basic for now) */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'Product Details' && styles.activeToggleButton]}
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
          style={[styles.toggleButton, activeTab === 'Owner Details' && styles.activeToggleButton]}
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

      {/* Main content */}
      <ScrollView style={styles.content}>
        {/* Price + title */}
        <View style={styles.priceBox}>
          <View style={styles.priceRow}>
            <Text style={styles.carPrice}>
              {currencyINR(data.price)} {data.negotiable ? '(Negotiable)' : ''}
            </Text>
          </View>
          <Text style={styles.carTitle}>{titleText}</Text>
          {/* Seller view: no rating / location */}
        </View>

        {/* Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailsBox}>
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>Brand - {data.brand || '—'}</Text>
              <Text style={styles.detailText}>Model - {data.model || '—'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>Year - {data.yearOfPurchase ?? '—'}</Text>
              <Text style={styles.detailText}>Condition - {data.condition || '—'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>Color - {data.color || '—'}</Text>
              <Text style={styles.detailText}>Status - {data.status || '—'}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {data.description || 'No description provided.'}
          </Text>
        </View>

        {activeTab === 'Owner Details' && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>Owner Details</Text>
            <View style={styles.detailsBox}>
              <Text style={styles.detailText}>Seller ID - {data.sellerId ?? '—'}</Text>
              <Text style={styles.detailText}>Name - (coming soon)</Text>
              <Text style={styles.detailText}>Phone - (coming soon)</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate('ChatScreen')}
        >
          <Text style={styles.chatButtonText}>💬 Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bidButton} onPress={() => console.log('Start Bidding')}>
          <Text style={styles.bidButtonText}>Start Bidding</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { justifyContent: 'center', alignItems: 'center' },

  header: { height: 300, backgroundColor: '#fff', position: 'relative' },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  sendButton: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  iconImage: { width: 28, height: 28, tintColor: '#fff' },
  carImage: { width: '100%', height: '100%' },

  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  toggleButton: { paddingVertical: 10, paddingHorizontal: 20 },
  activeToggleButton: { borderBottomWidth: 2, borderBottomColor: '#4A90E2' },
  toggleButtonText: { fontSize: 16, fontWeight: '600', color: '#666' },
  activeToggleButtonText: { color: '#333' },

  content: { flex: 1, paddingHorizontal: 20 },
  priceBox: { backgroundColor: '#EAF3FA', borderRadius: 10, padding: 12, marginTop: 20 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  carPrice: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  carTitle: { fontSize: 16, color: '#333', marginTop: 5 },

  detailsSection: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  detailsBox: { backgroundColor: '#EAF3FA', borderRadius: 10, padding: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  detailText: { fontSize: 14, color: '#333', flex: 1 },

  descriptionSection: { marginTop: 10 },
  descriptionText: {
    fontSize: 14, color: '#666', backgroundColor: '#EAF3FA',
    lineHeight: 20, padding: 10, borderRadius: 8,
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
    flex: 1, paddingVertical: 15, backgroundColor: '#143444',
    borderRadius: 12, alignItems: 'center', marginRight: 10, bottom: 10,
    borderWidth: 1, borderColor: '#DDE3EB',
  },
  chatButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  bidButton: { flex: 1, paddingVertical: 15, backgroundColor: '#143444', borderRadius: 12, bottom: 10, alignItems: 'center' },
  bidButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },

  retryBtn: { backgroundColor: '#216DBD', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
});
