// src/hooks/useMyAdsStatusFilter.ts
import { useMemo, useState } from 'react';

import { MY_ADS_TABS, MyAdsTabLabel } from '../screens/MyAds/common/MyAdsListLayout';

type Options<ItemT> = {
  items: ItemT[];
  getStatus: (item: ItemT) => string | undefined | null;
};

export const useMyAdsStatusFilter = <ItemT,>({ items, getStatus }: Options<ItemT>) => {
  const [selectedTab, setSelectedTab] = useState<MyAdsTabLabel>('Live');

  const filtered = useMemo(() => {
    if (selectedTab === 'Live') {
      return items.filter((item) => getStatus(item) === 'ACTIVE');
    }
    if (selectedTab === 'Completed') {
      return items.filter((item) => getStatus(item) === 'SOLD');
    }
    return items.filter((item) => {
      const status = getStatus(item);
      return status && status !== 'ACTIVE' && status !== 'SOLD';
    });
  }, [items, selectedTab, getStatus]);

  return {
    tabs: MY_ADS_TABS,
    selectedTab,
    setSelectedTab,
    filtered,
  };
};
