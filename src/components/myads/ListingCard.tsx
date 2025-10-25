import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export type ListingCardProps = {
  image: ImageSourcePropType;     // require(...) or { uri: string }
  priceText: string;              // e.g., "₹30,000"
  title: string;                  // e.g., "iPhone 17 - Well condition"
  subtitle?: string;              // e.g., "Apple • 16 Pro • 2020"
  location?: string;              // small gray line under subtitle
  badgeText?: string;             // yellow pill at top-left ("Live", "Info", etc.)
  onPress?: () => void;           // navigate to details
  onMenuPress?: () => void;       // open bottom sheet
};

const ListingCard: React.FC<ListingCardProps> = ({
  image,
  priceText,
  title,
  subtitle,
  location,
  badgeText = 'Info',
  onPress,
  onMenuPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageWrap}>
        <Image source={image} style={styles.image} />

        {/* Top-right 3-dot overlay */}
        <TouchableOpacity
          onPress={onMenuPress}
          activeOpacity={0.8}
          style={styles.menuBtn}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Icon name="dots-vertical" size={18} color="#111" />
        </TouchableOpacity>
      </View>

      <View style={styles.details}>
        {/* Timer/Status badge (yellow) */}
        <View style={styles.timerBadge}>
          <Icon name="clock-outline" size={12} color="#000" />
          <Text style={styles.timerText}>{badgeText}</Text>
        </View>

        <Text style={styles.price}>{priceText}</Text>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {!!subtitle && (
          <Text style={styles.km} numberOfLines={1}>
            {subtitle}
          </Text>
        )}

        <View style={styles.locationRow}>
          <Icon name="map-marker" size={14} color="#888" />
          <Text style={styles.location} numberOfLines={1}>
            {location || '—'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListingCard;

const styles = StyleSheet.create({
  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: '1.5%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  imageWrap: {
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  image: {
    width: '100%',
    height: 110,
    backgroundColor: '#f2f2f2',
  },
  menuBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    height: 28,
    width: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  details: { padding: 8 },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FDC20C',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 4,
  },
  timerText: { fontSize: 11, color: '#000', fontWeight: '600', marginLeft: 4 },
  price: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  title: { fontSize: 12, color: '#444' },
  km: { fontSize: 11, color: '#888' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  location: { marginLeft: 4, fontSize: 11, color: '#888' },
});
