import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewProps,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  listingUpdateStyles as styles,
  LISTING_UPDATE_COLORS as COLORS,
} from '../../theme/listingUpdate';

interface ListingUpdateLayoutProps {
  title: string;
  onBack: () => void;
  backDisabled?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  scrollProps?: Partial<ScrollViewProps>;
  keyboardOffset?: number;
}

const ListingUpdateLayout: React.FC<ListingUpdateLayoutProps> = ({
  title,
  onBack,
  backDisabled,
  children,
  footer,
  scrollProps,
  keyboardOffset,
}) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={
          keyboardOffset != null ? keyboardOffset : Platform.OS === 'ios' ? 0 : 20
        }
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              disabled={backDisabled}
            >
              <Icon name="arrow-left" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.progressContainer} />

          <ScrollView
            style={styles.form}
            contentContainerStyle={styles.formContent}
            keyboardShouldPersistTaps="handled"
            {...scrollProps}
          >
            {children}
          </ScrollView>

          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ListingUpdateLayout;
