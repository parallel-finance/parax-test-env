import { Inline, Icon, H6, InlineProps } from '@parallel-mono/components';
import { memo, useCallback } from 'react';
import styled from 'styled-components';

import { accountPanelRouteNamesMap } from '../../AccountPanel';
import { useAccountPanel } from '../../../contexts';

type CreateParaAccountProps = Omit<InlineProps, 'children'>;

const Container = styled(Inline)<{ disabled?: boolean }>`
  opacity: ${({ theme, disabled }) => (disabled ? theme.skin.action.disabledOpacity : 1)};
`;

export const CreateParaAccount = memo(({ ...props }: CreateParaAccountProps) => {
  const { openAccountPanel } = useAccountPanel();

  const createHandle = useCallback(() => {
    openAccountPanel(accountPanelRouteNamesMap.CREATE_PARA_ACCOUNT);
  }, [openAccountPanel]);

  return (
    <Container
      data-escape-account-drawer
      alignItems="center"
      gap="0.25rem"
      onClick={createHandle}
      {...props}
    >
      <Icon name="plusCircle" strokeWidth={2} size="1.25rem" />
      <H6>Create ParaX Account</H6>
    </Container>
  );
});
