import { memo } from 'react';

import { WalletIcon, WalletIconProps } from './WalletIcon';

import { useEOAProvider } from '@/apps/parax/contexts';

type ConnectedWalletProps = Omit<WalletIconProps, 'wallet'>;

export const ConnectedWallet = memo((props: ConnectedWalletProps) => {
  const { walletType } = useEOAProvider();

  return <WalletIcon wallet={walletType} width="2rem" {...props} />;
});
