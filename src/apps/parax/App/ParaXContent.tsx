import { Container } from '@parallel-mono/components';
import { memo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';

import './app.css';

import { Header } from '../components';

import { KeepMountedAppsPage } from './KeepMountedAppsPage';

const ParaXContainer = styled(Container)`
  height: 100%;
  background: ${({ theme }) => theme.skin.background.sub1};
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const Body = styled.div`
  flex: 1;
  overflow: auto;
`;

export const ParaXContent = memo(() => {
  return (
    <ParaXContainer>
      <Header height="3.75rem" />
      <Body>
        <KeepMountedAppsPage />
        <Routes>
          <Route path="/" element={<Navigate to="./apps" replace />} />
          <Route path="apps" element={<Navigate to="./demo" replace />} />
        </Routes>
      </Body>
    </ParaXContainer>
  );
});
