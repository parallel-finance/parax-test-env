import { Inline, stackTwoColors } from '@parallel-mono/components';
import styled from 'styled-components';

export const MenuPill = styled(Inline).attrs({
  inset: '0 1rem',
  gap: '0.5rem',
  alignItems: 'center'
})<{ active?: boolean }>`
  width: fit-content;
  white-space: nowrap;
  height: 2.5rem;
  border-radius: 2rem;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme, active }) =>
      stackTwoColors(
        active ? theme.skin.grey['200'] : theme.skin.background.main,
        theme.skin.action.hoverMask
      )};
  }
  background-color: ${props => (props.active ? props.theme.skin.grey['200'] : 'transparent')};
`;
