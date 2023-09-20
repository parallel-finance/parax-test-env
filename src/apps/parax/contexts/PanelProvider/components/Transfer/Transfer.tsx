import { HostedImage } from '@parallel-mono/business-components';
import { H4, Inline, Spinner, Text, useBreakpoints } from '@parallel-mono/components';
import BigNumber from 'bignumber.js';
import { useCallback, useState, useEffect, useMemo, memo } from 'react';
import { ethers } from 'ethers';

import { useEOAProvider, useAAProvider, useParaXToast, useBalanceProvider } from '../../..';
import { ERC20_CONFIG } from '../../../../config';
import { getUserFriendlyError } from '../../../../utils';

import {
  BaseLayout,
  AccountCardSelection,
  AccountCardInput,
  TransferAssets,
  ValidAddressIndicator
} from './components';
import { useTransfer } from './hooks/useTransfer';

import { XDrawer } from '@/apps/parax/components';

export const Transfer = memo((props: { isOpen: boolean; onClose: () => void }) => {
  const { isOpen, onClose, ...others } = props;
  const { account: EOAAccount } = useEOAProvider();
  const ERC20Config = ERC20_CONFIG;
  const { accounts: paraAccounts, account: activeParaAccount, provider } = useAAProvider();
  const { AABalances, refreshEOABalances, refreshAABalances } = useBalanceProvider();

  const { genTxDataTransferERC20, genTxDataTransferERC721 } = useTransfer();
  const toast = useParaXToast();

  const [currentEOAAccount, setCurrentEOAAccount] = useState(EOAAccount);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentEOAAccount(EOAAccount);
    }
  }, [isOpen, EOAAccount]);

  const isValidEOAAccount = useMemo(
    () => ethers.utils.isAddress(currentEOAAccount),
    [currentEOAAccount]
  );

  useEffect(() => {
    if (isOpen) {
      refreshAABalances();
    }
  }, [isOpen, refreshAABalances]);

  const handleConfirmTransfer = useCallback(
    async (params: TransferAssets) => {
      setSubmitting(true);

      if (activeParaAccount) {
        const { ERC20Tokens, ERC721Tokens } = params;

        const transferETHTxs = ERC20Tokens.filter(i => !i.address).map(async t => ({
          to: currentEOAAccount,
          value: BigNumber(t.value).shiftedBy(ERC20Config[t.symbol].decimals).toString(10),
          data: '0x'
        }));

        const transferERC20Txs = ERC20Tokens.filter(i => !!i.address).map(t =>
          genTxDataTransferERC20(
            currentEOAAccount,
            t.address,
            BigNumber(t.value).shiftedBy(ERC20Config[t.symbol].decimals).toString(10)
          )
        );

        const transferERC721Txs = ERC721Tokens.map(t =>
          genTxDataTransferERC721(activeParaAccount, currentEOAAccount, t.address, t.tokenId)
        );

        toast.promise(
          Promise.all([...transferETHTxs, ...transferERC20Txs, ...transferERC721Txs])
            .then(async res => {
              const txs = res.map(txRes => ({
                to: txRes.to ?? currentEOAAccount,
                value: txRes.value?.toString() ?? '0',
                data: txRes.data ?? ''
              }));
              const tx = await provider.submitTransactionsWithParaAccount(txs);
              await tx.wait();
              if (currentEOAAccount === EOAAccount) {
                refreshEOABalances();
              }
              refreshAABalances();
              onClose();
            })
            .catch(e => {
              throw getUserFriendlyError(e);
            })
            .finally(() => {
              setSubmitting(false);
            })
        );
      }
    },
    [
      activeParaAccount,
      toast,
      currentEOAAccount,
      refreshEOABalances,
      refreshAABalances,
      ERC20Config,
      genTxDataTransferERC20,
      genTxDataTransferERC721,
      provider,
      onClose,
      EOAAccount
    ]
  );
  const { desktop } = useBreakpoints();

  return (
    <XDrawer
      escapeClickAwayAttribute="data-escape-transfer-assets-drawer"
      data-escape-deposit-assets-drawer
      data-escape-rewards-drawer
      data-escape-account-drawer
      top={desktop ? '60px' : '0'}
      isOpen={isOpen}
      size={desktop ? '800px' : '100%'}
      onClose={onClose}
      {...others}
    >
      {isOpen && (
        <BaseLayout
          onBack={onClose}
          type="Transfer"
          fromAccount={
            <>
              <H4>From</H4>
              <AccountCardSelection
                readOnly
                accounts={paraAccounts}
                account={activeParaAccount ?? ''}
              />
            </>
          }
          toAccount={
            <>
              <Inline gap="10px" alignItems="center">
                <H4>To</H4>
                <ValidAddressIndicator address={currentEOAAccount} />
              </Inline>
              <AccountCardInput
                label={<H4>Master Account</H4>}
                image={<HostedImage name="icons/marketplace/metamask" width="48px" height="48px" />}
                account={currentEOAAccount}
                onHandleChange={addr => setCurrentEOAAccount(addr)}
              />
            </>
          }
          balances={AABalances}
          actionButtonText={
            submitting ? (
              <Inline gap="10px">
                <Spinner />
                <Text>Confirming</Text>
              </Inline>
            ) : (
              <Text>Confirm Transfer</Text>
            )
          }
          actionButtonDisabled={!isValidEOAAccount || !activeParaAccount || submitting}
          onHandleAction={data => handleConfirmTransfer(data)}
        />
      )}
    </XDrawer>
  );
});
