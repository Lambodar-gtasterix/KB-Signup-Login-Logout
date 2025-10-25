// src/components/laptops/LaptopCard.tsx
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

const LaptopCard: React.FC<Props> = (props) => {
  return <ListingCard {...props} />;
};

export default LaptopCard;
