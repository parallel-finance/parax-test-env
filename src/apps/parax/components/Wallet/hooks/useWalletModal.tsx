import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { Inline, Popup, useBreakpoints } from '@parallel-mono/components';
import styled from 'styled-components';

import { AbsoluteWalletContainer, WalletContainer } from '../components';
import { MobileBottomDrawer } from '../../MobileBottomDrawer';

import { useEOAProvider } from '@/apps/parax/contexts';

export type WalletModalContextType = {
  isWalletModalOpen: boolean;
  setWalletModalOpen: (open: boolean) => void;
};

export const WalletModalContext = createContext<WalletModalContextType>(
  {} as WalletModalContextType
);

const StyledPopup = styled(Popup)`
  .backdrop {
    background: none;
    transition: none;
    animation: none;
  }
`;

export const WalletModalContextProvider = ({ children }: { children: ReactNode }) => {
  const { isUsingUserWallet } = useEOAProvider();

  const [isWalletModalOpen, setWalletModalOpen] = useState(false);

  const handleCloseWalletModal = useCallback(() => {
    setWalletModalOpen(false);
  }, []);

  useEffect(() => {
    setWalletModalOpen(false);
  }, [isUsingUserWallet]);

  const value = useMemo(
    () => ({
      isWalletModalOpen,
      setWalletModalOpen: (open: boolean) => {
        setWalletModalOpen(open);
      }
    }),
    [isWalletModalOpen]
  );

  const { mobile } = useBreakpoints();

  return (
    <WalletModalContext.Provider value={value}>
      {mobile ? (
        <MobileBottomDrawer
          isOpen={isWalletModalOpen}
          onClick={handleCloseWalletModal}
          onClose={handleCloseWalletModal}
          onTouchEnd={handleCloseWalletModal}
        >
          <Inline width="100%" inset="0 1rem 1rem 1rem">
            <WalletContainer />
          </Inline>
        </MobileBottomDrawer>
      ) : (
        <StyledPopup
          backdropProps={{
            className: 'backdrop'
          }}
          isOpen={isWalletModalOpen}
          onClose={handleCloseWalletModal}
        >
          <AbsoluteWalletContainer />
        </StyledPopup>
      )}

      {children}
    </WalletModalContext.Provider>
  );
};

export const useWalletModalContext = () => {
  const context = useContext(WalletModalContext);

  if (context === undefined) {
    throw new Error('useWalletModalContext must be used within a WalletModalProvider');
  }

  return context;
};
