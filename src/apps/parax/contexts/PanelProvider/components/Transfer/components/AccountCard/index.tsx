import {
  Inline,
  Stack,
  Text,
  CardProps,
  Icon,
  Select,
  SelectBaseOption,
  SelectProps,
  H4,
  SmallText,
  useBreakpoints
} from '@parallel-mono/components';
import { FC, ReactElement, memo, useRef, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { merge } from 'lodash';
import { HostedImage } from '@parallel-mono/business-components';

import { FocusableCard } from '../StyledCard';
import { Maybe } from '../../../../../../typings/basic';

import { truncateTextMid } from '@/apps/parax/utils';

const StyledInput = styled.input`
  flex: 1;
  height: 40px;
  padding: 4px;
  margin: 0;
  ${({ theme }) => theme.typography.header3};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  border: none;
  outline: none;
  font-size: 14px;
  &:not(:placeholder-shown) {
    ${({ theme }) => ({
      background: theme.skin.background.main,
      color: 'inherit'
    })}
  }
`;

const ContainerCard = styled(FocusableCard)<{ readOnly?: boolean }>`
  height: 5rem;
  padding: 0.5rem;
  gap: 0.25rem;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const AccountCardInput: FC<
  CardProps & {
    image: ReactElement;
    label?: ReactElement;
    account: string;
    onHandleChange?: (e: string) => void;
    readOnly?: boolean;
  }
> = props => {
  const { image, label, account, onHandleChange, readOnly, ...rest } = props;

  const handleOnChange = useCallback(
    (addr: string) => {
      onHandleChange?.(addr);
    },
    [onHandleChange]
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const handleEdit = useCallback(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);
  const { desktop } = useBreakpoints();

  return (
    <ContainerCard readOnly={readOnly} inset="0" {...rest}>
      {image}
      <Stack width="100%" gap="0">
        {label}
        {readOnly ? (
          <SmallText>{desktop ? account : truncateTextMid(account, 8, 8)}</SmallText>
        ) : (
          <StyledInput
            type="text"
            readOnly={readOnly}
            value={account}
            onChange={e => handleOnChange(e.target.value)}
            ref={inputRef}
          />
        )}
      </Stack>

      {!readOnly && <Icon onClick={handleEdit} name="edit" />}
    </ContainerCard>
  );
};

const renderDisplay = (option: Maybe<SelectBaseOption>) => {
  if (!option) return null;
  return (
    <Inline gap="10px" alignItems="center">
      <HostedImage name="design/PDS_V3/logo/paraX-logo" width="2.5rem" height="2.5rem" />
      <Stack gap="0">
        <H4>ParaX Account</H4>
        <SmallText>{truncateTextMid(option.value, 8, 8)}</SmallText>
      </Stack>
    </Inline>
  );
};

const StyledSelect = styled(Select).attrs(({ classNames }) => ({
  classNames: merge(
    {
      item: 'select-item'
    } as any,
    classNames
  )
}))`
  height: 5rem;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.skin.grey[200]};
  border-radius: ${({ theme }) => theme.border.radius.large};
  opacity 1;

  &:hover {
    border: 1px solid ${({ disabled, theme }) =>
      disabled ? theme.skin.grey[200] : theme.skin.primary.main};
  }

  &:focus-within {
    border: 1px solid ${({ theme }) => theme.skin.grey[200]};
    ${({ disabled, theme }) => (disabled ? '' : `outline: 1px auto ${theme.skin.primary.main};`)}
  }
  .select-item {
    & > div {
      color: ${({ theme }) => theme.skin.text.main};
      background: none;
    }
  }
  .hide-dropdown-icon {
    display: none;
  }
`;

export const AccountCardSelection: FC<
  Omit<SelectProps, 'options' | 'value' | 'onChange'> & {
    account: string;
    accounts: string[];
    onChange?: (addr: string) => void;
    readOnly?: boolean;
  }
> = memo(props => {
  const { account, accounts, onChange, readOnly, ...rest } = props;

  const options = useMemo(
    () =>
      accounts.map(accountItem => ({
        label: (
          <Inline alignItems="center" justifyContent="space-between">
            <Inline gap="10px" alignItems="center">
              <HostedImage name="design/PDS_V3/logo/paraX-logo" width="2.5rem" height="2.5rem" />
              <Stack gap="0">
                <H4>ParaX Account</H4>
                <SmallText skin="secondary">{truncateTextMid(accountItem, 8, 8)}</SmallText>
              </Stack>
            </Inline>
            {account === accountItem && <Icon name="check" strokeWidth={2} />}
          </Inline>
        ),
        value: accountItem
      })),
    [account, accounts]
  );

  const handleChange = useCallback(
    (option: Maybe<SelectBaseOption>) => {
      onChange?.(option!.value);
    },
    [onChange]
  );

  return (
    <StyledSelect
      options={options}
      value={account}
      clearable={false}
      disabled={readOnly}
      classNames={{
        dropdownIcon: readOnly ? 'hide-dropdown-icon' : ''
      }}
      renderDisplay={renderDisplay}
      emptyMenu={
        <Stack justifyContent="center" alignItems="center" gap="10px" inset="10px">
          <Icon name="boxOpen" />
          <Text>No ParaX Account</Text>
        </Stack>
      }
      onChange={handleChange}
      {...rest}
    />
  );
});
