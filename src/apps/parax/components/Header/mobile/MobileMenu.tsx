import { memo, useState } from 'react';
import { Icon, Inline } from '@parallel-mono/components';
import { noop } from 'lodash';
import { AppPackage } from 'parax-sdk';

import { MobileBottomDrawer } from '../../MobileBottomDrawer';

import { MobileMenuList } from './MobileMenuList';

import { Maybe } from '@/apps/parax/typings/basic';

type Props = {
  routing: Maybe<AppPackage['routing']>;
};

export const MobileMenu = memo(({ routing }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { routes = [], onSwitchRoute } = routing ?? {};

  return (
    <Inline>
      <Icon onClick={() => setIsOpen(true)} name="menu" strokeWidth="2" size="1.25rem" />
      <MobileBottomDrawer
        isOpen={isOpen}
        onClick={() => setIsOpen(false)}
        onClose={() => setIsOpen(false)}
        onTouchEnd={() => setIsOpen(false)}
      >
        <MobileMenuList routes={routes} onSwitchRoute={onSwitchRoute || noop} />
      </MobileBottomDrawer>
    </Inline>
  );
});
