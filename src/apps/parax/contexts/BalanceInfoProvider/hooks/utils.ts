import BigNumber from 'bignumber.js';
import { CollectionConfig } from 'paraspace-configs-v2';
import { ReserveDataHumanized } from 'paraspace-utilities-contract-helpers';
import {
  ComputedUserReserve,
  FormatReserveUSDResponse,
  FormatUserSummaryResponse
} from 'paraspace-utilities-math-utils';
import { findKey, invert, mapKeys } from 'lodash';

import { Maybe } from '../../../typings/basic';
import { ERC20BalanceInfo, ERC721BalanceInfo, UniswapBalanceInfo } from '../types';
import { convertToChecksumAddress } from '../../../utils';
import type { ContractMap, ERC20Config } from '../../../config';

import { PositionMap } from './types';

import { ERC20Symbol } from '@/apps/parax/typings';

export const extractERC721BalanceFromUserPosition = (
  positionMap: PositionMap,
  erc721Collections: CollectionConfig[]
): ERC721BalanceInfo[] =>
  erc721Collections.map(config => {
    const positionInfo = positionMap[config.symbol.toLowerCase()];

    return {
      address: convertToChecksumAddress(positionInfo?.underlyingAsset ?? ''),
      tokenIds: positionInfo?.ownedTokens ?? [],
      symbol: config.symbol,
      name: config.contractName,
      collectionName: config.collectionName,
      priceInUSD: new BigNumber(positionInfo?.reserve.priceInUSD ?? 0)
    };
  });

export const getForgedNativeTokenBalanceInfo = ({
  erc20Config,
  positionMap,
  nativeTokenBalance
}: {
  erc20Config: ERC20Config;
  positionMap: Maybe<PositionMap>;
  nativeTokenBalance: BigNumber;
}): ERC20BalanceInfo => {
  const wrappedNativeTokenSymbol = findKey(
    erc20Config,
    it => it.isWrappedNativeToken
  ) as ERC20Symbol;

  const wTokenPositionInfo = positionMap?.[wrappedNativeTokenSymbol.toLowerCase()];

  const nativeTokenSymbol = findKey(erc20Config, it => it.isNativeToken) as ERC20Symbol;

  return {
    symbol: nativeTokenSymbol,
    address: '',
    balance: nativeTokenBalance.shiftedBy(-erc20Config[nativeTokenSymbol].decimals),
    priceInUSD: new BigNumber(wTokenPositionInfo?.reserve.priceInUSD ?? 0),
    isNativeToken: true
  };
};

export const getPositionMapFromUserPosition = (
  userPositions: FormatUserSummaryResponse<ReserveDataHumanized & FormatReserveUSDResponse>
) => {
  return mapKeys(userPositions.userReservesData, it =>
    it.reserve.symbol.toLowerCase()
  ) as PositionMap;
};

export const extractUniswapBalancesFromPosition = (
  positionInfo: ComputedUserReserve<ReserveDataHumanized & FormatReserveUSDResponse>,
  contracts: ContractMap
): UniswapBalanceInfo[] => {
  const contractAddressToSymbolMap = invert(contracts);
  return Array.from(positionInfo?.atomicTokens?.values() ?? [])
    .filter(info => {
      if (
        BigNumber(info.liquidityToken0Amount).eq(0) &&
        BigNumber(info.liquidityToken1Amount).eq(0)
      ) {
        return false;
      }
      const token0Symbol = contractAddressToSymbolMap[info.token0];
      const token1Symbol = contractAddressToSymbolMap[info.token1];
      if (!token0Symbol || !token1Symbol) {
        return false;
      }

      return true;
    })
    .map(info => {
      const token0Symbol = contractAddressToSymbolMap[info.token0];
      const token1Symbol = contractAddressToSymbolMap[info.token1];
      return {
        token0Address: info.token0,
        token1Address: info.token1,
        token0Symbol,
        token1Symbol,
        tokenId: parseInt(info.tokenId, 10),
        priceInUSD: new BigNumber(info.tokenPriceInUSD)
      };
    });
};
