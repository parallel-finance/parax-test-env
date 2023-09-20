import {
  Inline,
  Text,
  Stack,
  StackProps,
  Card,
  H4,
  CardProps,
  H1,
  Spinner
} from '@parallel-mono/components';
import styled from 'styled-components';
import { memo } from 'react';
import { CryptoIcon } from '@parallel-mono/business-components';
import { ERC721Symbol } from 'paraspace-configs-v2';
import BigNumber from 'bignumber.js';

import { NFTCollectionThumbnail } from '../../NFTCollectionThumbnail';

import { AccountHeaderWithBack } from './AccountHeader';

import { ERC20Symbol } from '@/apps/parax/typings';
import { formatBalance, formatToCurrency } from '@/apps/parax/utils';

type CardInfo = {
  symbol: ERC721Symbol | ERC20Symbol;
  assetName: string;
  balance: BigNumber;
  isERC20Token: boolean;
  totalPriceInUSD: BigNumber;
  onClick?: () => void;
};
type CardContainerProps = Omit<CardProps, 'children'> & CardInfo;
type AccountBalanceInfoProps = Omit<StackProps, 'children'> & {
  title: string;
  balance: BigNumber;
  assets: CardInfo[];
  loading: boolean;
  bgIcon: string;
};

const CardWithCursor = styled(Card)<{ onClick?: Function }>`
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
`;

const StackContainer = styled(Stack)<{ bgIcon: string }>`
  height: 100%;
  background: url(${({ bgIcon }) => bgIcon}) no-repeat;
  background-size: 100%;
  overflow: scroll;
`;

const CardContainer = memo(
  ({
    symbol,
    balance,
    isERC20Token,
    totalPriceInUSD,
    onClick,
    assetName,
    ...props
  }: CardContainerProps) => {
    return (
      <CardWithCursor inset="0.75rem" border onClick={onClick} {...props}>
        <Inline alignItems="center" justifyContent="space-between">
          <Inline gap="0.75rem" alignItems="center">
            {isERC20Token ? (
              <CryptoIcon symbol={symbol} />
            ) : (
              <NFTCollectionThumbnail symbol={symbol as ERC721Symbol} size="small" round />
            )}
            <H4>{assetName}</H4>
          </Inline>
          <Stack gap="0.25rem" alignItems="flex-end">
            <H4>
              {formatBalance(balance)} {symbol}
            </H4>
            <Text skin="secondary">{formatToCurrency(totalPriceInUSD)}</Text>
          </Stack>
        </Inline>
      </CardWithCursor>
    );
  }
);

export const AccountBalanceInfo = memo(
  ({ title, balance, assets, bgIcon, loading, ...props }: AccountBalanceInfoProps) => {
    return (
      <StackContainer bgIcon={bgIcon} gap="0" {...props}>
        <AccountHeaderWithBack />
        <Stack inset="2rem 2rem 5.75rem 2rem">
          <Stack alignItems="center" gap="1rem">
            <H4>{title}</H4>
            {loading && balance.isZero() ? <Spinner /> : <H1>{formatToCurrency(balance)}</H1>}
          </Stack>
          <Stack gap="1rem">
            {assets.map(item => (
              <CardContainer key={item.symbol} {...item} />
            ))}
          </Stack>
        </Stack>
      </StackContainer>
    );
  }
);
