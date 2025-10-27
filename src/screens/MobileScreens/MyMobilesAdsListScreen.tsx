import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MyMobileAdsStackParamList } from '../../navigation/MyMobileAdsStack';
import { getAllMobiles } from '../../api/MobilesApi/getAllMobiles';
import { deleteMobile } from '../../api/MobilesApi/deleteMobile';

import MobileCard from '../../components/mobiles/MobileCard';
import MobileCardMenu from '../../components/mobiles/MobileCardMenu';
import BottomSheet from '../../components/myads/BottomSheet';

type NavigationProp = NativeStackNavigationProp<MyMobileAdsStackParamList>;

type ApiMobile = {
  mobileId: number;
  title: string;
  description?: string;
  price: number;
  negotiable?: boolean;
  condition?: string;
  brand?: string;
  model?: string;
  color?: string;
  yearOfPurchase?: number;
  status?: 'ACTIVE' | 'DRAFT' | 'SOLD' | string;
  createdAt?: string;
  updatedAt?: string | null;
  sellerId?: number;
  images?: string[];
};

const INR = (v: number) => {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(v);
  } catch {
    return `₹${Math.round(v).toLocaleString('en-IN')}`;
  }
};

const TABS = ['Live', 'Upcoming', 'Completed'] as const;
type Tab = typeof TABS[number];

const MyMobilesAdsListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedTab, setSelectedTab] = useState<Tab>('Live');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [mobiles, setMobiles] = useState<ApiMobile[]>([]);

  // menu state
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedMobile, setSelectedMobile] = useState<ApiMobile | null>(null);

  // local flag to avoid double delete taps
  const [deleting, setDeleting] = useState(false);

  const fetchData = async (reset = false) => {
    if (loading && !reset) return;
    try {
      if (reset) {
        setPage(0);
        setHasMore(true);
      }
      setLoading(true);
      const res = await getAllMobiles({
        page: reset ? 0 : page,
        size: 20,
        sort: 'createdAt,DESC',
      });
      setHasMore(res?.last === false);
      setPage((p) => (reset ? 1 : p + 1));
      setMobiles((prev) => (reset ? res.content : [...prev, ...res.content]));
    } catch (e) {
      console.warn('getAllMobiles error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Refetch when screen gains focus
  useFocusEffect(
    useCallback(() => {
      fetchData(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(true);
    setRefreshing(false);
  };

  const filtered = useMemo(() => {
    if (selectedTab === 'Live') return mobiles.filter((m) => m.status === 'ACTIVE');
    if (selectedTab === 'Completed') return mobiles.filter((m) => m.status === 'SOLD');
    return mobiles.filter((m) => m.status && m.status !== 'ACTIVE' && m.status !== 'SOLD');
  }, [mobiles, selectedTab]);

  // open/close menu
  const openMenuFor = (m: ApiMobile) => {
    setSelectedMobile(m);
    setMenuOpen(true);
  };
  const closeMenu = () => {
    setMenuOpen(false);
    setSelectedMobile(null);
  };

  const handleEdit = () => {
    if (!selectedMobile) return;
    (navigation as any).navigate('UpdateMobile', { mobileId: selectedMobile.mobileId });
    closeMenu();
  };

  const handleDelete = () => {
    if (!selectedMobile || deleting) return;

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
              await deleteMobile(selectedMobile.mobileId);
              await fetchData(true);
              Alert.alert('Deleted', 'Mobile soft-deleted');
            } catch (e: any) {
              Alert.alert('Failed', e?.response?.data?.message ?? 'Please try again');
            } finally {
              setDeleting(false);
              closeMenu();
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderAdCard = ({ item }: { item: ApiMobile }) => {
    const primaryImage = item.images?.[0]
      ? { uri: item.images[0] }
      : require('../../assets/icons/Hyundai.png');

    const titleText = item.title || 'Untitled Mobile';
    const subtitleText = [item.brand, item.yearOfPurchase?.toString()].filter(Boolean).join(' • ');

    return (
      <MobileCard
        image={primaryImage}
        priceText={INR(item.price)}
        title={titleText}
        subtitle={subtitleText}
        location="Pune"
        badgeText={item.status === 'ACTIVE' ? 'Live' : (item.status ?? 'Info')}
        onPress={() => navigation.navigate('ProductDetails', { mobileId: item.mobileId })}
        onMenuPress={() => openMenuFor(item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Mobile Ads</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const isSelected = selectedTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, isSelected && styles.tabSelected]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>
                {tab} Mobiles
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Ads Grid */}
      {loading && mobiles.length === 0 ? (
        <View style={{ paddingTop: 40 }}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.mobileId)}
          renderItem={renderAdCard}
          numColumns={2}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.3}
          onEndReached={() => {
            if (hasMore && !loading) fetchData(false);
          }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            !loading ? (
              <View style={{ padding: 24 }}>
                <Text>No mobiles found.</Text>
              </View>
            ) : null
          }
        />
      )}

      {/* Bottom Sheet Menu */}
      <BottomSheet visible={menuOpen} onClose={closeMenu} height={0.28}>
        <MobileCardMenu
          title={selectedMobile?.title}
          statusLabel={selectedMobile?.status}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </BottomSheet>
    </View>
  );
};

export default MyMobilesAdsListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#000' },
  tabRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, paddingVertical: 12 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#F0F0F0' },
  tabSelected: { backgroundColor: '#216DBD' },
  tabText: { color: '#333', fontSize: 13 },
  tabTextSelected: { color: '#fff', fontWeight: '500' },
  grid: { paddingHorizontal: 10, paddingBottom: 20 },
});
