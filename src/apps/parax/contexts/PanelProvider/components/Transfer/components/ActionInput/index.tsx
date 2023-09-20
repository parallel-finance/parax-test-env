import { Inline, NumericInput, Button, InlineProps } from '@parallel-mono/components';
import styled from 'styled-components';
import { FC, memo } from 'react';
import { floor, isNil } from 'lodash';
import BigNumber from 'bignumber.js';

import { FocusableCard } from '../StyledCard';

import { MAXIMUM_BALANCE_DECIMALS } from '@/apps/parax/utils';
import { Maybe } from '@/apps/parax/typings/basic';

const StyledNumericInput = styled(NumericInput)`
  height: 24px;
  border: none;
  font-size: 16px;
  line-height: 24px;
  padding: 0;
  ${({ theme }) => ({ background: theme.skin.background.main })}
  &:focus,
  &:hover {
    border: none;
  }
  border-radius: 0;
`;

export const ActionInput: FC<
  InlineProps & {
    max: BigNumber;
    value: number | null;
    handleOnChange: (value: Maybe<BigNumber>) => void;
  }
> = memo(props => {
  const { max, value, handleOnChange, ...rest } = props;

  return (
    <FocusableCard inset="8px 12px" style={{ height: '44px' }} {...rest}>
      <Inline gap="0" alignItems="center">
        <StyledNumericInput
          max={max.toNumber()}
          decimals={MAXIMUM_BALANCE_DECIMALS}
          value={value && floor(value, MAXIMUM_BALANCE_DECIMALS)}
          onChange={v => handleOnChange(!isNil(v) ? BigNumber(v) : null)}
        />
        <Button
          size="small"
          skin="secondary"
          onClick={() => {
            handleOnChange(max);
          }}
        >
          Max
        </Button>
      </Inline>
    </FocusableCard>
  );
});
