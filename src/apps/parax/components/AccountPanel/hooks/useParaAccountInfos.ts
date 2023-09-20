import { isEmpty } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { sumBy } from '@parallel-mono/utils';

import { useAAProvider, useBalancesLoader } from '@/apps/parax/contexts';
import { Maybe } from '@/apps/parax/typings/basic';
import { zero } from '@/apps/parax/consts';

type AccountInfos = {
  address: string;
  totalBalance: BigNumber;
}[];

export const useParaAccountInfos = () => {
  const { accounts } = useAAProvider();
  const loadBalances = useBalancesLoader();

  const [accountInfos, setAccountInfo] = useState<Maybe<AccountInfos>>(null);
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    setAccountInfo(accounts?.map(v => ({ address: v, totalBalance: zero })));
  }, [accounts]);

  const refreshAccountInfo = useCallback(async () => {
    if (!isEmpty(accounts)) {
      setIsLoading(true);
      try {
        const infos = await Promise.all(accounts.map(address => loadBalances(address)));
        const infosWithAccount = accounts.map((address, index) => {
          const { ERC20Balances, ERC721Balances, uniswapBalances } = infos[index];
          const ERC20TotalBalances = sumBy(ERC20Balances, ({ priceInUSD, balance }) =>
            priceInUSD && balance ? priceInUSD.times(balance) : zero
          );
          const ERC721TotalBalances = sumBy(ERC721Balances, ({ priceInUSD, tokenIds }) =>
            priceInUSD && !isEmpty(tokenIds) ? priceInUSD.times(tokenIds.length) : zero
          );
          const uniswapTotalBalances = sumBy(
            uniswapBalances,
            ({ priceInUSD }) => priceInUSD || zero
          );

          return {
            address,
            totalBalance: ERC20TotalBalances.plus(ERC721TotalBalances).plus(uniswapTotalBalances)
          };
        });
        setAccountInfo(infosWithAccount);
      } catch (error) {
        console.error(`load parax accounts info field: `, error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [accounts, loadBalances]);

  useEffect(() => {
    refreshAccountInfo();
  }, [refreshAccountInfo]);

  return {
    accountInfos,
    refreshAccountInfo,
    loading
  };
};
