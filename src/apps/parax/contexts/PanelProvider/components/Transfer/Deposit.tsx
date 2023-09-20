import { HostedImage } from '@parallel-mono/business-components';
import { H4, Inline, Spinner, Text, useBreakpoints } from '@parallel-mono/components';
import { memo, useCallback, useEffect, useState } from 'react';
import { noop } from 'lodash';

import { useEOAProvider, useAAProvider, useBalanceProvider } from '../../..';

import {
  BaseLayout,
  TransferAssets,
  AccountCardSelection,
  AccountCardInput,
  ValidAddressIndicator
} from './components';
import { DepositModal, DepositModalProps } from './DepositModal';

import { XDrawer } from '@/apps/parax/components';

const defaultDepositModalProps: DepositModalProps = {
  isOpen: false,
  formData: { assets: { ERC20Tokens: [], ERC721Tokens: [] }, paraAccount: '' },
  onClose: noop
};

export const Deposit = memo((props: { isOpen: boolean; onClose: () => void }) => {
  const { isOpen, onClose, ...others } = props;

  const { account: eoaAccount } = useEOAProvider();
  const { accounts: paraAccounts, account: activeParaAccount } = useAAProvider();

  const { EOABalances, refreshAABalances, refreshEOABalances } = useBalanceProvider();

  const [currentParaAccount, setCurrentParaAccount] = useState(activeParaAccount);

  useEffect(() => {
    if (isOpen) {
      setCurrentParaAccount(activeParaAccount);
    }
  }, [activeParaAccount, isOpen]);

  useEffect(() => {
    if (isOpen) {
      refreshEOABalances();
    }
  }, [isOpen, refreshEOABalances]);

  const { desktop } = useBreakpoints();

  const [depositModalProps, setDepositModalProps] =
    useState<DepositModalProps>(defaultDepositModalProps);

  const handleConfirmDeposit = useCallback(
    (params: TransferAssets) => {
      return new Promise<void>((resolve, reject) => {
        setDepositModalProps(prev => ({
          ...prev,
          isOpen: true,
          formData: { assets: params, paraAccount: currentParaAccount! },
          onFinish: resolve,
          onError: reject,
          onClose: () => {
            setDepositModalProps(defaultDepositModalProps);
          }
        }));
      }).finally(() => {
        if (activeParaAccount === currentParaAccount) {
          refreshAABalances();
        }
        refreshEOABalances();
      });
    },
    [currentParaAccount, refreshAABalances, activeParaAccount, refreshEOABalances]
  );

  return (
    <XDrawer
      escapeClickAwayAttribute="data-escape-deposit-assets-drawer"
      data-escape-transfer-transfer-drawer
      data-escape-transfer-rewards-drawer
      data-escape-transfer-account-drawer
      top={desktop ? '60px' : '0'}
      isOpen={isOpen}
      size={desktop ? '800px' : '100%'}
      onClose={onClose}
      {...others}
    >
      <DepositModal
        data-escape-deposit-assets-drawer
        data-escape-transfer-assets-drawer
        data-escape-rewards-drawer
        {...depositModalProps}
      />
      {isOpen && (
        <BaseLayout
          onBack={onClose}
          type="Deposit"
          fromAccount={
            <>
              <Inline gap="10px" alignItems="center">
                <H4>From </H4>
                <ValidAddressIndicator address={eoaAccount} />
              </Inline>
              <AccountCardInput
                label={<H4>Master Account</H4>}
                image={<HostedImage name="icons/marketplace/metamask" width="48px" height="48px" />}
                account={eoaAccount}
                readOnly
              />
            </>
          }
          toAccount={
            <>
              <H4>To</H4>
              <AccountCardSelection
                account={currentParaAccount ?? ''}
                accounts={paraAccounts}
                onChange={addr => setCurrentParaAccount(addr)}
              />
            </>
          }
          balances={EOABalances}
          actionButtonText={
            depositModalProps.isOpen ? (
              <Inline gap="10px">
                <Spinner />
                <Text>Confirming</Text>
              </Inline>
            ) : (
              <Text>Confirm Deposit</Text>
            )
          }
          actionButtonDisabled={
            !currentParaAccount || EOABalances.loading || depositModalProps.isOpen
          }
          onHandleAction={handleConfirmDeposit}
        />
      )}
    </XDrawer>
  );
});
