import React from 'react';
import ListingCardMenu, { ListingCardMenuProps } from '../myads/ListingCardMenu';

type Props = ListingCardMenuProps;

const MobileCardMenu: React.FC<Props> = (props) => {
  // Reuse shared listing menu so mobile features stay in sync
  return <ListingCardMenu {...props} />;
};

export default MobileCardMenu;
