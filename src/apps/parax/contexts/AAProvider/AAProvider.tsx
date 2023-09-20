import {
  ReactNode,
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { noop, uniqueId } from 'lodash';
import { JsonRpcProvider } from '@ethersproject/providers';

import { ParaXProvider } from 'parax-sdk';
import { Maybe } from '../../typings/basic';
import { useParaAccountsLazyQuery } from '../../generated/graphql';
import { useEOAProvider } from '../EOAProvider';

const PARAX_ACCOUNT_LOCAL_STORAGE_KEY = 'selected_account';

type AAContextValue = {
  accounts: string[];
  account: Maybe<string>;
  switchAccount: (account: string) => void;
  mockAccount: (EOAAccount: string, paraAccount: string) => void;
  refreshAccounts: () => Promise<void>;
  loading: boolean;
  provider: ParaXProvider;
};

const AAContext = createContext<AAContextValue>({
  accounts: [],
  account: null,
  switchAccount: noop,
  mockAccount: noop,
  refreshAccounts: () => Promise.resolve(),
  loading: false,
  provider: new ParaXProvider(new JsonRpcProvider(), '', '')
});

export const AAProvider = memo(({ children }: { children: ReactNode }) => {
  const { account: EOAAccount, provider: EOAProvider } = useEOAProvider();
  const [{ accounts, account: activeAccount, loading }, setState] = useState<
    Pick<AAContextValue, 'accounts' | 'account' | 'loading'>
  >({
    accounts: [],
    account: null,
    loading: false
  });

  const [queryParaAccounts] = useParaAccountsLazyQuery({});

  const getParaAccounts = useCallback(
    async (account: string) => {
      if (account) {
        const result = await queryParaAccounts({
          variables: {
            filter: {
              EOAAccount: account
            }
          },
          fetchPolicy: 'no-cache'
        });
        return (result.data?.paraAccounts.map(it => it.paraAccount) ?? []) as string[];
      }
      return [];
    },
    [queryParaAccounts]
  );

  const latestCallIdRef = useRef<string>();
  const refreshAccounts = useCallback(async () => {
    setState(s => ({ ...s, loading: true }));
    const currentCallId = uniqueId();
    latestCallIdRef.current = currentCallId;
    try {
      const latestAccounts = await getParaAccounts(EOAAccount);

      if (latestCallIdRef.current === currentCallId) {
        setState(s => ({ ...s, accounts: latestAccounts, loading: false }));
      }
    } catch {
      if (latestCallIdRef.current === currentCallId) {
        setState(s => ({ ...s, loading: false }));
      }
    }
  }, [EOAAccount, getParaAccounts]);

  useEffect(() => {
    refreshAccounts();
  }, [refreshAccounts]);

  const provider = useMemo(
    () => new ParaXProvider(EOAProvider, EOAAccount, activeAccount),
    [EOAProvider, EOAAccount, activeAccount]
  );

  const switchAccount = useCallback(
    (accountToBe: string) => {
      setState(s => {
        if (!s.accounts.includes(accountToBe)) {
          return s;
        }
        localStorage.setItem(`${EOAAccount}:${PARAX_ACCOUNT_LOCAL_STORAGE_KEY}`, accountToBe);
        return { ...s, account: accountToBe };
      });
    },
    [EOAAccount]
  );

  const mockAccount = useCallback(
    (EOAAccountAddress: string, paraAccount: string) => {
      setState(s => {
        if (EOAAccountAddress === EOAAccount && !s.accounts.includes(paraAccount)) {
          return { ...s, accounts: s.accounts.concat(paraAccount) };
        }
        return s;
      });
    },
    [EOAAccount]
  );

  useEffect(() => {
    const storageAccount = localStorage.getItem(`${EOAAccount}:${PARAX_ACCOUNT_LOCAL_STORAGE_KEY}`);
    if (!activeAccount || !accounts.includes(activeAccount)) {
      const selectedAccount = accounts.includes(storageAccount ?? '')
        ? storageAccount
        : accounts[0];
      setState(s => ({ ...s, account: selectedAccount ?? null }));
    }
  }, [EOAAccount, accounts, activeAccount]);

  const contextValue = useMemo(
    () => ({
      accounts,
      account: activeAccount,
      switchAccount,
      refreshAccounts,
      mockAccount,
      loading,
      provider
    }),
    [accounts, activeAccount, switchAccount, loading, provider, refreshAccounts, mockAccount]
  );

  return <AAContext.Provider value={contextValue}>{children}</AAContext.Provider>;
});

export const useAAProvider = () => useContext(AAContext);
