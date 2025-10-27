// // src/screens/MobileScreens/ProductDetailsScreen.tsx
// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Image,
//   NativeScrollEvent,
//   NativeSyntheticEvent,
//   ScrollView,
//   Share,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
//
// import { MyAdsStackParamList } from '../../navigation/MyAdsStack';
// import { getMobileById, MobileDetail } from '../../api/MobilesApi/productDetails';
// import { deleteMobile } from '../../api/MobilesApi/deleteMobile';
// import BottomSheet from '../../components/myads/BottomSheet';
// import BottomActionBar from '../../components/myadsflowcomponets/BottomActionBar';
// import MobileCardMenu from '../../components/mobiles/MobileCardMenu';
//
// type DetailsRouteProp = RouteProp<MyAdsStackParamList, 'ProductDetails'>;
// type NavProp = NativeStackNavigationProp<MyAdsStackParamList>;
//
// const { width: SCREEN_WIDTH } = Dimensions.get('window');
// const PLACEHOLDER_IMAGE = require('../../assets/icons/Hyundai.png');
//
// const currencyText = (value?: number) => {
//   if (typeof value === 'number') {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0,
//     }).format(value);
//   }
//   return 'Price on request';
// };
//
// type DetailRow = { label: string; value: string };
//
// const ProductDetailsScreen: React.FC = () => {
//   const navigation = useNavigation<NavProp>();
//   const { params } = useRoute<DetailsRouteProp>();
//   const { mobileId } = params;
//
//   const [data, setData] = useState<MobileDetail | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [sheetVisible, setSheetVisible] = useState(false);
//   const [deleting, setDeleting] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//
//   const pagerRef = useRef<ScrollView>(null);
//
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         setLoading(true);
//         const res = await getMobileById(mobileId);
//         if (mounted) {
//           setData(res);
//           setError(null);
//         }
//       } catch (e: any) {
//         if (mounted) {
//           const message = e?.response?.data?.message || e?.message || 'Failed to load details';
//           setError(message);
//         }
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//
//     return () => {
//       mounted = false;
//     };
//   }, [mobileId]);
//
//   const images = useMemo(() => {
//     return (data?.images || [])
//       .filter((uri): uri is string => typeof uri === 'string' && uri.trim().length > 0);
//   }, [data?.images]);
//
//   const titleText = useMemo(() => {
//     if (!data) return `Mobile #${mobileId}`;
//     if (data.title && data.title.trim().length > 0) return data.title;
//     const parts = [data.brand, data.model].filter((part) => part && String(part).trim().length > 0);
//     if (parts.length > 0) return parts.join(' ');
//     return `Mobile #${mobileId}`;
//   }, [data, mobileId]);
//
//   const priceText = useMemo(() => currencyText(data?.price), [data?.price]);
//
//   const metaLine = useMemo(() => {
//     if (!data) return undefined;
//     const pieces: string[] = [];
//     if (data.yearOfPurchase) pieces.push(`Purchased ${data.yearOfPurchase}`);
//     if (data.condition) pieces.push(data.condition);
//     if (pieces.length === 0) return undefined;
//     return pieces.join(' | ');
//   }, [data]);
//
//   const badgeLabel = data?.status || 'Status unavailable';
//
//   const productSection = useMemo<DetailRow[]>(() => {
//     if (!data) return [];
//     return [
//       { label: 'Brand', value: data.brand ?? '' },
//       { label: 'Model', value: data.model ?? '' },
//       { label: 'Colour', value: data.color ?? '' },
//       { label: 'Condition', value: data.condition ?? '' },
//       {
//         label: 'Year of Purchase',
//         value: data.yearOfPurchase != null ? String(data.yearOfPurchase) : '',
//       },
//     ].filter((row) => row.value && row.value.trim().length > 0);
//   }, [data]);
//
//   const detailSections = useMemo(() => {
//     return [
//       { title: 'Product Details', rows: productSection },
//     ].filter((section) => section.rows.length > 0);
//   }, [productSection]);
//
//   const descriptionText = data?.description?.trim();
//
//   const handleRetry = async () => {
//     try {
//       setError(null);
//       setLoading(true);
//       const res = await getMobileById(mobileId);
//       setData(res);
//     } catch (e: any) {
//       setError(e?.response?.data?.message || e?.message || 'Failed to load details');
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   const onShare = async () => {
//     try {
//       await Share.share({
//         message: `Check this mobile on CarYanam: ${titleText}`,
//       });
//     } catch {
//       /* share cancelled */
//     }
//   };
//
//   const handleEdit = () => {
//     setSheetVisible(false);
//     (navigation as any).navigate('UpdateMobile', { mobileId });
//   };
//
//   const confirmDelete = () => {
//     if (deleting) return;
//     Alert.alert(
//       'Delete mobile',
//       'Are you sure you want to delete this mobile?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               setDeleting(true);
//               await deleteMobile(mobileId);
//               setSheetVisible(false);
//               Alert.alert('Deleted', 'Mobile removed from your listings', [
//                 { text: 'OK', onPress: () => navigation.goBack() },
//               ]);
//             } catch (e: any) {
//               Alert.alert('Failed', e?.response?.data?.message || 'Unable to delete mobile');
//             } finally {
//               setDeleting(false);
//             }
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   };
//
//   const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
//     const x = event.nativeEvent.contentOffset.x;
//     const index = Math.round(x / SCREEN_WIDTH);
//     if (index !== currentIndex) setCurrentIndex(index);
//   };
//
//   if (loading) {
//     return (
//       <View style={[styles.container, styles.center]}>
//         <ActivityIndicator size="large" />
//         <Text style={styles.loadingText}>Loading mobile details...</Text>
//       </View>
//     );
//   }
//
//   if (error || !data) {
//     return (
//       <View style={[styles.container, styles.center, styles.contentPadding]}>
//         <Text style={styles.errorText}>{error || 'Unable to load details.'}</Text>
//         <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
//           <Text style={styles.retryText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }
//
//   return (
//     <View style={styles.container}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 110 }} // ensures content not hidden behind footer
//       >
//         <View style={styles.header}>
//           {images.length > 0 ? (
//             <>
//               <ScrollView
//                 ref={pagerRef}
//                 horizontal
//                 pagingEnabled
//                 showsHorizontalScrollIndicator={false}
//                 scrollEventThrottle={16}
//                 onScroll={onScroll}
//               >
//                 {images.map((uri, index) => (
//                   <Image
//                     // eslint-disable-next-line react/no-array-index-key
//                     key={`${uri}-${index}`}
//                     source={{ uri }}
//                     style={styles.headerImage}
//                     resizeMode="cover"
//                   />
//                 ))}
//               </ScrollView>
//
//               {images.length > 1 && (
//                 <View style={styles.dotsBar}>
//                   {images.map((_, index) => (
//                     <View
//                       // eslint-disable-next-line react/no-array-index-key
//                       key={`dot-${index}`}
//                       style={[styles.dot, index === currentIndex && styles.dotActive]}
//                     />
//                   ))}
//                 </View>
//               )}
//             </>
//           ) : (
//             <Image source={PLACEHOLDER_IMAGE} style={styles.headerImage} resizeMode="cover" />
//           )}
//
//           <View style={styles.headerIcons}>
//             <TouchableOpacity style={styles.iconWrap} onPress={() => navigation.goBack()}>
//               <Icon name="arrow-left" size={22} color="#fff" />
//             </TouchableOpacity>
//             <View style={styles.iconCluster}>
//               <TouchableOpacity style={styles.iconWrap} onPress={onShare}>
//                 <Icon name="share-variant" size={20} color="#fff" />
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.iconWrap} onPress={() => setSheetVisible(true)}>
//                 <Icon name="dots-vertical" size={22} color="#fff" />
//               </TouchableOpacity>
//             </View>
//           </View>
//
//           <View style={styles.badge}>
//             <Text style={styles.badgeText}>{badgeLabel}</Text>
//           </View>
//         </View>
//
//         <View style={styles.content}>
//           <View style={styles.priceBox}>
//             <View style={styles.priceRow}>
//               <Text style={styles.priceText}>
//                 {priceText}
//                 {data.negotiable ? ' (Negotiable)' : ''}
//               </Text>
//             </View>
//             <Text style={styles.titleText}>{titleText}</Text>
//             {metaLine ? <Text style={styles.metaText}>{metaLine}</Text> : null}
//           </View>
//
//           {detailSections.map((section) => (
//             <View style={styles.section} key={section.title}>
//               <Text style={styles.sectionTitle}>{section.title}</Text>
//               <View style={styles.sectionBox}>
//                 {section.rows.map((row) => (
//                   <View style={styles.detailRow} key={row.label}>
//                     <Text style={styles.detailLabel}>{row.label}</Text>
//                     <Text style={styles.detailValue}>{row.value}</Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           ))}
//
//           {descriptionText ? (
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Description</Text>
//               <View style={[styles.sectionBox, styles.descriptionBox]}>
//                 <Text style={styles.descriptionText}>{descriptionText}</Text>
//               </View>
//             </View>
//           ) : null}
//
//           <View style={styles.bottomSpacer} />
//         </View>
//       </ScrollView>
//
//       <BottomActionBar
//         onChat={() => navigation.navigate('ChatScreen')}
//         onBid={() => console.log('Start Bidding')}
//       />
//
//       <BottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} height={0.3}>
//         <MobileCardMenu
//           title={titleText}
//           statusLabel={data.status}
//           onEdit={handleEdit}
//           onDelete={confirmDelete}
//         />
//       </BottomSheet>
//     </View>
//   );
// };
//
// export default ProductDetailsScreen;
//
// const DOT_SIZE = 8;
//
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   center: { justifyContent: 'center', alignItems: 'center' },
//   contentPadding: { paddingHorizontal: 32 },
//   loadingText: { marginTop: 8, color: '#666' },
//   errorText: { color: '#c00', marginBottom: 16, textAlign: 'center' },
//   retryBtn: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: '#216DBD',
//     borderRadius: 8,
//   },
//   retryText: { color: '#fff', fontWeight: '600' },
//   header: {
//     height: 300,
//     backgroundColor: '#111',
//     position: 'relative',
//   },
//   headerImage: {
//     width: SCREEN_WIDTH,
//     height: '100%',
//   },
//   headerIcons: {
//     position: 'absolute',
//     top: 20,
//     left: 16,
//     right: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   iconCluster: {
//     flexDirection: 'row',
//     gap: 14,
//   },
//   iconWrap: {
//     backgroundColor: 'rgba(0,0,0,0.45)',
//     height: 36,
//     width: 36,
//     borderRadius: 18,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   dotsBar: {
//     position: 'absolute',
//     bottom: 12,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 6,
//   },
//   dot: {
//     width: DOT_SIZE,
//     height: DOT_SIZE,
//     borderRadius: DOT_SIZE / 2,
//     backgroundColor: 'rgba(255,255,255,0.5)',
//   },
//   dotActive: {
//     backgroundColor: '#fff',
//     transform: [{ scale: 1.15 }],
//   },
//   badge: {
//     position: 'absolute',
//     bottom: 18,
//     left: 20,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     backgroundColor: 'rgba(0,0,0,0.55)',
//     borderRadius: 16,
//   },
//   badgeText: { color: '#fff', fontWeight: '600' },
//   content: {
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 10,
//     gap: 20,
//   },
//   priceBox: {
//     backgroundColor: '#EAF3FA',
//     borderRadius: 12,
//     padding: 16,
//     gap: 6,
//   },
//   priceRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   priceText: { fontSize: 24, fontWeight: '700', color: '#143444' },
//   titleText: { fontSize: 18, fontWeight: '600', color: '#143444' },
//   metaText: { fontSize: 13, color: '#4F6575' },
//   section: { gap: 10 },
//   sectionTitle: { fontSize: 18, fontWeight: '700', color: '#143444' },
//   sectionBox: {
//     backgroundColor: '#F3F7FB',
//     borderRadius: 12,
//     paddingVertical: 10,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//   },
//   detailLabel: { fontSize: 14, color: '#52616B', flex: 0.5 },
//   detailValue: { fontSize: 14, color: '#143444', flex: 0.5, textAlign: 'right' },
//   descriptionBox: {
//     paddingHorizontal: 16,
//   },
//   descriptionText: { fontSize: 14, lineHeight: 20, color: '#143444' },
//   bottomSpacer: { height: 20 },
// });

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
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MyAdsStackParamList } from '../../navigation/MyAdsStack';
import { getMobileById, MobileDetail } from '../../api/MobilesApi/productDetails';
import { deleteMobile } from '../../api/MobilesApi/deleteMobile';
import BottomSheet from '../../components/myads/BottomSheet';
import BottomActionBar from '../../components/myadsflowcomponets/BottomActionBar';
import MobileCardMenu from '../../components/mobiles/MobileCardMenu';

