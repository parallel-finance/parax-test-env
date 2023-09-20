import { Drawer, DrawerProps } from '@parallel-mono/components';
import { mergeWith } from 'lodash';
import React, { memo, useCallback, useRef } from 'react';
import { useClickAway } from 'react-use';
import styled from 'styled-components';

const defaultClassNames: DrawerProps['classNames'] = {
  backdrop: 'x-drawer-backdrop',
  content: 'x-drawer-content'
};

type XDrawerProps = DrawerProps & {
  backdrop?: boolean;
  escapeClickAwayAttribute?: string;
  overflow?: string;
};

const StyledDrawer = styled(Drawer)<XDrawerProps>`
  .${defaultClassNames.backdrop} {
    ${({ backdrop }) => (backdrop ? '' : 'visibility: hidden;')}
  }
  .${defaultClassNames.content} {
    overflow: visible;
  }
  z-index: 99999;
  width: 0;
  height: 0;
`;

const Container = styled.div<{ overflow?: string }>`
  height: calc(100vh - 60px); // the header height
  overflow: auto;
  ${({ theme }) => theme.breakpoints.only('mobile')`
    height: calc(100vh - 150px);
  `};
`;

export const XDrawer = memo(
  ({
    escapeClickAwayAttribute,
    children,
    onClose,
    classNames,
    isOpen,
    ...others
  }: XDrawerProps) => {
    const mergedClassNames = mergeWith(defaultClassNames, classNames, (a, b) =>
      [a, b].filter(it => !!it).join(' ')
    );
    const containerRef = useRef(null);

    const handleClickAway = useCallback(
      e => {
        const clickedElement = e.target as HTMLElement;
        if (clickedElement.closest(`[${escapeClickAwayAttribute}]`)) {
          return;
        }

        if (isOpen) {
          onClose?.();
        }
      },
      [onClose, escapeClickAwayAttribute, isOpen]
    );

    useClickAway(containerRef, handleClickAway);
    return (
      <StyledDrawer classNames={mergedClassNames} isOpen={isOpen} {...others}>
        <Container ref={containerRef}>{children}</Container>
      </StyledDrawer>
    );
  }
);
