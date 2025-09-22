// src/components/RecommendationsSection.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface RecommendationsSectionProps {
  products: Product[];
  onProductPress: (product: Product) => void;
  onSeeAllPress: () => void;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  products,
  onProductPress,
  onSeeAllPress,
}) => {
  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard product={item} onPress={onProductPress} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        <TouchableOpacity style={styles.seeAllButton} onPress={onSeeAllPress}>
          <Text style={styles.seeAllText}>+ Ad</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        scrollEnabled={false}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  seeAllText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  row: {
    justifyContent: 'space-between',
  },
  grid: {
    paddingBottom: 20,
  },
});

export default RecommendationsSection;
