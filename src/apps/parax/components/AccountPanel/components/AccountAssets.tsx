import {
  Inline,
  Stack,
  StackProps,
  Card,
  CardProps,
  Image,
  H4,
  Icon,
  Spinner,
  useBreakpoints
} from '@parallel-mono/components';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { memo, useCallback, useMemo } from 'react';
import BigNumber from 'bignumber.js';

import coinsIcon from '../image/coins.svg';
import nftsIcon from '../image/nfts.svg';
import { routeNamesMap } from '../routeNames';
import { useParaAccountBalances } from '../hooks/useParaAccountBalances';

import { formatToCurrency } from '@/apps/parax/utils';
import { useAccountPanel, usePanelProvider } from '@/apps/parax/contexts';
import { zero } from '@/apps/parax/consts';

type CardContainerProps = Omit<CardProps, 'children'> & {
  imgSrc: string;
  label: string;
  value: BigNumber;
  loading: boolean;
};
type AccountAssetsProps = Omit<StackProps, 'children'>;

const Container = styled(Card)`
  cursor: pointer;
`;

const StackWithCursor = styled(Stack)`
  cursor: pointer;
`;

const CardContainer = memo(({ imgSrc, label, value, loading, ...props }: CardContainerProps) => {
  return (
    <Container border {...props}>
      <Inline alignItems="center" justifyContent="space-between">
        <Inline gap="0.75rem" alignItems="center">
          <Image width="2.25rem" height="2.25rem" src={imgSrc} />
          <H4>{label}</H4>
        </Inline>
        <Inline gap="0" alignItems="center">
          {loading && value.isZero() ? <Spinner /> : <H4>{formatToCurrency(value)}</H4>}
          <Icon strokeWidth={2} name="chevronRight" />
        </Inline>
      </Inline>
    </Container>
  );
});

export const AccountAssets = memo(({ ...props }: AccountAssetsProps) => {
  const navigate = useNavigate();
  const { openDepositPanel } = usePanelProvider();
  const { closeAccountPanel } = useAccountPanel();
  const { mobile } = useBreakpoints();

  const { totalNftBalanceInUSD, totalErc20BalanceInUSD, loading } = useParaAccountBalances();

  const assets = useMemo(
    () => [
      {
        imgSrc: coinsIcon,
        label: 'Coins',
        value: totalErc20BalanceInUSD,
        path: routeNamesMap.ACCOUNT_ASSETS.COIN_BALANCE
      },
      {
        imgSrc: nftsIcon,
        label: 'NFTs',
        value: totalNftBalanceInUSD,
        path: routeNamesMap.ACCOUNT_ASSETS.NFTS_BALANCE.index
      }
    ],
    [totalErc20BalanceInUSD, totalNftBalanceInUSD]
  );

  const showAssets = useMemo(
    () => totalErc20BalanceInUSD.plus(totalNftBalanceInUSD).gt(zero),
    [totalErc20BalanceInUSD, totalNftBalanceInUSD]
  );

  const handleDeposit = useCallback(() => {
    openDepositPanel();
    closeAccountPanel();
  }, [closeAccountPanel, openDepositPanel]);

  if (loading) {
    return (
      <Inline justifyContent="center">
        <Spinner />
      </Inline>
    );
  }

  return showAssets ? (
    <Stack {...props}>
      {assets.map(({ imgSrc, label, value, path }) => (
        <CardContainer
          key={label}
          imgSrc={imgSrc}
          label={label}
          value={value}
          loading={loading}
          onClick={() => navigate(path)}
        />
      ))}
    </Stack>
  ) : (
    <StackWithCursor alignItems="center" gap="1rem" onClick={handleDeposit} {...props}>
      <Icon name="plusCircle" width="2.5rem" height="2.5rem" />
      <Stack alignItems="center" gap="0">
        <H4 style={{ fontSize: mobile ? '14px' : '18px' }}>
          You don’t have any assets in this account
        </H4>
        <H4 style={{ fontSize: mobile ? '14px' : '18px' }} skin="secondary">
          Please deposit first
        </H4>
      </Stack>
    </StackWithCursor>
  );
});
