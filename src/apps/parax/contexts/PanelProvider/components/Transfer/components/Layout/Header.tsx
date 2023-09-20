import { memo } from 'react';
import { Inline, InlineProps } from '@parallel-mono/components';
import styled from 'styled-components';

import { GoBack } from '../../../../../../components';

type HeaderProps = Omit<InlineProps, 'children'> & {
  onBack: () => void;
};

const HeaderContainer = styled(Inline)`
  background: ${({ theme }) => theme.skin.background.main};
  padding: 1rem 2rem;
  z-index: 999;
  border-bottom: 1px solid ${({ theme }) => theme.skin.grey[200]};
`;

export const Header = memo(({ onBack, ...others }: HeaderProps) => {
  return (
    <HeaderContainer alignItems="center" {...others}>
      <GoBack onClick={onBack} />
    </HeaderContainer>
  );
});
