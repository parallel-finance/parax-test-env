import { Stack, H5, Spinner, Text, StackProps } from '@parallel-mono/components';
import { ReactNode, FC } from 'react';
import styled from 'styled-components';

const StyledSpinner = styled(Spinner)`
  margin-bottom: 1rem;
`;

const StyledText = styled(Text)`
  text-align: center;
`;

const CenteredH5 = styled(H5)`
  text-align: center;
`;

export type InProgressMessageProps = Omit<StackProps, 'children'> & {
  message?: ReactNode;
};

export const InProgress: FC<InProgressMessageProps> = ({ message, children, ...others }) => {
  return (
    <Stack alignItems="center" {...others}>
      <StyledSpinner size="large" />
      {message && <CenteredH5>{message}</CenteredH5>}
      <StyledText skin="secondary">
        This may take up to 20 seconds. Please do not close the modal.
      </StyledText>
      {children}
    </Stack>
  );
};
