import { ReactNode, createContext, memo, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AppPackage } from 'parax-sdk';

import { Maybe } from '../../typings/basic';

import { apps } from '@/apps/consts';

type ContextValue = {
  currentApp: Maybe<{ appPackage: AppPackage; route: string }>;
  visible: boolean;
};
const AppsContext = createContext<ContextValue>({ currentApp: null, visible: false });

export const AppsContextProvider = memo(({ children }: { children: ReactNode }) => {
  const [currentApp, setCurrentApp] = useState<any>(null);
  const { pathname } = useLocation();

  const visible = useMemo(() => pathname.startsWith('/apps'), [pathname]);

  useEffect(() => {
    if (visible) {
      const targetApp = apps.find(app => pathname.startsWith(`/apps/${app.route}`)) ?? null;
      setCurrentApp(targetApp);
      return;
    }
    setCurrentApp(null);
  }, [visible, pathname]);

  const value = useMemo(
    () => ({
      currentApp,
      visible
    }),
    [currentApp, visible]
  );

  return <AppsContext.Provider value={value}>{children}</AppsContext.Provider>;
});

export const useAppsContext = () => useContext(AppsContext);
