import { AppPackage } from 'parax-sdk';

import demoApp from '@/apps/demoApp';

export const apps: {
  appPackage: AppPackage;
  route: string;
  disabled?: boolean;
}[] = [
  {
    appPackage: demoApp,
    route: 'demo'
  }
];
