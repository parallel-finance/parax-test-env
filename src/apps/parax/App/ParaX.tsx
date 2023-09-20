import {
  ColorMode,
  RecursivePartial,
  ThemeConfig,
  ThemeProvider,
  defaultThemeConfig
} from '@parallel-mono/components';
import { memo } from 'react';
import { merge } from 'lodash';

import { COLOR_MODE_STORAGE_KEY } from '../config';
import { GlobalStyles } from '../theme';
import {
  BalanceInfoProvider,
  EOAProvider,
  XToastProvider,
  ApolloProvider,
  AAProvider,
  AccountPanelProvider,
  AppsContextProvider
} from '../contexts';
import { WalletModalContextProvider } from '../components';
import './app.css';
import { PanelProvider } from '../contexts/PanelProvider';

import { ParaXContent } from './ParaXContent';

const alteredComponents: RecursivePartial<ThemeConfig> = {
  shadows: {
    primary: '0px 0px 16px rgba(58, 78, 88, 0.05)',
    secondary: '0px 4px 16px rgba(58, 78, 88, 0.55)'
  },
  components: {
    Typography: {
      darkSkin: {
        primary: {
          main: '#FFFFFF'
        },
        secondary: {
          main: '#BFBFBF'
        }
      }
    }
  }
};

const mergedThemeConfig = merge({}, defaultThemeConfig, alteredComponents);

export const ParaX = memo(() => {
  const defaultColorMode =
    localStorage.getItem(COLOR_MODE_STORAGE_KEY) === ColorMode.dark
      ? ColorMode.dark
      : ColorMode.light;

  return (
    <ThemeProvider defaultMode={defaultColorMode} themeConfig={mergedThemeConfig}>
      <GlobalStyles />
      <XToastProvider>
        <EOAProvider>
          <ApolloProvider>
            <AAProvider>
              <BalanceInfoProvider>
                <WalletModalContextProvider>
                  <PanelProvider>
                    <AccountPanelProvider>
                      <AppsContextProvider>
                        <ParaXContent />
                      </AppsContextProvider>
                    </AccountPanelProvider>
                  </PanelProvider>
                </WalletModalContextProvider>
              </BalanceInfoProvider>
            </AAProvider>
          </ApolloProvider>
        </EOAProvider>
      </XToastProvider>
    </ThemeProvider>
  );
});
