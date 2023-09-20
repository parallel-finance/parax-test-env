import { useCallback } from 'react';
import { Contract } from 'ethers';
import { decode } from 'js-base64';

import { useEOAProvider } from '@/apps/parax/contexts';

const MINIMUM_ABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'positions',
    outputs: [
      {
        internalType: 'uint96',
        name: 'nonce',
        type: 'uint96'
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'token0',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'token1',
        type: 'address'
      },
      {
        internalType: 'uint24',
        name: 'fee',
        type: 'uint24'
      },
      {
        internalType: 'int24',
        name: 'tickLower',
        type: 'int24'
      },
      {
        internalType: 'int24',
        name: 'tickUpper',
        type: 'int24'
      },
      {
        internalType: 'uint128',
        name: 'liquidity',
        type: 'uint128'
      },
      {
        internalType: 'uint256',
        name: 'feeGrowthInside0LastX128',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'feeGrowthInside1LastX128',
        type: 'uint256'
      },
      {
        internalType: 'uint128',
        name: 'tokensOwed0',
        type: 'uint128'
      },
      {
        internalType: 'uint128',
        name: 'tokensOwed1',
        type: 'uint128'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];

export const useERC721ImagesThroughContract = () => {
  const { provider } = useEOAProvider();

  const getERC721ImagesThroughContract = useCallback(
    async ({ tokenId, address }: { tokenId: number; address: string }) => {
      try {
        const contract = new Contract(address, MINIMUM_ABI, provider);

        const tokenData = await contract.tokenURI(tokenId).then((rawUri: string) => {
          const data = JSON.parse(decode(rawUri.split(',')[1]));
          return data;
        });

        return tokenData as {
          name: string;
          description: string;
          image: string;
        };
      } catch (e: unknown) {
        console.log(`Fetch erc721 image failed, tokenIds: ${tokenId} error: ${e}`);
        return null;
      }
    },
    [provider]
  );

  return getERC721ImagesThroughContract;
};
