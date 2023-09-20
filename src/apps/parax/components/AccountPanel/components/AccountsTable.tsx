import {
  Card,
  Inline,
  Stack,
  StackProps,
  Text,
  H4,
  Image,
  CardProps,
  Spinner,
  Container,
  ColorMode
} from '@parallel-mono/components';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { memo, useCallback } from 'react';

import paraAccountIcon from '../image/paraAccount.svg';
import { useParaAccountInfos } from '../hooks';

import { formatToCurrency, truncateTextMid } from '@/apps/parax/utils';
import { useAsyncEffect } from '@/apps/parax/hooks';
import { useAAProvider } from '@/apps/parax/contexts';

type AccountsTableProps = Omit<StackProps, 'children'> & {
  expanded: boolean;
  onClose: () => void;
};
type AccountCardProps = Omit<CardProps, 'children'> & {
  account: string;
  totalBalance: BigNumber;
  isSelected: boolean;
  onSwitchAccount: (address: string) => void;
};

const SpaceHolder = styled(Stack)<{ expanded: boolean }>`
  position: relative;
  pointer-events: ${({ expanded }) => (expanded ? 'auto' : 'none')};
  overflow: hidden;
  height: 100%;
`;

const ContentContainer = styled(Container)<{ expanded: boolean }>`
  padding: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  overflow: auto;
  transform: translateY(${({ expanded }) => (expanded ? '0' : '-100')}%);
  transition: transform 0.3s;
`;

const CardContainer = styled(Card)<{ isSelected: boolean }>`
  cursor: pointer;
  background: ${({ theme, isSelected }) => {
    if (isSelected && theme.mode === ColorMode.dark) return theme.skin.background.slot;
    if (isSelected && theme.mode !== ColorMode.dark) return theme.skin.grey[200];
    return 'inherit';
  }};
  border: 2px solid
    ${({ theme, isSelected }) => {
      if (isSelected && theme.mode === ColorMode.dark) return theme.skin.grey.white;
      if (isSelected && theme.mode !== ColorMode.dark) return theme.skin.grey[900];
      return theme.skin.grey[200];
    }};
`;

const AccountCard = memo(
  ({ account, totalBalance, isSelected, onSwitchAccount, ...props }: AccountCardProps) => {
    const handleClick = useCallback(() => {
      onSwitchAccount(account);
    }, [onSwitchAccount, account]);
    return (
      <CardContainer inset="1rem" isSelected={isSelected} onClick={handleClick} {...props}>
        <Inline justifyContent="space-between" alignItems="center">
          <Inline alignItems="center" gap="0.75rem">
            <Image width="2.25rem" height="2.25rem" src={paraAccountIcon} />
            <H4>{truncateTextMid(account)}</H4>
          </Inline>
          <H4>{formatToCurrency(totalBalance)}</H4>
        </Inline>
      </CardContainer>
    );
  }
);

export const AccountsTable = memo(({ expanded, onClose, ...props }: AccountsTableProps) => {
  const { accountInfos, refreshAccountInfo, loading: isLoadingAccountInfo } = useParaAccountInfos();
  const { switchAccount, account } = useAAProvider();

  useAsyncEffect(async () => {
    refreshAccountInfo();
  }, [expanded]);

  const handleSwitchAccount = useCallback(
    (address: string) => {
      if (address !== account) {
        switchAccount(address);
        onClose();
      }
    },
    [account, switchAccount, onClose]
  );

  return (
    <SpaceHolder expanded={expanded} width="100%" {...props}>
      <ContentContainer expanded={expanded} width="100%">
        <Stack width="100%">
          <Stack alignItems="center" inset="1.5rem 1.5rem 5.25rem 1.5rem">
            {isLoadingAccountInfo && <Spinner />}
            <Text skin="secondary" fontWeight="bold">
              Select an account
            </Text>
            <Stack width="100%">
              {(accountInfos || []).map(({ address, totalBalance }) => (
                <AccountCard
                  key={address}
                  account={address}
                  totalBalance={totalBalance}
                  isSelected={address === account}
                  onSwitchAccount={handleSwitchAccount}
                />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </ContentContainer>
    </SpaceHolder>
  );
});
