import { DrawerProps, useBreakpoints } from '@parallel-mono/components';
import React, { memo, useMemo } from 'react';
import { NavigateFunction, useRoutes } from 'react-router-dom';

import { XDrawer } from '../XDrawer';

import { useAutoRefreshBalanceWhenOpenAccountPanel } from './hooks';
import { routes } from './routes';

type AccountPanelProps = Omit<DrawerProps, 'children'>;

export type AccountPanelImperativeHandles = {
  navigate: NavigateFunction;
};

export const AccountPanel = memo(({ backdropProps = {}, isOpen, ...others }: AccountPanelProps) => {
  const mergedBackdropProps = useMemo(
    () => ({
      ...backdropProps,
      style: {
        ...backdropProps.style,
        background: 'none'
      }
    }),
    [backdropProps]
  );

  const routesElement = useRoutes(routes);

  useAutoRefreshBalanceWhenOpenAccountPanel(isOpen);
  const { mobile } = useBreakpoints();

  return (
    <XDrawer
      escapeClickAwayAttribute="data-escape-account-drawer"
      data-escape-deposit-assets-drawer
      data-escape-transfer-assets-drawer
      data-escape-rewards-drawer
      top="60px"
      size={!mobile ? '480px' : '100%'}
      backdropProps={mergedBackdropProps}
      isOpen={isOpen}
      {...others}
    >
      {routesElement}
    </XDrawer>
  );
});
