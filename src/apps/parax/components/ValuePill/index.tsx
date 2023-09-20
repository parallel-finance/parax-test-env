import { Inline, InlineProps } from '@parallel-mono/components';
import styled from 'styled-components';

type Size = 'large' | 'small';

export interface ValuePillProps extends InlineProps {
  size?: Size;
  borderColor?: string;
}

const insetHelper = (size: Size) => {
  return size === 'small' ? '0.25rem 0.5rem' : '0.5rem 1rem';
};

const gapHelper = (size: Size) => {
  return size === 'small' ? '0.25rem' : '0.5rem';
};

export const Container = styled(Inline)<{ borderColor?: string }>`
  border: ${({ theme, borderColor }) =>
    `${theme.border.width.medium} solid ${borderColor ?? theme.skin.grey[200]}`};
  border-radius: 100px;
`;

export const ValuePill = ({ children, size = 'large', borderColor, ...others }: ValuePillProps) => {
  return (
    <Container
      alignItems="center"
      inset={insetHelper(size)}
      gap={gapHelper(size)}
      borderColor={borderColor}
      {...others}
    >
      {children}
    </Container>
  );
};
