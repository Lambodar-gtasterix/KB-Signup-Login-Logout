// src/components/CategoryGrid.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Category } from '../types';

interface CategoryGridProps {
  categories: Category[];
  onCategoryPress: (category: Category) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, onCategoryPress }) => {
  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => onCategoryPress(item)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
        <Icon name={item.icon} size={24} color="#ffffff" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        numColumns={4}
        scrollEnabled={false}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  grid: {
    justifyContent: 'space-between',
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
    maxWidth: '25%',
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
});

export default CategoryGrid;
