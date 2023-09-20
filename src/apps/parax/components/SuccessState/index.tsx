import { Button, H4, Icon, Skin, Stack, StackProps, Text } from '@parallel-mono/components';
import { FC, ReactElement, ReactNode, memo } from 'react';
import styled from 'styled-components';

const CheckIcon = styled(Icon).attrs(({ theme }) => ({
  name: 'checkContained',
  size: '3.75rem',
  color: theme.skin.success.main
}))`
  background: ${({ theme }) => theme.skin.background.main};
  border-radius: 50%;
`;

const StyledText = styled(Text)`
  text-align: center;
`;

export type SuccessStateProps = Omit<StackProps, 'children'> & {
  desc: string;
  tip?: ReactNode;
  onAction?: () => void;
  actionButtonText?: string;
  actionButtonSkin?: Skin;
  icon?: ReactElement;
  children?: ReactNode;
};

const Container: FC<SuccessStateProps> = ({
  desc,
  tip,
  onAction,
  actionButtonText,
  actionButtonSkin = 'secondary',
  icon = <CheckIcon />,
  children,
  ...other
}) => {
  return (
    <Stack gap="2rem" alignItems="center" {...other}>
      {icon}
      <Stack gap=".25rem" alignItems="center">
        <H4>{desc}</H4>
        {tip && <StyledText skin="secondary">{tip}</StyledText>}
      </Stack>
      {children}
      {actionButtonText && (
        <Button size="large" block skin={actionButtonSkin} onClick={onAction}>
          {actionButtonText}
        </Button>
      )}
    </Stack>
  );
};

export const SuccessState = memo(Container);
