import {
  memo,
  ReactNode,
  useCallback,
  useContext,
  useState,
  useEffect,
  createContext,
  useMemo,
  useRef
} from 'react';
import { uniqueId } from 'lodash';

import { useBalancesLoader } from './hooks';
import { UserBalanceInfos } from './types';

import { useEOAProvider, useAAProvider } from '@/apps/parax/contexts';

type UserBalanceInfoContextValue = {
  EOABalances: UserBalanceInfos & { loading: boolean };
  AABalances: UserBalanceInfos & { loading: boolean };
  refreshEOABalances: () => Promise<void>;
  refreshAABalances: () => Promise<void>;
};

const UserBalanceInfoContext = createContext<UserBalanceInfoContextValue>({
  EOABalances: {
    ERC20Balances: [],
    ERC721Balances: [],
    uniswapBalances: [],
    loading: false
  },
  AABalances: {
    ERC20Balances: [],
    ERC721Balances: [],
    uniswapBalances: [],
    loading: false
  },
  refreshEOABalances: () => Promise.resolve(),
  refreshAABalances: () => Promise.resolve()
});

type UserBalanceInfoProviderProps = {
  children: ReactNode;
};

export const BalanceInfoProvider = memo(({ children }: UserBalanceInfoProviderProps) => {
  const [EOABalances, setEOABalances] = useState<UserBalanceInfos & { loading: boolean }>({
    ERC20Balances: [],
    ERC721Balances: [],
    uniswapBalances: [],
    loading: false
  });

  const [AABalances, setAABalances] = useState<UserBalanceInfos & { loading: boolean }>({
    ERC20Balances: [],
    ERC721Balances: [],
    uniswapBalances: [],
    loading: false
  });

  const { account: EOAAccount } = useEOAProvider();
  const { account: AAAccount } = useAAProvider();

  useEffect(() => {
    setEOABalances({
      ERC20Balances: [],
      ERC721Balances: [],
      uniswapBalances: [],
      loading: false
    });
  }, [EOAAccount]);

  useEffect(() => {
    setAABalances({
      ERC20Balances: [],
      ERC721Balances: [],
      uniswapBalances: [],
      loading: false
    });
  }, [AAAccount]);

  const loadBalances = useBalancesLoader();

  const latestRefreshEOABalanceCallIdRef = useRef<string>();
  const refreshEOABalances = useCallback(async () => {
    const currentCallId = uniqueId();
    latestRefreshEOABalanceCallIdRef.current = currentCallId;
    setEOABalances(s => ({ ...s, loading: true }));
    try {
      if (currentCallId === latestRefreshEOABalanceCallIdRef.current) {
        const balances = await loadBalances(EOAAccount);
        setEOABalances({ ...balances, loading: false });
      }
    } catch {
      if (currentCallId === latestRefreshEOABalanceCallIdRef.current) {
        setEOABalances(s => ({ ...s, loading: false }));
      }
    }
  }, [loadBalances, EOAAccount]);

  const latestRefreshAABalanceCallIdRef = useRef<string>();
  const refreshAABalances = useCallback(async () => {
    if (!AAAccount) return;
    const currentCallId = uniqueId();
    latestRefreshAABalanceCallIdRef.current = currentCallId;
    setAABalances(s => ({ ...s, loading: true }));
    try {
      const balances = await loadBalances(AAAccount);
      setAABalances({ ...balances, loading: false });
    } catch {
      setAABalances(s => ({ ...s, loading: false }));
    }
  }, [loadBalances, AAAccount]);

  const contextValue = useMemo(
    () => ({
      EOABalances,
      AABalances,
      refreshEOABalances,
      refreshAABalances
    }),
    [EOABalances, AABalances, refreshEOABalances, refreshAABalances]
  );

  useEffect(() => {
    refreshEOABalances();
  }, [refreshEOABalances]);

  useEffect(() => {
    refreshAABalances();
  }, [refreshAABalances]);

  return (
    <UserBalanceInfoContext.Provider value={contextValue}>
      {children}
    </UserBalanceInfoContext.Provider>
  );
});

export const useEOABalances = () => useContext(UserBalanceInfoContext).EOABalances;

export const useAABalances = () => useContext(UserBalanceInfoContext).AABalances;

export const useBalanceProvider = () => useContext(UserBalanceInfoContext);

export * from './types';

export * from './hooks';
