import { useCallback, useMemo } from 'react';
import { ERC721Service } from 'paraspace-utilities-contract-helpers';

import submitTransaction from '@/apps/parax/utils/submitTransaction';
import { useEOAProvider } from '@/apps/parax/contexts';

const useERC721 = (assetAddr: string) => {
  const { provider, account } = useEOAProvider();

  const service = useMemo(() => {
    if (!provider) {
      return null;
    }
    return new ERC721Service(provider);
  }, [provider]);

  const checkApprovalForAll = useCallback(
    async (spender: string) => {
      if (!service) {
        return false;
      }

      const result = await service.isApprovedForAll({
        user: account,
        spender,
        token: assetAddr,
        token_ids: []
      });
      return result;
    },
    [service, account, assetAddr]
  );

  const setApprovalForAll = useCallback(
    async (spender: string) => {
      if (!provider || !service) {
        return null;
      }

      const tx = await service.setApprovalForAll({
        spender,
        user: account,
        token: assetAddr
      });
      const txRes = submitTransaction({ provider, tx });
      return txRes;
    },
    [assetAddr, account, provider, service]
  );

  const isApproved = useCallback(
    async ({
      user = account,
      spender,
      tokenId
    }: {
      user?: string;
      spender: string;
      tokenId: string;
    }) => {
      if (!provider || !service) {
        return null;
      }

      const hasApproved = await service.isApproved({
        spender,
        user,
        token: assetAddr,
        token_id: tokenId
      });
      return hasApproved;
    },
    [assetAddr, provider, service, account]
  );
  const approve = useCallback(
    async ({
      user = account,
      spender,
      tokenId
    }: {
      user?: string;
      spender: string;
      tokenId: string;
    }) => {
      if (!provider || !service) {
        return null;
      }

      const tx = await service.approve({
        spender,
        user,
        token: assetAddr,
        token_id: tokenId
      });
      const txRes = submitTransaction({ provider, tx });
      return txRes;
    },
    [provider, service, assetAddr, account]
  );

  const balanceOf = useCallback(
    async (param: string | { assetAddress: string; owner: string }[]) => {
      if (!service || !provider) {
        return null;
      }

      // get the sum of multiple nfts's balance
      if (Array.isArray(param)) {
        const result = await Promise.all(
          param.map(async ({ assetAddress, owner }) => {
            return service.balanceOf(assetAddress, owner);
          })
        );
        return result.reduce((prev, curr) => {
          return prev + curr.toNumber();
        }, 0);
      }

      const result = await service.balanceOf(assetAddr, param);
      return result.toNumber();
    },
    [assetAddr, provider, service]
  );

  const ownerOf = useCallback(
    async (tokenId: number, address?: string) => {
      if (!service || !provider) {
        return '';
      }

      const contractAddress = address ?? assetAddr;
      return service.getContractInstance(contractAddress).ownerOf(tokenId);
    },
    [assetAddr, provider, service]
  );

  return { setApprovalForAll, checkApprovalForAll, isApproved, approve, balanceOf, ownerOf };
};

export default useERC721;
