import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

import { AccountHome, CreateParaAccount, NftsBalance, CoinBalance, CollectionInfo } from './pages';
import { routeNamesMap } from './routeNames';

type RouteConfig = {
  path: string;
  element: ReactNode;
  children?: RouteConfig[];
};

export const routes: RouteConfig[] = [
  {
    path: routeNamesMap.index,
    element: <AccountHome />
  },
  { path: routeNamesMap.CREATE_PARA_ACCOUNT, element: <CreateParaAccount /> },
  { path: routeNamesMap.ACCOUNT_ASSETS.COIN_BALANCE, element: <CoinBalance /> },
  {
    path: routeNamesMap.ACCOUNT_ASSETS.NFTS_BALANCE.index,
    element: <Outlet />,
    children: [
      {
        path: '',
        element: <NftsBalance />
      },
      {
        path: routeNamesMap.ACCOUNT_ASSETS.NFTS_BALANCE.COLLECTION_INFO,
        element: <CollectionInfo />
      }
    ]
  }
];
