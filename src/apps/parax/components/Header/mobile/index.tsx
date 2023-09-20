import { Card, H5, H6, Icon, Inline, Popover, Stack } from '@parallel-mono/components';
import { memo, useMemo } from 'react';
import { HostedImage } from '@parallel-mono/business-components';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { DropdownMenu } from '../../DropdownMenu';
import { ConnectWallet, WalletIcon, useWalletModalContext } from '../../Wallet';
import { MenuPill } from '../../MenuPill';
import { ColorModeSwitch } from '../../ColorModeSwitch';

import { MobileMenu } from './MobileMenu';

import { useAccountPanel, useAppsContext, useEOAProvider } from '@/apps/parax/contexts';
import { apps } from '@/apps/consts';

const StyledMenuPill = styled(MenuPill)`
  height: fit-content;
  width: fit-content;
  min-height: 2.25rem;
  min-width: 2.25rem;
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.skin.grey['100']};
`;

export const MobileHeader = memo(() => {
  const navigate = useNavigate();
  const appList = useMemo(
    () =>
      apps.map(app => ({
        disabled: app.disabled,
        tooltip: 'Coming soon...',
        label: (
          <Inline gap="1rem">
            <HostedImage height="1.5rem" width="1.5rem" name={app.appPackage.icon} />
            <H6>{app.appPackage.name}</H6>
          </Inline>
        ),
        onClick: () => {
          navigate(`/apps/${app.route}`);
        }
      })),
    [navigate]
  );

  const { setWalletModalOpen } = useWalletModalContext();

  const { toggleAccountPanel } = useAccountPanel();
  const { currentApp } = useAppsContext();

  const { account: eoaAccount, walletType, isUsingUserWallet } = useEOAProvider();
  return (
    <Inline width="100%" justifyContent="space-between" gap="0">
      <DropdownMenu
        gap="0.75rem"
        placement="bottom-start"
        options={appList}
        menuTrigger={
          <Inline alignItems="center" gap="0.25rem">
            <H5>ParaX</H5>
            <Icon name="chevronDown" strokeWidth="2" size="1rem" />
          </Inline>
        }
      />
      <Inline gap="0.5rem" alignItems="center">
        {currentApp && (
          <StyledMenuPill>
            <MobileMenu routing={currentApp.appPackage.routing} />
          </StyledMenuPill>
        )}

        <StyledMenuPill>
          <Popover
            trigger="click"
            gap="1rem"
            placement="bottom-end"
            popup={
              <Card width="13rem">
                <Stack>
                  <Inline width="100%">
                    <ColorModeSwitch />
                  </Inline>
                </Stack>
              </Card>
            }
            getPopupContainer={() => document.getElementById('root')!}
          >
            <Icon name="user" strokeWidth="2" size="1.25rem" />
          </Popover>
        </StyledMenuPill>
        {isUsingUserWallet ? (
          <>
            <StyledMenuPill data-escape-account-drawer onClick={() => toggleAccountPanel()}>
              <HostedImage name="design/PDS_V3/logo/paraX-logo" height="1.25rem" width="1.25rem" />
            </StyledMenuPill>

            <StyledMenuPill
              onClick={() => {
                setWalletModalOpen(true);
              }}
              style={{ padding: '0.5rem 0.75rem' }}
            >
              <WalletIcon wallet={walletType} width="1.25rem" height="1.25rem" />
              <H6>{eoaAccount.slice(0, 6)}</H6>
            </StyledMenuPill>
          </>
        ) : (
          <ConnectWallet btnSize="small" skin="primary" btnTxt="Connect" />
        )}
      </Inline>
    </Inline>
  );
});
