import { FC, createContext, memo, useCallback, useContext, useMemo, useState } from 'react';

import { Deposit, Transfer } from './components';

type PanelContextValue = {
  closeDepositPanel: () => void;
  openDepositPanel: () => void;
  isDepositPanelOpen: boolean;
  closeTransferPanel: () => void;
  openTransferPanel: () => void;
  isTransferPanelOpen: boolean;
};

const PanelContext = createContext({} as PanelContextValue);

export const PanelProvider: FC = memo(({ children }) => {
  const [{ isOpen: isDepositPanelOpen }, setIsDepositPanelOpen] = useState<{
    isOpen: boolean;
  }>({ isOpen: false });
  const [isTransferPanelOpen, setIsTransferPanelOpen] = useState(false);

  const closeDepositPanel = useCallback(() => {
    setIsDepositPanelOpen({ isOpen: false });
  }, []);
  const openDepositPanel = useCallback(() => {
    setIsDepositPanelOpen({ isOpen: true });
  }, []);

  const closeTransferPanel = useCallback(() => {
    setIsTransferPanelOpen(false);
  }, []);
  const openTransferPanel = useCallback(() => {
    setIsTransferPanelOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      closeDepositPanel,
      openDepositPanel,
      isDepositPanelOpen,
      closeTransferPanel,
      openTransferPanel,
      isTransferPanelOpen
    }),
    [
      closeDepositPanel,
      closeTransferPanel,
      isDepositPanelOpen,
      isTransferPanelOpen,
      openDepositPanel,
      openTransferPanel
    ]
  );

  return (
    <PanelContext.Provider value={value}>
      <Deposit isOpen={isDepositPanelOpen} onClose={closeDepositPanel} />
      <Transfer isOpen={isTransferPanelOpen} onClose={closeTransferPanel} />
      {children}
    </PanelContext.Provider>
  );
});

export const usePanelProvider = () => useContext(PanelContext);
