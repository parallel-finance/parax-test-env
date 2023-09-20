import { memo } from 'react';
import { Card, CardProps, H2, Spinner, Stack } from '@parallel-mono/components';

type NetworkSwitchingProcessProps = Omit<CardProps, 'children'>;

export const NetworkSwitchingProcess = memo((props: NetworkSwitchingProcessProps) => {
  return (
    <Card border {...props}>
      <Stack alignItems="center">
        <H2>Switching Network . . .</H2>
        <Spinner size="large" />
      </Stack>
    </Card>
  );
});
