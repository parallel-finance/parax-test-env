import { HostedImage } from '@parallel-mono/business-components';
import { Inline, InlineProps } from '@parallel-mono/components';
import { memo, useCallback } from 'react';
import styled from 'styled-components';

import { Tooltip } from '@/apps/parax/components';

const AppItem = styled(Inline)<{ active: boolean; disabled?: boolean }>`
  height: 5rem;
  width: 5rem;
  background: ${({ active, theme }) => {
    if (!active) return 'transparent';
    return theme.skin.background.sub1;
  }};
  opacity: ${({ disabled, theme }) => (disabled ? theme.skin.action.disabledOpacity : 1)};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
`;

type Props = Omit<InlineProps, 'children'> & {
  icon: string;
  active: boolean;
  onAppChange: () => void;
  disabled?: boolean;
};

export const AppCard = memo(({ onAppChange, icon, active, disabled, ...others }: Props) => {
  const handleAppChange = useCallback(() => {
    if (!disabled) {
      onAppChange();
    }
  }, [disabled, onAppChange]);
  return (
    <AppItem
      onClick={handleAppChange}
      disabled={disabled}
      active={active}
      alignItems="center"
      justifyContent="center"
      {...others}
    >
      <Tooltip placement="right-start" disabled={!disabled} content="Coming Soon...">
        <HostedImage height="2rem" width="2rem" name={icon} />
      </Tooltip>
    </AppItem>
  );
});
