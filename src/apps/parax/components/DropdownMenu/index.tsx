import {
  Inline,
  Stack,
  Card,
  H5,
  SmallText,
  Text,
  Popover,
  InlineProps,
  PopoverProps
} from '@parallel-mono/components';
import styled from 'styled-components';
import { isNil } from 'lodash';
import { FC, ReactElement, ReactNode } from 'react';

import { Tooltip } from '../Tooltip';

const MenuItem = styled(Inline).attrs<{ disabled?: boolean }>(
  ({ disabled, onClick, ...others }) => ({
    ...others,
    disabled,
    onClick: disabled ? null : onClick
  })
)<{ disabled?: boolean; active?: boolean }>`
  flex: 1;
  cursor: pointer;
  opacity: ${({ theme, disabled }) => (disabled ? theme.skin.action.disabledOpacity : 1)};
  &:hover {
    background: ${({ theme }) => theme.skin.action.hoverMask};
  }
  background: ${({ theme, active }) => (active ? theme.skin.grey['200'] : 'transparent')};
`;

export type DropdownMenuItemProps = {
  icon?: ReactElement;
  label: ReactNode;
  disabled?: boolean;
  value?: ReactNode;
  tooltip?: ReactNode;
  active?: boolean;
} & InlineProps;

const DropdownMenuItem: FC<DropdownMenuItemProps> = ({
  disabled = false,
  icon,
  label,
  value,
  tooltip,
  ...rest
}) => {
  const menuItem = (
    <MenuItem
      disabled={disabled}
      inset="1rem 1.5rem"
      alignItems="center"
      justifyContent="space-between"
      {...rest}
    >
      <Inline gap="0.75rem" alignItems="center">
        {icon}
        {!isNil(label) && (
          <Text as="div" style={{ whiteSpace: 'nowrap' }}>
            {label}
          </Text>
        )}
      </Inline>
      {!isNil(value) && (
        <SmallText as="div" skin="secondary">
          {value}
        </SmallText>
      )}
    </MenuItem>
  );
  return tooltip ? (
    <Tooltip content={tooltip} disabled={!disabled}>
      {menuItem}
    </Tooltip>
  ) : (
    menuItem
  );
};

interface MenuProps {
  menuTrigger: ReactNode;
  options: Array<DropdownMenuItemProps & InlineProps>;
  title?: string;
}

export type DropdownMenuType = MenuProps & Omit<PopoverProps, 'popup' | 'children'>;

export const DropdownMenu: FC<DropdownMenuType> = ({ title, menuTrigger, options, ...rest }) => {
  const renderDropdownMenus = () => (
    // TODO: style={{ overflow: 'hidden' }} should be fixed in components
    <Card shadow="secondary" inset="0" style={{ overflow: 'hidden' }}>
      {title && <H5 style={{ padding: '1rem 1.5rem 0' }}>{title}</H5>}
      <Stack gap="0">
        {options.map((option, index) => (
          <DropdownMenuItem key={index} {...option} />
        ))}
      </Stack>
    </Card>
  );

  return (
    <Popover
      gap="1rem"
      placement="bottom"
      {...rest}
      popup={renderDropdownMenus()}
      getPopupContainer={() => document.getElementById('root')!}
    >
      {menuTrigger}
    </Popover>
  );
};
