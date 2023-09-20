import { sumBy } from '@parallel-mono/utils';
import { useMemo } from 'react';
import { isEmpty } from 'lodash';
import { ERC721Symbol } from 'paraspace-configs-v2';

import { useAABalances } from '@/apps/parax/contexts';
import { zero } from '@/apps/parax/consts';

export const useParaAccountBalances = () => {
  const { ERC20Balances, ERC721Balances, uniswapBalances, loading } = useAABalances();

  const erc20Assets = useMemo(
    () =>
      ERC20Balances.filter(({ balance }) => balance && balance.isGreaterThan(zero)).map(
        ({ symbol, priceInUSD, balance }) => ({
          symbol,
          balance,
          totalPriceInUSD: balance.times(priceInUSD || zero)
        })
      ),
    [ERC20Balances]
  );
  const nftAssets = useMemo(() => {
    const erc721Assets = ERC721Balances.filter(({ tokenIds }) => !isEmpty(tokenIds)).map(
      ({ symbol, priceInUSD, tokenIds, collectionName }) => ({
        symbol,
        collectionName,
        tokenIds,
        totalPriceInUSD: priceInUSD?.times(tokenIds.length) || zero
      })
    );

    if (!isEmpty(uniswapBalances)) {
      return erc721Assets.concat({
        symbol: ERC721Symbol.UNISWAP_LP,
        collectionName: 'Uniswap V3',
        tokenIds: uniswapBalances.map(({ tokenId }) => tokenId),
        totalPriceInUSD: sumBy(uniswapBalances, ({ priceInUSD }) => priceInUSD || zero)
      });
    }

    return erc721Assets;
  }, [ERC721Balances, uniswapBalances]);

  const totalErc20BalanceInUSD = useMemo(
    () => sumBy(erc20Assets, ({ totalPriceInUSD }) => totalPriceInUSD || zero),
    [erc20Assets]
  );
  const totalNftBalanceInUSD = useMemo(
    () => sumBy(nftAssets, ({ totalPriceInUSD }) => totalPriceInUSD),
    [nftAssets]
  );

  return {
    erc20Assets,
    nftAssets,
    totalErc20BalanceInUSD,
    totalNftBalanceInUSD,
    loading
  };
};
