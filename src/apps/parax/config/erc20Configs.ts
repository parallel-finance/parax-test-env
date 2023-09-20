import { ERC20Symbol } from '../typings';

import { erc20Decimals } from './erc20DecimalsConfig';

export type ERC20Config = Record<
  ERC20Symbol,
  {
    contractName: string;
    isNativeToken?: boolean;
    isWrappedNativeToken?: boolean;
    nativeTokenSymbol?: string;
    displayName?: string;
    decimals: number;
  }
>;

export const ERC20_CONFIG = {
  [ERC20Symbol.APE]: {
    decimals: erc20Decimals[ERC20Symbol.APE],
    contractName: 'APE'
  },
  [ERC20Symbol.CAPE]: {
    decimals: erc20Decimals[ERC20Symbol.CAPE],
    contractName: 'cAPE'
  },
  [ERC20Symbol.SAPE]: {
    decimals: erc20Decimals[ERC20Symbol.SAPE],
    displayName: 'Staked Ape',
    contractName: 'sAPE'
  },
  [ERC20Symbol.ETH]: {
    decimals: erc20Decimals[ERC20Symbol.ETH],
    isNativeToken: true,
    contractName: ''
  },
  [ERC20Symbol.WETH]: {
    decimals: erc20Decimals[ERC20Symbol.WETH],
    nativeTokenSymbol: 'ETH',
    contractName: 'WETH',
    isWrappedNativeToken: true
  },
  [ERC20Symbol.STETH]: {
    decimals: erc20Decimals[ERC20Symbol.STETH],
    contractName: 'stETH'
  },
  [ERC20Symbol.WSTETH]: {
    decimals: erc20Decimals[ERC20Symbol.WSTETH],
    contractName: 'wstETH'
  },
  [ERC20Symbol.CBETH]: {
    decimals: erc20Decimals[ERC20Symbol.CBETH],
    contractName: 'cbETH'
  },
  [ERC20Symbol.RETH]: {
    decimals: erc20Decimals[ERC20Symbol.RETH],
    contractName: 'rETH'
  },
  [ERC20Symbol.AWETH]: {
    decimals: erc20Decimals[ERC20Symbol.AWETH],
    contractName: 'aWETH'
  },
  [ERC20Symbol.USDC]: {
    decimals: erc20Decimals[ERC20Symbol.USDC],
    contractName: 'USDC'
  },
  [ERC20Symbol.USDT]: {
    decimals: erc20Decimals[ERC20Symbol.USDT],
    contractName: 'USDT'
  },
  [ERC20Symbol.DAI]: {
    decimals: erc20Decimals[ERC20Symbol.DAI],
    contractName: 'DAI'
  },
  [ERC20Symbol.WBTC]: {
    decimals: erc20Decimals[ERC20Symbol.WBTC],
    contractName: 'WBTC'
  },
  [ERC20Symbol.BLUR]: {
    decimals: erc20Decimals[ERC20Symbol.BLUR],
    contractName: 'BLUR'
  },
  [ERC20Symbol.FRAX]: {
    decimals: erc20Decimals[ERC20Symbol.FRAX],
    contractName: 'FRAX'
  }
} as ERC20Config;
