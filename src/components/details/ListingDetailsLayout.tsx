import React, { useMemo, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export type DetailRow = { label: string; value: string };
export type DetailSection = { title: string; rows: DetailRow[] };

const DOT_SIZE = 8;

interface ListingDetailsLayoutProps {
  images: string[];
  placeholderSource: ImageSourcePropType;
  badgeLabel: string;
  title: string;
  price: string;
  detailSections: DetailSection[];
  onBack: () => void;
  onShare: () => void;
  onMenu: () => void;
  actionBarHeight: number;
  bottomInset: number;
  metaLines?: string[];
  description?: string | null;
  priceRightSlot?: React.ReactNode;
  children?: React.ReactNode;
}

const ListingDetailsLayout: React.FC<ListingDetailsLayoutProps> = ({
  images,
  placeholderSource,
  badgeLabel,
  title,
  price,
  detailSections,
  metaLines = [],
  description,
  onBack,
  onShare,
  onMenu,
  actionBarHeight,
  bottomInset,
  priceRightSlot,
  children,
}) => {
  const { width } = useWindowDimensions();
  const scrollWidth = useMemo(() => (width > 0 ? width : undefined), [width]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!scrollWidth) return;
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / scrollWidth);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: actionBarHeight + bottomInset + 20,
        }}
      >
        <View style={styles.header}>
          {images.length > 0 ? (
            <>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={handleScroll}
              >
                {images.map((uri, index) => (
                  <Image
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${uri}-${index}`}
                    source={{ uri }}
                    style={[styles.headerImage, scrollWidth != null && { width: scrollWidth }]}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
              {images.length > 1 && (
                <View style={styles.dotsBar}>
                  {images.map((_, index) => (
                    <View
                      // eslint-disable-next-line react/no-array-index-key
                      key={`dot-${index}`}
                      style={[styles.dot, index === currentIndex && styles.dotActive]}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <Image
              source={placeholderSource}
              style={[styles.headerImage, scrollWidth != null && { width: scrollWidth }]}
              resizeMode="cover"
            />
          )}

          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconWrap} onPress={onBack}>
              <Icon name="arrow-left" size={22} color="#fff" />
            </TouchableOpacity>
            <View style={styles.iconCluster}>
              <TouchableOpacity style={styles.iconWrap} onPress={onShare}>
                <Icon name="share-variant" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconWrap} onPress={onMenu}>
                <Icon name="dots-vertical" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeLabel}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.priceBox}>
            <View style={styles.priceRow}>
              <Text style={styles.priceText}>{price}</Text>
              {priceRightSlot}
            </View>
            <Text style={styles.titleText}>{title}</Text>
            {metaLines.map((meta) => (
              <Text style={styles.metaText} key={meta}>
                {meta}
              </Text>
            ))}
          </View>

          {children}

          {detailSections.map((section) => (
            <View style={styles.section} key={section.title}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionBox}>
                {section.rows.map((row) => (
                  <View style={styles.detailRow} key={row.label}>
                    <Text style={styles.detailLabel}>{row.label}</Text>
                    <Text style={styles.detailValue}>{row.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          {description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <View style={[styles.sectionBox, styles.descriptionBox]}>
                <Text style={styles.descriptionText}>{description}</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </View>
  );
};

export default ListingDetailsLayout;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 300,
    backgroundColor: '#111',
    position: 'relative',
  },
  headerImage: {
    height: '100%',
  },
  headerIcons: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconCluster: { flexDirection: 'row', gap: 14 },
  iconWrap: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsBar: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    backgroundColor: '#fff',
    transform: [{ scale: 1.15 }],
  },
  badge: {
    position: 'absolute',
    bottom: 18,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 16,
  },
  badgeText: { color: '#fff', fontWeight: '600' },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    gap: 20,
  },
  priceBox: {
    backgroundColor: '#EAF3FA',
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: { fontSize: 24, fontWeight: '700', color: '#143444' },
  titleText: { fontSize: 18, fontWeight: '600', color: '#143444' },
  metaText: { fontSize: 13, color: '#4F6575' },
  section: { gap: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#143444' },
  sectionBox: {
    backgroundColor: '#F3F7FB',
    borderRadius: 12,
    paddingVertical: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  detailLabel: { fontSize: 14, color: '#52616B', flex: 0.5 },
  detailValue: { fontSize: 14, color: '#143444', flex: 0.5, textAlign: 'right' },
  descriptionBox: { paddingHorizontal: 16 },
  descriptionText: { fontSize: 14, lineHeight: 20, color: '#143444' },
  bottomSpacer: { height: 20 },
});
