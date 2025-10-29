// src/screens/MyAds/common/MyAdsListLayout.tsx
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import BottomSheet from '../../../components/myads/BottomSheet';

export const MY_ADS_TABS = ['Live', 'Upcoming', 'Completed'] as const;
export type MyAdsTabLabel = (typeof MY_ADS_TABS)[number];

type MyAdsListLayoutProps<ItemT> = {
  title: string;
  tabLabelSuffix: string;
  selectedTab: MyAdsTabLabel;
  onTabChange: (tab: MyAdsTabLabel) => void;
  data: ItemT[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  renderItem: ListRenderItem<ItemT>;
  keyExtractor: FlatListProps<ItemT>['keyExtractor'];
  emptyMessage?: string;
  onBack: () => void;
  headerRight?: React.ReactNode;
  menuContent: React.ReactNode;
  menuVisible: boolean;
  onCloseMenu: () => void;
  bottomSheetHeight?: number;
  listProps?: Partial<
    Omit<
      FlatListProps<ItemT>,
      'data' | 'renderItem' | 'keyExtractor' | 'refreshControl' | 'ListEmptyComponent'
    >
  >;
  isInitialLoading?: boolean;
};

const MyAdsListLayout = <ItemT,>({
  title,
  tabLabelSuffix,
  selectedTab,
  onTabChange,
  data,
  loading,
  refreshing,
  onRefresh,
  renderItem,
  keyExtractor,
  emptyMessage = 'No ads found.',
  onBack,
  headerRight,
  menuContent,
  menuVisible,
  onCloseMenu,
  bottomSheetHeight = 0.28,
  listProps,
  isInitialLoading,
}: MyAdsListLayoutProps<ItemT>) => {
  const {
    contentContainerStyle,
    numColumns,
    ListFooterComponent,
    ...restListProps
  } = listProps || {};

  const effectiveInitialLoading =
    typeof isInitialLoading === 'boolean' ? isInitialLoading : loading && data.length === 0;

  const effectiveFooter =
    ListFooterComponent ??
    ((loading && data.length > 0) ? (
      <View style={styles.footerLoader}>
        <ActivityIndicator />
      </View>
    ) : null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerTrailing}>{headerRight ?? null}</View>
      </View>

      <View style={styles.tabRow}>
        {MY_ADS_TABS.map((tab) => {
          const isSelected = selectedTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, isSelected && styles.tabSelected]}
              onPress={() => onTabChange(tab)}
            >
              <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>
                {tab} {tabLabelSuffix}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {effectiveInitialLoading ? (
        <View style={styles.initialLoader}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={numColumns ?? 2}
          contentContainerStyle={[styles.grid, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>{emptyMessage}</Text>
              </View>
            ) : null
          }
          ListFooterComponent={effectiveFooter}
          {...restListProps}
        />
      )}

      <BottomSheet visible={menuVisible} onClose={onCloseMenu} height={bottomSheetHeight}>
        {menuContent}
      </BottomSheet>
    </View>
  );
};

export default MyAdsListLayout;

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
  headerTrailing: { width: 24, minHeight: 24, alignItems: 'flex-end', justifyContent: 'center' },
  tabRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, paddingVertical: 12 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#F0F0F0' },
  tabSelected: { backgroundColor: '#216DBD' },
  tabText: { color: '#333', fontSize: 13 },
  tabTextSelected: { color: '#fff', fontWeight: '500' },
  initialLoader: { paddingTop: 40 },
  emptyState: { padding: 24, alignItems: 'center' },
  emptyText: { color: '#333' },
  grid: { paddingHorizontal: 10, paddingBottom: 20 },
  footerLoader: { paddingVertical: 16 },
});
