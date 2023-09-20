import { StackProps } from '@parallel-mono/components';
import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BigNumber from 'bignumber.js';

import { routeNamesMap } from '../routeNames';
import { AccountBalanceInfo } from '../components';
import { useParaAccountBalances } from '../hooks/useParaAccountBalances';
import bgIcon from '../image/nftsBg.svg';

type NftsBalanceProps = Omit<StackProps, 'children'>;

export const NftsBalance = memo(({ ...props }: NftsBalanceProps) => {
  const navigate = useNavigate();
  const { totalNftBalanceInUSD, nftAssets, loading } = useParaAccountBalances();

  const assets = useMemo(
    () =>
      nftAssets.map(({ symbol, tokenIds, totalPriceInUSD, collectionName }) => ({
        symbol,
        assetName: collectionName,
        isERC20Token: false,
        balance: new BigNumber(tokenIds.length),
        totalPriceInUSD,
        onClick: () => {
          navigate(routeNamesMap.ACCOUNT_ASSETS.NFTS_BALANCE.COLLECTION_INFO, {
            state: { symbol }
          });
        }
      })),
    [nftAssets, navigate]
  );

  return (
    <AccountBalanceInfo
      title="NFTs"
      bgIcon={bgIcon}
      balance={totalNftBalanceInUSD}
      assets={assets}
      loading={loading}
      {...props}
    />
  );
});
