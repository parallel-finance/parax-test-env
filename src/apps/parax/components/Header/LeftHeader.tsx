import { Icon, Inline, H4, H5 } from '@parallel-mono/components';
import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import { isEmpty, noop } from 'lodash';
import { AppPackage } from 'parax-sdk';

import { Logo } from '../Logo';
import { DropdownMenu } from '../DropdownMenu';
import { Maybe } from '../../typings/basic';

const MenuItem = styled(Inline).attrs({
  alignItems: 'center',
  gap: '0.5rem'
})`
  margin: 0;
  padding: 0.5rem 1rem;
  border-radius: 6.25rem;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.skin.grey[200]};
  }
`;

type Props = {
  routing: Maybe<AppPackage['routing']>;
};
export const LeftHeader = memo(({ routing }: Props) => {
  const navigate = useNavigate();

  const menuList = useMemo(
    () => [
      {
        label: <H4>ParaX</H4>,
        onClick: () => navigate('/')
      }
    ],
    [navigate]
  );

  const { routes = [], onSwitchRoute = noop } = routing ?? {};

  const theme = useTheme();

  return (
    <Inline gap="1rem" alignItems="center">
      <DropdownMenu
        gap="0.75rem"
        placement="bottom"
        options={menuList}
        menuTrigger={
          <Inline alignItems="center" gap="0.25rem">
            <Logo />
            <Icon name="chevronDown" strokeWidth="2" />
          </Inline>
        }
      />
      {!isEmpty(routes) && (
        <Inline gap="0">
          {routes.map(item => {
            const menuItem = (
              <MenuItem
                key={item.path}
                onClick={() => {
                  onSwitchRoute(item.path);
                }}
              >
                <H5 fontWeight="medium">{item.name}</H5>
                {!isEmpty(item.subRoutes) && (
                  <Icon
                    name="chevronDown"
                    color={theme.skin.grey[500]}
                    size="small"
                    strokeWidth="2"
                  />
                )}
              </MenuItem>
            );

            const subMenuOptions = item.subRoutes?.map(({ name, path }) => ({
              label: <Inline inset="0 1rem 0 0">{name}</Inline>,
              onClick: () => {
                onSwitchRoute(path);
              }
            }));
            return isEmpty(item.subRoutes) ? (
              menuItem
            ) : (
              <DropdownMenu
                gap="0"
                key={item.name + item.path}
                placement="bottom-start"
                options={subMenuOptions!}
                menuTrigger={menuItem}
              />
            );
          })}
        </Inline>
      )}
    </Inline>
  );
});
