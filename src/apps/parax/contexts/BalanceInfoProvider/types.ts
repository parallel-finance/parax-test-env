import BigNumber from 'bignumber.js';
import { ERC721Symbol } from 'paraspace-configs-v2';

import { ERC20Symbol } from '../../typings';

export type ERC20BalanceInfo = {
  symbol: ERC20Symbol;
  address: string;
  balance: BigNumber;
  priceInUSD: BigNumber;
  isNativeToken?: boolean;
  displayName?: string;
};

export type ERC721BalanceInfo = {
  address: string;
  tokenIds: Array<number>;
  symbol: ERC721Symbol;
  name: string;
  collectionName: string;
  priceInUSD: BigNumber;
};

export type UniswapBalanceInfo = {
  tokenId: number;
  priceInUSD: BigNumber;
  token0Address: string;
  token1Address: string;
  token0Symbol: string;
  token1Symbol: string;
};

export type UserBalanceInfos = {
  ERC20Balances: Array<ERC20BalanceInfo>;
  ERC721Balances: Array<ERC721BalanceInfo>;
  uniswapBalances: Array<UniswapBalanceInfo>;
};
