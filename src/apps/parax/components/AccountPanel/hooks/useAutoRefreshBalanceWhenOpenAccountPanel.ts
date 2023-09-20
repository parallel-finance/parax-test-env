import { useEffect, useRef } from 'react';

import { useBalanceProvider } from '../../../contexts';

export const useAutoRefreshBalanceWhenOpenAccountPanel = (isAccountPanelOpen: boolean) => {
  const { refreshAABalances, refreshEOABalances } = useBalanceProvider();
  const refresherRef = useRef({ refreshAABalances, refreshEOABalances });
  refresherRef.current = { refreshAABalances, refreshEOABalances };
  useEffect(() => {
    if (isAccountPanelOpen) {
      refresherRef.current.refreshAABalances();
      refresherRef.current.refreshEOABalances();
    }
  }, [isAccountPanelOpen]);
};
