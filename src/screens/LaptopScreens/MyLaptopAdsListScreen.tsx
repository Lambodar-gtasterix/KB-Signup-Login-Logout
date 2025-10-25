// src/screens/laptopscreens/MyLaptopAdsListScreen.tsx
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
  ImageSourcePropType,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MyLaptopAdsStackParamList } from '../../navigation/MyLaptopAdsStack';
import { getAllLaptops, LaptopItem } from '../../api/LaptopsApi/getAllLaptops';
import { deleteLaptop } from '../../api/LaptopsApi/deleteLaptop';

import ListingCard from '../../components/myads/ListingCard';
import ListingCardMenu from '../../components/myads/ListingCardMenu';
import BottomSheet from '../../components/myads/BottomSheet';

type NavigationProp = NativeStackNavigationProp<MyLaptopAdsStackParamList>;

const INR = (v: number) => {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(v || 0);
  } catch {
    return `₹${Math.round((v || 0)).toLocaleString('en-IN')}`;
  }
};

const TABS = ['Live', 'Upcoming', 'Completed'] as const;
type Tab = typeof TABS[number];

const MyLaptopAdsListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [selectedTab, setSelectedTab] = useState<Tab>('Live');
  const [laptops, setLaptops] = useState<LaptopItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // menu
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedLaptop, setSelectedLaptop] = useState<LaptopItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await getAllLaptops(); // plain array
      setLaptops(data);
    } catch (e) {
      console.warn('getAllLaptops error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // refetch when screen regains focus (after update/delete)
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const filtered = useMemo(() => {
    if (selectedTab === 'Live') return laptops.filter((l) => l.status === 'ACTIVE');
    if (selectedTab === 'Completed') return laptops.filter((l) => l.status === 'SOLD');
    // Upcoming = anything not ACTIVE/SOLD (adjust as your business rules)
    return laptops.filter((l) => l.status && l.status !== 'ACTIVE' && l.status !== 'SOLD');
  }, [laptops, selectedTab]);

  const openMenuFor = (l: LaptopItem) => {
    setSelectedLaptop(l);
    setMenuOpen(true);
  };
  const closeMenu = () => {
    setMenuOpen(false);
    setSelectedLaptop(null);
  };

  const handleEdit = () => {
    if (!selectedLaptop) return;
    (navigation as any).navigate('UpdateLaptop', { laptopId: selectedLaptop.id }); // backend uses "id"
    closeMenu();
  };

  const handleDelete = () => {
    if (!selectedLaptop || deleting) return;

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
              await deleteLaptop(selectedLaptop.id); // pass the numeric id
              await fetchData();
              Alert.alert('Deleted', 'Laptop soft-deleted');
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

  const resolveImage = (item: LaptopItem): ImageSourcePropType => {
    const url = item.laptopPhotos?.[0]?.photo_link ?? '';
    if (url) return { uri: url };
    return require('../../assets/icons/Hyundai.png'); // fallback placeholder
  };

  const renderCard = ({ item }: { item: LaptopItem }) => {
    const titleText =
      [item.brand, item.model].filter(Boolean).join(' ') || `Laptop #${item.id}`;
    const subtitleText = [item.brand, item.processor].filter(Boolean).join(' • ');

    return (
      <ListingCard
        image={resolveImage(item)}
        priceText={INR(item.price || 0)}
        title={titleText}
        subtitle={subtitleText}
        location="Pune"
        badgeText={item.status === 'ACTIVE' ? 'Live' : (item.status as string) || 'Info'}
        onPress={() => navigation.navigate('LaptopDetails', { laptopId: item.id })}
        onMenuPress={() => openMenuFor(item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Header (kept consistent) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Laptop Ads</Text>
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
                {tab} Laptops
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Grid */}
      {loading && laptops.length === 0 ? (
        <View style={{ paddingTop: 40 }}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}   // backend id
          renderItem={renderCard}
          numColumns={2}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            !loading ? (
              <View style={{ padding: 24 }}>
                <Text>No laptops found.</Text>
              </View>
            ) : null
          }
        />
      )}

      {/* 3-dot BottomSheet */}
      <BottomSheet visible={menuOpen} onClose={closeMenu} height={0.28}>
        <ListingCardMenu
          title={
            selectedLaptop
              ? [selectedLaptop.brand, selectedLaptop.model].filter(Boolean).join(' ')
              : undefined
          }
          statusLabel={selectedLaptop?.status as string | undefined}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </BottomSheet>
    </View>
  );
};

export default MyLaptopAdsListScreen;

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
