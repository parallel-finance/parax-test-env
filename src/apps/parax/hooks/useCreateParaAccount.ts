import { useCallback, useState } from 'react';

import { useAAAccountFactory } from './useAAAccountFactory';

import { useAAProvider, useEOAProvider, useParaXToast } from '@/apps/parax/contexts';
import { getUserFriendlyError } from '@/apps/parax/utils';

export const useCreateParaAccount = () => {
  const [loading, setLoading] = useState(false);

  const parallelToast = useParaXToast();
  const { createParaAccount } = useAAAccountFactory();
  const { account: EOAAccount } = useEOAProvider();
  const { mockAccount } = useAAProvider();

  const createParaAccountHandle = useCallback(async () => {
    setLoading(true);
    const submitPromise = createParaAccount()
      .then(async tx => {
        const result = await tx?.wait();
        const createdAccount = result?.logs[0].address;
        if (createdAccount) {
          mockAccount(EOAAccount, createdAccount);
        }
        return createdAccount;
      })
      .catch(err => {
        throw getUserFriendlyError(err);
      })
      .finally(() => setLoading(false));
    return parallelToast.promise(submitPromise);
  }, [createParaAccount, parallelToast, mockAccount, EOAAccount]);

  return {
    loading,
    createParaAccountHandle
  };
};
