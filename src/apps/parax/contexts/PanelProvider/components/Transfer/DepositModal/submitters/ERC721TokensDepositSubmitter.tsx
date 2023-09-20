import { memo, useCallback } from 'react';

import { ERC721TokenAssets } from '../../components';
import { useTransfer } from '../../hooks/useTransfer';

import { FormSubmitter } from '@/apps/parax/components';
import { useEOAProvider } from '@/apps/parax/contexts/EOAProvider';

export const ERC721TokenDepositSubmitter = memo(
  ({
    formData: { asset, paraAccount },
    onError,
    onFinish
  }: {
    formData: { asset: ERC721TokenAssets[number]; paraAccount: string };
    onError: () => void;
    onFinish: () => void;
  }) => {
    const { provider, account: eoaAccount } = useEOAProvider();

    const { genTxDataTransferERC721 } = useTransfer();

    const submit = useCallback(
      () =>
        provider
          .getSigner()
          .sendTransaction(
            genTxDataTransferERC721(eoaAccount, paraAccount, asset.address, asset.tokenId)
          ),
      [provider, genTxDataTransferERC721, eoaAccount, paraAccount, asset]
    );

    return (
      <FormSubmitter
        submit={submit}
        onError={onError}
        onFinish={onFinish}
        inProgressMessage="Deposit ERC721"
      />
    );
  }
);
