import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  listingUpdateStyles as styles,
  LISTING_UPDATE_COLORS as COLORS,
} from '../../theme/listingUpdate';

interface ListingUpdateLoaderProps {
  message: string;
}

const ListingUpdateLoader: React.FC<ListingUpdateLoaderProps> = ({ message }) => (
  <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
    <View style={[styles.container, styles.center]}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  </SafeAreaView>
);

export default ListingUpdateLoader;