type DetailsRouteProp = RouteProp<MyAdsStackParamList, 'ProductDetails'>;
type NavProp = NativeStackNavigationProp<MyAdsStackParamList>;

const { width: INIT_SCREEN_WIDTH } = Dimensions.get('window');
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

type DetailRow = { label: string; value: string };

const ProductDetailsScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { params } = useRoute<DetailsRouteProp>();
  const { mobileId } = params;

  // 🔁 Responsive width + safe area
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const ACTION_BAR_HEIGHT = 96; // matches BottomActionBar height (padding + buttons)

  const [data, setData] = useState<MobileDetail | null>(null);
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
        const res = await getMobileById(mobileId);
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
  }, [mobileId]);

  const images = useMemo(() => {
    return (data?.images || []).filter(
      (uri): uri is string => typeof uri === 'string' && uri.trim().length > 0
    );
  }, [data?.images]);

  const titleText = useMemo(() => {
    if (!data) return `Mobile #${mobileId}`;
    if (data.title && data.title.trim().length > 0) return data.title;
    const parts = [data.brand, data.model].filter((part) => part && String(part).trim().length > 0);
    if (parts.length > 0) return parts.join(' ');
    return `Mobile #${mobileId}`;
  }, [data, mobileId]);

  const priceText = useMemo(() => currencyText(data?.price), [data?.price]);

  const metaLine = useMemo(() => {
    if (!data) return undefined;
    const pieces: string[] = [];
    if (data.yearOfPurchase) pieces.push(`Purchased ${data.yearOfPurchase}`);
    if (data.condition) pieces.push(data.condition);
    if (pieces.length === 0) return undefined;
    return pieces.join(' | ');
  }, [data]);

  const badgeLabel = data?.status || 'Status unavailable';

  const productSection = useMemo<DetailRow[]>(() => {
    if (!data) return [];
    return [
      { label: 'Brand', value: data.brand ?? '' },
      { label: 'Model', value: data.model ?? '' },
      { label: 'Colour', value: data.color ?? '' },
      { label: 'Condition', value: data.condition ?? '' },
      {
        label: 'Year of Purchase',
        value: data.yearOfPurchase != null ? String(data.yearOfPurchase) : '',
      },
    ].filter((row) => row.value && row.value.trim().length > 0);
  }, [data]);

  const detailSections = useMemo(() => {
    return [{ title: 'Product Details', rows: productSection }].filter(
      (section) => section.rows.length > 0
    );
  }, [productSection]);

  const descriptionText = data?.description?.trim();

  const handleRetry = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await getMobileById(mobileId);
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
        message: `Check this mobile on CarYanam: ${titleText}`,
      });
    } catch {
      /* share cancelled */
    }
  };

  const handleEdit = () => {
    setSheetVisible(false);
    (navigation as any).navigate('UpdateMobile', { mobileId });
  };

  const confirmDelete = () => {
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
              await deleteMobile(mobileId);
              setSheetVisible(false);
              Alert.alert('Deleted', 'Mobile removed from your listings', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (e: any) {
              Alert.alert('Failed', e?.response?.data?.message || 'Unable to delete mobile');
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / (width || INIT_SCREEN_WIDTH));
    if (index !== currentIndex) setCurrentIndex(index);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading mobile details...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={[styles.container, styles.center, styles.contentPadding]}>
        <Text style={styles.errorText}>{error || 'Unable to load details.'}</Text>
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
        contentContainerStyle={{
          paddingBottom: ACTION_BAR_HEIGHT + insets.bottom + 20, // ✅ adaptive padding to avoid overlap
        }}
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
                removeClippedSubviews
              >
                {images.map((uri, index) => (
                  <Image
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${uri}-${index}`}
                    source={{ uri }}
                    style={[styles.headerImage, { width }]} // ✅ responsive width
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
            <Image
              source={PLACEHOLDER_IMAGE}
              style={[styles.headerImage, { width }]} // ✅ responsive width
              resizeMode="cover"
            />
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
              <Text style={styles.priceText}>
                {priceText}
                {data.negotiable ? ' (Negotiable)' : ''}
              </Text>
            </View>
            <Text style={styles.titleText}>{titleText}</Text>
            {metaLine ? <Text style={styles.metaText}>{metaLine}</Text> : null}
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

          {descriptionText ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <View style={[styles.sectionBox, styles.descriptionBox]}>
                <Text style={styles.descriptionText}>{descriptionText}</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* ✅ fixed footer */}
      <BottomActionBar
        onChat={() => navigation.navigate('ChatScreen')}
        onBid={() => console.log('Start Bidding')}
      />

      <BottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} height={0.3}>
        <MobileCardMenu
          title={titleText}
          statusLabel={data.status}
          onEdit={handleEdit}
          onDelete={confirmDelete}
        />
      </BottomSheet>
    </View>
  );
};

export default ProductDetailsScreen;

const DOT_SIZE = 8;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { justifyContent: 'center', alignItems: 'center' },
  contentPadding: { paddingHorizontal: 32 },
  loadingText: { marginTop: 8, color: '#666' },
  errorText: { color: '#c00', marginBottom: 16, textAlign: 'center' },
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
    // width injected dynamically for responsiveness
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
  iconCluster: { flexDirection: 'row', gap: 14 },
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
  descriptionBox: { paddingHorizontal: 16 },
  descriptionText: { fontSize: 14, lineHeight: 20, color: '#143444' },
  bottomSpacer: { height: 20 },
});
