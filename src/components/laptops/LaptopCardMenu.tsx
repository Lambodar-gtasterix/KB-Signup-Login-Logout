// src/components/laptops/LaptopCardMenu.tsx
import React from 'react';
import ListingCardMenu, { ListingCardMenuProps } from '../myads/ListingCardMenu';

type Props = ListingCardMenuProps;
const LaptopCardMenu: React.FC<Props> = (props) => <ListingCardMenu {...props} />;

export default LaptopCardMenu;
