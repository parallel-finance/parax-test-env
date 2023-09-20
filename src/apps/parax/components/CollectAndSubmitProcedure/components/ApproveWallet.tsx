import { ReactNode, memo } from 'react';
import { H5, Stack, StackProps } from '@parallel-mono/components';

import { ConnectedWallet } from '../../Wallet';

type ApproveWalletProps = Omit<StackProps, 'children'> & {
  children?: ReactNode;
};

export const ApproveWallet = memo(({ children, ...others }: ApproveWalletProps) => {
  return (
    <Stack alignItems="center" {...others}>
      <Stack alignItems="center" gap="1rem">
        <ConnectedWallet />
        <H5>Please approve on your wallet.</H5>
      </Stack>
      {children}
    </Stack>
  );
});
