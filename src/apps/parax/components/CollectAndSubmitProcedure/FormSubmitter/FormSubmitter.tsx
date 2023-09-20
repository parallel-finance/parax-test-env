import { memo, ReactNode, useRef, useState } from 'react';
import { useMount } from 'react-use';
import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers';
import { isArray } from 'lodash';
import { Stack } from '@parallel-mono/components';

import { ApproveWallet, InProgress } from '../components';

import { useParaXToast } from '@/apps/parax/contexts';
import { Maybe } from '@/apps/parax/typings/basic';
import { ErrorConfig, getUserFriendlyError } from '@/apps/parax/utils';

export type FormSubmitterProps = {
  submit: <T>() => Promise<Maybe<TransactionResponse> | Maybe<TransactionResponse>[] | void | T>;
  onError: (errorConfig: Maybe<ErrorConfig>) => void;
  prepare?: () => Promise<void>;
  inPreparationMessage?: ReactNode;
  onFinish: (results: Maybe<TransactionReceipt>[]) => void;
  inProgressMessage?: ReactNode;
  children?: ReactNode;
};

enum Phase {
  Preparing,
  Approving,
  Submitting
}

export const FormSubmitter = memo(
  ({
    onFinish,
    onError,
    submit,
    prepare,
    inPreparationMessage,
    inProgressMessage,
    children
  }: FormSubmitterProps) => {
    const [phase, setPhase] = useState<Phase>(prepare ? Phase.Preparing : Phase.Approving);

    const onFinishRef = useRef<Maybe<FormSubmitterProps['onFinish']>>(null);
    onFinishRef.current = onFinish;
    const onErrorRef = useRef<Maybe<FormSubmitterProps['onError']>>(null);
    onErrorRef.current = onError;

    const paraXToast = useParaXToast();

    useMount(async () => {
      if (prepare) {
        await prepare?.();
        setPhase(Phase.Approving);
      }
      const submitPromise = submit()
        .then(async tx => {
          setPhase(Phase.Submitting);
          const txs = isArray(tx) ? tx : [tx];
          return Promise.all(
            txs.map(it => {
              if ((it as TransactionResponse)?.wait) return (it as TransactionResponse)!.wait();
              return it;
            })
          );
        })
        .then(results => {
          onFinishRef.current?.(results as Maybe<TransactionReceipt>[]);
        })
        .catch(err => {
          const errConfig = getUserFriendlyError<ErrorConfig>(err, undefined, 'errObj');
          onErrorRef.current?.(errConfig ?? null);

          throw getUserFriendlyError(err);
        });
      paraXToast.promise(submitPromise);
    });

    if (phase === Phase.Preparing) {
      return (
        <Stack alignItems="center">
          {inPreparationMessage}
          {children}
        </Stack>
      );
    }

    if (phase === Phase.Approving) {
      return <ApproveWallet>{children}</ApproveWallet>;
    }

    if (phase === Phase.Submitting) {
      return <InProgress message={inProgressMessage}>{children}</InProgress>;
    }

    return null;
  }
);
