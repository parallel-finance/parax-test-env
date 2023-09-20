import { useCallback, useMemo } from 'react';
import { DeploylessViewerClient } from 'deployless-view';
import { UiPoolDataProvider, WalletBalanceProvider } from 'paraspace-utilities-contract-helpers';
import { formatReserves, formatUserSummary } from 'paraspace-utilities-math-utils';
import { ERC721Symbol } from 'paraspace-configs-v2';
import { isEmpty, values } from 'lodash';
import BigNumber from 'bignumber.js';

import { useEOAProvider } from '../../EOAProvider';
import { ERC20_CONFIG, Network, contractsConfig } from '../../../config';
import { Maybe } from '../../../typings/basic';
import { ERC20BalanceInfo, UserBalanceInfos } from '../types';

import { PositionMap } from './types';
import {
  extractERC721BalanceFromUserPosition,
  extractUniswapBalancesFromPosition,
  getForgedNativeTokenBalanceInfo,
  getPositionMapFromUserPosition
} from './utils';

import { convertToChecksumAddress } from '@/apps/parax/utils';
import { ERC20Symbol } from '@/apps/parax/typings';

const PUNKS_NFT_TYPE = 2;

export const useBalancesLoader = () => {
  const { provider, chainId } = useEOAProvider();
  const contracts = contractsConfig.contracts[chainId];
  const ERC20Config = ERC20_CONFIG;
  const ERC721Config = contractsConfig.nft[chainId]?.collection;

  const viewer = useMemo(() => {
    if (!provider) {
      return null;
    }
    return new DeploylessViewerClient(provider);
  }, [provider]);

  const uiPoolDataProvider = useMemo(
    () =>
      new UiPoolDataProvider({
        uiPoolDataProviderAddress: contracts.UiPoolDataProvider,
        provider,
        chainId
      }),
    [chainId, contracts.UiPoolDataProvider, provider]
  );

  const walletBalanceProvider = useMemo(
    () =>
      new WalletBalanceProvider({
        walletBalanceProviderAddress: contracts.WalletBalanceProvider,
        provider
      }),
    [contracts.WalletBalanceProvider, provider]
  );

  const loadUserPositions = useCallback(
    async (accountAddress: string) => {
      if (!viewer) {
        return null;
      }

      const reserveData = await uiPoolDataProvider.getReservesHumanized({
        lendingPoolAddressProvider: contracts.PoolAddressesProvider
      });

      const userReservesData = await uiPoolDataProvider.getUserReservesHumanized({
        lendingPoolAddressProvider: contracts.PoolAddressesProvider,
        user: accountAddress,
        reservesDataHumanized: reserveData
      });

      const currentTimestamp = (new Date().getTime() / 1000).toFixed(0);
      const formatReservesData = formatReserves({
        reserves: reserveData.reservesData,
        currentTimestamp: Number(currentTimestamp),
        marketReferenceCurrencyDecimals:
          reserveData.baseCurrencyData.marketReferenceCurrencyDecimals,
        marketReferencePriceInUsd: reserveData.baseCurrencyData.marketReferenceCurrencyPriceInUsd
      });

      const formatUserSummaryData = formatUserSummary({
        currentTimestamp: Number(currentTimestamp),
        marketReferenceCurrencyDecimals:
          reserveData.baseCurrencyData.marketReferenceCurrencyDecimals,
        marketReferencePriceInUsd: reserveData.baseCurrencyData.marketReferenceCurrencyPriceInUsd,
        userReserves: userReservesData.userReserves,
        userEmodeCategoryId: userReservesData.userEmodeCategoryId,
        formattedReserves: formatReservesData
      });

      // For now the getPunksBalance is only supported on ethereum network.
      if ([Network, Network.GOERLI].includes(chainId)) {
        // const punksBalance = await getPunksBalance();
        const rawData = await viewer.getAllTokensByOwner(
          accountAddress,
          contracts.PUNKS,
          PUNKS_NFT_TYPE
        );
        const punksBalance = rawData.tokenInfos as number[];
        const wpunksUserReservesData = formatUserSummaryData.userReservesData.find(
          item => item.reserve.symbol === ERC721Symbol.WPUNKS
        );
        if (punksBalance && wpunksUserReservesData) {
          const formatUserSummaryDataWithPunks = {
            ...formatUserSummaryData,
            userReservesData: [
              ...formatUserSummaryData.userReservesData,
              {
                ...wpunksUserReservesData,
                ownedTokens: punksBalance,
                underlyingAsset: contracts.PUNKS,
                suppliedTokens: [],
                collaterizedTokens: [],
                auctionedTokens: [],
                collaterizedBalance: '0',
                scaledXTokenBalance: '0',
                reserve: {
                  ...wpunksUserReservesData.reserve,
                  symbol: ERC721Symbol.PUNK,
                  underlyingAsset: contracts.PUNKS
                }
              }
            ]
          };
          return formatUserSummaryDataWithPunks;
        }
      }

      return formatUserSummaryData;
    },
    [viewer, uiPoolDataProvider, contracts.PoolAddressesProvider, contracts.PUNKS, chainId]
  );

  const getUserERC20BalanceInfos = useCallback(
    async (
      accountAddress: string,
      positionMap: Maybe<PositionMap>
    ): Promise<ERC20BalanceInfo[]> => {
      const erc20Tokens = (Object.keys(ERC20Config) as ERC20Symbol[])
        .filter(key => !ERC20Config[key]?.isNativeToken)
        .map(key => {
          const { contractName, decimals } = ERC20Config[key]!;
          return {
            symbol: key,
            address: contracts[contractName],
            decimals
          };
        });
      const assets = erc20Tokens.map(token => token.address);
      const balances = await walletBalanceProvider.batchBalanceOf([accountAddress], assets);

      return erc20Tokens.map(({ symbol, address, decimals }, index) => {
        const positionInfo = positionMap?.[symbol.toLowerCase()];

        return {
          symbol,
          address,
          balance: new BigNumber(balances[index].toString()).shiftedBy(-decimals),
          priceInUSD: new BigNumber(positionInfo?.reserve.priceInUSD ?? 0),
          displayName: symbol
        };
      });
    },
    [walletBalanceProvider, ERC20Config, contracts]
  );

  const getAccountBalance = useCallback(
    async (account: string) => {
      const userPositions = await loadUserPositions(account);
      const positionMap = userPositions ? getPositionMapFromUserPosition(userPositions) : null;

      // ERC721
      const ERC721Balances = positionMap
        ? extractERC721BalanceFromUserPosition(positionMap, values(ERC721Config))
        : [];

      // ERC20
      const erc20BalanceInfos = await getUserERC20BalanceInfos(account, positionMap);

      // TODO please remove it when the wrong AA migration work is done
      const ACCOUNT_LIST_THAT_NEEDS_TO_DISPLAY_PTOKEN = [
        '0xA83725D3e40bd05f4953C31C2C4658DFf0635586'
      ].concat(
        [Network.GOERLI].includes(chainId)
          ? [
              '0x0d68061aCaB78486Cd20Fc4cb2834Ba77d5dF0f5',
              '0xE836fE5Ab1f0d31E5CDb0a6162b0D9d25835533d', // EOA: 0xd5009F65e68BC4c1FD28A1Bd79dE1448A49A7201
              '0x534CDDc86C9e59De7B30135B5E9183f3d7651939', // EOA: 0xA3a692D57f6dBb9E7C8A1bfC3101F8B4Da97F996
              '0x7F7782e94a077EedA66055F0BA65316326f263a5' // EOA: 0x018BE500Be1Fa7aA05f8a1725D32E0D66ab8740B
            ]
          : []
      );

      if (ACCOUNT_LIST_THAT_NEEDS_TO_DISPLAY_PTOKEN.includes(account) && !isEmpty(ERC721Config)) {
        const pTokenBalance = [ERC721Config.BAYC, ERC721Config.MAYC, ERC721Config.BAKC].map(
          tokenConfig => {
            const positionInfo = positionMap?.[tokenConfig!.symbol.toLowerCase()];
            return {
              address: convertToChecksumAddress(positionInfo?.reserve.aTokenAddress ?? ''),
              tokenIds: positionInfo?.suppliedTokens ?? [],
              symbol: tokenConfig.symbol,
              name: tokenConfig.contractName,
              collectionName: `Supplied ${tokenConfig.symbol}`,
              priceInUSD: new BigNumber(positionInfo?.reserve.priceInUSD ?? 0)
            };
          }
        );
        ERC721Balances.unshift(...pTokenBalance);

        const cAPEPosition = positionMap?.[ERC20Symbol.CAPE.toLowerCase()];
        const pcAPEBalance = await walletBalanceProvider.batchBalanceOf(
          [account],
          [cAPEPosition?.reserve.aTokenAddress ?? '']
        );

        erc20BalanceInfos.unshift({
          symbol: ERC20Symbol.CAPE,
          address: cAPEPosition?.reserve.aTokenAddress ?? '',
          balance: new BigNumber(pcAPEBalance[0].toString()).shiftedBy(-ERC20Config.CAPE.decimals),
          priceInUSD: BigNumber(cAPEPosition!.reserve.priceInUSD ?? 0),
          displayName: `Supplied cAPE`,
          isNativeToken: false
        });
      }

      const nativeTokenBalance = await provider?.getBalance(account);
      const forgedNativeTokenBalanceInfo = getForgedNativeTokenBalanceInfo({
        erc20Config: ERC20Config,
        positionMap,
        nativeTokenBalance: new BigNumber(nativeTokenBalance.toString())
      });

      // Uniswap
      const uniswapBalances = positionMap?.[ERC721Symbol.UNISWAP_LP.toLowerCase()]
        ? extractUniswapBalancesFromPosition(
            positionMap?.[ERC721Symbol.UNISWAP_LP.toLowerCase()],
            contracts
          )
        : [];

      return {
        ERC20Balances: erc20BalanceInfos.concat(forgedNativeTokenBalanceInfo),
        ERC721Balances,
        uniswapBalances
      } as UserBalanceInfos;
    },
    [
      ERC20Config,
      ERC721Config,
      chainId,
      contracts,
      getUserERC20BalanceInfos,
      loadUserPositions,
      provider,
      walletBalanceProvider
    ]
  );

  return getAccountBalance;
};
