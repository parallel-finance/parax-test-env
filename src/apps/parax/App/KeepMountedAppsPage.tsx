import { memo, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Apps, AppsProps } from '../pages';

type KeepMountedAppsPageProps = Omit<AppsProps, 'visible'>;

export const KeepMountedAppsPage = memo((props: KeepMountedAppsPageProps) => {
  const { pathname } = useLocation();
  const [shouldMount, setShouldMount] = useState(pathname.startsWith('/apps'));

  useEffect(() => {
    if (pathname.startsWith('/apps')) {
      setShouldMount(true);
    }
  }, [pathname]);

  return shouldMount ? <Apps {...props} /> : null;
});
