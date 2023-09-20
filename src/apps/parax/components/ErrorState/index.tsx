import { Button, H4, Icon, Stack, StackProps, Text } from '@parallel-mono/components';
import { memo } from 'react';
import styled from 'styled-components';

const ErrorIcon = styled(Icon).attrs({
  name: 'closeContained',
  size: 'xlarge'
})`
  color: ${({ theme }) => theme.skin.error.main};
`;

const Label = styled(H4)`
  margin: 1.5rem 0 0.25rem;
`;

export const ConfirmButton = styled(Button).attrs({
  skin: 'secondary'
})`
  margin-top: 1.5rem;
  width: 100%;
`;

type ErrorStateProps = { closeModal: () => void; errorMsg?: string } & Omit<StackProps, 'children'>;

export const ErrorState = memo(({ closeModal, errorMsg, ...props }: ErrorStateProps) => {
  return (
    <Stack gap="0" justifyContent="center" alignItems="center" {...props}>
      <ErrorIcon />
      <Label>Oops, something went wrong.</Label>
      <Text skin="secondary">{errorMsg || 'Try again later.'}</Text>
      <ConfirmButton onClick={closeModal}>Okay</ConfirmButton>
    </Stack>
  );
});
