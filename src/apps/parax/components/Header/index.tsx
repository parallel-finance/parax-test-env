import { Inline, InlineProps, useBreakpoints } from '@parallel-mono/components';
import { FC, memo } from 'react';
import styled, { CSSProperties } from 'styled-components';

import { useAppsContext } from '../../contexts';

import { RightHeader } from './RightHeader';
import { LeftHeader } from './LeftHeader';
import { MobileHeader } from './mobile';

const StyledHeaderBar = styled(Inline)<{ height?: CSSProperties['height'] }>`
  width: 100%;
  height: ${({ height }) => height ?? 'auto'};
  background-color: ${({ theme }) => theme.skin.background.main};
  border-bottom: ${({ theme }) => `${theme.border.width.medium} solid ${theme.skin.grey[200]}`};
`;

export const Header: FC<Omit<InlineProps, 'children'> & { height?: CSSProperties['height'] }> =
  memo(({ ...others }) => {
    const { mobile } = useBreakpoints();
    const { currentApp } = useAppsContext();

    return (
      <StyledHeaderBar
        justifyContent="space-between"
        inset={mobile ? '0.75rem 1rem' : '0.75rem 1.5rem'}
        {...others}
      >
        {mobile ? (
          <MobileHeader />
        ) : (
          <>
            <LeftHeader routing={currentApp?.appPackage.routing} />
            <RightHeader />
          </>
        )}
      </StyledHeaderBar>
    );
  });
