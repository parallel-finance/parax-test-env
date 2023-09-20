import { HostedImage, HostedImageProps } from '@parallel-mono/business-components';
import { memo } from 'react';

import { WalletTypeEnum } from '@/apps/parax/contexts';

const walletIconNameMap = {
  [WalletTypeEnum.COINBASE_WALLET]: 'coinbase',
  [WalletTypeEnum.GNOSIS_SAFE]: 'safe',
  [WalletTypeEnum.METAMASK]: 'metamask',
  [WalletTypeEnum.OKX_WALLET]: 'okx',
  [WalletTypeEnum.WALLET_CONNECT]: 'walletconnect'
};

export type WalletIconProps = Omit<HostedImageProps, 'path' | 'name'> & {
  wallet: WalletTypeEnum;
};

export const getWalletIconPath = (walletType: WalletTypeEnum) => {
  if (walletType === WalletTypeEnum.NETWORK) {
    return null;
  }
  return `icons/wallet/${walletIconNameMap[walletType]}`;
};

export const WalletIcon = memo(({ wallet, ...others }: WalletIconProps) => {
  const iconPath = getWalletIconPath(wallet);

  return wallet === WalletTypeEnum.NETWORK ? null : <HostedImage name={iconPath!} {...others} />;
});
