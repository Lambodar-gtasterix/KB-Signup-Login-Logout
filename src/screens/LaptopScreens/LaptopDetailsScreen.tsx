// src/screens/LaptopScreens/LaptopDetailsScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { MyLaptopAdsStackParamList } from '../../navigation/MyLaptopAdsStack';
import { deleteLaptop } from '../../api/LaptopsApi/deleteLaptop';
import { getLaptopById, LaptopDetail } from '../../api/LaptopsApi/getLaptopById';
import BottomSheet from '../../components/myads/BottomSheet';
import BottomActionBar from '../../components/myadsflowcomponets/BottomActionBar';
import LaptopCardMenu from '../../components/laptops/LaptopCardMenu';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type DetailsRouteProp = RouteProp<MyLaptopAdsStackParamList, 'LaptopDetails'>;
type NavProp = NativeStackNavigationProp<MyLaptopAdsStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PLACEHOLDER_IMAGE = require('../../assets/icons/Hyundai.png');

const currencyText = (value?: number) => {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  }
  return 'Price on request';
};

const LaptopDetailsScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { params } = useRoute<DetailsRouteProp>();
  const { laptopId } = params;
  const insets = useSafeAreaInsets();
  const ACTION_BAR_HEIGHT = 96;

  const [data, setData] = useState<LaptopDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const pagerRef = useRef<ScrollView>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getLaptopById(laptopId);
        if (mounted) {
          setData(res);
          setError(null);
        }
      } catch (e: any) {
        if (mounted) {
          const message = e?.response?.data?.message || e?.message || 'Failed to load details';
          setError(message);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [laptopId]);

  const images = useMemo(() => {
    return (data?.laptopPhotos || [])
      .map((photo) => photo?.photo_link)
      .filter((uri): uri is string => typeof uri === 'string' && uri.trim().length > 0);
  }, [data?.laptopPhotos]);

  const titleText = useMemo(() => {
    if (!data) return `Laptop #${laptopId}`;
    const parts = [data.brand, data.model].filter((part) => !!part && String(part).trim().length > 0);
    if (parts.length > 0) return parts.join(' ');
    if (data.serialNumber) return data.serialNumber;
    return `Laptop #${laptopId}`;
  }, [data, laptopId]);

  const handleRetry = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await getLaptopById(laptopId);
      setData(res);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load details');
    } finally {
      setLoading(false);
    }
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `Check this laptop on CarYanam: ${titleText}`,
      });
    } catch {
      /* share cancelled */
    }
  };

  const handleEdit = () => {
    setSheetVisible(false);
    navigation.navigate('UpdateLaptop', { laptopId });
  };

  const confirmDelete = () => {
    if (deleting) return;
    Alert.alert(
      'Delete laptop',
      'Are you sure you want to delete this laptop?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              await deleteLaptop(laptopId);
              setSheetVisible(false);
              Alert.alert('Deleted', 'Laptop removed from your listings', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (e: any) {
              Alert.alert('Failed', e?.response?.data?.message || 'Unable to delete laptop');
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const priceText = useMemo(() => currencyText(data?.price), [data?.price]);

  const badgeLabel = data?.status || 'Status unavailable';

  const productSection = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'Brand', value: data.brand },
      { label: 'Model', value: data.model },
      { label: 'Colour', value: data.colour },
      { label: 'Manufacturer', value: data.manufacturer },
      {
        label: 'Warranty',
        value: data.warrantyInYear != null ? `${data.warrantyInYear} year(s)` : undefined,
      },
      { label: 'Serial Number', value: data.serialNumber },
    ].filter((row) => row.value && String(row.value).trim().length > 0);
  }, [data]);

  const specificationSection = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'Processor', value: data.processor },
      { label: 'Processor Brand', value: data.processorBrand },
      { label: 'Memory Type', value: data.memoryType },
      { label: 'RAM', value: data.ram },
      { label: 'Storage', value: data.storage },
      { label: 'Graphics Card', value: data.graphicsCard },
      { label: 'Graphic Brand', value: data.graphicBrand },
      { label: 'Screen Size', value: data.screenSize },
      { label: 'Battery', value: data.battery },
      { label: 'Battery Life', value: data.batteryLife },
      { label: 'Weight', value: data.weight },
      {
        label: 'USB Ports',
        value:
          data.usbPorts != null && !Number.isNaN(data.usbPorts) ? String(data.usbPorts) : undefined,
      },
    ].filter((row) => row.value && String(row.value).trim().length > 0);
  }, [data]);

  const detailSections = useMemo(() => {
    return [
      { title: 'Product Details', rows: productSection },
      { title: 'Specifications', rows: specificationSection },
    ].filter((section) => section.rows.length > 0);
  }, [productSection, specificationSection]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / SCREEN_WIDTH);
    if (index !== currentIndex) setCurrentIndex(index);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading laptop details...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error || 'Unable to load laptop details.'}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: ACTION_BAR_HEIGHT + insets.bottom + 20 }}
      >
        <View style={styles.header}>
          {images.length > 0 ? (
            <>
              <ScrollView
                ref={pagerRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={onScroll}
              >
                {images.map((uri, index) => (
                  <Image
                    key={`${uri}-${index}`}
                    source={{ uri }}
                    style={styles.headerImage}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
              {images.length > 1 && (
                <View style={styles.dotsBar}>
                  {images.map((_, index) => (
                    <View
                      // eslint-disable-next-line react/no-array-index-key
                      key={`dot-${index}`}
                      style={[styles.dot, index === currentIndex && styles.dotActive]}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <Image source={PLACEHOLDER_IMAGE} style={styles.headerImage} resizeMode="cover" />
          )}

          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconWrap} onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={22} color="#fff" />
            </TouchableOpacity>
            <View style={styles.iconCluster}>
              <TouchableOpacity style={styles.iconWrap} onPress={onShare}>
                <Icon name="share-variant" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconWrap} onPress={() => setSheetVisible(true)}>
                <Icon name="dots-vertical" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeLabel}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.priceBox}>
            <View style={styles.priceRow}>
              <Text style={styles.priceText}>{priceText}</Text>
              {!!data.screenSize && <Text style={styles.metaText}>{data.screenSize}</Text>}
            </View>
            <Text style={styles.titleText}>{titleText}</Text>
            {!!data.serialNumber && (
              <Text style={styles.metaText}>Serial No: {data.serialNumber}</Text>
            )}
          </View>

          {detailSections.map((section) => (
            <View style={styles.section} key={section.title}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionBox}>
                {section.rows.map((row) => (
                  <View style={styles.detailRow} key={row.label}>
                    <Text style={styles.detailLabel}>{row.label}</Text>
                    <Text style={styles.detailValue}>{row.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      <BottomActionBar
        onChat={() => navigation.navigate('ChatScreen')}
        onBid={() => console.log('Start Bidding')}
      />

      <BottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} height={0.3}>
        <LaptopCardMenu
          title={titleText}
          statusLabel={data.status}
          onEdit={handleEdit}
          onDelete={confirmDelete}
        />
      </BottomSheet>
    </View>
  );
};

export default LaptopDetailsScreen;

const DOT_SIZE = 8;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 8, color: '#666' },
  errorText: { color: '#c00', marginBottom: 16, textAlign: 'center', paddingHorizontal: 32 },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#216DBD',
    borderRadius: 8,
  },
  retryText: { color: '#fff', fontWeight: '600' },
  header: {
    height: 300,
    backgroundColor: '#111',
    position: 'relative',
  },
  headerImage: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  headerIcons: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconCluster: {
    flexDirection: 'row',
    gap: 14,
  },
  iconWrap: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsBar: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
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
    transform: [{ scale: 1.15 }],
  },
  badge: {
    position: 'absolute',
    bottom: 18,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 16,
  },
  badgeText: { color: '#fff', fontWeight: '600' },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    gap: 20,
  },
  priceBox: {
    backgroundColor: '#EAF3FA',
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: { fontSize: 24, fontWeight: '700', color: '#143444' },
  titleText: { fontSize: 18, fontWeight: '600', color: '#143444' },
  metaText: { fontSize: 13, color: '#4F6575' },
  section: { gap: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#143444' },
  sectionBox: {
    backgroundColor: '#F3F7FB',
    borderRadius: 12,
    paddingVertical: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  detailLabel: { fontSize: 14, color: '#52616B', flex: 0.5 },
  detailValue: { fontSize: 14, color: '#143444', flex: 0.5, textAlign: 'right' },
  bottomSpacer: { height: 20 },
});
