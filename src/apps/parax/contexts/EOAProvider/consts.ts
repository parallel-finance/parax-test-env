import { WalletTypeEnum } from './type';

export const LAST_CONNECTED_TYPE_LOCAL_SESSION_NAME = 'LAST_CONNECTED_TYPE_LOCAL_SESSION_NAME';

export const UNRECOGNIZED_CHAIN_ERR_CODE = 4902;

export const ORDERED_WALLET_TO_INIT = [
  WalletTypeEnum.GNOSIS_SAFE,
  WalletTypeEnum.METAMASK,
  WalletTypeEnum.OKX_WALLET,
  WalletTypeEnum.COINBASE_WALLET,
  WalletTypeEnum.NETWORK
];

export const WalletNameMap = {
  [WalletTypeEnum.METAMASK]: 'MetaMask',
  [WalletTypeEnum.WALLET_CONNECT]: 'WalletConnect',
  [WalletTypeEnum.GNOSIS_SAFE]: 'Gnosis Safe',
  [WalletTypeEnum.OKX_WALLET]: 'OKX',
  [WalletTypeEnum.COINBASE_WALLET]: 'Coinbase',
  [WalletTypeEnum.NETWORK]: ''
};
