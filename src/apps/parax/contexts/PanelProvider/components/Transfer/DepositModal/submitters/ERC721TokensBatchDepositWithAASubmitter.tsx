import { memo, useCallback } from 'react';

import { ERC721TokenAssets } from '../../components';
import { useTransfer } from '../../hooks/useTransfer';

import { FormSubmitter } from '@/apps/parax/components';
import { useEOAProvider } from '@/apps/parax/contexts/EOAProvider';
import { useAAProvider } from '@/apps/parax/contexts/AAProvider';

export const ERC721TokensBatchDepositWithAASubmitter = memo(
  ({
    formData: { assets, paraAccount },
    onError,
    onFinish
  }: {
    formData: { assets: ERC721TokenAssets; paraAccount: string };
    onError: () => void;
    onFinish: () => void;
  }) => {
    const { account: eoaAccount } = useEOAProvider();
    const { provider: AAProvider } = useAAProvider();

    const { genTxDataTransferERC721 } = useTransfer();

    const submit = useCallback(
      () =>
        AAProvider.submitTransactionsWithParaAccount(
          assets.map(asset => {
            return genTxDataTransferERC721(eoaAccount, paraAccount, asset.address, asset.tokenId);
          })
        ),
      [AAProvider, eoaAccount, genTxDataTransferERC721, assets, paraAccount]
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
