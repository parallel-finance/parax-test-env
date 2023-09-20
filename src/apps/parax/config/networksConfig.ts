import { Network } from 'paraspace-configs-v2';

export const SUPPORTED_NETWORK = Network.GOERLI;

export type NetworkConfig = {
  name: string;
  publicJsonRPCUrl: string[]; // public rpc used if not private found, and used to add specific network to wallets if user don't have them. Normally with slow rates
  /**
   * When this is set withdrawals will automatically be unwrapped
   */
  wrappedBaseAssetSymbol?: string;
  baseAssetSymbol: string;
  // needed for configuring the chain on metemask when it doesn't exist yet
  baseAssetDecimals: number;
  // function returning a link to etherscan
  explorerLink: string[];
  // set this to show faucets and similar
  isTestnet?: boolean;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
};

export const networkConfig: NetworkConfig = {
  name: 'Goerli',
  publicJsonRPCUrl: [
    // 'https://goerli.infura.io/v3/4731ac879a6d4552b98d52a5e043dd70',
    // 'https://goerli.infura.io/v3/d087235981064c84929590a1d83a814f',
    // 'https://goerli.infura.io/v3/9fe62e7a55f14efebb640b22ba860aea',
    'https://goerli.infura.io/v3/1c973d5b253f4700a8ce560ef8671685'
  ],
  baseAssetSymbol: 'ETH',
  wrappedBaseAssetSymbol: 'WETH',
  baseAssetDecimals: 18,
  explorerLink: ['https://goerli.etherscan.io'],
  isTestnet: true,
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18
  }
};
