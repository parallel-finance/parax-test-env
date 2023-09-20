import { useCallback, useEffect, useRef, useState } from 'react';

import { ErrorConfig } from '../../utils';
import { Maybe } from '../../typings/basic';

export enum CollectAndSubmitProcedurePhase {
  Idle,
  Collecting,
  Submitting,
  Success,
  Failed
}

export const useCollectAndSubmitProcedure = <FormData, Result = void, Err = ErrorConfig>(
  {
    defaultPhase = CollectAndSubmitProcedurePhase.Collecting,
    onError,
    onFinish,
    running
  }: {
    defaultPhase?: CollectAndSubmitProcedurePhase;
    onError?: (err?: Maybe<Err>) => void;
    onFinish?: (result: Result) => void;
    running: boolean;
  } = { running: false }
) => {
  const [phase, setPhase] = useState<CollectAndSubmitProcedurePhase>(defaultPhase);
  const [submittingError, setSubmittingError] = useState<Maybe<Err>>(null);

  const [submittedFormData, setSubmittedFormData] = useState<Maybe<FormData>>(null);
  const [submittingResult, setSubmittingResult] = useState<Maybe<Result>>(null);

  const defaultPhaseRef = useRef(defaultPhase);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  useEffect(() => {
    if (running) {
      setPhase(defaultPhaseRef.current);
    } else {
      if (
        ![CollectAndSubmitProcedurePhase.Success, CollectAndSubmitProcedurePhase.Failed].includes(
          phaseRef.current
        )
      ) {
        onErrorRef.current?.(null);
      }
      setPhase(CollectAndSubmitProcedurePhase.Idle);
    }
  }, [running]);

  const handleSubmitFailed = useCallback(
    (err: Maybe<Err> = null) => {
      setSubmittingError(err);
      setPhase(CollectAndSubmitProcedurePhase.Failed);
      onError?.(err);
    },
    [onError]
  );

  const handleSubmitSuccess = useCallback(
    (result: Result) => {
      setSubmittingResult(result);
      setPhase(CollectAndSubmitProcedurePhase.Success);
      onFinish?.(result);
    },
    [onFinish]
  );

  const handleFormSubmit = useCallback((formData: FormData) => {
    setSubmittedFormData(formData);
    setPhase(CollectAndSubmitProcedurePhase.Submitting);
  }, []);

  return {
    submittedFormData,
    submittingResult,
    submittingError,
    phase,
    handleSubmitSuccess,
    handleSubmitFailed,
    handleFormSubmit
  };
};
