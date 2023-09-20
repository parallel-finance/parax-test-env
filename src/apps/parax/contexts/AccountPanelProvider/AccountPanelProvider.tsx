import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { NavigateFunction, NavigateOptions, To } from 'react-router-dom';

import { useEOAProvider } from '..';
import { RouterImperativeHandles } from '../../HOC';
import { ImperativeBrowserRouter, AccountPanel, ImperativeMemoryRouter } from '../../components';

import { RoutersProvider } from './RoutersProvider';

export type AccountPanelContextType = {
  isAccountPanelOpen: boolean;
  openAccountPanel: (to?: To, options?: NavigateOptions) => void;
  closeAccountPanel: () => void;
  toggleAccountPanel: (open?: boolean) => void;
  navigate: (to: To, options?: NavigateOptions) => void;
};

export const AccountPanelContext = createContext<AccountPanelContextType>(
  {} as AccountPanelContextType
);

export const AccountPanelProvider = ({ children }: { children: ReactNode }) => {
  const { isUsingUserWallet } = useEOAProvider();

  const [isAccountPanelOpen, setAccountPanelOpen] = useState(false);
  const handleClosePanel = useCallback(() => {
    setAccountPanelOpen(false);
  }, []);

  useEffect(() => {
    setAccountPanelOpen(false);
  }, [isUsingUserWallet]);

  const closeAccountPanel = useCallback(() => {
    setAccountPanelOpen(false);
  }, [setAccountPanelOpen]);

  const toggleAccountPanel = useCallback(
    (open?: boolean) => {
      setAccountPanelOpen(v => open ?? !v);
    },
    [setAccountPanelOpen]
  );

  const paraXRouterRef = useRef<RouterImperativeHandles>(null);
  const accountPanelRouterRef = useRef<RouterImperativeHandles>(null);

  const openAccountPanel = useCallback(
    (to?: To, options?: NavigateOptions) => {
      setAccountPanelOpen(true);
      if (to) {
        accountPanelRouterRef.current?.navigate(to, options);
      }
    },
    [setAccountPanelOpen]
  );

  const navigate = useCallback((to: To, options?: NavigateOptions) => {
    return accountPanelRouterRef.current?.navigate(to, options);
  }, []);

  const value = useMemo(
    () => ({
      isAccountPanelOpen,
      openAccountPanel,
      closeAccountPanel,
      navigate,
      toggleAccountPanel
    }),
    [isAccountPanelOpen, openAccountPanel, closeAccountPanel, navigate, toggleAccountPanel]
  );

  const routers = useMemo(
    () => ({
      paraXRouter: {
        navigate: ((...params: Parameters<NavigateFunction>) => {
          paraXRouterRef.current?.navigate(...params);
        }) as NavigateFunction
      },
      accountPanelRouter: {
        navigate: ((...params: Parameters<NavigateFunction>) => {
          accountPanelRouterRef.current?.navigate(...params);
        }) as NavigateFunction
      }
    }),
    []
  );

  return (
    <AccountPanelContext.Provider value={value}>
      <RoutersProvider value={routers}>
        <ImperativeMemoryRouter ref={accountPanelRouterRef}>
          <AccountPanel isOpen={isAccountPanelOpen} onClose={handleClosePanel} />
        </ImperativeMemoryRouter>
        <ImperativeBrowserRouter ref={paraXRouterRef}>{children}</ImperativeBrowserRouter>
      </RoutersProvider>
    </AccountPanelContext.Provider>
  );
};

export const useAccountPanel = () => {
  const context = useContext(AccountPanelContext);

  if (context === undefined) {
    throw new Error('useAccountPanelContext must be used within a AccountPanelContext');
  }

  return context;
};
