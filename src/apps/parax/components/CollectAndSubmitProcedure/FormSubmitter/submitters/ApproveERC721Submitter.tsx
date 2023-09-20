import { memo, useEffect, useRef } from 'react';

import { ApprovingStatus, useERC721Approval } from '../../hooks';
import { ApproveWallet, InProgress } from '../../components';

import { useParaXToast } from '@/apps/parax/contexts';
import { getUserFriendlyError } from '@/apps/parax/utils';

type ApproveERC721FormData = {
  name: string;
  assetAddress: string;
  spender: string;
};

type ApproveERC721SubmitterProps = {
  formData: ApproveERC721FormData;
  onFinish: () => void;
  onError: () => void;
};

export const ApproveERC721Submitter = memo(
  ({ onFinish, onError, formData }: ApproveERC721SubmitterProps) => {
    const { assetAddress, name, spender } = formData;
    const {
      approve,
      status: approvingStatus,
      check
    } = useERC721Approval({
      token: assetAddress,
      spender
    });

    useEffect(() => {
      check().catch(null);
    }, [check]);

    const onFinishRef = useRef<ApproveERC721SubmitterProps['onFinish'] | null>(null);
    onFinishRef.current = onFinish;
    const onErrorRef = useRef<ApproveERC721SubmitterProps['onError'] | null>(null);
    onErrorRef.current = onError;

    const paraXToast = useParaXToast();

    useEffect(() => {
      if (approvingStatus === ApprovingStatus.APPROVED) {
        onFinishRef.current?.();
      } else if (
        approvingStatus === ApprovingStatus.ERROR_APPROVING ||
        approvingStatus === ApprovingStatus.ERROR_CHECKING
      ) {
        onErrorRef.current?.();
      } else if (approvingStatus === ApprovingStatus.NOT_APPROVED) {
        paraXToast.promise(
          approve().catch(e => {
            throw getUserFriendlyError(e);
          })
        );
      }
    }, [paraXToast, approve, approvingStatus]);

    if (approvingStatus === ApprovingStatus.CHECKING || approvingStatus === ApprovingStatus.IDLE) {
      return <InProgress message={`Checking approval for ${name}`} />;
    }

    if (
      approvingStatus === ApprovingStatus.SIGNING ||
      approvingStatus === ApprovingStatus.NOT_APPROVED
    ) {
      return <ApproveWallet />;
    }

    if (
      approvingStatus === ApprovingStatus.APPROVING ||
      approvingStatus === ApprovingStatus.APPROVED
    ) {
      return <InProgress message={`Approving ${name}`} />;
    }

    return null;
  }
);
