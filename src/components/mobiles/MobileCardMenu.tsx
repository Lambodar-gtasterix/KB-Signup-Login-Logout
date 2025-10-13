// ADD FILE: src/components/mobiles/MobileCardMenu.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  title?: string;
  statusLabel?: string;
  onEdit: () => void;
  onDelete: () => void;
};

const MobileCardMenu: React.FC<Props> = ({ title, statusLabel, onEdit, onDelete }) => {
  return (
    <View style={styles.container}>
      {/* Optional context header */}
      {!!title && (
        <View style={styles.header}>
          <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
          {!!statusLabel && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{statusLabel}</Text>
            </View>
          )}
        </View>
      )}

      {/* Actions */}
      <TouchableOpacity style={styles.row} onPress={onEdit} activeOpacity={0.8}>
        <View style={styles.iconWrap}>
          <Icon name="pencil" size={18} color="#216DBD" />
        </View>
        <Text style={styles.rowText}>Update</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.row} onPress={onDelete} activeOpacity={0.8}>
        <View style={[styles.iconWrap, { backgroundColor: '#FFE9E9' }]}>
          <Icon name="trash-can-outline" size={18} color="#D93025" />
        </View>
        <Text style={[styles.rowText, { color: '#D93025' }]}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MobileCardMenu;

const styles = StyleSheet.create({
  container: { paddingVertical: 8 },
  header: { marginBottom: 8, flexDirection: 'row', alignItems: 'center' },
  headerTitle: { flex: 1, fontSize: 14, fontWeight: '600', color: '#111' },
  badge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: '#F0F6FF',
  },
  badgeText: { fontSize: 11, color: '#216DBD', fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  iconWrap: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: '#E8F1FB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rowText: { fontSize: 15, color: '#111' },
  divider: { height: 1, backgroundColor: '#EFEFEF' },
});
