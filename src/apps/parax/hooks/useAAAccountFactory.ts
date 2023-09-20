import { useCallback, useMemo } from 'react';
import { AAacountFactory } from 'paraspace-utilities-contract-helpers';

import { useEOAProvider } from '../contexts';
import submitTransaction from '../utils/submitTransaction';

import { useContractsMap } from './useContractsMap';

export const useAAAccountFactory = () => {
  const { provider, account } = useEOAProvider();
  const contracts = useContractsMap();

  const service = useMemo(() => {
    if (!provider || !contracts.AAAcountFactory) {
      return null;
    }
    return new AAacountFactory(provider, contracts.AAAcountFactory);
  }, [contracts.AAAcountFactory, provider]);

  const createParaAccount = useCallback(async () => {
    if (!provider || !service) {
      return null;
    }

    const salt = new Date().getTime();
    const tx = await service.createAccount({
      owner: account,
      salt
    });
    const txRes = submitTransaction({ provider, tx });
    return txRes;
  }, [account, provider, service]);

  return { createParaAccount };
};
