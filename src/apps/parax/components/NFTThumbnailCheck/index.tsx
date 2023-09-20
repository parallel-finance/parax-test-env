import { ReactNode, FC, useCallback, HTMLAttributes, useMemo } from 'react';
import styled from 'styled-components';
import { Checkbox, Stack, useDualModeState } from '@parallel-mono/components';
import cx from 'classnames';

import { Tooltip } from '../Tooltip';
import { NFTThumbnail, NFTThumbnailProps } from '../NFTThumbnail';

type Size = 'small' | 'large';

export interface NFTThumbnailCheckProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick' | 'onChange'> {
  symbol: NFTThumbnailProps['symbol'];
  tokenId: number;
  defaultChecked?: boolean;
  checked?: boolean;
  size?: Size;
  readonly?: boolean;
  disabled?: boolean;
  disabledTip?: string;
  children?: ReactNode;
  onChange?: (
    checked: boolean,
    arg: { symbol: NFTThumbnailProps['symbol']; tokenId: number }
  ) => void;
  floatingTag?: NFTThumbnailProps['floatingTag'];
}

const sizeMap = {
  small: {
    iconPosition: {
      right: '0.25rem',
      top: '0.25rem'
    },
    padding: '0.25rem 0',
    containerRadius: '0.75rem',
    imageRadius: '0.625rem'
  },
  large: {
    iconPosition: {
      right: '0.5rem',
      top: '0.5rem'
    },
    padding: '0.75rem 0',
    containerRadius: '1.125rem',
    imageRadius: '1rem'
  }
};

const Container = styled.div<{ checked: boolean; disabled: boolean; size: Size }>`
  position: relative;
  border: 2px solid
    ${({
      theme: {
        skin: { primary, grey }
      },
      checked
    }) => (checked ? primary.main : grey['200'])};
  opacity: ${({ theme, disabled }) => (disabled ? theme.skin.action.disabledOpacity : 1)};
  transition: border 0.2s;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  border-radius: ${({ size }) => sizeMap[size].containerRadius};
  overflow: hidden;
`;

const IconContainer = styled.div<{ position: { top: string; right: string } }>`
  position: absolute;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  ${({ position }) => position};
  border-radius: 50%;
  width: 19px;
  height: 19px;
  background-color: ${({ theme }) => theme.skin.grey.white};
  border: 2px solid ${({ theme }) => theme.skin.grey['200']};
`;

const RoundCheckbox = styled(Checkbox)`
  Label {
    border-radius: 50%;
    justify-content: center;
  }
  & img {
    width: 10px;
    height: 10px;
  }
`;

const DescriptionContainer = styled(Stack)<{ padding: string }>`
  padding: ${({ padding }) => padding};
  align-items: center;
  justify-content: center;
`;

export const NFTThumbnailCheck: FC<NFTThumbnailCheckProps> = ({
  symbol,
  tokenId,
  defaultChecked = false,
  checked,
  disabled = false,
  disabledTip,
  children,
  readonly = false,
  size = 'large',
  onChange,
  floatingTag,
  ...others
}) => {
  const [finalChecked, setInternalChecked] = useDualModeState(defaultChecked, checked);

  const isSelectable = useMemo(() => !(disabled || readonly), [disabled, readonly]);

  const handleClick = useCallback(() => {
    if (!isSelectable) return;
    setInternalChecked(!finalChecked);
    onChange?.(!finalChecked, {
      symbol,
      tokenId
    });
  }, [finalChecked, isSelectable, symbol, tokenId, onChange, setInternalChecked]);

  const { padding, iconPosition } = sizeMap[size];

  return (
    <Container
      checked={finalChecked}
      disabled={disabled}
      onClick={handleClick}
      size={size}
      {...others}
    >
      <NFTThumbnail
        width="100%"
        tokenId={tokenId}
        symbol={symbol}
        showDescription
        description={
          children && (
            <DescriptionContainer gap="0" padding={padding}>
              {children}
            </DescriptionContainer>
          )
        }
        floatingTag={floatingTag}
        classNames={{ imageThumbnail: cx('imageThumbnail') }}
        gap="0"
      />
      {disabled && disabledTip && (
        <IconContainer position={iconPosition}>
          <Tooltip content={disabledTip} />
        </IconContainer>
      )}
      {isSelectable && (
        <IconContainer position={iconPosition}>
          <RoundCheckbox color="primary" checked={finalChecked} size="large" />
        </IconContainer>
      )}
    </Container>
  );
};
