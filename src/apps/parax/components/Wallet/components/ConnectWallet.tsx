import { Button, ButtonProps } from '@parallel-mono/components';
import { useCallback } from 'react';

import { useWalletModalContext } from '../hooks';

import { WalletContainerProps } from './WalletContainer';

export type ConnectWalletProps = {
  btnTxt: string;
  walletListTitle?: string;
  btnSize?: ButtonProps['size'];
  skin?: ButtonProps['skin'];
  block?: ButtonProps['block'];
  buttonProps?: ButtonProps;
  containerProps?: WalletContainerProps;
};

export const ConnectWallet = ({
  btnTxt,
  btnSize = 'large',
  skin = 'secondary',
  block = true,
  buttonProps
}: ConnectWalletProps) => {
  const { setWalletModalOpen, isWalletModalOpen } = useWalletModalContext();

  const handleWalletConnectClick = useCallback(() => {
    if (!isWalletModalOpen) {
      setWalletModalOpen(true);
    }
  }, [isWalletModalOpen, setWalletModalOpen]);

  return (
    <Button
      size={btnSize}
      onClick={handleWalletConnectClick}
      skin={skin}
      block={block}
      {...buttonProps}
    >
      {btnTxt}
    </Button>
  );
};
