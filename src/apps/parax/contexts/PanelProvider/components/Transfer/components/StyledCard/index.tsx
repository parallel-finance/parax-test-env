import { Card } from '@parallel-mono/components';
import styled from 'styled-components';

export const FocusableCard = styled(Card).attrs({ border: true })<{ readOnly?: boolean }>`
  &:focus-within {
    outline: 1px auto
      ${({ theme, readOnly }) => (readOnly ? theme.skin.grey[200] : theme.skin.primary.main)};
  }
`;

export const BorderedCard = styled(Card).attrs({ border: true })``;
