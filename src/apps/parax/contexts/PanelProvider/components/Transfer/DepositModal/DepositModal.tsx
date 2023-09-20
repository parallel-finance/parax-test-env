import { Modal, ModalProps } from '@parallel-mono/components';
import { memo } from 'react';

import { TransferAssets } from '../components';

import { DepositSteppers } from './DepositSteppers';

import {
  CollectAndSubmitProcedurePhase,
  useCollectAndSubmitProcedure,
  ErrorState,
  SuccessState
} from '@/apps/parax/components';

export type DepositModalProps = Omit<ModalProps, 'children'> & {
  formData: { assets: TransferAssets; paraAccount: string };
  onFinish?: () => void;
  onError?: () => void;
  onClose: () => void;
};

export const DepositModal = memo(
  ({ formData, isOpen, onClose, onFinish, onError, ...others }: DepositModalProps) => {
    const { phase, handleSubmitFailed, handleSubmitSuccess } = useCollectAndSubmitProcedure({
      defaultPhase: CollectAndSubmitProcedurePhase.Submitting,
      running: isOpen,
      onFinish,
      onError
    });

    return (
      <Modal style={{ zIndex: 99999 }} isOpen={isOpen} onClose={onClose} {...others}>
        {phase === CollectAndSubmitProcedurePhase.Submitting && (
          <DepositSteppers
            formData={formData}
            onFinish={handleSubmitSuccess}
            onError={handleSubmitFailed}
          />
        )}
        {phase === CollectAndSubmitProcedurePhase.Success && (
          <SuccessState desc="Deposit success" actionButtonText="Done" onAction={onClose} />
        )}
        {phase === CollectAndSubmitProcedurePhase.Failed && <ErrorState closeModal={onClose} />}
      </Modal>
    );
  }
);
