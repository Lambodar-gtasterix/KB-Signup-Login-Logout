// src/screens/MobileScreens/ProductDetailsScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Share,
  Alert,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MyAdsStackParamList } from '../../navigation/MyAdsStack';
import { getMobileById, MobileDetail } from '../../api/MobilesApi/productDetails';

import BottomSheet from '../../components/myads/BottomSheet';
import MobileCardMenu from '../../components/mobiles/MobileCardMenu';
import { deleteMobile } from '../../api/MobilesApi/deleteMobile';

type DetailsRouteProp = RouteProp<MyAdsStackParamList, 'ProductDetails'>;
type NavProp = NativeStackNavigationProp<MyAdsStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

  // BottomSheet state
  const [sheetVisible, setSheetVisible] = useState(false);

  // guard to prevent double delete taps
  const [deleting, setDeleting] = useState(false);

  // image pager state
  const [currentIndex, setCurrentIndex] = useState(0);
  const pagerRef = useRef<ScrollView>(null);

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

  // compute image list (keep only valid strings)
  const imageUris = useMemo(() => {
    const urls = (data?.images || []).filter(
      (u) => typeof u === 'string' && u.trim().length > 0
    );
    return urls;
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

  // Built-in RN Share
  const onShare = async () => {
    try {
      await Share.share({
        message: `${titleText} — check this mobile on CarYanam!`,
      });
    } catch {
      /* user cancelled */
    }
  };

  const handleUpdate = () => {
    (navigation as any).navigate('UpdateMobile', { mobileId });
    setSheetVisible(false);
  };

  const handleDelete = () => {
    if (deleting) return;
    Alert.alert(
      'Delete mobile',
      'Are you sure you want to delete this mobile?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              await deleteMobile(mobileId); // DELETE /api/v1/mobiles/delete/{id}
              setSheetVisible(false);
              Alert.alert('Deleted', 'Mobile soft-deleted', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (e: any) {
              Alert.alert('Failed', e?.response?.data?.message ?? 'Please try again');
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // pager handler
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / SCREEN_WIDTH);
    if (idx !== currentIndex) setCurrentIndex(idx);
  };

  return (
    <View style={styles.container}>
      {/* HEADER: Swipeable image pager (height kept 300) */}
      <View style={styles.header}>
        {imageUris.length > 0 ? (
          <>
            <ScrollView
              ref={pagerRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={onScroll}
              scrollEventThrottle={16}
              bounces
            >
              {imageUris.map((uri, idx) => (
                <Image
                  key={uri + idx}
                  source={{ uri }}
                  style={styles.carImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>

            {/* dot indicators — show only if multiple images */}
            {imageUris.length > 1 && (
              <View style={styles.dotsBar}>
                {imageUris.map((_, i) => (
                  <View
                    key={`dot-${i}`}
                    style={[styles.dot, i === currentIndex && styles.dotActive]}
                  />
                ))}
              </View>
            )}
          </>
        ) : (
          <Image
            source={require('../../assets/icons/Hyundai.png')}
            style={styles.carImage}
            resizeMode="cover"
          />
        )}

        {/* Right-side: Share + 3-dot menu */}
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={onShare} style={styles.iconWrap} activeOpacity={0.8}>
            <Icon name="share-variant" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSheetVisible(true)} style={styles.iconWrap} activeOpacity={0.8}>
            <Icon name="dots-vertical" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
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

      {/* Bottom Sheet for Update/Delete */}
      <BottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} height={0.28}>
        <MobileCardMenu
          title={titleText}
          statusLabel={data?.status}
          onEdit={handleUpdate}
          onDelete={handleDelete}
        />
      </BottomSheet>
    </View>
  );
};

export default ProductDetailsScreen;

const DOT_SIZE = 7;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { justifyContent: 'center', alignItems: 'center' },

  // header height kept same (300)
  header: { height: 300, backgroundColor: '#fff', position: 'relative' },
  carImage: { width: SCREEN_WIDTH, height: '100%' },

  // Right-side icon cluster over image (share + menu)
  headerIcons: {
    position: 'absolute',
    top: 20,
    right: 15,
    flexDirection: 'row',
    zIndex: 10,
    gap: 14,
  },
  iconWrap: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // dots
  dotsBar: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    height: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    backgroundColor: '#fff',
    transform: [{ scale: 1.1 }],
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
  chatButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  bidButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: '#143444',
    borderRadius: 12,
    bottom: 10,
    alignItems: 'center',
  },
  bidButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },

  retryBtn: { backgroundColor: '#216DBD', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
});
