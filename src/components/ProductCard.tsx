// src/components/ProductCard.tsx
import React from 'react';
import { View,Text,Image,TouchableOpacity,StyleSheet,Dimensions,} from 'react-native';
import { Product } from '../types';
const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 60 for padding and spacing
interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}
const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(product)}
    >
      <Image 
        source={typeof product.image === 'string' ? { uri: product.image } : product.image} 
        style={styles.image} 
      />
      <View style={styles.content}>
        <Text style={styles.price}>{product.price}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  }, 
  content: {
    padding: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 18,
  },
});
export default ProductCard;
