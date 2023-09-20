import { memo, useCallback } from 'react';
import BigNumber from 'bignumber.js';

import { ERC20TokenAssets } from '../../components';
import { useTransfer } from '../../hooks/useTransfer';

import { FormSubmitter } from '@/apps/parax/components';
import { useEOAProvider } from '@/apps/parax/contexts/EOAProvider';
import { ERC20_CONFIG } from '@/apps/parax/config';

export const ERC20TokensDepositSubmitter = memo(
  ({
    formData: { assets, paraAccount },
    onError,
    onFinish
  }: {
    formData: { assets: ERC20TokenAssets; paraAccount: string };
    onError: () => void;
    onFinish: () => void;
  }) => {
    const { provider } = useEOAProvider();
    const ERC20Config = ERC20_CONFIG;

    const { genTxTransferETH, genTxDataTransferERC20 } = useTransfer();

    const submit = useCallback(() => {
      return Promise.all(
        assets.map(asset => {
          // ETH
          if (!asset.address) {
            return provider
              .getSigner()
              .sendTransaction(
                genTxTransferETH(
                  paraAccount,
                  BigNumber(asset.value).shiftedBy(ERC20Config[asset.symbol].decimals).toString(10)
                )
              );
          }
          return provider
            .getSigner()
            .sendTransaction(
              genTxDataTransferERC20(
                paraAccount,
                asset.address,
                BigNumber(asset.value).shiftedBy(ERC20Config[asset.symbol].decimals).toString(10)
              )
            );
        })
      );
    }, [provider, genTxTransferETH, genTxDataTransferERC20, assets, ERC20Config, paraAccount]);

    return (
      <FormSubmitter
        submit={submit}
        onError={onError}
        onFinish={onFinish}
        inProgressMessage="Deposit ERC20"
      />
    );
  }
);
