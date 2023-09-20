import { TransactionResponse } from '@ethersproject/providers';
import { useCallback, useMemo, useRef, useState } from 'react';
import { isArray } from 'lodash';

import { ApprovingStatus } from './types';

import { Maybe } from '@/apps/parax/typings/basic';
import { FetchingStatus } from '@/apps/parax/typings';
import { getUserFriendlyError } from '@/apps/parax/utils';

export const useApproval = <AllowanceType>({
  getAllowance,
  checkAllowance,
  createApproveTransaction
}: {
  getAllowance: () => Promise<AllowanceType>;
  checkAllowance: (allowance: Maybe<AllowanceType>) => boolean;
  createApproveTransaction: (
    allowance: Maybe<AllowanceType>
  ) => Promise<TransactionResponse | null | void[]>;
}) => {
  const [allowance, setAllowance] = useState<Maybe<AllowanceType>>(null);
  const [checkingStatus, setCheckingStatus] = useState<FetchingStatus>(FetchingStatus.INIT);
  const [signing, setSigning] = useState(false);
  const [signAndApprovingStatus, setSignAndApprovingStatus] = useState<FetchingStatus>(
    FetchingStatus.INIT
  );
  const checking = checkingStatus === FetchingStatus.FETCHING;
  const signAndApproving = signAndApprovingStatus === FetchingStatus.FETCHING;

  const checkingRef = useRef(checking);
  checkingRef.current = checking;
  const signAndApprovingRef = useRef(checking);
  signAndApprovingRef.current = signAndApproving;

  const check = useCallback(async () => {
    if (checkingRef.current) {
      throw new Error('there already is a checking in process');
    }

    setCheckingStatus(FetchingStatus.FETCHING);
    return getAllowance()
      .then(latestAllowance => {
        setAllowance(latestAllowance);
        setCheckingStatus(FetchingStatus.SUCCESS);
        return latestAllowance;
      })
      .catch(err => {
        setCheckingStatus(FetchingStatus.FAIL);
        throw getUserFriendlyError(err);
      });
  }, [getAllowance]);

  const approve = useCallback(async () => {
    if (signAndApprovingRef.current) {
      throw new Error('there already is a approving in process');
    }
    if (checkingRef.current) {
      throw new Error('can not approve while checking allowance');
    }
    if (checkAllowance(allowance)) {
      throw new Error('current allowance is enough, no need to approve more');
    }
    setSignAndApprovingStatus(FetchingStatus.FETCHING);
    setSigning(true);
    try {
      const tx = await createApproveTransaction(allowance);
      setSigning(false);
      if (!isArray(tx) && tx?.wait) await tx.wait();
      const latestAllowance = await getAllowance();
      setAllowance(latestAllowance);
      setSignAndApprovingStatus(FetchingStatus.SUCCESS);
    } catch (err) {
      setSigning(false);
      setSignAndApprovingStatus(FetchingStatus.FAIL);
      throw err;
    }
  }, [createApproveTransaction, getAllowance, checkAllowance, allowance]);

  const status: ApprovingStatus = useMemo(() => {
    if (checkAllowance(allowance)) {
      return ApprovingStatus.APPROVED;
    }
    if (checkingStatus === FetchingStatus.FAIL) {
      return ApprovingStatus.ERROR_CHECKING;
    }
    if (checking) {
      return ApprovingStatus.CHECKING;
    }
    if (signAndApprovingStatus === FetchingStatus.FAIL) {
      return ApprovingStatus.ERROR_APPROVING;
    }
    if (signing) {
      return ApprovingStatus.SIGNING;
    }
    if (signAndApproving) {
      return ApprovingStatus.APPROVING;
    }
    if (checkingStatus === FetchingStatus.INIT) {
      return ApprovingStatus.IDLE;
    }
    return ApprovingStatus.NOT_APPROVED;
  }, [
    checkingStatus,
    signAndApprovingStatus,
    checkAllowance,
    allowance,
    signing,
    checking,
    signAndApproving
  ]);

  return {
    approve,
    check,
    status,
    allowance,
    approved: status === ApprovingStatus.APPROVED,
    errorChecking: status === ApprovingStatus.ERROR_CHECKING,
    errorApproving: status === ApprovingStatus.ERROR_APPROVING,
    notApproved: status === ApprovingStatus.NOT_APPROVED,
    signing: status === ApprovingStatus.SIGNING,
    checking: status === ApprovingStatus.CHECKING,
    approving: status === ApprovingStatus.APPROVING
  };
};
