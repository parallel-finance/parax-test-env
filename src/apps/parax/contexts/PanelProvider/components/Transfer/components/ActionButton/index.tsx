import { Button, Inline, InlineProps } from '@parallel-mono/components';
import { ReactNode, memo } from 'react';
import styled from 'styled-components';

type ActionButtonProps = Omit<InlineProps, 'children'> & {
  actionButtonText: ReactNode;
  onAction: () => void;
  disabled?: boolean;
};

const Footer = styled(Inline)`
  position: sticky;
  bottom: 0;
  width: 100%;
  margin-top: 24px;

  background: ${({ theme }) =>
    `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ${theme.skin.background.main} 100%)`};
`;

export const ActionButton = memo(
  ({ actionButtonText, onAction, disabled = false, ...others }: ActionButtonProps) => {
    return (
      <Footer inset="1rem" justifyContent="center" {...others}>
        <Button onClick={onAction} disabled={disabled} size="large">
          {actionButtonText}
        </Button>
      </Footer>
    );
  }
);
