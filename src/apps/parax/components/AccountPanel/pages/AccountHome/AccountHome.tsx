import { Stack, StackProps } from '@parallel-mono/components';
import styled from 'styled-components';
import { memo, useCallback, useState } from 'react';

import { AccountAssets, AccountHeaderWithHome, AccountsTable } from '../../components';

import { AccountAbstraction } from './components';

type AccountHomeProps = Omit<StackProps, 'children'>;

const AccountHomeContainer = styled(Stack)`
  height: 100%;
`;

const Container = styled(Stack)`
  position: relative;
  flex: 1;
`;

const HoveredAccountsTable = styled(AccountsTable)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const AccountHome = memo((props: AccountHomeProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const clickAccountHandle = useCallback(() => setExpanded(it => !it), []);
  const handleAccountsTableClose = useCallback(() => setExpanded(false), []);

  return (
    <AccountHomeContainer gap="0" {...props}>
      <AccountHeaderWithHome expanded={expanded} onClickAccount={clickAccountHandle} />
      <Container width="100%" gap="0">
        <HoveredAccountsTable onClose={handleAccountsTableClose} expanded={expanded} />
        <Stack inset="0">
          <AccountAbstraction />
          <AccountAssets inset="0 2rem" />
        </Stack>
      </Container>
    </AccountHomeContainer>
  );
});
