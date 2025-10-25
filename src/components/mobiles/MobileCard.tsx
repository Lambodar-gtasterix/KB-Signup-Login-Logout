// Thin wrapper that preserves your original MobileCard API
// and internally reuses the shared ListingCard.

import React from 'react';
import { ImageSourcePropType } from 'react-native';
import ListingCard, { ListingCardProps } from '../myads/ListingCard';

type Props = {
  image: ImageSourcePropType;
  priceText: string;
  title: string;
  subtitle?: string;
  location?: string;
  badgeText?: string;
  onPress?: () => void;
  onMenuPress?: () => void;
};

const MobileCard: React.FC<Props> = (props) => {
  // Directly pass through since ListingCard uses the same prop names/types
  const listingProps: ListingCardProps = { ...props };
  return <ListingCard {...listingProps} />;
};

export default MobileCard;
