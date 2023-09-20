import { Inline, Text, Stack, StackProps, H1 } from '@parallel-mono/components';
import { memo, useMemo } from 'react';
import { ERC721Symbol } from 'paraspace-configs-v2';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

import { AccountHeaderWithBack } from '../components';
import { NFTThumbnail } from '../../NFTThumbnail';
import { useParaAccountBalances } from '../hooks/useParaAccountBalances';
import { NFTCollectionThumbnail } from '../../NFTCollectionThumbnail';

import { formatToCurrency } from '@/apps/parax/utils';
import { zero } from '@/apps/parax/consts';

type CollectionInfoProps = Omit<StackProps, 'children'>;

const StyledStack = styled(Stack)`
  height: 100%;
  overflow: scroll;
`;

const Grid = styled.div`
  width: fit-content;
  display: grid;
  grid-template-columns: repeat(2, 2fr);
  grid-gap: 0.5rem;
`;

export const CollectionInfo = memo(({ ...props }: CollectionInfoProps) => {
  const {
    state: { symbol }
  } = useLocation() as {
    state: { symbol: ERC721Symbol };
  };

  const { nftAssets } = useParaAccountBalances();
  const { tokenIds = [], totalPriceInUSD = zero } = useMemo(
    () =>
      (nftAssets.find(item => item.symbol === symbol) || {}) as {
        tokenIds: number[];
        totalPriceInUSD: BigNumber;
      },
    [nftAssets, symbol]
  );

  return (
    <StyledStack gap="0" {...props}>
      <AccountHeaderWithBack />
      <Stack gap="2rem" inset="2rem 2rem 5.75rem 2rem" alignItems="center">
        <Inline width="100%" justifyContent="space-between" alignItems="center">
          <Stack gap="1rem">
            <Text fontWeight="bold">{symbol}</Text>
            <Stack gap="0">
              <H1>
                {tokenIds.length} {symbol}
              </H1>
              <Text skin="secondary">{formatToCurrency(totalPriceInUSD)}</Text>
            </Stack>
          </Stack>
          <NFTCollectionThumbnail symbol={symbol as ERC721Symbol} size="medium" round />
        </Inline>
        <Grid>
          {tokenIds.map(tokenId => (
            <NFTThumbnail
              key={tokenId}
              size="xLarge"
              showDescription
              symbol={symbol}
              tokenId={tokenId}
            />
          ))}
        </Grid>
      </Stack>
    </StyledStack>
  );
});
