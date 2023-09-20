import { useCallback } from 'react';

import useERC721 from '../useERC721';

import { useApproval } from './useApproval';

import { Maybe } from '@/apps/parax/typings/basic';

export const useERC721Approval = ({ token, spender }: { token: string; spender: string }) => {
  const { setApprovalForAll, checkApprovalForAll } = useERC721(token);

  const getAllowance = useCallback(async () => {
    return checkApprovalForAll(spender);
  }, [checkApprovalForAll, spender]);

  const checkAllowance = useCallback(
    (approvedForAll: Maybe<boolean>) => approvedForAll ?? false,
    []
  );

  const createApproveTransaction = useCallback(async () => {
    return setApprovalForAll(spender);
  }, [setApprovalForAll, spender]);

  return useApproval<boolean>({
    getAllowance,
    checkAllowance,
    createApproveTransaction
  });
};
