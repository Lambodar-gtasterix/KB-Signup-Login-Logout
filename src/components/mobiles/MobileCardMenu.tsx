import React from 'react';
import ListingCardMenu, { ListingCardMenuProps } from '../myads/ListingCardMenu';

export type MobileCardMenuProps = ListingCardMenuProps;

const MobileCardMenu: React.FC<MobileCardMenuProps> = (props) => {
  // Reuse shared listing menu so mobile features stay in sync
  return <ListingCardMenu {...props} />;
};

export default MobileCardMenu;
