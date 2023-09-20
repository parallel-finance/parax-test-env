import { memo, useCallback, useEffect, useState, KeyboardEvent } from 'react';
import {
  DecoratedInput,
  SmallText,
  Button,
  NumericInput,
  DecoratedInputProps
} from '@parallel-mono/components';
import styled from 'styled-components';

import { Maybe } from '../../typings/basic';

const StyledDecoratedInput = styled(DecoratedInput)`
  border: 2px solid ${({ theme }) => theme.skin.grey[200]} !important;
  border-radius: 10000px;
  padding: 0 0.5rem 0 0.75rem;
  width: auto;
  &:hover,
  &:focus {
    border: 2px solid ${({ theme }) => theme.skin.grey[200]};
  }

  ${({ theme }) => theme.breakpoints.only('mobile')`
    padding: 0.25rem 0.5rem 0.25rem 0.75rem;
  `}
`;

const StyledNumericInput = styled(NumericInput)`
  width: 4em;
  border: 1px solid ${({ theme }) => theme.skin.grey[200]};
  &:hover,
  &:focus {
    border: 1px solid ${({ theme }) => theme.skin.grey[200]};
  }
  height: fit-content;
  margin: auto;
  padding: 2px 6px;
  text-align: center;

  ${({ theme }) => theme.breakpoints.only('mobile')`
    width: 8em;
  `}
`;

type SelectTopItemsInputProps = Omit<
  DecoratedInputProps<typeof NumericInput>,
  'onSelect' | 'startAdornment' | 'endAdornment' | 'Component' | 'inputProps'
> & {
  itemsCount: number;
  onSelect: (top: Maybe<number>) => void;
};
export const SelectTopItemsInput = memo(
  ({ itemsCount, onSelect, ...props }: SelectTopItemsInputProps) => {
    const [count, setCount] = useState<Maybe<number>>(itemsCount);

    useEffect(() => {
      setCount(itemsCount);
    }, [itemsCount]);

    const handleSelect = useCallback(() => {
      onSelect(count);
    }, [onSelect, count]);

    const handleInputKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          handleSelect();
        }
      },
      [handleSelect]
    );

    return (
      <StyledDecoratedInput
        {...props}
        startAdornment={<SmallText>Top</SmallText>}
        endAdornment={
          <Button onClick={handleSelect} size="small">
            Select
          </Button>
        }
        Component={StyledNumericInput}
        inputProps={{
          value: count,
          onChange: setCount,
          onKeyDown: handleInputKeyDown,
          min: 0
        }}
      />
    );
  }
);
