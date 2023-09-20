import styled, { useTheme } from 'styled-components';
import {
  Button,
  H6,
  Icon,
  Inline,
  SmallText,
  Spinner,
  Stack,
  Container,
  stackTwoColors
} from '@parallel-mono/components';
import { HTMLAttributes, memo, useEffect } from 'react';
import { useCopyToClipboard } from 'react-use';

import { WalletIcon } from './WalletIcon';

import { truncateTextMid } from '@/apps/parax/utils/format';
import {
  getWalletDownloadUrl,
  isWalletInstalled,
  useEOAProvider,
  WalletTypeEnum,
  useParaXToast
} from '@/apps/parax/contexts';

const WalletsContainer = styled(Container).attrs({
  border: true
})`
  position: absolute;
  top: 4rem;
  right: 0;
  width: 23.5rem;
  padding: 1.5rem 1rem;
  z-index: 99999;
`;

const Wallet = styled(Container).attrs({
  background: 'slot'
})`
  border: 1px solid ${({ theme }) => theme.skin.grey[200]};
  border-radius: 1rem;
  cursor: pointer;
  padding: 0.75rem;
  padding-right: 1.5rem;
  justify-content: flex-start;
  background-size: cover;

  &:hover {
    background: ${({ theme }) =>
      stackTwoColors(theme.skin.background.slot, theme.skin.action.hoverMask)};
  }
`;

const Title = styled(SmallText)`
  padding-left: 0.5rem;
`;

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0.375rem;
  background-color: white;
  border-radius: 50%;
  box-shadow: ${({ theme }) => theme.shadows.secondary};
`;

const AddressContainer = styled.div`
  display: flex;
  align-items: center;

  > p {
    margin-right: 0.25rem;
  }
`;

export type WalletRowProps = {
  walletType: WalletTypeEnum;
  walletName: string;
  disable?: boolean;
};

const WalletRow = ({ walletName, walletType, disable = false }: WalletRowProps) => {
  const {
    connectWallet,
    account,
    walletType: curConnectedWalletType,
    isUsingUserWallet,
    walletInActivating
  } = useEOAProvider();
  const connected = isUsingUserWallet && curConnectedWalletType === walletType;
  const loading = walletInActivating === walletType;
  const paraXToast = useParaXToast();
  const installed = isWalletInstalled(walletType);
  const onWalletConnectClick = async () => {
    if (!installed) {
      window.open(getWalletDownloadUrl(walletType), '_blank');
    } else if (!walletInActivating && !connected) {
      connectWallet(walletType);
    }
  };
  const [copyState, copyToClipboard] = useCopyToClipboard();

  const theme = useTheme();

  useEffect(() => {
    const { value, error } = copyState;
    if (value) {
      paraXToast.success('Wallet Address copied!');
    }
    if (error) {
      paraXToast.error(error.message);
    }
  }, [copyState, paraXToast]);

  return (
    <Wallet onClick={onWalletConnectClick}>
      <Inline gap="0" alignItems="center" justifyContent="space-between" width="100%">
        <Inline gap="0.75rem" alignItems="center">
          <ImageWrapper>
            <WalletIcon width="2rem" height="1.75rem" wallet={walletType} />
          </ImageWrapper>
          <Stack gap="0" alignItems="start">
            <H6>{walletName}</H6>
            {!disable && connected && account && (
              <AddressContainer
                onClick={e => {
                  e.stopPropagation();
                  copyToClipboard(account);
                }}
              >
                <SmallText skin="secondary">{truncateTextMid(account, 4, 4)}</SmallText>
                <Icon size="small" name="copy" />
              </AddressContainer>
            )}
          </Stack>
        </Inline>
        {(() => {
          if (disable) {
            return <SmallText skin="secondary">Coming Soon</SmallText>;
          }
          if (connected) {
            return <Icon name="check" size="medium" color={theme.skin.success.main} />;
          }
          if (loading) {
            return <Spinner />;
          }
          if (!installed) {
            return (
              <Button skin="secondary" size="small">
                Install
              </Button>
            );
          }
          return null;
        })()}
      </Inline>
    </Wallet>
  );
};

export interface WalletContainerProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  showLogOut?: boolean;
}

const WalletConnectorList = memo(
  ({ title = 'Wallets', showLogOut = true }: WalletContainerProps) => {
    const { isUsingUserWallet, disconnectWallet } = useEOAProvider();

    return (
      <Stack width="100%" gap="0.75rem">
        <Title skin="secondary">{title}</Title>
        <WalletRow
          key="browser_wallet"
          walletName="MetaMask"
          walletType={WalletTypeEnum.METAMASK}
        />
        <WalletRow
          key="coinbase_wallet"
          walletName="Coinbase Wallet"
          walletType={WalletTypeEnum.COINBASE_WALLET}
        />
        <WalletRow
          key="wallet_connect"
          walletName="WalletConnect"
          walletType={WalletTypeEnum.WALLET_CONNECT}
        />
        <WalletRow
          key="okx_wallet"
          walletName="OKX Wallet"
          walletType={WalletTypeEnum.OKX_WALLET}
        />
        {isUsingUserWallet && showLogOut && (
          <Button
            skin="error"
            block
            onClick={() => {
              if (isUsingUserWallet) {
                disconnectWallet();
              }
            }}
          >
            Log Out
          </Button>
        )}
      </Stack>
    );
  }
);

export const AbsoluteWalletContainer = ({
  title = 'Wallets',
  showLogOut = true,
  ...otherProps
}: WalletContainerProps) => {
  return (
    <WalletsContainer {...otherProps}>
      <WalletConnectorList title={title} showLogOut={showLogOut} />
    </WalletsContainer>
  );
};

export const WalletContainer = ({
  title = 'Wallets',
  showLogOut = true,
  ...otherProps
}: WalletContainerProps) => {
  return <WalletConnectorList {...otherProps} title={title} showLogOut={showLogOut} />;
};
