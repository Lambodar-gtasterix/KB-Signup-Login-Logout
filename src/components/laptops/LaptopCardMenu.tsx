// src/components/laptops/LaptopCardMenu.tsx
import React from 'react';
import ListingCardMenu, { ListingCardMenuProps } from '../myads/ListingCardMenu';

export type LaptopCardMenuProps = ListingCardMenuProps;
const LaptopCardMenu: React.FC<LaptopCardMenuProps> = (props) => <ListingCardMenu {...props} />;

export default LaptopCardMenu;
