import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MyAdsStackParamList } from '../navigation/MyAdsStack';

type MyAdsScreenNavigationProp = NativeStackNavigationProp<
  MyAdsStackParamList,
  'MyAdsScreen'
>;

const categories = [
  {
    id: 'car',
    label: ' Car',
    image: require('../assets/icons/car.png'),
  },
  {
    id: 'bike',
    label: 'Bike',
    image: require('../assets/icons/bike.png'),
  },
  {
    id: 'laptop',
    label: ' Laptop',
    image: require('../assets/icons/laptop.png'),
  },
  {
    id: 'mobile',
    label: ' Mobile',
    image: require('../assets/icons/mobile.png'),
  },
];

const MyAdsScreen: React.FC = () => {
  const navigation = useNavigation<MyAdsScreenNavigationProp>();
  const selectedCategory = 'car'; // static; can be changed to state later

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>My Ads</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Subheading */}
      <Text style={styles.subtitle}>Select Categories</Text>
      <Text style={styles.description}>
        Lorem ipsum dolor sit amet consectetur. Ipsum massa turpis morbi platea.
        Vitae habitant duis.
      </Text>

      {/* Category Grid */}
      <View style={styles.grid}>
        {categories.map((item) => {
          const isSelected = item.id === selectedCategory;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() =>
                navigation.navigate('MyAdsListScreen', { category: item.label })
              }
            >
              <Image
                source={item.image}
                style={[styles.icon, isSelected && styles.iconSelected]}
                resizeMode="contain"
              />
              <Text style={[styles.cardLabel, isSelected && { color: '#fff' }]}>
                 {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default MyAdsScreen;

const windowWidth = Dimensions.get('window').width;
const cardSize = (windowWidth - 60) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
    color: '#000',
  },
  description: {
    fontSize: 13,
    textAlign: 'center',
    color: '#888',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: cardSize,
    height: 110,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardSelected: {
    backgroundColor: '#216DBD',
    borderColor: '#216DBD',
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: '#000',
  },
  iconSelected: {
    tintColor: '#fff',
  },
  cardLabel: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
});
