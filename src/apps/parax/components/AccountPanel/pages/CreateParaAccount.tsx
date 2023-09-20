import {
  Stack,
  H3,
  Inline,
  Icon,
  Text,
  InlineProps,
  Button,
  StackProps,
  Image
} from '@parallel-mono/components';
import { memo, useCallback } from 'react';
import { useTheme } from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { AccountHeaderWithBack } from '../components';
import { routeNamesMap } from '../routeNames';
import tokenWallet from '../image/tokenWallet.png';

import { useCreateParaAccount } from '@/apps/parax/hooks';
import { useAAProvider } from '@/apps/parax/contexts';

type LabLineProps = Omit<InlineProps, 'children'> & {
  content: string;
};
type CreateParaAccountProps = Omit<StackProps, 'children'>;

const LabLine = memo(({ content, ...props }: LabLineProps) => {
  const theme = useTheme();

  return (
    <Inline gap="0.75rem" alignItems="center" {...props}>
      <Icon
        strokeWidth={2}
        width="1.25rem"
        height="1.25rem"
        name="checkCircle"
        color={theme.skin.success.main}
      />
      <Text>{content}</Text>
    </Inline>
  );
});

export const CreateParaAccount = memo(({ ...props }: CreateParaAccountProps) => {
  const { loading, createParaAccountHandle } = useCreateParaAccount();
  const { switchAccount } = useAAProvider();
  const navigate = useNavigate();
  const handleCreateParaAccount = useCallback(async () => {
    const createdAccount = await createParaAccountHandle();
    if (createdAccount) {
      switchAccount(createdAccount);
      navigate(routeNamesMap.index, { replace: true });
    }
  }, [createParaAccountHandle, switchAccount, navigate]);

  return (
    <Stack gap="0" {...props}>
      <AccountHeaderWithBack />
      <Stack inset="2rem">
        <Image src={tokenWallet} width="100%" />
        <H3>Create New Account</H3>
        <Stack gap="1rem">
          {[
            'Multiple-chain Account Management',
            'Gas-free transaction',
            'Cross-domain Automated Strategy',
            'Batch Transaction and Gas Optimization'
          ].map(item => (
            <LabLine key={item} content={item} />
          ))}
        </Stack>
        <Button block loading={loading} disabled={loading} onClick={handleCreateParaAccount}>
          Create
        </Button>
      </Stack>
    </Stack>
  );
});
