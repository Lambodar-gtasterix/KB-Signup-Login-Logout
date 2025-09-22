import { Category, Product } from '../types';
export const categories: Category[] = [
  { id: '1', name: 'Vehicle', icon: 'directions-car', color: '#FF9800' },
  { id: '2', name: 'Electronics', icon: 'phone-android', color: '#4CAF50' },
  { id: '3', name: 'Fashion', icon: 'checkroom', color: '#E91E63' },
  { id: '4', name: 'Kitchen\nappliances', icon: 'kitchen', color: '#FFC107' },
  { id: '5', name: 'Real\nEstate', icon: 'home', color: '#FF5722' },
  { id: '6', name: 'Jobs', icon: 'work', color: '#2196F3' },
  { id: '7', name: 'Books', icon: 'menu-book', color: '#9C27B0' },
  { id: '8', name: 'Services', icon: 'build', color: '#607D8B' },
];
//Product list with mixed image types (remote and local)
export const sampleProducts: Product[] = [
  {
    id: '1',
    title: 'Mahindra Thar',
    price: 'Rs. 2,50,000',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/1/13/Mahindra_Thar_Photoshoot_At_Perupalem_Beach_%28West_Godavari_District%2CAP%2CIndia_%29_Djdavid.jpg',
    category: 'Vehicle',
    description: 'Well maintained SUV in excellent condition',
  },
  {
    id: '2',
    title: 'Mahindra Suvra Plus 2024',
    price: 'Rs. 2,50,000',
    image:
      'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    category: 'Vehicle',
    description: 'Well maintained SUV in excellent condition',
  },
  {
    id: '3',
    title: 'Hyundai Creta 2024',
    price: 'Rs. 12,00,000',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    category: 'Vehicle',
    description: 'Brand new SUV with advanced features',
  },
];
