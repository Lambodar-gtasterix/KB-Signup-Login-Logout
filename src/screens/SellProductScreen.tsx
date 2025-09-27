import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SellProductStackParamList } from '../navigation/SellProductStack';

type SellProductScreenNavigationProp = NativeStackNavigationProp<
  SellProductStackParamList,
  'SellProduct'
>;

const SellProductScreen: React.FC = () => {
  const navigation = useNavigation<SellProductScreenNavigationProp>();
  const [pressedItem, setPressedItem] = useState<string | null>(null);

  const renderItem = (label: string, icon: string, onPress?: () => void) => (
    <Pressable
      onPressIn={() => setPressedItem(label)}
      onPressOut={() => setPressedItem(null)}
      onPress={onPress}
      style={[
        styles.item,
        pressedItem === label && styles.selectedItem, // apply blue when pressed
      ]}
    >
      <Icon
        name={icon}
        size={30}
        color={pressedItem === label ? 'white' : 'black'}
      />
      <Text
        style={[
          styles.itemText,
          pressedItem === label && styles.selectedText,
        ]}
      >
        + Add {label}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What are you Selling?</Text>
      <Text style={styles.subtitle}>Add Product</Text>
      <Text style={styles.description}>
        Lorem ipsum dolor sit amet consectetur ipsum
        massa turpis monti plotov. Vitae habitant duis
      </Text>

      <View style={styles.grid}>
        {renderItem('Car', 'car', () => navigation.navigate('AddCarDetails'))}
        {renderItem('Bike', 'motorbike')}
        {renderItem('Laptop', 'laptop')}
        {renderItem('Mobile', 'cellphone')}
      </View>
    </View>
  );
};

export default SellProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    width: '48%',
    height: 120,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedItem: {
    backgroundColor: '#4A90E2',
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    color: '#333',
  },
  selectedText: {
    color: 'white',
  },
});
