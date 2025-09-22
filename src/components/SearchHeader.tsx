// src/components/SearchHeader.tsx
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SearchHeader: React.FC = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1a365d" barStyle="light-content" />
      <View style={styles.header}>
      </View>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="What are you looking for?"
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>SEE ALL</Text>
          <Icon name="arrow-forward" size={16} color="#007bff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingBottom: 15,
  },
  header: {
    backgroundColor: '#1a365d',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 25,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  filterText: {
    color: '#007bff',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 5,
  },
});

export default SearchHeader;
