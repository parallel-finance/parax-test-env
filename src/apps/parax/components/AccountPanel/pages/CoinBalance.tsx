import { StackProps } from '@parallel-mono/components';
import { memo, useMemo } from 'react';

import { AccountBalanceInfo } from '../components';
import { useParaAccountBalances } from '../hooks/useParaAccountBalances';
import bgIcon from '../image/coinsBg.svg';

type CoinBalanceProps = Omit<StackProps, 'children'>;

export const CoinBalance = memo(({ ...props }: CoinBalanceProps) => {
  const { totalErc20BalanceInUSD, erc20Assets, loading } = useParaAccountBalances();

  const assets = useMemo(
    () =>
      erc20Assets.map(({ symbol, balance, totalPriceInUSD }) => ({
        symbol,
        assetName: symbol,
        balance,
        totalPriceInUSD,
        isERC20Token: true
      })),
    [erc20Assets]
  );

  return (
    <AccountBalanceInfo
      title="Coins"
      bgIcon={bgIcon}
      balance={totalErc20BalanceInUSD}
      assets={assets}
      loading={loading}
      {...props}
    />
  );
});
