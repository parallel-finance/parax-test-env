import { HTMLAttributes, memo, useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { useThemeConfig } from '@parallel-mono/components';
import { AppPackage, AuthenticationType } from 'parax-sdk';

import { useEOAProvider, useAAProvider, useAccountPanel } from '../../../../contexts';

import {
  accountPanelRouteNamesMap,
  getWalletIconPath,
  useWalletModalContext
} from '@/apps/parax/components';
import { WalletNameMap } from '@/apps/parax/contexts/EOAProvider/consts';

type AppContainerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  app: AppPackage;
  baseRoute: string;
};

export const AppContainer = memo(({ app, baseRoute, ...others }: AppContainerProps) => {
  const { provider, account } = useAAProvider();
  const {
    account: EOAAccount,
    provider: EOAProvider,
    chainId,
    isUsingUserWallet,
    walletType
  } = useEOAProvider();
  const { colorMode } = useThemeConfig();
  const { setWalletModalOpen } = useWalletModalContext();
  const { openAccountPanel } = useAccountPanel();
  const handleConnectWallet = useCallback(() => {
    if (!isUsingUserWallet) {
      setWalletModalOpen(true);
    } else if (!account) {
      openAccountPanel(accountPanelRouteNamesMap.CREATE_PARA_ACCOUNT);
    }
  }, [setWalletModalOpen, isUsingUserWallet, openAccountPanel, account]);

  const renderContainerRef = useRef<HTMLDivElement>(null);

  const EOAAuthenticationMeta = useMemo(
    () => ({
      walletType: WalletNameMap[walletType],
      walletIcon: getWalletIconPath(walletType),
      account: EOAAccount,
      provider: EOAProvider
    }),
    [EOAAccount, EOAProvider, walletType]
  );

  useLayoutEffect(() => {
    const { render } = app;
    render({
      state: {
        colorMode,
        provider,
        chainId,
        account: account ?? '',
        baseRoute,
        authentication: {
          type: AuthenticationType.EOA,
          meta: EOAAuthenticationMeta
        }
      },
      container: renderContainerRef.current!,
      apis: { connectWallet: handleConnectWallet }
    });
  }, [
    app,
    baseRoute,
    colorMode,
    provider,
    chainId,
    account,
    handleConnectWallet,
    EOAAccount,
    walletType,
    EOAProvider,
    EOAAuthenticationMeta
  ]);

  return <div ref={renderContainerRef} {...others} />;
});
