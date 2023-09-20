import { BigNumber } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';

import { WalletTypeEnum } from './type';

export const isWalletInstalled = (type: WalletTypeEnum) => {
  if (type === WalletTypeEnum.METAMASK) {
    return window.ethereum?.isMetaMask;
  }
  if (type === WalletTypeEnum.OKX_WALLET) {
    return !!window.okxwallet;
  }

  if (type === WalletTypeEnum.COINBASE_WALLET) {
    return (
      window.ethereum?.providerMap?.get?.('CoinbaseWallet') || window.ethereum?.isCoinbaseWallet
    );
  }
  // TODO check for GNOSIS_SAFE
  if (type === WalletTypeEnum.WALLET_CONNECT || type === WalletTypeEnum.GNOSIS_SAFE) {
    return true;
  }

  console.warn(`Not integrated ${type} yet`);
  return false;
};

export const getWalletDownloadUrl = (type: WalletTypeEnum) => {
  if (type === WalletTypeEnum.METAMASK) {
    return 'https://metamask.io';
  }

  if (type === WalletTypeEnum.OKX_WALLET) {
    return 'https://www.okx.com/web3';
  }

  if (type === WalletTypeEnum.COINBASE_WALLET) {
    return 'https://www.coinbase.com/wallet';
  }

  return '';
};

export const rewriteGasEstimation = (provider: Web3Provider) => {
  const originEstimateGas = provider.estimateGas;
  provider.estimateGas = async (...args: Parameters<typeof originEstimateGas>) => {
    /**
     * disable by default but can enable explicitly
     */
    const bypassGasEstimation =
      // eslint-disable-next-line no-underscore-dangle
      (window as any).__PARASPACE_DEBUG__ === true;

    if (bypassGasEstimation) {
      return BigNumber.from(5000000);
    }
    return originEstimateGas.call(provider, ...args);
  };
};
