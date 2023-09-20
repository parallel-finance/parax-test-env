import { random } from 'lodash';
import { StaticJsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { Web3ReactHooks, initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';
import { EIP1193 } from '@web3-react/eip1193';
import { GnosisSafe } from '@web3-react/gnosis-safe';
import { EMPTY } from '@web3-react/empty';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { useMemo } from 'react';
import { Network as NetworkConnector } from '@web3-react/network';

import { WalletTypeEnum } from '../type';

import config, { SUPPORTED_NETWORK, networkConfig } from '@/apps/parax/config';

type HooksData = {
  chainId: number | undefined;
  provider: Web3Provider | undefined;
  account: string;
  isActive: boolean;
};

const DefaultConnectorPayload = initializeConnector(actions => {
  const urls = networkConfig.publicJsonRPCUrl;
  const urlMap = {
    [SUPPORTED_NETWORK]: new StaticJsonRpcProvider(urls[random(urls.length - 1)])
  };

  return new NetworkConnector({
    actions,
    urlMap,
    defaultChainId: SUPPORTED_NETWORK
  });
});

const ConnectorMap: Record<WalletTypeEnum, ReturnType<typeof initializeConnector>> = {
  [WalletTypeEnum.METAMASK]: initializeConnector(actions => new MetaMask({ actions })),
  [WalletTypeEnum.WALLET_CONNECT]: initializeConnector(
    actions =>
      new WalletConnectV2({
        actions,
        options: {
          projectId: config.walletConnectProjectId,
          chains: [SUPPORTED_NETWORK],
          showQrModal: true,
          optionalChains: [SUPPORTED_NETWORK],
          metadata: {
            name: 'paraspace',
            description: 'paraspace',
            url: window.location.origin,
            icons: []
          }
        }
      })
  ),
  [WalletTypeEnum.OKX_WALLET]: initializeConnector(actions => {
    return window.okxwallet ? new EIP1193({ actions, provider: window.okxwallet }) : EMPTY;
  }),
  [WalletTypeEnum.GNOSIS_SAFE]: initializeConnector(actions => new GnosisSafe({ actions })),
  [WalletTypeEnum.COINBASE_WALLET]: initializeConnector(
    // it's fine to keep url (default rpc point) empty
    // https://github.com/coinbase/coinbase-wallet-sdk/blob/master/packages/wallet-sdk/src/CoinbaseWalletSDK.ts#L136
    actions => new CoinbaseWallet({ actions, options: { appName: 'ParaSpace', url: '' } })
  ),
  // fallback
  [WalletTypeEnum.NETWORK]: DefaultConnectorPayload
};

const useConnectorHooksData = (hooks: Web3ReactHooks): HooksData => {
  const { useProvider, useChainId, useAccount, useIsActive } = hooks;
  const chainId = useChainId();
  const provider = useProvider();
  const account = useAccount() || '';
  const isActive = useIsActive();

  return useMemo(
    () => ({
      chainId,
      provider,
      account,
      isActive
    }),
    [chainId, provider, account, isActive]
  );
};

export const useWalletConnectorsAndData = () => {
  // 0: connector  1: hooks
  const metamask = ConnectorMap[WalletTypeEnum.METAMASK];
  const metaMaskData = useConnectorHooksData(metamask[1]);

  const walletConnect = ConnectorMap[WalletTypeEnum.WALLET_CONNECT];
  const walletConnectData = useConnectorHooksData(walletConnect[1]);

  const okxWallet = ConnectorMap[WalletTypeEnum.OKX_WALLET];
  const okxWalletData = useConnectorHooksData(okxWallet[1]);

  const coinbaseWallet = ConnectorMap[WalletTypeEnum.COINBASE_WALLET];
  const coinbaseWalletData = useConnectorHooksData(coinbaseWallet[1]);

  const gnosis = ConnectorMap[WalletTypeEnum.GNOSIS_SAFE];
  const gonosisData = useConnectorHooksData(gnosis[1]);

  const network = ConnectorMap[WalletTypeEnum.NETWORK];
  const networkData = useConnectorHooksData(network[1]);

  return useMemo(
    () => ({
      [WalletTypeEnum.NETWORK]: {
        connector: network[0],
        data: networkData
      },
      [WalletTypeEnum.WALLET_CONNECT]: {
        connector: walletConnect[0],
        data: walletConnectData
      },
      [WalletTypeEnum.OKX_WALLET]: {
        connector: okxWallet[0],
        data: okxWalletData
      },
      [WalletTypeEnum.COINBASE_WALLET]: {
        connector: coinbaseWallet[0],
        data: coinbaseWalletData
      },
      [WalletTypeEnum.METAMASK]: {
        connector: metamask[0],
        data: metaMaskData
      },
      [WalletTypeEnum.GNOSIS_SAFE]: {
        connector: gnosis[0],
        data: gonosisData
      }
    }),
    [
      coinbaseWallet,
      coinbaseWalletData,
      gnosis,
      gonosisData,
      metaMaskData,
      metamask,
      network,
      networkData,
      okxWallet,
      okxWalletData,
      walletConnect,
      walletConnectData
    ]
  );
};
