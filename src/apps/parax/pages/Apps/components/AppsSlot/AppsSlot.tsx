import { Container, ContainerProps } from '@parallel-mono/components';
import { memo } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { AppPackage } from 'parax-sdk';

import { AppCard } from './AppCard';

type AppsSlotProps = Omit<ContainerProps, 'children'> & {
  apps: { appPackage: AppPackage; route: string; disabled?: boolean }[];
  onAppChange: (route: string) => void;
};

const AppsSlotContainer = styled(Container)`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const AppsSlot = memo(({ onAppChange, apps, ...others }: AppsSlotProps) => {
  const { pathname } = useLocation();
  return (
    <AppsSlotContainer {...others}>
      {apps.map(app => (
        <AppCard
          onAppChange={() => onAppChange(app.route)}
          active={pathname.includes(app.route)}
          key={app.appPackage.name}
          icon={app.appPackage.icon}
          disabled={app.disabled}
        />
      ))}
    </AppsSlotContainer>
  );
});
