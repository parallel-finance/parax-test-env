import {
  Button,
  H2,
  Inline,
  Skeleton,
  Stack,
  StackProps,
  SmallText,
  Icon
} from '@parallel-mono/components';
import { memo, useCallback, useEffect, useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import { useCopyToClipboard } from 'react-use';

import { useParaAccountBalances } from '../../../hooks/useParaAccountBalances';
import {
  useAAProvider,
  useAccountPanel,
  useParaXToast,
  usePanelProvider
} from '../../../../../contexts';
import { formatBalance, truncateTextMid } from '../../../../../utils';

type AccountAbstractionProps = Omit<StackProps, 'children'>;

const Container = styled(Stack)`
  background: radial-gradient(circle at 20% -40%, #a5a6f6, transparent 50%),
    radial-gradient(circle at 80% -40%, #99e8ff, transparent 50%);
  backdrop-filter: blur(100px);
`;

const AddressChip = styled(Inline)`
  background: ${({ theme }) => theme.skin.background.main};
  border-radius: ${({ theme }) => theme.border.radius.large};
  height: auto;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const AccountAbstraction = memo((props: AccountAbstractionProps) => {
  const { account } = useAAProvider();
  const { totalNftBalanceInUSD, totalErc20BalanceInUSD, loading } = useParaAccountBalances();
  const { openTransferPanel, openDepositPanel } = usePanelProvider();
  const { closeAccountPanel } = useAccountPanel();

  const handleTransfer = useCallback(() => {
    closeAccountPanel();
    openTransferPanel();
  }, [openTransferPanel, closeAccountPanel]);

  const handleDeposit = useCallback(() => {
    closeAccountPanel();
    openDepositPanel();
  }, [closeAccountPanel, openDepositPanel]);

  const [copyState, copyToClipBoard] = useCopyToClipboard();
  const xToast = useParaXToast();
  useEffect(() => {
    const { value, error } = copyState;
    if (value) {
      xToast.success('Wallet Address copied!');
    }
    if (error) {
      xToast.error(error.message);
    }
  }, [copyState, xToast]);

  const handleCopyAddress = useCallback(() => {
    copyToClipBoard(account!);
  }, [copyToClipBoard, account]);

  const theme = useTheme();

  const totalAssetsValue = useMemo(
    () => totalNftBalanceInUSD.plus(totalErc20BalanceInUSD),
    [totalNftBalanceInUSD, totalErc20BalanceInUSD]
  );
  return (
    <Container inset="2rem" alignItems="center" {...props}>
      {account && (
        <AddressChip gap="0.5rem" inset="0.25rem 0.75rem" onClick={handleCopyAddress}>
          <SmallText>{truncateTextMid(account)}</SmallText>
          <Icon size="small" name="copy" color={theme.skin.primary.main} strokeWidth="2" />
        </AddressChip>
      )}
      {totalAssetsValue.isZero() && loading ? (
        <Skeleton.Title width="5rem" height="2rem" />
      ) : (
        <H2>${formatBalance(totalAssetsValue)}</H2>
      )}
      <Inline width="100%">
        <Button disabled={!account} size="large" block onClick={handleTransfer} skin="secondary">
          Transfer
        </Button>
        <Button disabled={!account} size="large" block onClick={handleDeposit} skin="primary">
          Deposit
        </Button>
      </Inline>
    </Container>
  );
});
