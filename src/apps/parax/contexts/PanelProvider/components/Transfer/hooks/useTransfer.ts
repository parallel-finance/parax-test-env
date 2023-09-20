import { ethers } from 'ethers';
import { useCallback } from 'react';

import { contractsConfig } from '@/apps/parax/config';
import { useEOAProvider } from '@/apps/parax/contexts';

export const useTransfer = () => {
  const { chainId } = useEOAProvider();

  const genTxTransferETH = useCallback((toAddress: string, amount: string) => {
    return {
      to: toAddress,
      value: amount
    };
  }, []);

  const genTxDataTransferERC20 = useCallback(
    (toAddress: string, contractAddress: string, amount: string) => {
      const contract = new ethers.Contract(contractAddress, [
        'function transfer(address to, uint256 value) returns (bool)'
      ]);

      const transaction = {
        to: contractAddress,
        data: contract.interface.encodeFunctionData('transfer', [toAddress, amount]),
        value: '0'
      };

      return transaction;
    },
    []
  );

  const genTxDataTransferERC721 = useCallback(
    (fromAddress: string, toAddress: string, contractAddress: string, tokenId: number) => {
      const contract = new ethers.Contract(contractAddress, [
        'function safeTransferFrom(address from, address to, uint256 tokenId) external',
        'function transferPunk(address to, uint256 punkIndex)'
      ]);
      const punkContractName = contractsConfig.nft[chainId]?.collection.PUNK.contractName!;
      const transaction = {
        to: contractAddress,
        data:
          contractAddress === contractsConfig.contracts[chainId][punkContractName]
            ? contract.interface.encodeFunctionData('transferPunk', [toAddress, tokenId])
            : contract.interface.encodeFunctionData('safeTransferFrom', [
                fromAddress,
                toAddress,
                tokenId
              ]),
        value: '0'
      };

      return transaction;
    },
    [chainId]
  );

  return {
    genTxTransferETH,
    genTxDataTransferERC20,
    genTxDataTransferERC721
  };
};
