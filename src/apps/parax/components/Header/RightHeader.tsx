import { H6, Icon, Inline, Button } from '@parallel-mono/components';
import { memo, useCallback, MouseEvent } from 'react';
import styled from 'styled-components';
import tinycolor from 'tinycolor2';

import { ValuePill } from '../ValuePill';
import { ColorModeSwitch } from '../ColorModeSwitch';
import { WalletIcon, useWalletModalContext } from '../Wallet';
import { WalletTypeEnum } from '../../contexts';

import { CreateParaAccount } from './components';

import { useEOAProvider, useAAProvider, useAccountPanel } from '@/apps/parax/contexts';
import { truncateTextMid } from '@/apps/parax/utils';

const ClickablePill = styled(ValuePill)<{ disabled?: boolean }>`
  ${({ disabled, theme }) =>
    disabled
      ? 'cursor: default;'
      : `
&:hover {
  background: ${tinycolor(theme.skin.primary.main).setAlpha(0.05).toString()};
}`}
`;
const BorderedPill = styled(ClickablePill)`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
`;

const NoBorderedPill = styled(ClickablePill)`
  border-left: none;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`;

const CursorInline = styled(Inline)`
  cursor: pointer;
`;

const stopPropagation = (e: MouseEvent) => e.stopPropagation();

export const RightHeader = memo(() => {
  const { isUsingUserWallet, account: eoaAccount, walletType } = useEOAProvider();
  const { account: paraAccount } = useAAProvider();
  const { toggleAccountPanel } = useAccountPanel();
  const { isWalletModalOpen, setWalletModalOpen } = useWalletModalContext();

  const handleWalletConnectClick = () => {
    setWalletModalOpen(!isWalletModalOpen);
  };
  const handleClickParaAccount = useCallback(() => {
    toggleAccountPanel();
  }, [toggleAccountPanel]);

  return (
    <Inline gap="1rem" alignItems="center">
      {isUsingUserWallet ? (
        <>
          <ColorModeSwitch />
          <CursorInline gap="0">
            <BorderedPill gap="0.25rem">
              {paraAccount === null ? (
                <CreateParaAccount onMouseDown={stopPropagation} />
              ) : (
                <Inline data-escape-account-drawer gap="0.25rem" onClick={handleClickParaAccount}>
                  <Icon name="purse" strokeWidth={2} size="1.25rem" />
                  <H6>{truncateTextMid(paraAccount)}</H6>
                </Inline>
              )}
            </BorderedPill>
            <NoBorderedPill
              disabled={walletType === WalletTypeEnum.GNOSIS_SAFE}
              onClick={
                walletType === WalletTypeEnum.GNOSIS_SAFE
                  ? undefined
                  : () => setWalletModalOpen(!isWalletModalOpen)
              }
            >
              <WalletIcon wallet={walletType} width="1.25rem" height="1.25rem" />
              <H6>{truncateTextMid(eoaAccount)}</H6>
            </NoBorderedPill>
          </CursorInline>
        </>
      ) : (
        <Inline gap="1rem" alignItems="center">
          <Button skin="primary" onClick={handleWalletConnectClick}>
            Connect Wallet
          </Button>
        </Inline>
      )}
    </Inline>
  );
});
