import { Inline, InlineProps, useBreakpoints } from '@parallel-mono/components';
import { memo, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { apps } from '../../../consts';
import { useAppsContext } from '../../contexts';

import { AppContainer, AppsSlot } from './components';

export type AppsProps = Omit<InlineProps, 'children'>;

const AppsContainer = styled(Inline)<{ visible: boolean }>`
  display: ${({ visible }) => (visible ? 'flex' : 'none')};
  height: 100%;
`;

const StyledAppsSlot = styled(AppsSlot)`
  width: 5rem;
  height: 100%;
`;

const StyledAppContainer = styled(AppContainer)`
  flex: 1;
  height: 100%;
  overflow: auto;
  padding: 2rem;
  & > * {
    overflow-x: clip;
    ${({ theme }) => theme.breakpoints.only('desktop')`
      border-radius: 1rem;
    `};
  }
  ${({ theme }) => theme.breakpoints.only('mobile')`
    padding: 0rem;
  `};
`;

export const Apps = memo((props: AppsProps) => {
  const navigate = useNavigate();
  const { currentApp, visible } = useAppsContext();

  const { mobile } = useBreakpoints();

  const handleAppChange = useCallback(
    route => {
      navigate(`/apps/${route}`);
    },
    [navigate]
  );

  return (
    <AppsContainer visible={visible} gap="0" {...props}>
      {!mobile && <StyledAppsSlot onAppChange={handleAppChange} apps={apps} />}

      {currentApp && (
        <StyledAppContainer app={currentApp.appPackage} baseRoute={`apps/${currentApp.route}`} />
      )}
    </AppsContainer>
  );
});
