import { values } from 'lodash';
import {
  memo,
  useState,
  ReactNode,
  useCallback,
  createContext,
  useMemo,
  useContext,
  useRef,
  useEffect
} from 'react';
import { useMount } from 'react-use';
import { Web3Provider } from '@ethersproject/providers';
import { initializeConnector } from '@web3-react/core';
import { Inline } from '@parallel-mono/components';

import { LAST_CONNECTED_TYPE_LOCAL_SESSION_NAME, ORDERED_WALLET_TO_INIT } from './consts';
import { WalletTypeEnum } from './type';
import { isWalletInstalled, rewriteGasEstimation } from './utils';
import { useWalletConnectorsAndData } from './hooks';
import { NetworkSwitchingProcess } from './components';

import { Maybe } from '@/apps/parax/typings/basic';
import { Network } from '@/apps/parax/config';

type EOAContextValue = Maybe<{
  connectWallet: (wallet: WalletTypeEnum) => void;
  disconnectWallet: () => void;
  walletType: WalletTypeEnum;
  connector: ReturnType<typeof initializeConnector>[0];
  provider: Web3Provider;
  chainId: Network;
  account: string;
  active: boolean;
  walletInActivating: Maybe<WalletTypeEnum>;
  isUsingUserWallet: boolean;
}>;

const EOAContext = createContext<EOAContextValue>(null);

type Web3ProviderProps = {
  children: ReactNode;
  defaultChain?: Network;
};

const memoizedWalletType = localStorage.getItem(
  LAST_CONNECTED_TYPE_LOCAL_SESSION_NAME
) as Maybe<WalletTypeEnum>;

export const EOAProvider = memo(({ children, defaultChain }: Web3ProviderProps) => {
  const [walletType, setWalletType] = useState<WalletTypeEnum>(WalletTypeEnum.NETWORK);
  const [walletInActivating, setWalletInActivating] = useState<Maybe<WalletTypeEnum>>(null);

  const connectorsAndDataMap = useWalletConnectorsAndData();
  const {
    [walletType]: {
      connector,
      data: { chainId = null, provider, account = '', isActive }
    }
  } = connectorsAndDataMap;

  const connectingPromiseRef = useRef<Promise<void> | void>();
  const connectWallet = useCallback(
    async (walletTypeToConnect: WalletTypeEnum, network?: Network) => {
      if (walletInActivating === walletTypeToConnect) {
        await connectingPromiseRef.current;
      }

      if (walletInActivating !== null) {
        throw new Error(
          `can not activate ${walletTypeToConnect} while ${walletInActivating} is activating`
        );
      }

      const { connector: targetConnector } = connectorsAndDataMap[walletTypeToConnect];

      try {
        setWalletInActivating(walletTypeToConnect);
        connectingPromiseRef.current = targetConnector
          .activate(network)
          ?.then(() => targetConnector.connectEagerly?.());
        await connectingPromiseRef.current;
        setWalletType(walletTypeToConnect);
        if (walletTypeToConnect !== WalletTypeEnum.GNOSIS_SAFE) {
          localStorage.setItem(LAST_CONNECTED_TYPE_LOCAL_SESSION_NAME, walletTypeToConnect);
        }
      } catch (e) {
        console.error('connect wallet error');
        console.error(e);
        throw e;
      } finally {
        setWalletInActivating(null);
        connectingPromiseRef.current = undefined;
      }
    },
    [walletInActivating, connectorsAndDataMap]
  );

  const disconnectWallet = useCallback(async () => {
    if (walletType === WalletTypeEnum.NETWORK) {
      return;
    }
    try {
      setWalletType(WalletTypeEnum.NETWORK);
      localStorage.removeItem(LAST_CONNECTED_TYPE_LOCAL_SESSION_NAME);
      await connector.deactivate?.();
    } catch (e) {
      console.error('disconnect error');
      console.error(e);
      throw e;
    }
  }, [walletType, connector]);

  useMount(() => {
    // activate network wallet by default
    connectorsAndDataMap.network.connector.activate()?.catch(e => {
      console.warn('Default Network Connector activate failed');
      console.warn(e);
    });
  });

  // TODO: only disconnectWallet when the wallet is WalletTypeEnum.WALLET_CONNECT
  const handleConnectWalletDisconnect = useCallback(() => {
    if (walletType === WalletTypeEnum.WALLET_CONNECT) {
      disconnectWallet();
    }
  }, [disconnectWallet, walletType]);

  useEffect(() => {
    const handleChainChanged = () => {
      connector.activate();
    };

    const handleAccountsChange = (connectedAccounts: string[]) => {
      if (connectedAccounts.length === 0) {
        connectWallet(WalletTypeEnum.NETWORK);
      }
    };

    // when connected with metamask, chainChanged event won't trigger, have to subscribe using window.ethereum?.addListener
    window.ethereum?.addListener?.('chainChanged', handleChainChanged);
    connector.provider?.on('chainChanged', handleChainChanged);
    connector.provider?.on('accountsChanged', handleAccountsChange);
    connector.provider?.on('disconnect', handleConnectWalletDisconnect);
    return () => {
      window.ethereum?.removeListener?.('accountsChanged', handleChainChanged);
      connector.provider?.removeListener('chainChanged', handleChainChanged);
      connector.provider?.removeListener('accountsChanged', handleAccountsChange);
      connector.provider?.removeListener('disconnect', handleConnectWalletDisconnect);
    };
  }, [connector, connectWallet, walletType, disconnectWallet, handleConnectWalletDisconnect]);

  useMount(async () => {
    // there's no sync method to test if gnosis is installed, have to check by actually trying to activate
    try {
      await connectWallet(WalletTypeEnum.GNOSIS_SAFE, defaultChain);
    } catch {
      console.warn('eagerly connect to safe failed');
      if (memoizedWalletType !== null && values(WalletTypeEnum).includes(memoizedWalletType)) {
        await connectWallet(memoizedWalletType, defaultChain);
      } else {
        const firstValidWallet = ORDERED_WALLET_TO_INIT.filter(
          it => it !== WalletTypeEnum.GNOSIS_SAFE
        ).find(it => isWalletInstalled(it));

        await connectWallet(firstValidWallet ?? WalletTypeEnum.NETWORK, defaultChain);
      }
    }
  });

  const value: EOAContextValue = useMemo(() => {
    if (!provider) {
      return null;
    }

    // dangerous: mutable code to alter provider.estimateGas
    rewriteGasEstimation(provider);

    return {
      connectWallet,
      disconnectWallet,
      walletType,
      walletInActivating,
      connector,
      provider,
      chainId: chainId!,
      account,
      active: isActive,
      isUsingUserWallet: walletType !== WalletTypeEnum.NETWORK
    };
  }, [
    connectWallet,
    disconnectWallet,
    walletType,
    walletInActivating,
    connector,
    provider,
    chainId,
    account,
    isActive
  ]);

  if (!value) {
    return null;
  }

  // TODO more intuitive flag to indicate network switching
  if (chainId === null) {
    if (!isActive) {
      return null;
    }
    return (
      <Inline inset="2rem" width="100%" justifyContent="center">
        <NetworkSwitchingProcess />
      </Inline>
    );
  }

  return <EOAContext.Provider value={value}>{children}</EOAContext.Provider>;
});

export const useEOAProvider = () => {
  const EOAContextValue = useContext(EOAContext);

  if (EOAContextValue === null) {
    throw new Error('web3Context not ready');
  }

  return EOAContextValue;
};
