import { H5, Icon, Inline, Collapse, Stack, StackProps, Text } from '@parallel-mono/components';
import { isEmpty } from 'lodash';
import { FC, memo, useCallback, useState } from 'react';
import styled from 'styled-components';
import { AppPackage } from 'parax-sdk';

import { Maybe } from '@/apps/parax/typings/basic';

const MenuWrapper = styled(Stack)`
  max-height: 32.25rem;
  overflow-y: scroll;
  width: 100vw;
  padding: 0 1.5rem 2rem;
`;

const MenuItem = styled(Inline).attrs<{ disabled?: boolean }>(({ disabled, ...others }) => ({
  disabled,
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.5rem',
  ...others
}))<{ active?: boolean; disabled?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 6.25rem;
  opacity: ${({ theme, disabled }) => (disabled ? theme.skin.action.disabledOpacity : 1)};
  background-color: ${({ active, theme }) => (active ? theme.skin.grey[200] : 'transparent')};
`;

const ExpandToggle = styled(Icon).attrs({ name: 'chevronRight' })<{ open: boolean }>`
  transform: rotate(${({ open }) => (open ? '-90deg' : '90deg')});
  transition: transform 0.2s;
`;

type Props = AppPackage['routing'];

export const MobileMenuList: FC<Props & Omit<StackProps, 'children'>> = memo(
  ({ routes, onSwitchRoute, ...others }) => {
    const [openedMenuCollapse, setOpenedMenuCollapse] = useState<Maybe<string>>(null);

    const handleOpenMenuCollapse = useCallback((value: string) => {
      setOpenedMenuCollapse(prev => (prev === value ? null : value));
    }, []);

    return (
      <MenuWrapper {...others}>
        {routes.map(menuItem => {
          return (
            <Stack key={menuItem.name} gap="0">
              <MenuItem
                onClick={e => {
                  if (isEmpty(menuItem.subRoutes)) {
                    onSwitchRoute(menuItem.path);
                  } else {
                    e.stopPropagation();
                    handleOpenMenuCollapse(menuItem.name);
                  }
                }}
              >
                <H5 skin="primary" fontWeight="medium">
                  {menuItem.name}
                </H5>
                {!isEmpty(menuItem.subRoutes) && (
                  <Inline inset="0 0 0 2rem">
                    <ExpandToggle open={openedMenuCollapse === menuItem.name} />
                  </Inline>
                )}
              </MenuItem>
              <Collapse open={openedMenuCollapse === menuItem.name}>
                <Stack inset="1.5rem" gap="1.5rem">
                  {menuItem.subRoutes?.map(({ name, path }) => (
                    <MenuItem
                      key={name + path}
                      onClick={() => {
                        onSwitchRoute(path);
                      }}
                    >
                      <Inline gap="0.5rem">
                        <Text skin="primary">{name}</Text>
                      </Inline>
                    </MenuItem>
                  ))}
                </Stack>
              </Collapse>
            </Stack>
          );
        })}
      </MenuWrapper>
    );
  }
);
